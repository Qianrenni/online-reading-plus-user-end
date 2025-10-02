import type { User } from "../types";
import { get, post } from "../utils";

export const  useApiAuth = {
    authMe:async()=>{
        const {success,data,message} = await get<{user:User}>('/token/auth/me');
        return {success,data:data?.user,message};
    },
    login:async(username:string,password:string,captcha:string,x_captcha_id:string)=>{
        const {success,data,message} = await post<{token:{access_token:string,refresh_token:string}}>(
            '/token/get',
            {
                'username':username,
                'password':password,
                'captcha':captcha
            },
            {
                headers:{
                    'X-Captcha-Id':x_captcha_id,
                    'Content-Type':'application/json'
                }
            }
        );
        return {success,data,message};
    },
    refreshToken:async(refresh_token:string)=>{
        const {success,data,message} = await post<{token:{access_token:string,refresh_token:string}}>(
            '/token/refresh',
            {},
            {
                headers:{
                    'Authorization':`Bearer ${refresh_token}`
                }
            }
        );
        return {success,data,message};  
    }

}