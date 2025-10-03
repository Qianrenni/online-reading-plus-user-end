// utils/request.ts
import { useMessage } from 'qyani-components'
import { BASE_URL } from '../config'
import { useAuthStore } from '../store/useAuthStore'

// 响应码枚举
const ResponseCode =  {
  SUCCESS : 0,
  FAIL : 1
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

const authStore = useAuthStore();
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
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), defaultConfig.timeout)

  const config: RequestInit = {
    method: 'GET',
    ...options,
    headers: { ...defaultConfig.headers, 
              ...options.headers,
              'Authorization':`${authStore.getTokenType} ${authStore.getAccessToken}`
            },
    signal: controller.signal
  }

  // 处理 body：如果是普通对象（非 FormData、Blob 等），自动转为 JSON 字符串
  if (config.body != null && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  const fullUrl = defaultConfig.baseURL + url

  try {
    const response = await fetch(fullUrl, config);
    clearTimeout(timeoutId);
    if(response.status===429){
      useMessage.error('请求频率过快，请稍后再试');
      return {
        success:false,
        data:null,
        message:'请求频率过快，请稍后再试'
      }
    }
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.log(`error ${url} return not is json`);
      return {
        success:response.ok?true:false,
        data:null,
        message:response.ok?'请求成功':'请求失败'
      };
    }
    const result: { code: number; data: T; message?: string } = await response.json();

    const success = result.code === ResponseCode.SUCCESS;
    if(showMessage&&!success){
      useMessage.error(result.message??'请求失败'); 
    }
    return {
      success,
      data: success ? result.data : null,
      message: result.message??(success ? '成功' : '请求失败')
    }
  } catch (error) {
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