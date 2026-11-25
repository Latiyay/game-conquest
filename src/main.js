import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Router/Index.js'
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')
