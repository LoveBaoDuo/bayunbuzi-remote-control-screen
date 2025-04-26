<script setup lang="ts">
import Icon from '@renderer/components/Icon.vue'
import { useFriendsStore } from '../store'
import { useUserStore } from '/@/store/user.store'

const props = defineProps<{ searchStr: string }>()
const emits = defineEmits(['search'])
const user = useUserStore()
const useFriends = useFriendsStore()
const handleSerach = () => {
  useFriends.getNormalUserInfo(props.searchStr, user.getUserId)
  emits('search')
}
</script>
<template>
  <div>
    <div class="flex justify-between p-2 border-b no-drag cursor-pointer">
      <div class="flex justify-center items-center rounded-md w-10 h-10 bg-green-600">
        <Icon :size="24" color="#fff" name="serach" />
      </div>
      <div class="flex flex-1 justify-start ml-1 items-center truncate" @click="handleSerach">
        <p class="w-10">搜索:</p>
        <p class="truncate ml-0.5">{{ props.searchStr }}</p>
      </div>
      <div class="flex justify-center items-center w-6">
        <Icon :size="20" color="#9ca3af" name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
