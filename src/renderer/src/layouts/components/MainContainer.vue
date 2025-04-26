<script setup lang="ts">
import Logo2 from '/@/assets/img/logo2.png'
</script>

<template>
  <div class="grid grid-cols-12 h-full">
    <div class="col-span-3 border-r-2">
      <slot name="menu" />
    </div>
    <div class="col-span-9 bg-[#f3f3f3]">
      <slot name="container">
        <div class="w-full h-full flex justify-between items-center">
          <el-empty class="m-auto " :image="Logo2" description=" " style="opacity: 0.1" />
        </div>
      </slot>
    </div>
  </div>
</template>
<style scoped></style>
