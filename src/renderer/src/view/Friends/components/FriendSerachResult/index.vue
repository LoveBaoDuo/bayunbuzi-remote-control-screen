<script setup lang="ts">
import { useFriendsStore } from '../../store'
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'
import { addFriendUserInfoApi } from '/@/api/user'
import { useUserStore } from '/@/store/user.store'

const emits = defineEmits<{
  (e: 'refresh'): void
}>()
const useFriends = useFriendsStore()
const { friendSearchResult } = storeToRefs(useFriends)
const useUser = useUserStore()
const handleAddFriend = async (toUserId: string) => {
  const { value } = await ElMessageBox.prompt('请输入申请理由', '添加好友', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.+$/,
    cancelButtonClass: 'no-drag',
    confirmButtonClass: 'no-drag',
    inputErrorMessage: '请输入申请理由'
  })
  try {
    await addFriendUserInfoApi({
      toUserId,
      formUserId: useUser.getUserId,
      reason: value
    })
    useFriends.refreshFiendSearchResult()
    emits('refresh')
  } catch (e) {
    console.log(e)
  } finally {
  }
}
</script>

<template>
  <div v-loading="friendSearchResult.loading" class="h-full">
    <div class="h-[60px] px-2 py-4 border-b-2">
      <h4 class="font-black mt-1 pl-5">搜索结果</h4>
    </div>
    <div class="flex justify-center h-full pt-2">
      <div id="search-results" class="w-[70%]">
        <template v-if="friendSearchResult.data.length > 0">
          <div
            v-for="user in friendSearchResult.data"
            :key="user.userId"
            class="flex py-2 items-center justify-center border-b"
          >
            <Avatar class="!ml-0" :src="user?.avatar || ''" :nickname="user.username" />
            <div class="flex-1 ml-2">
              <p class="text-md text-gray-800/90 font-normal">{{ user.username }}</p>
            </div>
            <el-button type="primary" size="small" @click="handleAddFriend(user.userId)"
              >添加好友
            </el-button>
          </div>
        </template>
        <template v-else-if="!friendSearchResult.loading">
          <Empty />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
