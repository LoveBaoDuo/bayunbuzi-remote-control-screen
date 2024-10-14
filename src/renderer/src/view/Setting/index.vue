<script setup lang="ts">
const openWind = () => {
  window.api.createWindow({
    width: 800,
    height: 600,
    url: 'http://localhost:5173/setting'
  })
}
console.log(openWind)
</script>

<template>
  <div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
  </div>

</template>

<style scoped></style>
