/**
 * a simple impl of @vueuse/core/useFetch
 * include: error, isFetching, refetch(as return value), .blob(), .json(), .text(), hooks
 */
import type { Ref } from 'vue'
import { ref, shallowRef } from 'vue'
import { until } from '@/utils/util'

interface UseFetchReturn<T> {
  /**
	 * Indicates if the fetch request has finished
	 */
  isFinished: Ref<boolean>

  /**
	 * The statusCode of the HTTP fetch response
	 */
  statusCode: Ref<number | null>

  /**
	 * The raw response of the fetch response
	 */
  response: Ref<Response | null>

  /**
	 * Any fetch errors that may have occurred
	 */
  error: Ref<any>

  /**
	 * The fetch response body on success, may either be JSON or text
	 */
  data: Ref<T | null>

  /**
	 * Indicates if the request is currently being fetched.
	 */
  isFetching: Ref<boolean>

  /**
	 * Refetch trigger
	 */
  refetch: () => Promise<any>

  // type
  json: () => UseFetchReturn<JSON> & PromiseLike<UseFetchReturn<JSON>>
  text: () => UseFetchReturn<string> & PromiseLike<UseFetchReturn<string>>
  blob: () => UseFetchReturn<Blob> & PromiseLike<UseFetchReturn<Blob>>
  arrayBuffer: () => UseFetchReturn<ArrayBuffer> & PromiseLike<UseFetchReturn<ArrayBuffer>>
  formData: () => UseFetchReturn<FormData> & PromiseLike<UseFetchReturn<FormData>>
}

type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'

export type BeforeFetchContext = UseFetchConfig

export interface AfterFetchContext<T = any> {
  response: Response

  data: T | null
}

export interface OnFetchErrorContext<T = any, E = any> {
  error: E

  data: T | null
}

type NativeFetchOptions = RequestInit
interface UseFetchHooks {

  /**
	 * Will run immediately before the fetch request is dispatched
	 */
  beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void

  /**
	 * Will run immediately after the fetch request is returned.
	 * Runs after any 2xx response
	 */
  afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext> | void

  /**
	 * Will run immediately after the fetch request is returned.
	 * Runs after any 4xx and 5xx response
	 */
  onFetchError?: (ctx: OnFetchErrorContext) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>
}
interface UseFetchConfig {
  options?: NativeFetchOptions
  hooks?: UseFetchHooks
}

function useFetch<T> (url: string, config?: UseFetchConfig): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
  /** return value */
  const isFinished = ref(false)
  const isFetching = ref(false)
  const statusCode = ref<number | null>(null)
  const response = shallowRef<Response | null>(null)
  const error = shallowRef<any>(null)
  const data = shallowRef<T | null>(null)

  const fetchOptions: NativeFetchOptions = {
    method: 'GET',
    ...config?.options
  }

  function loading (isLoading: boolean): void {
    isFetching.value = isLoading
    isFinished.value = !isLoading
  }

  const dataType: Ref<DataType> = ref('json')
  async function exec (): Promise<any> {
    loading(true)
    error.value = null
    statusCode.value = null

    let responseData: any

    if (config?.hooks?.beforeFetch) {
      Object.assign(config, (await config.hooks.beforeFetch(config)) ?? {})
    }

    await fetch(url, fetchOptions)
      .then(async (fetchResponse) => {
        response.value = fetchResponse
        statusCode.value = fetchResponse.status

        responseData = await fetchResponse.clone()[dataType.value]()

        if (!fetchResponse.ok) {
          data.value = null
          throw new Error(fetchResponse.statusText)
        }

        if (config?.hooks?.afterFetch) {
          responseData = Object.assign(responseData, await config.hooks.afterFetch({
            data: responseData,
            response: fetchResponse
          }) ?? {})
        }

        data.value = responseData
        loading(false)
      })
      .catch(async (fetchError) => {
        const errorData = fetchError.message || fetchError.name

        if (config?.hooks?.onFetchError) {
          await config.hooks.onFetchError({ error: fetchError, data })
        }

        error.value = errorData

        loading(false)

        throw fetchError
      })
  }

  Promise.resolve().then(() => exec())

  const shell: UseFetchReturn<T> = {
    isFinished,
    statusCode,
    response,
    error,
    data,
    isFetching,
    refetch: exec,
    json: setType('json'),
    text: setType('text'),
    blob: setType('blob'),
    arrayBuffer: setType('arrayBuffer'),
    formData: setType('formData')
  }

  function waitUntilFinished () {
    return new Promise<UseFetchReturn<T>>((resolve, reject) => {
      until(isFinished).toBe(true)
        .then(() => { resolve(shell) })
        .catch(error => { reject(error) })
    })
  }

  function setType (type: DataType) {
    return () => {
      if (!isFetching.value) {
        dataType.value = type
        return {
          ...shell,
          then (onFulfilled: any, onRejected: any) {
            return waitUntilFinished()
              .then(onFulfilled, onRejected)
          }
        } as any
      }
      return undefined
    }
  }

  return {
    ...shell,
    then (onFulfilled, onRejected) {
      return waitUntilFinished()
        .then(onFulfilled, onRejected)
    }
  }
}

export {
  useFetch
}
