<script setup lang="ts">
import MenuItem from '../MenuItem/index.vue'
import Logo from '@renderer/layouts/components/Logo/index.vue'
import gsap from 'gsap'
import Avatar from  '@renderer/layouts/components/Avatar/index.vue'
import { ref } from 'vue'
import {useRouterStore} from "../../../store/router";
import {storeToRefs} from "pinia";
import {MenuType} from "../../type/MenuType";
const isOpen = ref(false)
const routerStore =  useRouterStore()
routerStore.setMenuList()
const  { menuList, currentMenu } = storeToRefs(routerStore)

const handleClickLogo = () => {
  isOpen.value = !isOpen.value
  let width = 80
  if (isOpen.value) {
    width = 200
  }
  gsap.to('#bybz-menu', {
    duration: 0.1,
    width: width, // 添加 expanded 类并移除 collapsed 类
    ease: 'power1.in',
    delay: 0
  })
}
const handleClickMenu  = (menu: MenuType) => {
  currentMenu.value = menu
}
</script>

<template>
  <div id="bybz-menu" class="w-20 min-w-20 flex flex-col justify-center w-full text-center h-full">
    <Logo @click="handleClickLogo" style="-webkit-app-region: no-drag" :is-title="isOpen" />
    <ul class="flex-1 relative">
      <MenuItem v-for="item in menuList" :key="item.path" :config="item" :open="isOpen" :active="currentMenu.path === item.path" @click="handleClickMenu(item)" />
    </ul>
    <ul class="h-30">
      <li class="flex items-center ">
        <Avatar src="https://bayunbuzi-1307803943.cos.ap-shanghai.myqcloud.com/unnamed.jpg" />
        <transition name="fade">
        <span v-show="isOpen" class="flex-1 font-semibold text-sm truncate">未知晓天空之蓝</span>
        </transition>
      </li>
      <MenuItem :config="{title: '退出', icon: 'out', path: ''}"  :open="isOpen"  />
    </ul>

  </div>
</template>

<style scoped></style>
