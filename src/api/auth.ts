import { BASE_URL } from "../config";
import type { User } from "../types";
import { get, post } from "../utils";

export const  useApiAuth = {
    authMe:async()=>{
        const {success,data,message} = await get<{user:User}>('/token/auth/me');
        return {success,data:data?.user,message};
    },
    login:async(username:string,password:string,captcha:string,x_captcha_id:string):Promise<{
        success:boolean,
        data:{
            access_token:string,
            refresh_token:string,
            token_type:string,
            user:User
        }|null,
        message:string|null
    }>=>{
        const {success,data,message} = await post<{access_token:string,refresh_token:string,token_type:string,user:User}>(
            '/token/get',
            {
                'username':username,
                'password':password,
                'captcha':captcha
            },
            {
                headers:{
                    'X-Captcha-Id':x_captcha_id,
                }
            }
        );
        return {success,data,message};
    },
    refreshToken:async(refresh_token:string):Promise<{
        success:boolean,
        data:{
            access_token:string,
            refresh_token:string,
            token_type:string,
            user:User
        }|null,
        message:string| null
    }>=>{
        const {success,data,message} = await post<{access_token:string,refresh_token:string,token_type:string,user:User}>(
            '/token/refresh',
            {},
            {
                headers:{
                    'Authorization':`Bearer ${refresh_token}`
                }
            }
        );
        return {success,data,message};  
    },
    verifyEmail:async(email:string)=>{
        const {success,data,message} = await post<null>(
            '/token/verify_email',
            {
                'email':email
            },
            undefined,
            true 
        );
        return {success,data,message};
    },
    register:async(
        username:string,
        password:string,
        email:string,
        captcha:string,
        x_captcha_id:string,
        avatar:string='')=>{
            const response = await fetch(`${BASE_URL}/user/register`,{
                method:'POST',
                headers:{
                    'X-Captcha-Id':x_captcha_id
                },
                body:JSON.stringify({
                    'user':{
                        'username':username,
                        'password':password,
                        'email':email,
                        'avatar':avatar
                    },
                    'captcha':captcha
                })
            });
            if (response.ok){
                return {
                    success:true,
                    data:null,
                    message:null
                }
            }else{
                const result = await response.json();
                return {
                    success:false,
                    data:null,
                    message:result.message
                }
            }
    }
}