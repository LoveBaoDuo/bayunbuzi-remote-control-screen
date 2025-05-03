<script setup lang="ts">
import Nav from '/@/layouts/components/Nav/index.vue'
import Avatar from '/@/components/Avatar/index.vue'
import Icon from '/@/components/Icon.vue'
import { useUserStore } from '/@/store/user.store'
import WebRTCConnection from '/@/utils/WebRTCConnection'
import { useMediaSocketCallback } from '/@/hooks/socket'

const route = useRoute()
const type = computed(() => {
  return route.query.type
})
const useUser = useUserStore()
useUser.initUserInfo()
const videoInstanll = ref()
const currentUserInfo = computed<any>(() => {
  const cellResultInfoStr = localStorage.getItem('MEDIA_SENDER_INFO')
  const cellResultInfo = !cellResultInfoStr ? {} : JSON.parse(cellResultInfoStr)
  const receiverInfoStr = localStorage.getItem('MEDIA_RECEIVER_INFO')
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
  videoInstanll.value.srcObject = stram
}
const linkSignalingServer = () => {
  const joinData: any = {
    roomKey: currentUserInfo.value.roomKey
  }
  // 判断当前是接收者还是发送者
  if (type.value === 'receiver') {
    joinData.type = 'receiver'
  }
  const { disconnect, connect } = useMediaSocketCallback({
    joinData: joinData,
    handleSignalingMessage: async (payload: any) => {
      // 接收者加入进行webRtc通信流程
      if (payload.type === 'receiver') {
        const isSender = type.value === 'sender'
        await rtc.init(isSender)
        if (isSender) {
          await rtc.createOffer()
        }
      } else if (payload.type) {
        // 使用webrtc实例处理通信消息
        rtc.handleSignalingMessage(payload)
      }
    }
  })
  connect()
  disconnectFun = disconnect
}
const mediaInit = async () => {
  // 实例化webRtc对象
  rtc = new WebRTCConnection({
    onRemoteStream: handleRemoteStram
  })
  if (type.value === 'sender') {
    // 发送者加入信令服务器房间
    linkSignalingServer()
  }
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
  <div class="relative h-full shadow-xl text-gray-800">
    <div class="absolute right-0 top-0 z-[9999999]">
      <Nav color="#232946FF" :full-screen="false" />
    </div>
    <div
      class="flex flex-col items-center absolute left-[50%] top-[30%] z-[9999999]"
      style="transform: translateX(-50%) translateY(-50%)"
    >
      <Avatar
        class="!ml-0"
        :nickname="currentUserInfo.info?.nickname || currentUserInfo.info?.username"
        :src="currentUserInfo.info?.avatar"
      />
      <p v-if="type === 'sender'" class="text-center">等待对方接受邀请...</p>
      <p v-else class="text-center">邀请你视频通话...</p>
    </div>
    <div
      class="absolute left-[50%] bottom-[10%] z-[9999999]"
      style="transform: translateX(-50%) translateY(-50%)"
    >
      <div v-if="type === 'sender'" class="flex flex-col items-center">
        <div
          class="w-12 flex items-center justify-center bg-red-600 rounded-full h-12 items-center space-x-3"
        >
          <Icon class="text-white" :size="20" name="phone-missed" />
        </div>
        挂断
      </div>
      <div v-else class="flex flex-col items-center" @click="">
        <div
          class="w-12 flex items-center justify-center bg-green-600 rounded-full h-12 items-center space-x-3"
        >
          <Icon class="text-white" :size="20" name="phone-call" />
        </div>
        接听
      </div>
    </div>
    <video ref="videoInstanll" class="w-full h-full" />
    <!--    <audio />-->
  </div>
</template>

<style scoped></style>
