<template>
  <main>
    <div class=" content-container">
      <div class="login-container bg-card radius-rem">
        <h4 class=" text-center">
          修改密码
        </h4>
        <div class=" container">
          <QFormText
            v-model="formParam.email"
            type="text"
            label="邮箱"
            placeholder="请输入邮箱"
            name="email"
          />
        </div>
        <QFormText
          v-model="formParam.oldPassword"
          type="password"
          label="旧密码"
          placeholder="请输入密码"
          name="password"
        />
        <QFormText
          v-model="formParam.password"
          type="password"
          label="新密码"
          placeholder="请输入密码"
          name="newPassword"
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
import { useAuthStore } from '../store';
defineOptions({
    name: 'UpdatePassword'
})
const formParam = ref({
    email: '',
    oldPassword: '',
    password: '',
    confirmPassword: ''
});
const handelSubmit = () => {
    useApiUser.updatePassword(
        formParam.value.email,
        formParam.value.oldPassword,
        formParam.value.password,
        formParam.value.confirmPassword
    ).then(res=>{ 
        if(res.success){
            const authStore = useAuthStore();
            authStore.clearUser();
            authStore.clearToken();
            router.replace({
                name:'Login'
            });
        }
    })
}
</script>
<style scoped>
</style>