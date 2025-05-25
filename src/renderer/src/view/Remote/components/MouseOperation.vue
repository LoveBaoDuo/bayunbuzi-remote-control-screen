<script setup lang="ts">
import { throttle } from 'lodash'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { localStorageKey } from '/@/config'

const emitter = new IpcEmitter()
const emits = defineEmits(['mouse'])
const handleMousemove = throttle(async (type: string) => {
  const winId = localStorage.getItem(localStorageKey.remoteWinId)
  const atio = await emitter.invoke('coordinate_atio', winId)
  emits('mouse', JSON.stringify({ ...atio, type: type }))
}, 50)

</script>

<template>
  <div
    class="absolute z-[999999] bottom-0 w-full h-[calc(100%-30px)] no-drag"
    @mousemove="handleMousemove('mousemove')"
    @mousedown.left="handleMousemove('mousedownLeft')"
    @mousedown.right="handleMousemove('mousedownRight')"
  ></div>
</template>

<style scoped></style>
