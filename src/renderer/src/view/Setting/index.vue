<script setup lang="ts">
const openWind =async () => {
  const config = JSON.stringify({
    width: 800,
    height: 600,
    title: '设置',
    show: false,
    frame: false, // 设置无边框
    transparent: true, // 设置窗口透明
    backgroundColor: '#00000000',
    url: 'http://localhost:5173/setting'
  })
  // @ts-ignore
  window.api.createWindow(config)
}
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
