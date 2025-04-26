<script setup lang="ts">
import { ContactChildrenType } from '../friends'
import Avatar from '/@/components/Avatar/index.vue'
import { useFriendsStore } from '/@/view/Friends/store'
import { storeToRefs } from 'pinia'
import { friendApplyAgree, friendApplyReject } from '/@/api/user'

defineProps<{
  data: ContactChildrenType
}>()

const useFriends = useFriendsStore()
const { friendRequestList } = storeToRefs(useFriends)

// 同意
const handleAgree = async (val: any) => {
  try {
    await friendApplyAgree({ id: val.id })
    useFriends.getFriendRequestList()
    useFriends.getFriendList()
  } catch (e) {
    console.log(e)
  }
}
// 拒绝
const handleReject = async (val: any) => {
  try {
    await friendApplyReject({ id: val.id })
    await useFriends.getFriendRequestList()
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="h-full">
    <div class="h-[60px] px-2 py-4 border-b-2">
      <h4 class="font-black mt-1 pl-5">{{ data.title }}</h4>
    </div>
    <div class="flex justify-center">
      <div v-loading="friendRequestList.loading" class="w-[70%]">
        <div
          v-for="friendRequest in friendRequestList.data"
          :key="friendRequest.userId"
          class="flex py-2 items-center justify-center border-b"
        >
          <Avatar class="!ml-0" :src="friendRequest.avatar" :nickname="friendRequest.nickname" />
          <div class="flex-1 ml-2">
            <p class="text-md text-gray-800/90 font-normal">{{ friendRequest.nickname }}</p>
            <p class="text-xs text-gray-500/70">{{ friendRequest.reason }}</p>
          </div>
          <template v-if="friendRequest.type == 0">
            <button
              class="bg-blue-500 h-6 text-xs text-white px-1 rounded-sm mr-2"
              @click="handleAgree(friendRequest)"
            >
              同意
            </button>
            <button
              class="bg-red-500 h-6 text-xs text-white px-1 rounded-sm"
              @click="handleReject(friendRequest)"
            >
              拒绝
            </button>
          </template>
          <span v-else-if="friendRequest.type == 1" text class="text-xs px-1 rounded-sm">
            已通过
          </span>
          <span v-else text class="text-xs px-1 rounded-sm"> 已拒绝 </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
