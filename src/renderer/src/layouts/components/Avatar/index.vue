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
    return props.nickname.slice(0, 1).toLocaleUpperCase()
  }
})
</script>

<template>
  <div class="ml-3">
    <img v-if="src" class="w-12 h-12 rounded-lg" :src="src" v-bind="$attrs" />
    <p
      v-else
      class="w-12 h-12 rounded-lg font-semibold bg-blue-400 text-white text-center leading-[48px]"
    >
      {{ name }}
    </p>
  </div>
</template>

<style scoped></style>
