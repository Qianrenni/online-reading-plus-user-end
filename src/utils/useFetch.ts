// utils/request.ts
import { BASE_URL } from '../config'

// 响应码枚举
const ResponseCode =  {
  SUCCESS : 0,
  FAIL : 1
} as const

// 默认配置
const defaultConfig = {
  baseURL: BASE_URL,
  timeout: 10000,
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
  options: RequestOptions = {}
): Promise<RequestResult<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), defaultConfig.timeout)

  const config: RequestInit = {
    method: 'GET',
    headers: { ...defaultConfig.headers },
    ...options,
    signal: controller.signal
  }

  // 处理 body：如果是普通对象（非 FormData、Blob 等），自动转为 JSON 字符串
  if (config.body != null && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  const fullUrl = defaultConfig.baseURL + url

  try {
    const response = await fetch(fullUrl, config)

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('服务器返回非 JSON 格式')
    }

    const result: { code: number; data: T; message?: string } = await response.json()

    const success = result.code === ResponseCode.SUCCESS

    return {
      success,
      data: success ? result.data : null,
      message: result.message || (success ? '成功' : '请求失败')
    }
  } catch (error) {
    clearTimeout(timeoutId)
    // 如果是 AbortError，说明是超时或手动取消
    if (error instanceof Error && error.name === 'AbortError') {
      error.message = '请求超时或已取消'
    }
    throw error
  }
}

// 快捷方法
export const get = <T = any>(url: string, config: RequestOptions = {}) =>
  request<T>(url, { method: 'GET', ...config })

export const post = <T = any>(url: string, data?: any, config: RequestOptions = {}) =>
  request<T>(url, { method: 'POST', body: data, ...config })

export const put = <T = any>(url: string, data?: any, config: RequestOptions = {}) =>
  request<T>(url, { method: 'PUT', body: data, ...config })

export const del = <T = any>(url: string, config: RequestOptions = {}) =>
  request<T>(url, { method: 'DELETE', ...config })