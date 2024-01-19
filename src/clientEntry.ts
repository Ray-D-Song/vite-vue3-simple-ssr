import createVueInstance from './main'

const { app, store, router } = createVueInstance()

if (window.__PINIA__ && (!import.meta.env.DEV))
	store.state.value = JSON.parse(window.__PINIA__)

router.isReady().then(() => {
	app.mount('#app')
})
