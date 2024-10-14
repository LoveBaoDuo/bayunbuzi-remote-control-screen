<script setup lang="ts">
import { ref } from 'vue'

const uniqueId = ref('')
const getUUID = async () => {
  // @ts-ignore
  uniqueId.value = await window.api?.uniqueId()
}

getUUID()
</script>

<template>
<div>
  <div class="text-white" @click="openWind">{{ uniqueId }}</div>
</div>
</template>

<style scoped></style>
