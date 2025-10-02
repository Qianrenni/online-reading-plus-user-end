import { useMessage } from "qyani-components";
import { BASE_URL } from "../config";


export const  useApiCaptcha = {
    getCaptcha:async()=>{
        const response = await fetch(`${BASE_URL}/captcha/get`);
        if(response.ok){
            const data = await response.blob();
            const imageUrl = URL.createObjectURL(data);
            const x_captcha_id = response.headers.get('x-captcha-id');
            return {
                imageUrl,
                x_captcha_id
            }
        }else{
            console.error(response.statusText);
            useMessage.error(response.statusText);
        }

    }
}

