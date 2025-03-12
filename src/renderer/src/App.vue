<script setup lang="ts">
import { IpcListener } from '@electron-toolkit/typed-ipc/renderer'

const ipc = new IpcListener()
const loadingOpiton = ref<[boolean, {text: string}]>([false, {text: '正在下载...'}])
ipc.on('download-progress', (_, data) => {
  loadingOpiton.value[0] = true
  loadingOpiton.value[1].text = '正在下载中' + data.toFixed(0) + '%...'
})
</script>

<template>
  <div v-loading="loadingOpiton" class="w-full h-full rounded-md shadow-2xl bg-white overflow-hidden">
    <router-view />
  </div>
</template>

