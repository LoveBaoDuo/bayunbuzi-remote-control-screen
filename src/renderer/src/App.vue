<script setup lang="ts">
import { IpcListener } from '@electron-toolkit/typed-ipc/renderer'

const ipc = new IpcListener()
ipc.on('download-progress', (_, data) => {
  console.log(data)
})
</script>

<template>
  <div class="w-full h-full rounded-md shadow-2xl bg-white overflow-hidden">
    <router-view />
    <!--    <Layouts />-->
  </div>
</template>

