<script setup lang="ts">
import Icon from '@renderer/components/Icon.vue'

defineProps({
  icon: {
    type: String,
    default: 'serach'
  },
  placeholder: {
    type: String,
    default: '搜索'
  }
})
const emit = defineEmits(['input'])
const value = defineModel({
  default: ''
})
const handleInput = (e: Event) => {
  value.value = (e.target as HTMLInputElement).value
  emit('input', value.value)
}
</script>

<template>
  <div >
    <div class="px-2 py-4 no-drag">
      <div class="flex w-full">
        <div class="border relative flex-1">
          <Icon class="absolute top-[5px] left-1" color="#9ca3af" :name="icon" />
          <input
            :value="value"
            class="w-full text-sm h-6 bg-gray-200/50 focus:bg-white focus:outline-none pl-5"
            :placeholder="placeholder"
            @input="handleInput"
          />
        </div>
        <slot name="after"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
