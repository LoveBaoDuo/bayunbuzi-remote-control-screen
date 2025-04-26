<script setup lang="ts">
import MainContainer from '/@/layouts/components/MainContainer.vue'
const ChatRoomList = defineAsyncComponent(() => import('/@/view/Info/components/ChatRoomList.vue'))
const ChatRoom = defineAsyncComponent(() => import('/@/view/Info/components/ChatRoom.vue'))
import {useChatStore} from "/@/store/chat.store";
import {useUserStore} from "/@/store/user.store";
const useChat = useChatStore()
const useUser = useUserStore()
onActivated(() => {
  useChat.getChatRoomList(useUser.userInfo.userId)
})
</script>

<template>
  <div class="h-full">
    <MainContainer>
      <template #menu>
        <ChatRoomList />
      </template>
      <template #container>
        <ChatRoom v-if="useChat.currentChat"  room-id=""/>
      </template>
    </MainContainer>
  </div>
</template>

<style scoped></style>
