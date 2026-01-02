<template>
  <main>
    <div class=" content-container">
      <div class="login-container bg-card radius-rem">
        <h4 class=" text-center">
          忘记密码
        </h4>
        <div class=" container">
          <QFormText
            v-model="formParam.email"
            type="text"
            label="邮箱"
            placeholder="请输入邮箱"
            name="email"
          />
          <QFormButton
            type="button"
            class=" button-primary"
            @click="useApiUser.getForgotPassword(formParam.email)"
          >
            <span class=" text-08rem">验证邮箱</span>
          </QFormButton>
        </div>
        <QFormText
          v-model="formParam.captcha"
          type="text"
          label="验证码"
          placeholder="请输入验证码"
          name="captcha"
        />
        <QFormText
          v-model="formParam.password"
          type="password"
          label="新密码"
          placeholder="请输入密码"
          name="password"
        />
        <QFormText
          v-model="formParam.confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请输入密码"
          name="confirmPassword"
        />
        <QFormButton
          type="button"
          class="button-primary"
          @click="handelSubmit"
        >
          <span class=" text-08rem">重置密码</span>
        </QFormButton>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import { QFormText,QFormButton } from 'qyani-components';
import { ref } from 'vue';
import { useApiUser } from '../api';
import router from '../route';
defineOptions({
    name: 'ForgetPassword'
})
const formParam = ref({
    email: '',
    captcha: '',
    password: '',
    confirmPassword: ''
});
const handelSubmit = () => {
    useApiUser.patchForgotPassword(
            formParam.value.email,
            formParam.value.captcha,
            formParam.value.password,
            formParam.value.confirmPassword
    ).then(res=>{
        if(res.success){
            router.replace({
                name:'Login'
            });
        }
    })
}
</script>
<style scoped>
</style>