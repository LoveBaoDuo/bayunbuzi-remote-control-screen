<script setup lang="ts">
import Icon from '@renderer/components/Icon.vue'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'

const emitter = new IpcEmitter()
const props = defineProps({
  color: {
    type: String,
    default: '#fff'
  },
  fullScreen: {
    type: Boolean,
    default: true
  },
  closeOption: {
    type: String,
    default: '',
  }
})
const isFullScreen = ref(false)
const handleCloseApp = () => {
  emitter.send('close', props.closeOption)
}
const handleToggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  emitter.send('ToggleFullScreen', isFullScreen.value)
}
const handleMinimize = () => {
  emitter.send('minimize')
}
</script>

<template>
  <div class="h-full flex justify-end align-middle pr-1 pt-1 box-border">
    <Icon class="mr-2" name="minus" :size="20" :color="color" @click="handleMinimize" />
    <template v-if="fullScreen">
      <Icon
        v-if="!isFullScreen"
        class="mr-2"
        name="square"
        :size="20"
        :color="color"
        @click="handleToggleFullScreen"
      />
      <Icon
        v-else
        class="mr-2"
        name="copy"
        :size="20"
        :color="color"
        @click="handleToggleFullScreen"
      />
    </template>
    <Icon class="cursor-pointer" name="close" :size="20" :color="color" @click="handleCloseApp" />
  </div>
</template>

<style scoped></style>
