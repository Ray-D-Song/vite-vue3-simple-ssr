/** /src/mocks/server.ts */
import { setupServer } from 'msw/node'
import { type HttpHandler, HttpResponse, http } from 'msw'

const prefix = 'https://test.mock'

export const handlers: HttpHandler[] = [
	http.get(`${prefix}/useFetch/default`, () => {
		return HttpResponse.json({
			msg: 'hey',
		})
	}),

	http.post(`${prefix}/useFetch/hooks`, async (ctx) => {
		return HttpResponse.json({
			msg: 'hey',
			reqBody: (await ctx.request.json()).name,
		})
	}),
]

export const server = setupServer(...handlers)
