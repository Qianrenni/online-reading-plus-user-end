import { ref, readonly } from 'vue';

interface UseWrapLoadOptions {
  preventConcurrent?: boolean;
  immediate?: boolean;
  immediateArgs?: unknown[];
}
export const useWrapLoad = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  options: UseWrapLoadOptions = {}
) => {
  const { preventConcurrent = true, immediate = false, immediateArgs = [] } = options;
  
  const loading = ref(false);
  const result = ref<Awaited<ReturnType<T>> | null>(null);
  const error = ref<unknown>(null);

  const run = async (...args: Parameters<T>): Promise<void> => {
    if (preventConcurrent && loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      result.value = await func(...args);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  if (immediate) {
    // 类型断言确保 immediateArgs 类型正确
    run(...(immediateArgs as Parameters<T>));
  }

  return {
    loading: readonly(loading),
    result: readonly(result),
    error: readonly(error),
    run
  };
};