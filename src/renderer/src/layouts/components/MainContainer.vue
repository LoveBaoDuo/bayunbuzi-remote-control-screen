<script setup lang="ts">

</script>

<template>
  <div class="grid grid-cols-12 h-full">
    <div class="col-span-3 border-r-2 bg-[#f7f7f7]" >
      <slot name="menu" />
    </div>
    <div class="col-span-9 bg-[#f3f3f3]">
      <slot name="container" />
    </div>
  </div>
</template>

<style scoped>

</style>
