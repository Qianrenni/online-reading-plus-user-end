<template>
    <div class=" content-container">
        <div class="login-container bg-card radius-rem">
        <h3 class=" text-center">新用户注册</h3>
        <QFormText
            type="text"
            v-model="form.username"
            label="用户名"
            placeholder="请输入用户名"
            name="username"
        />
        <QFormText
            type="password"
            v-model="form.password"
            label="密码"
            placeholder="请输入密码"
            name="password"
        />
        <QFormText
            type="password"
            v-model="form.confirmPassword"
            label="重复输入密码"
            placeholder="再次输入密码"
            name="confirmPassword"
        />

        <div class=" container-space-between">
            <QFormText
                type="email"
                v-model="form.email"
                label="邮箱"
                placeholder="请输入邮箱"
                name="email"
            />
            <QFormButton type="button" >验证邮箱</QFormButton>
        </div> 
        <div class="login-captcha-container">
            <QFormText
                type="text"
                v-model="form.captcha"
                label="验证码"
                placeholder="请输入验证码"
                name="captcha"
            />
            <QLazyImage
                class=" mouse-cursor"
                :width="80"  
                :height="30" 
                :src="image"
                @click="refreshCaptcha" 
            />
        </div>
        <QFormButton type="button" @click="login">注册</QFormButton>
    </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useApiCaptcha } from '../api/captcha';
import { useApiAuth } from '../api/auth';
import { useMessage } from 'qyani-components';
const image = ref<string>('');
const form = ref({
    username: '',
    password: '',
    confirmPassword:'',
    email:'',
    captcha: '',
    x_captcha_id: '',
})

const refreshCaptcha = async () => {
    if (image.value){
        URL.revokeObjectURL(image.value);
    }
    const {x_captcha_id,imageUrl} = (await useApiCaptcha.getCaptcha())!;
    form.value.x_captcha_id = x_captcha_id!;
    image.value = imageUrl;
};
const login = async () => {
    const {success,message,data} = await useApiAuth.login(
        form.value.username,
        form.value.password,
        form.value.captcha,
        form.value.x_captcha_id
    );
    if (success){

    }else{
        useMessage.error(message);
    }
}
onMounted( async ()=>{
    refreshCaptcha();
});
onBeforeUnmount(()=>{
    if (image.value){
        URL.revokeObjectURL(image.value);
    }
})
</script>

<style scoped lang="css">
.login-container{
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 400px;
}
.login-captcha-container{
    display: flex;
    gap: 0.2rem;
    align-items:end;
}
@media screen and (max-width: 768px){
    .login-container{
        max-width: unset;
    }
    
}
</style>