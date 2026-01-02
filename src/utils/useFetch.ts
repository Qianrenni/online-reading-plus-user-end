// utils/request.ts
import {useMessage} from 'qyani-components'
import {BASE_URL} from '../config'
import {useAuthStore} from '../store/useAuthStore'
import {useApiAuth} from '../api/auth'

// 响应码枚举
const ResponseCode = {
  SUCCESS: 0,
  FAIL: 1
} as const

// 默认配置
const defaultConfig = {
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
}

// 请求选项扩展（兼容 fetch 的 RequestInit，但 body 可为对象）
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any // 允许传入普通对象，内部自动 stringify
}

// 请求返回结果类型
export interface RequestResult<T = any> {
  success: boolean
  data: T | null
  message: string | null
}

/**
 * 通用请求函数
 * @param url - 接口路径（不带 baseURL）
 * @param options - fetch 配置（method, body, headers 等）
 * @returns Promise<RequestResult<T>>
 */
export async function request<T = any>(
  url: string,
  options: RequestOptions = {},
  showMessage: boolean = false,
): Promise<RequestResult<T>> {

  // 创建 AbortController 和 timeoutId, 用于取消请求
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), defaultConfig.timeout)
  // 获取当前用户信息
  const authStore = useAuthStore();
  // 添加请求头
  const appendHeader: { [key: string]: string } = {}
  // 添加授权信息
  if (authStore.getAccessToken !== null) {
    appendHeader.Authorization = `${authStore.getTokenType} ${authStore.getAccessToken}`
  }
  // 组合请求配置
  const config: RequestInit = {
    method: 'GET',
    ...options,
    headers: {
              ...defaultConfig.headers,
              ...appendHeader,
              ...options.headers,
            },
    signal: controller.signal
  }
  // 处理 body：如果是普通对象（非 FormData、Blob 等），自动转为 JSON 字符串
  if (config.body != null && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  // 构建完整 URL
  const fullUrl = defaultConfig.baseURL + url
  // 发送请求
  try {
    const response = await fetch(fullUrl, config);
    // 清除超时定时器
    clearTimeout(timeoutId);
    // 响应码为 429 时，说明请求频率过快，返回错误信息
    if(response.status===429){
      useMessage.error('请求频率过快，请稍后再试');
      return {
        success:false,
        data:null,
        message:'请求频率过快，请稍后再试'
      }
    }
    // 响应码为 401 时，说明授权信息过期，尝试刷新授权信息  
    if(response.status===401&&authStore.getRefreshToken!==null){
      const {success,data}= await useApiAuth.refreshToken(authStore.getRefreshToken);
      if(success){
        authStore.setToken(data!.access_token,data!.refresh_token,data!.token_type);
        authStore.setUser(data!.user);
        return request(url,options,showMessage);
      }else{
        authStore.clearToken();
        authStore.clearUser();
      }
    }
    // 判断响应内容是否为 JSON
    const contentType = response.headers.get('content-type');
    // 如果不是 JSON，则直接返回结果
    if (!contentType?.includes('application/json')) {
      return {
        success: response.ok ? true : false,
        data: null,
        message: ''
      }
    }
    const reponseText = await response.text();
    // 如果没有body，直接返回
    if (reponseText === null || reponseText == undefined || reponseText === '') {
      return {
        success: response.ok ? true : false,
        data: null,
        message: ''
      }
    }
    // 解析响应结果
    const result: { code: number; data: T; message?: string } = JSON.parse(reponseText);
    // 如果响应结果为 null，则返回错误信息
    if (result === null) {
      return {
        success: response.ok ? true : false,
        data: null,
        message: ''
      }
    }
    // 判断响应结果是否成功
    const success = result.code === ResponseCode.SUCCESS;
    // 是否显示错误信息
    if(showMessage&&!success){
      useMessage.error(result.message??'请求失败'); 
    }
    return {
      success,
      data: success ? result.data : null,
      message: result.message??(success ? '成功' : '请求失败')
    }
  }
  catch (error) {
    clearTimeout(timeoutId)
    // 如果是 AbortError，说明是超时或手动取消
    console.error(error);
    return  {
      success:false,
      data:null,
      message:'网络错误,请稍后重试'
    }
  }
}

// 快捷方法
export const get = <T = any>(url: string, config: RequestOptions = {},showMessage:boolean=false) =>
  request<T>(url, { method: 'GET', ...config },showMessage)

export const post = <T = any>(url: string, data?: any, config: RequestOptions = {},showMessage:boolean=false) =>
  request<T>(url, { method: 'POST', body: data, ...config },showMessage)

export const put = <T = any>(url: string, data?: any, config: RequestOptions = {},showMessage:boolean=false) =>
  request<T>(url, { method: 'PUT', body: data, ...config },showMessage)

export const del = <T = any>(url: string, config: RequestOptions = {},showMessage:boolean=false) =>
  request<T>(url, { method: 'DELETE', ...config },showMessage)

export const patch = <T = any>(url: string, data?: any, config: RequestOptions = {},showMessage:boolean=false) =>
  request<T>(url, { method: 'PATCH', body: data, ...config },showMessage)