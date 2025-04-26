<script setup lang="ts">
import { ContactChildrenType } from '../friends'
import Avatar from '/@/components/Avatar/index.vue'

defineProps<{
  data: ContactChildrenType
}>()
const users = [
  { id: 1, name: '李智恩', avatar: '/path/to/avatar1.jpg' },
  { id: 2, name: '王宗健', avatar: '/path/to/avatar2.jpg' },
  { id: 3, name: '孔令昭', avatar: '/path/to/avatar3.jpg' },
  { id: 4, name: '李诗佳', avatar: '/path/to/avatar4.jpg' },
  { id: 5, name: '金宇', avatar: '/path/to/avatar5.jpg' },
  { id: 6, name: '刘亚东', avatar: '/path/to/avatar6.jpg' },
  { id: 7, name: '钱依婷', avatar: '/path/to/avatar7.jpg' },
  { id: 8, name: 'zero', avatar: '/path/to/avatar8.jpg' },
  { id: 9, name: '张敏文', avatar: '/path/to/avatar9.jpg' },
  { id: 10, name: '陈清十八', avatar: '/path/to/avatar10.jpg' },
  { id: 11, name: '刘帅', avatar: '/path/to/avatar11.jpg' },
  { id: 12, name: '栾宁', avatar: '/path/to/avatar12.jpg' },
  { id: 13, name: '徐智斌', avatar: '/path/to/avatar13.jpg' },
  { id: 14, name: '圈圈无无光', avatar: '/path/to/avatar14.jpg' }
]
</script>

<template>
  <div>
    <div class="h-[60px] px-2 py-4 border-b-2">
      <h4 class="font-black mt-1 pl-5">{{ data.title }}</h4>
    </div>
    <div class="min-h-screen m-12 text-xs">
      <!-- 头像列表容器 -->
      <div class="flex flex-wrap gap-6 mb-4">
        <div v-for="user in users" :key="user.id" class="flex flex-col items-center w-16">
          <!-- 头像图片 -->
          <div class="w-16 h-16 rounded-lg overflow-hidden mb-1">
            <Avatar class="!ml-0 !w-16 !h-16 leading-[64px] text-xl" :nickname="user.name" />
          </div>
          <!-- 用户名称 -->
          <span class="text-xs text-gray-600 truncate w-full text-center">
            {{ user.name }}
          </span>
        </div>
      </div>
      <div class="mt-10 flex justify-center">
        <!-- 发消息按钮 -->
        <button class="w-36 bg-green-500 text-white py-2 hover:bg-green-600 transition-colors">
          发消息
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
