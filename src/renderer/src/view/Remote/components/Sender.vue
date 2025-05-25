<script setup lang="ts">
import Nav from '/@/layouts/components/Nav/index.vue'
import { useMediaSocketCallback } from '/@/hooks/socket'
import MouseOperation from '/@/view/Remote/components/MouseOperation.vue'
import WebRtCConnectionRemote from '/@/utils/WebRtCConnectionRemote'
import {localStorageKey} from "/@/config";
// 当前链接信息
const currentLinkInfo = computed<any>(() => {
  const cellResultInfoStr = localStorage.getItem(localStorageKey.mediaSenderInfo)
  return !cellResultInfoStr ? {} : JSON.parse(cellResultInfoStr)
})
const navInstance = ref()
let disconnectFun: any
const videoInstance = ref()
let rtc: WebRtCConnectionRemote
// 设置远程流
const handleRemoteStram = (stram: MediaStream) => {
  if (!stram) return
  videoInstance.value.srcObject = stram
  videoInstance.value.play().catch((error) => {
    console.error('播放失败:', error)
  })
}

// 处理链接状态
const handleConnectionStateChange = () => {}
const handleGetMediaError = () => {}
const linkSignalingServer = () => {
  const joinData: any = {
    roomKey: currentLinkInfo.value.linkInfo.linkRoom,
    type: 'sender',
    linkType: 'remote',
    userId: currentLinkInfo.value.sendUserId
  }

  // 进行websocket链接
  const { disconnect, connect } = useMediaSocketCallback({
    joinData: joinData,
    handleSignalingMessage: async (payload: any) => {
      try {
        // 被控端进入websocket房间
        if (payload.type === 'receiver') {
          await rtc.init(true)
          await rtc.createOffer()
        }
        // 使用webrtc实例处理通信消息
        rtc.handleSignalingMessage(payload)
        if (payload.type === 'close') {
          setTimeout(() => {
            navInstance.value?.close()
          }, 100)
        }
      } catch (e) {
        console.log(e)
      }
    }
  })
  connect()
  disconnectFun = disconnect
}
const remoteInit = async () => {
  // 实例化webRtc对象
  rtc = new WebRtCConnectionRemote({
    roomKey: currentLinkInfo.value.linkInfo.linkRoom,
    onRemoteStream: handleRemoteStram,
    onConnectionStateChange: handleConnectionStateChange,
    onGetMediaError: handleGetMediaError
  })
  rtc.isLocalStream = false
  // 发送者加入信令服务器房间
  linkSignalingServer()
}
const handleMouse = (val: any) => {
  rtc.send(val)
}
onMounted(() => {
  remoteInit()
})
onUnmounted(() => {
  disconnectFun && disconnectFun()
  rtc && rtc.close()
})
const handleClosed = () => {
  rtc.sendSignalingMessage({
    type: 'close',
    userId: currentLinkInfo.value.sendUserId,
    message: '关闭'
  })
  rtc.close()
  navInstance.value?.close()
}
</script>

<template>
  <div class="h-full">
    <div class="absolute right-0 top-0 z-[9999999]">
      <Nav ref="navInstance" color="#cdd0d6" @close="handleClosed" />
    </div>
    <MouseOperation @mouse="handleMouse" />
    <video ref="videoInstance" class="w-full h-full bg-black" />
  </div>
</template>

<style scoped></style>
