// composables/useRequest.ts
import { ref, onUnmounted, readonly} from 'vue'
import { request, type RequestResult } from '../utils'
interface UseRequestOptions extends RequestInit {
  // 可扩展
}


export function useRequest<T = any>(
  url: string,
  options: UseRequestOptions = {}
){
  const loading = ref(false)
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  let abortController: AbortController | null = null

  const execute = async (overrideOptions: UseRequestOptions = {}): Promise<T> => {
    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()

    loading.value = true
    error.value = null

    try {
      // 注意：request 返回的是 RequestResult<T>
      const res: RequestResult<T> = await request<T>(url, {
        ...options,
        ...overrideOptions,
        signal: abortController.signal
      })

      if (res.success) {
        data.value = res.data
        return res.data! // 返回 T
      } else {
        // 构造错误并抛出
        const err = new Error(res.message || '请求失败');
        throw err
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        error.value = err as Error
        console.error('请求失败:', err)
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  onUnmounted(() => {
    if (abortController) {
      abortController.abort()
    }
  })

  return {
    loading: readonly(loading),
    data: readonly(data),
    error: readonly(error),
    execute
  }
}