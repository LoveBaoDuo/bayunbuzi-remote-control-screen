// 在 main.js 或 main.ts 中
import 'element-plus/dist/index.css'
import './style/drag.css'
import './style/main.css'
import './style/index.css'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import App from './App.vue'
import route from '@renderer/router/index'
import deactivateds from '@renderer/directive'
import { createPinia } from 'pinia'
import '../../../resources/font/iconfont.css?asset'
import setupDirectives from './directives'
import { setupApp } from '/@/components'

createApp(App)
  .use(deactivateds)
  .use(setupDirectives)
  .use(route)
  .use(createPinia())
  .use(setupApp)
  .mount('#app')
