import fs from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Manifest, createServer as createViteServer } from 'vite'
import Koa from 'koa'
import koaConnect from 'koa-connect'
import koaStatic from 'koa-static'
import koaCompress from 'koa-compress'

const nodeEnv = process.env.NODE_ENV
const _dirname = typeof __dirname !== 'undefined'
	? __dirname
	: dirname(fileURLToPath(import.meta.url))

type Render = (url: string, manifest?: Manifest) => Promise<{ html: string, storeState: string, preload: string }>
type Server = Koa<Koa.DefaultState, Koa.DefaultContext>

async function createDevServer(): Promise<Server> {
	const vite = await createViteServer({
		server: { middlewareMode: true },
		appType: 'custom',
	})

	const server = new Koa()

	server.use(koaCompress({
		threshold: 2048,
	}))

	server.use(koaConnect((req, res, next) => {
		vite.middlewares.handle(req, res, next)
	}))

	server.use(async ({ request, response }) => {
		const url = request.url
		try {
			let template = fs.readFileSync(
				'index.html',
				'utf-8',
			)
			template = await vite.transformIndexHtml(url, template)

			const render: Render = (await vite.ssrLoadModule('/src/serverEntry.ts')).serverRender
			const { html: appHtml } = await render(url)

			const html = template
				.replace('<!-- ssr -->', appHtml)

			response.status = 200
			response.set('Content-Type', 'text/html')
			response.body = html
		}
		catch (e: any) {
			vite.ssrFixStacktrace(e)
			console.log(e)
			response.status = 500
			response.body = e.stack
		}
	})

	return server
}

async function createProdServer(): Promise<Server> {
	const server = new Koa()

	server.use(koaStatic(`${_dirname}/client`, {
		index: false,
	}))

	server.use(async ({ request, response }) => {
		const url = request.url
		try {
			const template = fs.readFileSync(
        `${_dirname}/client/index.html`,
        'utf-8',
			)

			const render: Render = (await import(`${_dirname}/server/serverEntry.js`)).serverRender
			const manifest: Manifest = JSON.parse(fs.readFileSync(`${_dirname}/client/.vite/ssr-manifest.json`, 'utf-8'))
			const { html: appHtml, storeState, preload } = await render(url, manifest)

			const html = template
				.replace('<!-- ssr -->', appHtml)
				.replace('<!-- preload -->', preload)
				.replace('\'<!-- store -->\'', JSON.stringify(storeState))

			response.status = 200
			response.set('Content-Type', 'text/html')
			response.body = html
		}
		catch (e) {
			console.log(e)
			response.status = 500
			response.body = (e as Error).stack
		}
	})

	return server
}

if (nodeEnv === 'development') {
	createDevServer()
		.then(s => s.listen(80))
		.then(() => { console.log('dev server: http://127.0.0.1:80') })
		.catch((e) => { console.log(e) })
}
else {
	createProdServer()
		.then(s => s.listen(process.env.SERVER_PORT))
		.then(() => { console.log('prod server start, ', `port: ${process.env.SERVER_PORT}`) })
		.catch((e) => { console.log(e) })
}
