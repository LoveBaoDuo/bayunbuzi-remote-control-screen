<script setup lang="ts">
import Icon from '@renderer/components/Icon.vue'

const props = withDefaults(
  defineProps<{
    width?: string
    title?: string
    mount?: string
  }>(),
  {
    width: '30vw',
    title: '提示',
    mount: 'body'
  }
)
const emits = defineEmits(['close'])
const visible = defineModel({
  default: false
})
const style = computed(() => {
  const translateX = parseInt(props.width) / 2
  return {
    width: props.width,
    transform: `translateX(-${props.width.replace(/\d*/, translateX + '')})`
  }
})
const handleCloseDialog = () => {
  emits('close')
  visible.value = false
}
</script>

<template>
  <teleport :to="mount">
    <div
      v-if="visible"
      class="absolute top-3/7 left-1/2 z-[99999] bg-white rounded-md min-w-[30vw] text-black p-2"
      :style="style"
    >
      <div class="border-b h-8 flex justify-between">
        <slot name="header">
          <h5>{{ title }}</h5>
        </slot>
        <Icon
          class="cursor-pointer"
          name="close"
          :size="20"
          color="#000"
          @click="handleCloseDialog"
        />
      </div>
      <div>
        <slot />
      </div>
      <div>
        <slot name="footer"></slot>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
