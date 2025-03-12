<script setup lang="ts">
import { useSocket } from '../../hooks/socket'
import { PayloadType } from '../../layouts/type/MessageType'

const { sendMessage } = useSocket({
  roomId: 1,
  userId: 2,
  onMessage: (payload: PayloadType) => {
    console.log('收到消息', payload)
  }
})
const openWind = async () => {
  const config = JSON.stringify({
    width: 800,
    height: 600,
    title: '设置',
    show: false,
    frame: false, // 设置无边框
    transparent: true, // 设置窗口透明
    backgroundColor: '#00000000',
    url: '/setting'
  })
  // @ts-ignore
  window.api.createWindow(config)
}
const handleSendMessage = async () => {
  sendMessage({
    message: { text: '测试', type: '0' },
    roomId: '1',
    userId: '2',
    sendUserId: '3',
  })
}
</script>

<template>
  <div>
    <div class="text-white w-full h-full cursor-pointer" @click="handleSendMessage">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
    <div class="text-white w-full h-full cursor-pointer" @click="openWind">222</div>
  </div>
</template>

<style scoped></style>
