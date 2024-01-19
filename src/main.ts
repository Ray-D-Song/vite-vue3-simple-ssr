import { createSSRApp } from 'vue'
import { type Pinia, createPinia } from 'pinia'
import type { Router } from 'vue-router'
import App from './App.vue'
import createRouter from '@/router/index'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

function createVueInstance(): { app: any, store: Pinia, router: Router } {
	const app = createSSRApp(App)
	const store = createPinia()
	const router = createRouter()

	app
		.use(store)
		.use(router)

	return { app, store, router }
}

export default createVueInstance
