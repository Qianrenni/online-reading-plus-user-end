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
    /**
     * 重置密码表单提交
     * @param email 邮箱
     * @param code  验证码
     * @param password  新密码
     * @param confirmPassword   确认密码
     * @returns     {success:boolean,data:null,message:string|null}
     */
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
    },
    /**
     * 修改密码
     * @param email 邮箱
     * @param oldPassword  旧密码
     * @param newPassword  新密码
     * @param confirmPassword   确认密码
     * @returns     {success:boolean,data:null,message:string|null}
     */
    updatePassword: async function (email: string, oldPassword: string, newPassword: string, confirmPassword: string) {
        if (useValidate.email(email) === false) {
            useMessage.error('邮箱格式错误');
            return {success: false, data: null, message: '邮箱格式错误'};
        }
        if (newPassword !== confirmPassword) {
            useMessage.error('密码不一致');
            return {success: false, data: null, message: '密码不一致'};
        }
        const {success, data, message} = await patch<null>(
            `${this.prefix}/update-password`,
            {
                username: email,
                old_password: oldPassword,
                new_password: newPassword
            },
            undefined,
            true
        )
        if (success) {
            useMessage.success('修改密码成功,请重新登录');
        }
        return {success, data, message};
    }
}