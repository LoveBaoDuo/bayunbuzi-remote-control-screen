<script setup lang="ts">
import Icon from '@renderer/components/Icon.vue'
</script>

<template>
  <div >
    <div class="px-2 py-4">
      <div class="flex">
        <div class="border rounded-md relative">
          <Icon class="absolute top-[5px] left-1" color="#9ca3af" name="serach" />
          <input
            class="w-full text-sm h-6 bg-gray-200/50 focus:bg-white focus:outline-none pl-5"
            placeholder="搜索"
          />
        </div>
        <div class=" px-1 ml-2 bg-gray-200 rounded-md flex items-center justify-center">
          <Icon :size="20" color="#9ca3af" name="addteam" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
