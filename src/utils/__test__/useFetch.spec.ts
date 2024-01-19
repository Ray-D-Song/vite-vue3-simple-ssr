import { describe, expect, it } from 'vitest'
import { useFetch } from '@/utils/useFetch/index'

const prefix = 'https://test.mock/useFetch/'

const url = {
	default: `${prefix}default`,
	hooks: `${prefix}hooks`,
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
	it('request 200', async () => {
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
})
