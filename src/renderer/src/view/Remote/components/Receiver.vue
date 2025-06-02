<script setup lang="ts">
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { useMediaSocketCallback } from '/@/hooks/socket'
import WebRtCConnectionRemote from '/@/utils/WebRtCConnectionRemote'
import { localStorageKey } from '/@/config'

const emitter = new IpcEmitter()
// 当前链接信息
const currentLinkInfo = computed<any>(() => {
  const cellResultInfoStr = localStorage.getItem(localStorageKey.mediaSenderInfo)
  return !cellResultInfoStr ? {} : JSON.parse(cellResultInfoStr)
})
const formattedString = computed(() => {
  return (
    currentLinkInfo.value.linkInfo.connectionCode?.replace(/(\d{3})(?=\d)/g, '$1  ') || '000 000'
  )
})
let disconnectFun: any
let rtc: WebRtCConnectionRemote
// 处理链接状态
const handleConnectionStateChange = () => {}
const handleGetMediaError = () => {}
const linkSignalingServer = () => {
  const joinData: any = {
    roomKey: currentLinkInfo.value.linkInfo.linkRoom,
    type: 'receiver',
    linkType: 'remote',
    userId: currentLinkInfo.value.receiverId
  }

  // 进行websocket链接
  const { disconnect, connect } = useMediaSocketCallback({
    joinData: joinData,
    handleSignalingMessage: async (payload: any) => {
      try {
        if (['receiver'].includes(payload.type)) {
          await rtc.init(false)
          const joinData: any = {
            type: 'link',
            linkType: 'remote',
          }
          rtc.sendSignalingMessage(joinData)
          return
        }
        // 使用webrtc实例处理通信消息
        rtc.handleSignalingMessage(payload)
        if (payload.type === 'close') {
          setTimeout(() => {
            emitter.send('close', '')
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
// 处理数据通道的数据
const handleDataChannelMessage = (data: any) => {
  emitter.send('set_window_event', data)
}
const remoteInit = async () => {
  // 实例化webRtc对象
  rtc = new WebRtCConnectionRemote({
    roomKey: currentLinkInfo.value.linkInfo.linkRoom,
    onConnectionStateChange: handleConnectionStateChange,
    onGetMediaError: handleGetMediaError,
    onDataChannelMessage: handleDataChannelMessage
  })
  rtc.isLocalStream = true
  // 发送者加入信令服务器房间
  linkSignalingServer()
}
const handleDisconnect = () => {
  rtc.sendSignalingMessage({
    type: 'close',
    userId: currentLinkInfo.value.sendUserId,
    message: '关闭'
  })
  rtc.close()
  emitter.send('close', '')
}
onMounted(() => {
  remoteInit()
})
onUnmounted(() => {
  disconnectFun && disconnectFun()
  rtc && rtc.close()
})
</script>

<template>
  <div class="h-full">
    <div class="flex justify-between items-center h-full">
      <Avatar
        :src="currentLinkInfo.senderInfo.avatar || ''"
        :nickname="currentLinkInfo.senderInfo.nickname || currentLinkInfo.senderInfo.username"
      />
      <div class="text-black h-12">
        <h2 class="text-xl font-semibold leading-none mb-2">
          {{ currentLinkInfo.linkInfo.devices }}
        </h2>
        <p class="text-xs text-gray-400">设备代码：{{ formattedString }}</p>
      </div>
      <div class="mr-4">
        <el-button type="danger" size="small" @click="handleDisconnect">断开</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
