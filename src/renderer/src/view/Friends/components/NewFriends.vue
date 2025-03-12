<script setup lang="ts">
import { ContactChildrenType } from '../friends'
import Avatar from '@renderer/layouts/components/Avatar/index.vue'

defineProps<{
  data: ContactChildrenType
}>()
</script>

<template>
  <div class="h-full">
    <div class="h-[60px] px-2 py-4 border-b-2">
      <h4 class="font-black mt-1 pl-5">{{ data.title }}</h4>
    </div>
    <div class="flex justify-center" style="-webkit-app-region: no-drag">
      <div class="w-[70%]">
        <div class="flex py-2 items-center justify-center border-b">
          <Avatar class="!ml-0" nickname="测试" />
          <div class="flex-1 ml-2">
            <p class="text-md text-gray-800/90 font-normal">名称</p>
            <p class="text-xs text-gray-500/70">申请理由</p>
          </div>
          <button class="bg-blue-500 h-6 text-xs text-white px-1 rounded-sm" style="-webkit-app-region: no-drag">接受</button>
        </div>
        <div class="flex py-2 items-center justify-center border-b">
          <Avatar class="!ml-0" nickname="测试1" />
          <div class="flex-1 ml-2">
            <p class="text-md text-gray-800/90 font-normal">名称1</p>
            <p class="text-xs text-gray-500/70">申请理由1</p>
          </div>
          <span class="h-6 text-xs  px-1 rounded-sm">已添加</span>
        </div>
        <div class="flex py-2 items-center justify-center border-b">
          <Avatar class="!ml-0" nickname="测试2" />
          <div class="flex-1 ml-2">
            <p class="text-md text-gray-800/90 font-normal">名称2</p>
            <p class="text-xs text-gray-500/70">申请理由2</p>
          </div>
          <button class="bg-blue-500 h-6 text-xs text-white px-1 rounded-sm">接受</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
