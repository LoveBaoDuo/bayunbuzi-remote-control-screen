<script setup lang="ts">
import { IpcListener } from '@electron-toolkit/typed-ipc/renderer'
import { useRemoteStore } from '/@/view/Home/store'

const useRemote = useRemoteStore()
const ipc = new IpcListener()
const loadingOpiton = ref<{ loading: boolean; loadingText: string }>({
  loading: false,
  loadingText: '正在更新...'
})
ipc.on('download-progress', (_, data) => {
  loadingOpiton.value.loadingText = '正在下载中' + data.toFixed(0) + '%...'
  loadingOpiton.value.loading = true
})
useRemote.getRemoteInfo()
</script>

<template>
  <div
    v-loading="loadingOpiton.loading"
    :element-loading-text="loadingOpiton.loadingText"
    class="w-full h-full rounded-md shadow-2xl bg-white overflow-hidden"
  >
    <router-view />
  </div>
</template>
