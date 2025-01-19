<script setup lang="ts">
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'

const emitter = new IpcEmitter()
setTimeout(async () => {
  const config = JSON.stringify({
    parent: false,
    url: 'http://localhost:5173/login',
    win: {
      width: 1024,
      height: 480,
      resizable: false, // 禁止手动调整宽高
      show: false, // 是否在创建时立即显示
      frame: false, // 设置无边框
      transparent: true, // 设置窗口透明
      backgroundColor: '#00000000'
    }
  })
  await emitter.invoke('open-custom-window', config)
  emitter.send('close')
  //   await window.api.createWindow(config)
}, 1 * 1000)
</script>

<template>
  <div class="h-full w-full text-9xl text-black flex items-center justify-center">
    <p class="h-40 leading-40">加载中.....</p>
  </div>
</template>

<style scoped></style>
