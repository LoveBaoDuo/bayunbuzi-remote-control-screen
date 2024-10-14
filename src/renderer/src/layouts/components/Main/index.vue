<script setup lang="ts">
import Nav from '../Nav/index.vue'
import  gsap  from 'gsap'

const beforeEnter = (el) => {
  gsap.from(el, { opacity: 0, x: -100, duration: 0.5 })
}

const afterEnter = (el) => {
  gsap.to(el, { opacity: 1, x: 0, duration: 0.5 })
}

const beforeLeave = (el) => {
  gsap.to(el, { opacity: 0, x: 100, duration: 0.5 })
}

const afterLeave = (el) => {
  gsap.set(el, { opacity: 0 })
}
</script>

<template>
  <div class="h-full">
    <nav class="h-10">
      <Nav />
    </nav>
    <section class="h-5/6" style="-webkit-app-region: no-drag;">
      <router-view v-slot="{ Component }">
        <!-- 过渡效果 -->
        <transition
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
          @before-leave="beforeLeave"
          @after-leave="afterLeave"
        >
          <!-- 缓存组件 -->
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </section>
  </div>
</template>

<style scoped></style>
