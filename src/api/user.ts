import {useMessage} from "qyani-components";
import {get, patch, useValidate} from "../utils"

export const useApiUser = {
    prefix: '/user',
    /**
     * 获取忘记密码的邮件，里面有验证码用于表单提交
     * @param email  邮箱
     * @returns  {success:boolean,data:null,message:string|null}
     */
    getForgotPassword: async function (email: string) {
        if (useValidate.email(email) === false) {
            useMessage.error('邮箱格式错误');
            return {success: false, data: null, message: '邮箱格式错误'};
        }
        const {success, data, message} = await get<null>(
            `${this.prefix}/forgot-password?user_account=${email}`,
            undefined,
            true
        );
        if (success) {
            useMessage.success('重置密码邮件已发送,请检查邮箱');
        }
        return {success, data, message};
    },
    patchForgotPassword: async function (email: string, code: string, password: string, confirmPassword: string) {
        if (useValidate.email(email) === false) {
            useMessage.error('邮箱格式错误');
            return {success: false, data: null, message: '邮箱格式错误'};
        }
        if (password !== confirmPassword) {
            useMessage.error('密码不一致');
            return {success: false, data: null, message: '密码不一致'};
        }
        const {success, data, message} = await patch<null>(
            `${this.prefix}/forgot-password`,
            {
                user_account: email,
                verify_code: code,
                password
            },
            undefined,
            true
        )
        if (success) {
            useMessage.success('重置密码成功,请重新登录');
        }
        return {success, data, message};
    }
}