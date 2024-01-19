import { describe, expect, it } from 'vitest'
import { useFetch } from '@/utils/useFetch/index'

const prefix = 'https://test.mock/useFetch/'

const url = {
	default: `${prefix}default`,
	hooks: `${prefix}hooks`,
	value: `${prefix}value`,
}

describe('useFetch_no_config', async () => {
	it('default request', async () => {
		useFetch(url.default).then((res) => {
			const { data } = res
			expect(data.value).toEqual({
				msg: 'hey',
			})
		})
	})

	it('default request await', async () => {
		const { data } = await useFetch(url.default)
		expect(data.value).toEqual({
			msg: 'hey',
		})
	})
})

describe('useFetch_config_hooks', async () => {
	it('beforeFetch_change_request_body', async () => {
		const { data } = await useFetch(url.hooks, {
			hooks: {
				beforeFetch() {
					return {
						body: JSON.stringify({
							name: 'Jenny',
						}),
					}
				},
			},
			options: {
				method: 'POST',
				body: JSON.stringify({
					name: 'Ray',
				}),
			},
		})
		expect(data.value).toEqual({
			msg: 'hey',
			reqBody: 'Jenny',
		})
	})

	it('afterFetch_change_return_value', async () => {
		const { data } = await useFetch(url.hooks, {
			hooks: {
				afterFetch() {
					return {
						age: 18,
					}
				},
			},
			options: {
				method: 'POST',
				body: JSON.stringify({
					name: 'Ray',
				}),
			},
		})
		expect(data.value).toEqual({
			age: 18,
		})
	})

	it('onFetchError_log_error', async () => {
		const { data } = await useFetch(url.hooks, {
			hooks: {
				onFetchError(ctx) {
					console.log(ctx?.error)
				},
			},
		})
	})
})

describe('useFetch_return_values', async () => {
	it('refetch', async () => {
		const { data, refetch } = await useFetch(url.value)
		expect(data.value).toEqual({ num: 1 })
		await refetch()
		expect(data.value).toEqual({ num: 2 })
	})
})
