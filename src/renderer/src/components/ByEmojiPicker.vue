<script setup lang="ts">
import 'emoji-picker-element'
import cn from 'emoji-picker-element/i18n/zh_CN'
import { useClickOutside } from '/@/hooks'

const visible = ref(false)
const popoverContent = ref()
const reference = ref()
const emits = defineEmits<{
  (e: 'sendMessage', emoji: string): void
}>()
useClickOutside(popoverContent, (e) => {
  if (reference.value === e.target?.parentElement) {
    return
  }
  visible.value = false
})
const handleEmojiClick  = (e) => {
  emits('sendMessage', e.detail)
  visible.value = false

}
</script>

<template>
  <div class="cursor-pointer">
    <el-popover :visible="visible" placement="top" width="370px">
      <div ref="popoverContent">
        <emoji-picker searchPosition="none"  :i18n="cn" locale="zh_CN" category="people" @emoji-click="handleEmojiClick" />
      </div>
      <template #reference>
        <div ref="reference" style="width: 20px" @click="visible = !visible">
          <Icon class="!focus:outline-none" name="smile" :size="20" />
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style scoped></style>
