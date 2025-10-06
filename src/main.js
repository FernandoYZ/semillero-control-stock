import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { router } from './router'
import App from './App.vue'
import './style.css'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})
