import { createServer as createViteServer } from 'vite'
import Koa from 'koa'
import koaConnect from 'koa-connect'
import * as fs from 'fs'

const nodeEnv = process.env.NODE_ENV

async function createDevServer() {

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  const server = new Koa()

  server.use(koaConnect((req, res, next) => {
    vite.middlewares.handle(req, res, next)
  }))

  server.use(async ({request, response}) => {
    const url = request.url
    try {
      let template = fs.readFileSync(
        'index.html',
        'utf-8',
      )
      template = await vite.transformIndexHtml(url, template)

      const render = (await vite.ssrLoadModule('/src/serverEntry.ts')).serverRender
      const appHtml = await render(url)

      const html = template.replace(`<!-- ssr -->`, appHtml.html)

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

async function createProdServer() {

  const server = new Koa()
  
  server.use(async ({request, response}) => {
    const url = request.url
    try {
      let template = fs.readFileSync(
        `${__dirname}/client/index.html`,
        'utf-8',
      )

      const render = (await import(`${__dirname}/server/serverEntry.js`)).serverRender
      const appHtml = await render(url)??{ html: '' }

      const html = template.replace(`<!-- ssr -->`, appHtml.html)

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

if(nodeEnv === 'development') {
  createDevServer()
    .then(s => s.listen(80))
    .then(() => console.log('dev server: http://127.0.0.1:80'))
}

if(nodeEnv === 'production') {
  createProdServer()
    .then(s => s.listen(process.env.PORT))
    .then(() => {
      console.log('prod server start')
    })
}