<template>
    <div class=" content-container">
        <div class="login-container bg-card radius-rem">
        <h3 class=" text-center">欢迎体验</h3>
        <QFormText
            type="email"
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
        <QFormButton type="button" @click="()=>run()">
            <QLoading v-if="loading" type="spinner"/>
            <span v-else>登录</span>
        </QFormButton>
    </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useApiCaptcha } from '../api/captcha';
import { useApiAuth } from '../api/auth';
import { useMessage } from 'qyani-components';
import { UseLocalStorage, useWrapLoad } from '../utils';
import router from '../route';

const tokenStorage = new UseLocalStorage('token');
const image = ref<string>('');
const form = ref({
    username: '',
    password: '',
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
const {loading,run}= useWrapLoad(async () => {
    const {success,message,data} = await useApiAuth.login(
        form.value.username,
        form.value.password,
        form.value.captcha,
        form.value.x_captcha_id
    );
    if (success){
        useMessage.success('登录成功');
        tokenStorage.setItem('access_token',data?.access_token);
        tokenStorage.setItem('refresh_token',data?.refresh_token);
        tokenStorage.setItem('type',data?.token_type);
        router.back();
    }else{
        useMessage.error(message);
    }
})
onMounted( async ()=>{
    refreshCaptcha();
});
onBeforeUnmount(()=>{
    if (image.value){
        URL.revokeObjectURL(image.value);
    }
});
</script>

<style scoped lang="css">
</style>