<script setup lang="ts">
import Avatar from '/@/components/Avatar/index.vue'
import Icon from '@renderer/components/Icon.vue'
import { useChatStore } from '/@/store/chat.store'
import { ContactChildrenType } from '/@/view/Friends/friends'
import { useStartCallMedia } from '/@/hooks/socket'
import { useUserStore } from '/@/store/user.store'
import {localStorageKey} from "/@/config";
const props = defineProps<{
  data: ContactChildrenType
}>()
const route = useRouter()
const useChat = useChatStore()
const useUser = useUserStore()
const startChat = async () => {
  const friendId = useUser.getUserId === props.data.userId ? props.data.friendId : props.data.userId
  const res = await useChat.startChat(friendId as string)
  if (res) {
    await route.push(`/info?code=${res.data.code}`)
  }
}
const openVideo = async () => {
  const sendUserId = useUser.getUserId
  const receiverId = sendUserId === props.data.userId ? props.data.friendId : props.data.userId
  localStorage.setItem(localStorageKey.mediaReceiverInfo, JSON.stringify(props.data))
  useStartCallMedia({
    type: 'sender',
    media: 'video',
    sendUserId: sendUserId,
    receiverId: receiverId as string,
    senderInfo: useUser.userInfo
  })
}
</script>
<template>
  <div class="min-h-screen mt-12 text-xs">
    <div class="w-96 mx-auto">
      <!-- 头部信息 -->
      <div class="p-4 flex items-center justify-between border-b">
        <div class="flex items-center space-x-3">
          <Avatar class="!ml-0" :nickname="data.title" :src="data.avatar" />
          <div>
            <h1 class="text-lg font-medium">{{ data.title }}</h1>
            <p class="text-gray-500 text-sm">手机号：{{ data.phone || '' }}</p>
          </div>
        </div>
        <div class="text-gray-400">
          <span>...</span>
        </div>
      </div>

      <!-- 信息列表 -->
      <div>
        <div class="p-4">
          <div class="flex items-center">
            <span class="text-gray-500 w-16">备注</span>
            <span class="text-gray-700">点击添加备注</span>
          </div>
        </div>

        <!--        <div class="p-4">-->
        <!--          <div class="flex items-center">-->
        <!--            <span class="text-gray-500 w-16">标签</span>-->
        <!--            <span class="text-gray-700">陌生人</span>-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        <div class="p-4">-->
        <!--          <div class="flex items-center">-->
        <!--            <span class="text-gray-500 w-16">朋友权限</span>-->
        <!--            <span class="text-gray-700">仅聊天</span>-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        <div class="p-4 border-t">-->
        <!--          <div class="flex">-->
        <!--            <span class="text-gray-500 w-16">个性签名</span>-->
        <!--            <span class="text-gray-700 flex-1"-->
        <!--              >IT地中海 不定时收会员 代理 失联请➕xzm16886611111111111111111111</span-->
        <!--            >-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        <div class="p-4 border-b">-->
        <!--          <div class="flex items-center">-->
        <!--            <span class="text-gray-500 w-16">来源</span>-->
        <!--            <span class="text-gray-700">通过搜索微信号添加</span>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-center gap-2 p-4 mt-4">
        <button
          class="flex flex-col items-center justify-center mx-4 text-[#576b95]"
          @click="startChat"
        >
          <Icon color="#576b95" name="comment" :size="20" />
          <span>发消息</span>
        </button>
        <button class="flex flex-col items-center justify-center mx-4 text-[#576b95]">
          <Icon color="#576b95" name="phone" :size="20" />
          <span>语音聊天</span>
        </button>
        <button
          class="flex flex-col items-center justify-center mx-4 text-[#576b95]"
          @click="openVideo"
        >
          <Icon color="#576b95" name="video" :size="20" />
          <span>视频聊天</span>
        </button>
      </div>
    </div>
  </div>
</template>
