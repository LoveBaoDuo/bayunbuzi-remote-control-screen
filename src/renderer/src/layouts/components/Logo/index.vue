<script setup lang="ts">
 import Icon from '@renderer/components/Icon.vue'
 defineProps({
   isTitle: {
     type: Boolean,
     default: false
   }
 })
</script>

<template>
<div class="flex justify-center items-center h-10 mt-2.5 mb-2.5 gap-1">
  <Icon name="logo"  :size="40" />
  <h4 v-if="isTitle" class="font-semibold text-base text-2xl">BAYUNBUZI</h4>
</div>
</template>

<style scoped>

</style>
