<template>
  <div class=" content-container">
    <div class="login-container bg-card radius-rem">
      <h3 class=" text-center">
        欢迎体验
      </h3>
      <QFormText
        v-model="form.username"
        type="email"
        label="用户名"
        placeholder="请输入用户名"
        name="username"
      />
      <QFormText
        v-model="form.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        name="password"
      />
      <div class="login-captcha-container">
        <QFormText
          v-model="form.captcha"
          type="text"
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
      <div class=" container-space-between">
        <QFormCheckboxGroup
          v-model="form.remember"
          :options="[{label:'记住我',value:'remember'}]"
        />
        <RouterLink
          to="/forget-password"
          class=" link-primary"
        >
          忘记密码?
        </RouterLink>
      </div>
      <QFormButton
        type="button"
        class=" button-primary "
        @click="()=>run()"
      >
        <QLoading
          v-if="loading"
          type="spinner"
        />
        <span v-else>登录</span>
      </QFormButton>
      <div class=" container-space-between">
        <RouterLink
          to="/register"
          class=" link-primary"
        >
          没有账号?立即注册
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useApiCaptcha } from '../api/captcha';
import { useApiAuth } from '../api/auth';
import { useMessage,QFormText,QFormCheckboxGroup,QFormButton,QLazyImage,QLoading } from 'qyani-components';
import { useWrapLoad } from '../utils';
import { useAuthStore } from '../store';
import router from '../route';
import { useBookShelfStore } from '../store/useBookShelfStore';
import { useReadingHistoryStore } from '../store/useReadingHistoryStore';
defineOptions({
    name: 'Login'
});
const authStore = useAuthStore();
if(authStore.isLogin){
    router.push('/');
}
const image = ref<string>('');
const form = ref({
    username: '',
    password: '',
    captcha: '',
    x_captcha_id: '',
    remember: []
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
        authStore.setRemeber(form.value.remember.length>0);
        authStore.setToken(data?.access_token!,data?.refresh_token!,data?.token_type!);
        authStore.setUser(data?.user!);
    }else{
        useMessage.error(message);
    }
});

watch(
    ()=>authStore.isLogin,
    ()=>{
        if(authStore.redictUrl!==null){
            const url = authStore.redictUrl;
            authStore.setRedictUrl(null);
            router.replace(url);
        }else{
            router.back();
        }
        const bookShelfStore = useBookShelfStore();
        const readingHistoryStore = useReadingHistoryStore();
        Promise.allSettled([
            bookShelfStore.get(),
            readingHistoryStore.get()
        ])
    }
)
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