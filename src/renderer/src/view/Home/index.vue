<script setup lang="ts">
const uniqueId = ref('')
const getUUID = async () => {
  // @ts-ignore
  uniqueId.value = await window.api?.uniqueId()
}

getUUID()
</script>

<template>
  <div>
    <div class="text-white">{{ uniqueId }}</div>
  </div>
</template>

<style scoped></style>
