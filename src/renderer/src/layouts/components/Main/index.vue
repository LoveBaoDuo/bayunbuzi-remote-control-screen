<script setup lang="ts">
import Nav from '../Nav/index.vue'
import gsap from 'gsap'

// const beforeEnter = (el) => {
//   gsap.from(el, { opacity: 0, x: -100, duration: 0.5 })
// }
//
// const afterEnter = (el) => {
//   gsap.to(el, { opacity: 1, x: 0, duration: 0.5 })
// }
//
// const beforeLeave = (el) => {
//   gsap.to(el, { opacity: 0, x: 100, duration: 0.5 })
// }
//
// const afterLeave = (el) => {
//   gsap.set(el, { opacity: 0 })
// }
</script>

<template>
  <div class="h-full pl-2 relative rounded-l-lg">
    <nav class="h-6 absolute right-0 z-[9999] no-drag">
      <Nav color="#232946FF" />
    </nav>
    <section class="bg-white overflow-hidden h-full">
      <router-view v-slot="{ Component }">
        <!-- 过渡效果 -->
        <!--          <transition-->
        <!--            @before-enter="beforeEnter"-->
        <!--            @after-enter="afterEnter"-->
        <!--            @before-leave="beforeLeave"-->
        <!--            @after-leave="afterLeave"-->
        <!--          >-->
        <!-- 缓存组件 -->
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
        <!--          </transition>-->
      </router-view>
    </section>
  </div>
</template>

<style scoped></style>
