import { createServer as createViteServer, type Manifest } from 'vite'
import Koa from 'koa'
import koaConnect from 'koa-connect'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import koaStatic from 'koa-static'

const nodeEnv = process.env.NODE_ENV
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename)

type Render = (url: string, manifest?: Manifest) => Promise<{ html: string, storeState: string, preload: string }>
type Server = Koa<Koa.DefaultState, Koa.DefaultContext>

async function createDevServer (): Promise<Server> {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  const server = new Koa()

  server.use(koaConnect((req, res, next) => {
    vite.middlewares.handle(req, res, next)
  }))

  server.use(async ({ request, response }) => {
    const url = request.url
    try {
      let template = fs.readFileSync(
        'index.html',
        'utf-8'
      )
      template = await vite.transformIndexHtml(url, template)

      const render: Render = (await vite.ssrLoadModule('/src/serverEntry.ts')).serverRender
      const { html: appHtml } = await render(url)

      const html = template
        .replace('<!-- ssr -->', appHtml)

      response.status = 200
      response.set('Content-Type', 'text/html')
      response.body = html
    } catch (e: any) {
      vite.ssrFixStacktrace(e)
      console.log(e)
      response.status = 500
      response.body = e.stack
    }
  })

  return server
}

async function createProdServer (): Promise<Server> {
  const server = new Koa()

  server.use(koaStatic(`${__dirname}/client`, {
    index: false
  }))

  server.use(async ({ request, response }) => {
    const url = request.url
    try {
      const template = fs.readFileSync(
        `${__dirname}/client/index.html`,
        'utf-8'
      )

      const render: Render = (await import(`${__dirname}/server/serverEntry.js`)).serverRender
      const manifest: Manifest = JSON.parse(fs.readFileSync(`${__dirname}/client/.vite/ssr-manifest.json`, 'utf-8'))
      const { html: appHtml, storeState, preload } = await render(url, manifest)

      const html = template
        .replace('<!-- ssr -->', appHtml)
        .replace('<!-- preload -->', preload)
        .replace('\'<!-- store -->\'', JSON.stringify(storeState))

      response.status = 200
      response.set('Content-Type', 'text/html')
      response.body = html
    } catch (e: any) {
      console.log(e)
      response.status = 500
      response.body = e.stack
    }
  })

  return server
}

if (nodeEnv === 'development') {
  createDevServer()
    .then(s => s.listen(80))
    .then(() => { console.log('dev server: http://127.0.0.1:80') })
    .catch(e => { console.log(e) })
} else {
  createProdServer()
    .then(s => s.listen(process.env.SERVER_PORT))
    .then(() => { console.log('prod server start, ', `port: ${process.env.SERVER_PORT}`) })
    .catch(e => { console.log(e) })
}
