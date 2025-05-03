<script setup lang="ts">
import ChatMessages from '/@/view/Info/components/ChatMessages.vue'
import MessageSendingBox from '/@/view/Info/components/MessageSendingBox.vue'
import { useSocket } from '/@/hooks/socket'
import { SuccessType } from '/@/layouts/type/MessageType'
import { useChatStore } from '/@/store/chat.store'
import { storeToRefs } from 'pinia'
import { useMessageStore } from '/@/store/message'

const scrollbarInstance = ref()
const loaderStatus = ref(false)
const useMessage = useMessageStore()
const { list, nextCursor, loading } = storeToRefs(useMessage)
const { currentChat, currentFriend } = storeToRefs(useChatStore())
const { connect, sendMessage, disconnect } = useSocket({
  roomId: currentChat.value?.id as string,
  onMessage: (payload: SuccessType) => {
    useMessage.addMessage(payload, currentFriend.value as any)
    scrollToBottom()
  }
})
const handleSendMessage = (message: any) => {
  sendMessage({
    roomId: currentChat.value?.id as string,
    content: message
  })
}
const handleLoadingData = async () => {
  try {
    loaderStatus.value = true
    await useMessage.queryMessagePage(currentChat.value?.id as string, currentFriend.value as any)
  } finally {
    loaderStatus.value = false
  }
}
const scrollToBottom = async () => {
  await nextTick()
  scrollbarInstance.value?.scrollTo(0, 9999999999)
  // setTimeout(() => {
  //
  // }, 200)
}
watch(
  () => list.value,
  () => {
    scrollToBottom()
  }
)
onMounted(() => {
  scrollToBottom()
})
onActivated(() => {
  connect()
  scrollToBottom()
})
onDeactivated(() => {
  disconnect()
  // useMessage.clear()
})
</script>

<template>
  <div class="h-full chat-room">
    <div class="h-[60px] px-2 py-4 border-b-2">
      <h4 class="font-black mt-1 pl-5">{{ currentFriend?.nickname || '聊天室' }}</h4>
    </div>
    <div class="flex flex-col no-drag" style="height: calc(100vh - 60px)">
      <div class="flex-1">
        <el-scrollbar
          v-loading="loading"
          ref="scrollbarInstance"
          style="height: calc(100vh - 204px)"
        >
          <IntersectionLoader
            v-if="list.length > 0"
            :loading="loaderStatus"
            :noMore="nextCursor === null"
            @loading="handleLoadingData"
          />
          <ChatMessages
            v-for="(message, index) in list"
            :key="index"
            :type="message.isFriendMsg ? 'right' : 'left'"
            :data="message"
          />
        </el-scrollbar>
      </div>
      <MessageSendingBox @send="handleSendMessage" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-room {
  :deep(.el-textarea) {
    box-shadow: none !important;

    textarea {
      background-color: #f3f3f3;
      box-shadow: none !important;
    }
  }
}
</style>
