<script setup lang="ts">

import Nav from "/@/layouts/components/Nav/index.vue";
const handleClosed = () => {}
</script>

<template>
<div class="h-full">
  <div class="absolute right-0 top-0 z-[9999999]">
    <Nav ref="navInstance" color="#cdd0d6" @close="handleClosed" />
  </div>
</div>
</template>

<style scoped>

</style>
