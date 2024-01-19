import type { Ref } from 'vue'

/**
 * useFetch param type
 */
export interface UseFetchConfig {
	options?: NativeFetchOptions
	hooks?: UseFetchHooks
}

export type NativeFetchOptions = RequestInit

export type BeforeFetchContext = NativeFetchOptions

export interface AfterFetchContext {
	response: Response
}

export interface OnFetchErrorContext<T = any, E = any> {
	error: E

	data: T | null
}

export interface UseFetchHooks {

	/**
	 * Will run immediately before the fetch request is dispatched
	 * return value will be merged into config
	 */
	beforeFetch?: (ctx?: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void

	/**
	 * Will run immediately after the fetch request is returned.
	 * Runs after any 2xx response
	 * return value will replace data
	 */
	afterFetch?: (ctx?: AfterFetchContext) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext> | void

	/**
	 * Will run immediately after the fetch request is returned.
	 * Runs after any 4xx and 5xx response
	 */
	onFetchError?: (ctx?: OnFetchErrorContext) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext> | void
}

/** useFetch return type */
export interface UseFetchReturn<T> {
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
