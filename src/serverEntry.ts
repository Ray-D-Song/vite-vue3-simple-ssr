import { renderToString } from 'vue/server-renderer'
import createVueInstance from './main'

function path2ToLnk(filePath: string): string {
	if (filePath.endsWith('.js'))
		return `<link rel="modulepreload" crossorigin href="${filePath}">`
	else if (filePath.endsWith('.css'))
		return `<link rel="stylesheet" href="${filePath}">`
	else if (filePath.endsWith('.woff'))
		return ` <link rel="preload" href="${filePath}" as="font" type="font/woff" crossorigin>`
	else if (filePath.endsWith('.woff2'))
		return ` <link rel="preload" href="${filePath}" as="font" type="font/woff2" crossorigin>`
	else if (filePath.endsWith('.gif'))
		return ` <link rel="preload" href="${filePath}" as="image" type="image/gif">`
	else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg'))
		return ` <link rel="preload" href="${filePath}" as="image" type="image/jpeg">`
	else if (filePath.endsWith('.png'))
		return ` <link rel="preload" href="${filePath}" as="image" type="image/png">`

	return ''
}

interface SSRCtx {
	modules: Set<string>
}
type Manifest = Record<string, string[]>

function renderPreload(manifest: Manifest, { modules }: SSRCtx): string {
	let links = ''
	modules.forEach((key) => {
		const filePathArr = manifest[key] ?? []
		filePathArr.forEach((filePath) => {
			links += path2ToLnk(filePath)
		})
	})

	return links
}

async function serverRender(url: string, mainfest?: Manifest): Promise<{
	html: string
	storeState: string
	preload: string
} | undefined> {
	const { app, store, router } = createVueInstance()

	try {
		await router.push(url)
		await router.push('/')
		await router.isReady()

		const ctx = {}
		// @vitejs/plugin-vue will auto inject context
		const html = await renderToString(app, ctx)
		const preload = renderPreload(mainfest ?? {}, ctx as SSRCtx)
		const storeState = JSON.stringify(store.state.value)

		return { html, storeState, preload }
	}
	catch (err) {
		console.log(err)
	}
}

export {
	serverRender,
}
