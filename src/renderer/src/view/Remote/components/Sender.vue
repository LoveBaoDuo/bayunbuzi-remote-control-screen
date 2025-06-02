<script setup lang="ts">
import Nav from '/@/layouts/components/Nav/index.vue'
import { useMediaSocketCallback } from '/@/hooks/socket'
import MouseOperation from '/@/view/Remote/components/MouseOperation.vue'
import WebRtCConnectionRemote from '/@/utils/WebRtCConnectionRemote'
import { localStorageKey } from '/@/config'
import { ElMessage } from 'element-plus'
// 当前链接信息
const currentLinkInfo = computed<any>(() => {
  const cellResultInfoStr = localStorage.getItem(localStorageKey.mediaSenderInfo)
  return !cellResultInfoStr ? {} : JSON.parse(cellResultInfoStr)
})
const rtcConnectionState = ref('')
const navInstance = ref()
let disconnectFun: any
const videoInstance = ref()
// 视频和渲染的差值
const difference = ref({
  offsetX: 0, // 黑边偏移X
  offsetY: 0, // 黑边偏移Y
  height: 0,
  width: 0
})
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
const handleConnectionStateChange = (status: string) => {
  console.log(status, '链接状态')
  rtcConnectionState.value = status
}
const handleGetMediaError = () => {}
const linkSignalingServer = () => {
  const joinData: any = {
    roomKey: currentLinkInfo.value.linkInfo.linkRoom,
    type: 'sender',
    linkType: 'remote',
    userId: currentLinkInfo.value.sendUserId
  }
  const message = ElMessage({ message: '连接中...', duration: 0, type: 'info' })
  const setLinkTime = (time: number) => {
    return setTimeout(() => {
      message.close()
      ElMessage({ message: '连接失败', duration: 0, type: 'error' })
    }, time)
  }
  const currentTime = setLinkTime(10000)
  // 进行websocket链接
  const { disconnect, connect } = useMediaSocketCallback({
    joinData: joinData,
    handleSignalingMessage: async (payload: any) => {
      try {
        // 被控端进入websocket房间
        if (payload.type === 'link') {
          await rtc.init(true)
          await rtc.createOffer()
          message.close()
          if (currentTime) {
            clearTimeout(currentTime)
          }
          return
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
  if (rtcConnectionState.value === 'connected') {
    rtc.send(val)
  }
}
const handleLoadedmetadata = () => {
  const container = videoInstance.value?.parentElement
  // 视频高和渲染高的比值
  const videoRatio = videoInstance.value?.videoWidth / videoInstance.value?.videoHeight
  const containerRatio = container.offsetWidth / container.offsetHeight
  let actualWidth, actualHeight
  if (containerRatio > videoRatio) {
    // 左右黑边情况
    actualHeight = container.offsetHeight
    actualWidth = actualHeight * videoRatio
  } else {
    // 上下黑边情况
    actualWidth = container.offsetWidth
    actualHeight = actualWidth / videoRatio
  }

  difference.value = {
    offsetX: (container.offsetWidth - actualWidth) / 2, // 黑边偏移X
    offsetY: (container.offsetHeight - actualHeight) / 2, // 黑边偏移Y
    width: actualWidth,
    height: actualHeight
  }
}
window.onresize = () => {
  handleLoadedmetadata()
}
onMounted(() => {
  remoteInit()
  videoInstance.value?.addEventListener('loadedmetadata', handleLoadedmetadata)
})
onUnmounted(() => {
  disconnectFun && disconnectFun()
  rtc && rtc.close()
  videoInstance.value?.removeEventListener('loadedmetadata', handleLoadedmetadata)
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
    <MouseOperation :difference="difference" @mouse="handleMouse" @keydown="handleMouse" />
    <video
      v-loading="rtcConnectionState === 'connected'"
      ref="videoInstance"
      class="w-full h-full bg-black"
      style="aspect-ratio: 16/9"
    />
  </div>
</template>

<style scoped></style>
