<script setup lang="ts">
import { IpcEmitter, IpcListener } from '@electron-toolkit/typed-ipc/renderer'
import { otherWindowsConfig } from '../../config/windows.config'
import { navigationToWin } from '../../utils'
import { useUserStore } from '../../store/user.store'
import { onMounted } from 'vue'
// // 创建 IpcSender 实例
const ipcRenderer = new IpcListener()
//
const emitter = new IpcEmitter()
const userUser = useUserStore()
let isDownlad = false

const init = async () => {
  const access_token = await emitter.invoke('store_get', 'access_token')
  if (!access_token) {
    await toLogin()
    return
  }
  const flag = await userUser.getUserInfo()
  if (!flag) {
    await toLogin()
    return
  }
  await navigationToWin('/home')
}
const toLogin = async () => {
  const config = JSON.stringify({
    parent: false,
    url: '/login',
    win: otherWindowsConfig
  })
  await emitter.invoke('open-custom-window', config)
  emitter.send('close')
}
onMounted(() => {
  emitter.send('CheckForUpdates')
  if (isDownlad) return
  init()
})

// 检查更新
ipcRenderer.on('startDownload', () => {
  isDownlad = true
})
ipcRenderer.on('notDownload', () => {
  init()
})
</script>

<template>
  <div class="h-full w-full text-9xl text-black flex items-center justify-center">
    <p class="h-40 leading-40">加载中.....</p>
  </div>
</template>

<style scoped></style>
