// 
import { defineStore } from 'pinia'
import type { User } from '../types'
import { UseLocalStorage } from '../utils'
import { useApiAuth } from '../api/auth';
const tokenLocalStorage= new UseLocalStorage<{accessToken:string,refreshToken:string,tokenType:string}>('token');

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    tokenType: '',
    user: null as User | null
  }),
  getters:{
    isLogin:(state)=>state.user!==null,
    getUser:(state)=>state.user,
    getAccessToken:(state)=>state.accessToken,
    getRefreshToken:(state)=>state.refreshToken,
    getTokenType:(state)=>state.tokenType
  },
  actions: {
    setToken(accessToken: string, refreshToken: string, tokenType: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.tokenType = tokenType;
      tokenLocalStorage.setItem('token',{accessToken,refreshToken,tokenType});
    },
    setUser(user: User) {
      this.user = user
    },
    clearToken() {
      this.accessToken = ''
      this.refreshToken = ''
      this.tokenType = ''
      tokenLocalStorage.removeItem('token');
    },
    clearUser() {
      this.user = null;
    },
    async tokenRefresh(){
      const {success,data,message} = await useApiAuth.refreshToken(this.refreshToken);
      if(success){
        this.setToken(data!.access_token,data!.refresh_token,data!.token_type);
      }else{
        console.error(message);
        this.clearToken();
        this.clearUser();
      }
    }   
 }
});