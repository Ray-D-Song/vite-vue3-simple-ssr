import { type Router, createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

export default function (): Router {
	return createRouter({
		history: !import.meta.env.SSR ? createWebHistory(import.meta.env.BASE_URL) : createMemoryHistory(),
		routes: [
			{
				path: '/',
				name: 'home',
				component: async () => await import('@/views/Home.vue'),
			},
		],
	})
}
