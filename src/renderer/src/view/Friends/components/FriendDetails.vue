<script setup lang="ts">
import {ContactChildrenType} from "../friends";
import UserProfile from  './UserProfile.vue'
defineProps<{
  data: ContactChildrenType
}>()
</script>

<template>
  <div class="h-full">
    <div class="h-[60px] px-2 py-4">
    </div>
   <div >
     <UserProfile :data="data" />
   </div>
    </div>
</template>

<style scoped></style>
