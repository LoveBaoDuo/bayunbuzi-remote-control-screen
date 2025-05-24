<script setup lang="ts">
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'

const emitter = new IpcEmitter()
const handleDisconnect = () => {
  emitter.send('close', '')
}
</script>

<template>
<div class="h-full">
  <div class="flex justify-between items-center h-full">
    <Avatar src="" nickname="xxxx" />
    <div class="text-black">
      <h2 class="text-xl font-semibold">控制中...</h2>
      <p class="text-xs text-gray-400">设备代码：xxx xxx xxx</p>
    </div>
    <div class="mr-4">
      <el-button type="danger" size="small" @click="handleDisconnect">断开</el-button>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
