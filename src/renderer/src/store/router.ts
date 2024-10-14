import { defineStore } from 'pinia'
import { currentRoutes } from '../router'
import { RouteRecordRaw } from 'vue-router'
import { MenuType } from '../../type/MenuType'

interface RouterState {
  menuList: MenuType[]
  currentMenu: MenuType
}

export const useRouterStore = defineStore('RouterStore', {
  state: (): RouterState => ({
    menuList: [],
    currentMenu: {}
  }),
  actions: {
    setMenuList() {
      this.menuList = currentRoutes[0].children?.map((item: RouteRecordRaw) => ({
        title: item.meta?.title,
        icon: item.meta?.icon,
        path: item.path
      })) as MenuType[]
      this.currentMenu = this.menuList[0]
    }
  }
})
