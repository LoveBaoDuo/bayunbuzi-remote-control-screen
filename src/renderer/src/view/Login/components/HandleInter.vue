<script setup lang="ts">
import acgGy06 from "/@/assets/img/acg.gy_06.jpg"
import mittBus from '/@/utils/mitt'
import gsap from 'gsap'

import { onMounted, onUnmounted } from 'vue'

const handleOnLoginAndRegisterSwitch = (val: string) => {
  if (val === 'login') {
    gsap.to('.handle-inter__img', { x: '0%', duration: 0.5, overwrite: 'auto' })
  } else {
    gsap.to('.handle-inter__img', { x: '-50%', duration: 0.5, overwrite: 'auto' })
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
  <div class="w-1/2  overflow-hidden rounded-lg box-border" style="height: calc(100% - 1rem)">
   <div class="w-[200%] handle-inter__img">
     <img  :src="acgGy06" alt=""/>
   </div>
  </div>
</template>

<style scoped></style>
