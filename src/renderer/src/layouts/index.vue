<script setup lang="ts">
import Menu from './components/Menu/index.vue'
import Main from './components/Main/index.vue'
</script>

<template>
  <div class="flex text-gray-950 w-full h-full">
    <MediaCallSocket />
    <aside class="bg-white h-full relative shadow-xl">
      <Menu />
    </aside>
    <main class="h-full flex-1" style="background: var(--bg-color)">
      <Main />
    </main>
  </div>
</template>

<style scoped></style>
