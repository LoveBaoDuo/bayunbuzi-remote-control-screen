<script setup lang="ts">
import Nav from '/@/layouts/components/Nav/index.vue'
import Avatar from '/@/components/Avatar/index.vue'
import Icon from '/@/components/Icon.vue'
import { useUserStore } from '/@/store/user.store'
import WebRTCConnection, { ConnectionState } from '/@/utils/WebRTCConnection'
import { useMediaSocketCallback } from '/@/hooks/socket'
import { localStorageKey } from '/@/config'

const route = useRoute()
const type = computed(() => {
  return route.query.type
})
const receiveStatus = ref(false)
const connectionState = ref<ConnectionState>('new')
const useUser = useUserStore()
useUser.initUserInfo()
const equipmentError = ref('')
const videoInstance = ref()
const localVideoInstance = ref()
const navInstance = ref()
// 当前链接用户信息
const currentUserInfo = computed<any>(() => {
  const cellResultInfoStr = localStorage.getItem(localStorageKey.mediaSenderInfo)
  const cellResultInfo = !cellResultInfoStr ? {} : JSON.parse(cellResultInfoStr)
  const receiverInfoStr = localStorage.getItem(localStorageKey.mediaReceiverInfo)
  const receiverInfo = !receiverInfoStr ? {} : JSON.parse(receiverInfoStr)
  if (type.value === 'sender') {
    return {
      info: receiverInfo,
      roomKey: cellResultInfo.roomKey
    }
  } else {
    return {
      info: cellResultInfo.senderInfo,
      roomKey: cellResultInfo.roomKey
    }
  }
})
let disconnectFun: any
let rtc: WebRTCConnection
// 设置远程流
const handleRemoteStram = (stram: MediaStream) => {
  if (!stram) return
  videoInstance.value.srcObject = stram
  videoInstance.value.play().catch((error) => {
    console.error('播放失败:', error)
  })
}
// 设置本地流
const handleLocalStream = (stram: MediaStream) => {
  if (!stram) return
  localVideoInstance.value.srcObject = stram
  localVideoInstance.value.play().catch((error) => {
    console.error('播放失败:', error)
  })
}
// 处理链接状态
const handleConnectionStateChange = (status: ConnectionState) => {
  connectionState.value = status
}
const linkSignalingServer = () => {
  const joinData: any = {
    roomKey: currentUserInfo.value.roomKey,
    type: type.value,
    linkType: 'media',
    userId: currentUserInfo.value.userId
  }
  // 进行websocket链接
  const { disconnect, connect } = useMediaSocketCallback({
    joinData: joinData,
    handleSignalingMessage: async (payload: any) => {
      try {
        receiveStatus.value = true
        // 接收者加入进行webRtc通信房间
        if (payload.type === 'receiver') {
          const isSender = type.value === 'sender'
          await rtc.init(isSender)
          if (isSender) {
            await rtc.createOffer()
          }
        } else if (payload.type) {
          // 使用webrtc实例处理通信消息
          rtc.handleSignalingMessage(payload)
          if (payload.type === 'close') {
            setTimeout(() => {
              navInstance.value?.close()
            }, 100)
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  })
  connect()
  disconnectFun = disconnect
}
const handleReceiveCommunication = () => {
  linkSignalingServer()
}
const handleGetMediaError = (error: any) => {
  equipmentError.value = error
}
const mediaInit = async () => {
  // 实例化webRtc对象
  rtc = new WebRTCConnection({
    roomKey: currentUserInfo.value.roomKey,
    onRemoteStream: handleRemoteStram,
    onLocalStream: handleLocalStream,
    onConnectionStateChange: handleConnectionStateChange,
    onGetMediaError: handleGetMediaError
  })
  if (type.value === 'sender') {
    receiveStatus.value = true
    // 发送者加入信令服务器房间
    linkSignalingServer()
  }
}
const handleClosed = () => {
  rtc.sendSignalingMessage({
    type: 'close',
    userId: currentUserInfo.value.userId,
    message: '关闭视频通话'
  })
  rtc.close()
  navInstance.value?.close()
}
onMounted(() => {
  mediaInit()
})
onActivated(() => {})
onUnmounted(() => {
  disconnectFun && disconnectFun()
  rtc && rtc.close()
})
</script>

<template>
  <div class="relative h-full shadow-xl">
    <div class="absolute right-0 top-0 z-[9999999]">
      <Nav ref="navInstance" color="#fff" :full-screen="false" @close="handleClosed" />
    </div>
    <div
      :class="[
        'flex flex-col justify-between  w-[60%] h-[60%] absolute left-[50%] top-[50%] z-[9999999] no-drag hover:opacity-100 transition-opacity duration-300',
        connectionState === 'connected' ? 'opacity-0' : ''
      ]"
      style="transform: translateX(-50%) translateY(-50%)"
    >
      <div>
        <div v-if="connectionState !== 'connected'" class="flex flex-col items-center">
          <Avatar
            class="!ml-0 mb-2"
            :nickname="currentUserInfo.info?.nickname || currentUserInfo.info?.username"
            :src="currentUserInfo.info?.avatar"
          />
          <p v-if="type === 'sender'" class="text-center">等待对方接受邀请...</p>
          <p v-else class="text-center">邀请你视频通话...</p>
        </div>
      </div>
      <div>
        <p class="text-center mb-2" v-if="equipmentError">{{ equipmentError }}</p>
        <div class="flex justify-center gap-5">
          <div class="flex flex-col items-center no-drag cursor-pointer">
            <div
              class="w-12 flex items-center justify-center bg-[#363534] rounded-full h-12 items-center space-x-3"
            >
              <Icon class="text-white" :size="20" name="mic" />
            </div>
          </div>
          <div
            v-if="receiveStatus"
            class="flex flex-col items-center no-drag cursor-pointer"
            @click="handleClosed"
          >
            <div
              class="w-12 flex items-center justify-center bg-red-600 rounded-full h-12 items-center space-x-3"
            >
              <Icon class="text-white" :size="20" name="phone-missed" />
            </div>
            挂断
          </div>
          <div
            v-else
            class="flex flex-col items-center no-drag cursor-pointer"
            @click="handleReceiveCommunication"
          >
            <div
              class="w-12 flex items-center justify-center bg-green-600 rounded-full h-12 items-center space-x-3"
            >
              <Icon class="text-white" :size="20" name="phone-call" />
            </div>
            接听
          </div>
          <div class="flex flex-col items-center no-drag cursor-pointer">
            <div
              class="w-12 flex items-center justify-center bg-[#363534] rounded-full h-12 items-center space-x-3"
            >
              <Icon class="text-white" :size="20" name="video" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <video ref="videoInstance" class="w-full h-full bg-black" style="object-fit: cover" />
    <video
      muted
      ref="localVideoInstance"
      class="absolute w-[20%] h-[20%] top-6 right-4 shadow-lg shadow-white/10 bg-black rounded-md border-2 border-green-600 z-[9999999]"
    />
    <!--    <audio />-->
  </div>
</template>

<style scoped></style>
