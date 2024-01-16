import createVueInstance from './main'

const { app, store, router } = createVueInstance()

router.isReady().then(() => {
  app.mount('#app')
})