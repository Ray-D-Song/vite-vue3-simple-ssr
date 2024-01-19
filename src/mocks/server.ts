/** /src/mocks/server.ts */
import { setupServer } from 'msw/node'
import { type HttpHandler, HttpResponse, http } from 'msw'

export const handlers: HttpHandler[] = [
  http.get('https://test.mock/useFetch/default', () => {
    return HttpResponse.json({
      msg: 'hey'
    })
  })
]

export const server = setupServer(...handlers)
