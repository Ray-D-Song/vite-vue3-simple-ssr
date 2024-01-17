import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import createRouter from '@/router/index'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

import App from './App.vue'


function createVueInstance() {
  const app = createSSRApp(App)
  const store = createPinia()
  const router = createRouter()

  app
    .use(store)
    .use(router)

  return { app, store, router }
}

export default createVueInstance