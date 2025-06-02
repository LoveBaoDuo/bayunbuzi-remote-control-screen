<script setup lang="ts">
import { throttle } from 'lodash'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { localStorageKey } from '/@/config'

const props = defineProps({
  difference: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})
const emitter = new IpcEmitter()
const emits = defineEmits(['mouse', 'keydown'])
const handleMousemove = throttle(async (type: string, e: MouseEvent | WheelEvent) => {
  const winId = localStorage.getItem(localStorageKey.remoteWinId)
  const atio = await emitter.invoke('coordinate_atio', {
    winId,
    x: e.clientX - props.difference.offsetX,
    y: e.clientY - props.difference.offsetY,
    width: props.difference.width,
    height: props.difference.height,
    offsetX: props.difference.offsetX,
    offsetY: props.difference.offsetY
  })
  const mouseParams = { ...atio, type: type }
  if (type === 'mousedownWheel') {
    // @ts-ignore
    mouseParams.deltaY = e.deltaX || 0
    // @ts-ignore
    mouseParams.deltaY = e.deltaY || 0
  }
  emits('mouse', JSON.stringify(mouseParams))
}, 50)
const handleWheel = throttle(async (e: WheelEvent) => {
  const wheelParams = {
    type: 'wheel',
    deltaY: e.deltaY || 0,
    deltaX: e.deltaY || 0
  }
  emits('mouse', JSON.stringify(wheelParams))
}, 50)
const handleKeydown = throttle(async (e: KeyboardEvent) => {
  emits('keydown', JSON.stringify({ code: e.code, type: 'keydown' }))
})
</script>

<template>
  <div
    class="absolute z-[999999] w-full h-[calc(100%-0px)] no-drag"
    @mousemove="(e: MouseEvent) => handleMousemove('mousemove', e)"
    @mousedown.left="(e: MouseEvent) => handleMousemove('mousedownLeft', e)"
    @mousedown.right="(e: MouseEvent) => handleMousemove('mousedownRight', e)"
    @wheel.stop.prevent="handleWheel"
    @keydown="handleKeydown"
    tabindex="0"
    :style="{
      width: `${difference.width}px`,
      height: `${difference.height}px`,
      marginLeft: `${difference.offsetX}px`,
      marginTop: `${difference.offsetY}px`,
      outline: 'none'
    }"
  ></div>
</template>

<style scoped></style>
