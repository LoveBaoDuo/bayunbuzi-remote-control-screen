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
   <div style="-webkit-app-region: no-drag">
     <UserProfile />
   </div>
    </div>
</template>

<style scoped></style>
