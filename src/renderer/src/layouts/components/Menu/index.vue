<script setup lang="ts">
import MenuItem from '../MenuItem/index.vue'
import Logo from '@renderer/layouts/components/Logo/index.vue'
import gsap from 'gsap'
import Avatar from '/@/components/Avatar/index.vue'
import { useRouterStore } from '../../../store/router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../../store/user.store'
import { toLogin } from '/@/utils'

const isOpen = ref(false)
const route = useRoute()
const routerStore = useRouterStore()
const userStore = useUserStore()
userStore.initUserInfo()
routerStore.setMenuList()
const { menuList, currentMenu } = storeToRefs(routerStore)
const { userInfo } = storeToRefs(userStore)
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
const handleLogout = async () => {
  await userStore.logout()
  toLogin()
}
watchEffect(() => {
  currentMenu.value = {
    title: route.meta?.title,
    icon: route.meta?.icon,
    path: route.path,
    name: route.name
  }
})
</script>

<template>
  <div id="bybz-menu" class="w-20 min-w-20 flex flex-col justify-center w-full text-center h-full">
    <Logo @click="handleClickLogo" :is-title="isOpen" />
    <ul class="flex-1 relative">
      <MenuItem
        v-for="item in menuList"
        :key="item.path"
        :config="item"
        :open="isOpen"
        :active="currentMenu.name === item.name"
      />
    </ul>
    <ul class="h-30">
      <li class="flex items-center">
        <Avatar :src="userInfo.avatar" :nickname="userInfo.name || userInfo.username" />
        <transition name="fade">
          <span v-show="isOpen" class="flex-1 font-semibold text-sm truncate">{{
            userInfo.nickname
          }}</span>
        </transition>
      </li>
      <MenuItem
        :config="{ title: '退出', icon: 'Import', path: '' }"
        :open="isOpen"
        @click="handleLogout"
      />
    </ul>
  </div>
</template>

<style scoped></style>
