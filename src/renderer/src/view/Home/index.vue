<script setup lang="ts">
import {ref} from "vue";

const uniqueId = ref('')
const getUUID = async () => {
  // @ts-ignore
  uniqueId.value = await window.api?.uniqueId()
}
getUUID()
</script>

<template>
  <div class="text-white">{{
      uniqueId
      }}</div>
</template>

<style scoped>

</style>
