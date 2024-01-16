import createVueInstance from './main'
import { renderToString } from 'vue/server-renderer'

async function serverRender(url: string, mainfest?: Object) {
  const { app, store, router } = createVueInstance()

  try {
    await router.push(url)
    await router.push('/')
    await router.isReady()
    const ssrCtx = {}
    const html = await renderToString(app)
    // todo: preload
    // todo: teleports
    const storeState = JSON.stringify(store.state.value)
    return { html, storeState }
  } catch (err) {
    console.log(err)
  }
}

export {
  serverRender
}