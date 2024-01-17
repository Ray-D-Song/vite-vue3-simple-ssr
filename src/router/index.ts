import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

export default function () {
  return createRouter({
    history: import.meta.env.SSR === false ? createWebHistory(import.meta.env.BASE_URL) : createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About')
      }
    ]
  })
}
