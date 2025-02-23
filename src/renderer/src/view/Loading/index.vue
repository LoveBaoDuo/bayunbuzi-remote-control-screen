<script setup lang="ts">
import { IpcEmitter, IpcListener } from '@electron-toolkit/typed-ipc/renderer'
import { otherWindowsConfig } from '../../config/windows.config'
import { navigationToWin } from '../../utils'
import { useUserStore } from '../../store/user.store'
// // 创建 IpcSender 实例
const ipcRenderer = new IpcListener()
//
const emitter = new IpcEmitter()
const userUser = useUserStore()
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
    url: 'http://localhost:5173/login',
    win: otherWindowsConfig
  })
  await emitter.invoke('open-custom-window', config)
  emitter.send('close')
}
init()
// 检查更新
ipcRenderer.on('update_available', () => {
  // 提示用户有更新可用
  alert('A new update is available. Downloading now...')
})
ipcRenderer.on('update_downloaded', () => {
  // ipcRenderer.removeAllListeners('update_downloaded')
  // 提示用户重启应用以应用更新
  const isConfirmed = confirm('Update downloaded. Restart now to apply the update?')
  console.log(222)
  if (isConfirmed) {
    console.log(222)
    emitter.send('restart_app')
  }
})
</script>

<template>
  <div class="h-full w-full text-9xl text-black flex items-center justify-center">
    <p class="h-40 leading-40">加载中.....</p>
  </div>
</template>

<style scoped></style>
