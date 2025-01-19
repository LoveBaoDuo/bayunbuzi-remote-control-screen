<script setup lang="ts">
import Nav from '@renderer/layouts/components/Nav/index.vue'
import Password from './components/Password.vue'
import HandleInter from './components/HandleInter.vue'
import Register from './components/Register.vue'
import mittBus from '/@/utils/mitt'
import gsap from 'gsap'

import { onMounted, onUnmounted } from 'vue'

const handleOnLoginAndRegisterSwitch = (val: string) => {
  if (val === 'login') {
    gsap.to('.handle-inter', { left: '0.5rem', duration: 0.5, overwrite: 'auto' })
  } else {
    gsap.to('.handle-inter', { left: 'calc(50% - 0.5rem)', duration: 0.5, overwrite: 'auto' })
  }
}
onMounted(() => {
  mittBus.on('onLoginAndRegisterSwitch', handleOnLoginAndRegisterSwitch)
})
onUnmounted(() => {
  mittBus.off('onLoginAndRegisterSwitch', handleOnLoginAndRegisterSwitch)
})
</script>

<template>
  <div class="relative h-full p-2 shadow-xl">
    <div class="absolute right-0 top-0 z-10">
      <Nav color="#232946FF" :full-screen="false" />
    </div>
    <HandleInter class="absolute handle-inter" />
    <div class="h-full flex justify-around">
      <Register />
      <Password />
    </div>
  </div>
</template>

<style scoped></style>
