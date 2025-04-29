<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  nickname: {
    type: String,
    default: ''
  }
})
const name = computed(() => {
  const regex = /[\u4e00-\u9fa5]/
  if (regex.test(props.nickname)) {
    return props.nickname.slice(0, 1)
  } else {
    return props.nickname.slice(0, 1)?.toLocaleUpperCase()
  }
})
</script>

<template>
  <div class="w-12 h-12 ml-4 leading-[48px]">
    <img v-if="src" class="rounded-md" :src="src" v-bind="$attrs" />
    <p v-else class="h-full rounded-md font-semibold bg-[#232946] text-white text-center ">
      {{ name || 'A' }}
    </p>
  </div>
</template>

<style scoped></style>
