<script setup lang="ts">
import Icon from '@renderer/components/Icon.vue'
import { ref } from 'vue'
const { api } = window
const isFullScreen = ref(false)
const handleCloseApp = () => {
  api.close()
}
const handleToggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  api.toggleFullScreen(isFullScreen.value)
}
const handleMinimize = () => {
  api.minimize()
}
</script>

<template>
  <div class="h-full flex justify-end align-middle pr-1 pt-1 box-border">
    <Icon class="mr-2" name="minus" :size="20" color="#fff" @click="handleMinimize" />
    <Icon v-if="!isFullScreen" class="mr-2" name="square" :size="20" color="#fff" @click="handleToggleFullScreen" />
    <Icon v-else class="mr-2" name="copy" :size="20" color="#fff" @click="handleToggleFullScreen" />
    <Icon class="cursor-pointer" name="close" :size="20" color="#fff" @click="handleCloseApp" />
  </div>
</template>

<style scoped></style>
