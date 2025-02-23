/**
 * createRouter 创建路由实例的方法
 * createWebHashHistory 路由模式为hash createWebHistory 是路由的 history 模式
 */
import { createRouter,createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 声明路由配置
export const currentRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@renderer/layouts/index.vue'),
    redirect: '/loading',
    children: [
      {
        path: 'home',
        component: () => import('@renderer/view/Home/index.vue'),
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'home',
          hidden: false
        }
      },
      {
        path: 'setting',
        component: () => import('@renderer/view/Setting/index.vue'),
        name: 'Setting',
        meta: {
          title: '设置',
          icon: 'setting',
          hidden: false
        }
      },
    ]
  },
  {
    path: '/loading',
    component: () => import('@renderer/view/Loading/index.vue'),
    name: 'Loading'
  },
  {
    path: '/login',
    component: () => import('@renderer/view/Login/index.vue'),
    name: 'Login'
  },
]

// 导出 router
const route = createRouter({
  history: createWebHashHistory(),
  routes: currentRoutes
})
export default route
