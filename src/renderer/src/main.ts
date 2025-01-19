import './assets/main.css'
import './style/index.css'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import App from './App.vue'
import route from '@renderer/router/index'
import deactivateds from '@renderer/directive'
import { createPinia } from 'pinia'

createApp(App).use(deactivateds).use(route).use(createPinia()).mount('#app')
