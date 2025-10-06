// 
import { defineStore } from 'pinia'
import type { User } from '../types'
import { UseLocalStorage } from '../utils'
import { useApiAuth } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: ():{
    accessToken:string|null,
    refreshToken:string|null,
    tokenType:string|null,
    user:User|null,
    tokenLocalStorage:UseLocalStorage<{accessToken:string,refreshToken:string,tokenType:string}>|null,
    redictUrl:string|null,
    isRemeber:boolean
  } => ({
    accessToken: null,
    refreshToken: null,
    tokenType: null,
    user: null as User | null,
    tokenLocalStorage:null,
    redictUrl:null,
    isRemeber:true,
  }),
  getters:{
    isLogin:(state)=>state.user!==null,
    getUser:(state)=>state.user,
    getAccessToken:(state)=>state.accessToken,
    getRefreshToken:(state)=>state.refreshToken,
    getTokenType:(state)=>state.tokenType,
    getTokenLocalStorage:(state)=>{
      if(state.tokenLocalStorage===null){
        state.tokenLocalStorage = new UseLocalStorage<{accessToken:string,refreshToken:string,tokenType:string}>('token');
      }
      return state.tokenLocalStorage;
    },
    getRedictUrl:(state)=>state.redictUrl,
  },
  actions: {
    async initial(){
      const token = this.getTokenLocalStorage.getItem('token');
      if(token){
        this.setToken(token.accessToken,token.refreshToken,token.tokenType);
        const {success,data,message} = await useApiAuth.authMe();
        if(success){
          this.setUser(data!);
        }else{
          const {success,data,message} = await useApiAuth.refreshToken(this.refreshToken!);
          if(success){
            this.setToken(data!.access_token,data!.refresh_token,data!.token_type);
          }else{
            this.clearToken();
            this.clearUser();
            console.error(message);
          }
        }
      }
    },
    setRemeber(isRemeber:boolean){
      this.isRemeber = isRemeber;
    },
    setToken(accessToken: string, refreshToken: string, tokenType: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.tokenType = tokenType;
      if(!this.isRemeber){
        this.getTokenLocalStorage.removeItem('token');
        return;
      }
      this.getTokenLocalStorage.setItem('token',{accessToken,refreshToken,tokenType});
    },
    setUser(user: User) {
      this.user = user
    },
    clearToken() {
      this.accessToken = ''
      this.refreshToken = ''
      this.tokenType = ''
      this.getTokenLocalStorage.removeItem('token');
    },
    clearUser() {
      this.user = null;
    },
    async tokenRefresh(){
      const {success,data,message} = await useApiAuth.refreshToken(this.refreshToken!);
      if(success){
        this.setToken(data!.access_token,data!.refresh_token,data!.token_type);
      }else{
        console.error(message);
        this.clearToken();
        this.clearUser();
      }
    },
    setRedictUrl(url:string|null){
      this.redictUrl = url;
    },
    clearRedictUrl(){
      this.redictUrl = null;
    }
 }
});