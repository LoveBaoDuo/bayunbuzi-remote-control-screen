<script setup lang="ts">
import Receiver from '/@/view/Remote/components/Receiver.vue'
import Sender from '/@/view/Remote/components/Sender.vue'

const route = useRoute()
</script>

<template>
  <div class="h-full">
    <Receiver v-if="route.query.type === 'receiver'" />
    <Sender v-else />
  </div>
</template>

<style scoped></style>
