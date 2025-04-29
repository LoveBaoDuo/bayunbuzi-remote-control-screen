<script setup lang="ts">
import Avatar from '/@/components/Avatar/index.vue'
import { ChatMessagePropDataType } from '/@/type'
import { useUserStore } from '/@/store/user.store'

const useUser = useUserStore()
withDefaults(
  defineProps<{
    type: 'left' | 'right'
    data: ChatMessagePropDataType
  }>(),
  {
    type: 'left'
  }
)
</script>

<template>
  <div class="grid grid-cols-2 gap-2 p-2">
    <div class="flex gap-2 w-full">
      <template v-if="type === 'left'">
        <Avatar
          :src="data.avatar"
          class="!ml-0 !w-8 !h-8 !leading-8 text-sm"
          :nickname="data?.nickname || data.username"
        />
        <div
          class="flex bg-white rounded-lg rounded-tl-none p-2 shadow flex-wrap"
          style="max-width: calc(100% - 40px)"
        >
          <p class="text-gray-800 text-sm w-full text-wrap break-words">
            {{ data.message }}
          </p>
        </div>
      </template>
    </div>
    <div class="flex justify-end gap-2">
      <template v-if="type === 'right'">
        <div
          class="flex bg-white rounded-lg rounded-tr-none p-2 shadow flex-wrap"
          style="max-width: calc(100% - 40px)"
        >
          <p class="text-gray-800 text-sm w-full text-wrap break-words">
            {{ data.message }}
          </p>
        </div>
        <Avatar
          :src="useUser.userInfo.avatar"
          class="!ml-0 !w-8 !h-8 !leading-8 text-sm"
          :nickname="useUser.userInfo.nickname || useUser.userInfo.username"
        />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
