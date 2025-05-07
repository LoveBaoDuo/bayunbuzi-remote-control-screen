<script setup lang="ts">
import Avatar from '/@/components/Avatar/index.vue'
import Search from '/@/components/Search/index.vue'
import { reactive } from '@vue/runtime-core'
import { useChatStore } from '/@/store/chat.store'
import { storeToRefs } from 'pinia'
import { useMessageStore } from '/@/store/message'

const route = useRoute()
const useChat = useChatStore()
const useMessage = useMessageStore()
const { chatList, userId, currentFriend, chatLoading } = storeToRefs(useChat)
const searchOption = reactive({
  icon: 'serach',
  placeholder: '搜索',
  isAddFriend: false,
  searchStr: ''
})
const currentActionMenu = ref('')
const getChatName = (chat) => {
  if (chat.type === '0') {
    return chat.members?.filter((item: any) => item.userId !== userId.value)[0]
  } else {
    return {
      avatar: '',
      nickname: chat.name
    }
  }
}
const handleClick = (chat: any) => {
  if (chat === currentFriend.value) {
    return
  } else {
    useMessage.list = []
  }
  useChat.setCurrentInfo(chat)
  if (currentFriend.value && useMessage.list.length === 0) {
    useMessage.nextCursor = null
    useMessage.queryMessageList(chat.id, currentFriend.value)
  }
}
const handleInput = () => {}
const handleMenuSelect = (val) => {
  currentActionMenu.value = val
}
const init = async () => {
  if (route.query.code) {
    const currentChat = chatList.value.find((item) => item.code === route.query.code)
    if (currentChat) {
      currentActionMenu.value = route.query.code as  string
      handleClick(currentChat)
    }
  }
}
onMounted(init)
onActivated(init)
</script>

<template>
  <div class="w-full no-drag">
    <div class="h-[60px] border-b-2 w-full">
      <Search
        v-model="searchOption.searchStr"
        :icon="searchOption.icon"
        :placeholder="searchOption.placeholder"
        @input="handleInput"
      />
    </div>
    <el-scrollbar v-loading="chatLoading" height="calc(100vh - 60px)">
      <el-menu class="!border-none" :default-active="currentActionMenu" active-background-color="#000" @select="handleMenuSelect">
        <el-menu-item
          v-for="chat in chatList"
          :key="chat.id"
          :index="chat.code"
          :class="['!px-2', currentActionMenu === chat.code ? 'by-menu-active' : '']"
          @click="handleClick(chat)"
        >
          <Avatar
            class="!h-8 !w-8 !leading-8 !ml-0"
            :src="getChatName(chat)?.avatar"
            :nickname="getChatName(chat)?.nickname"
          />
          <span class="ml-3"> {{ getChatName(chat)?.nickname }} </span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.by-menu-active {
  background: var(--bg-color-active) !important;
}
</style>
