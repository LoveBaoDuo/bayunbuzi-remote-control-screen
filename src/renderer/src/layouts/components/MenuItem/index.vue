<script setup lang="ts">
import Icon from '@renderer/components/Icon.vue'
import { PropType } from 'vue'
import { MenuType } from '../../type/MenuType'

 defineProps({
  config: {
    type: Object as PropType<MenuType>,
    required: true
  },
  open: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
})
</script>

<template>
  <li class="w-full pl-3 h-14">
    <router-link :to="config.path" >
    <div
      class="relative flex items-center h-full w-full text-white"
      :class="{ 'bybz-menu-item': active }"
      style="
        border-top-left-radius: 120px;
        border-bottom-left-radius: 120px;
        color: var(--bg-color);
        -webkit-app-region: no-drag;
      "
    >
      <span class="rounded-full bg-white ml-2.5 mr-4 h-10 w-10 min-w-10 leading-8">
        <Icon :name="config.icon" :size="20" />
      </span>
      <transition name="fade">
        <span class="font-semibold" v-show="open">{{config.title}}</span>
      </transition>
    </div>
    </router-link>
    <!--  <div></div>-->
  </li>
</template>
<style scoped>
.bybz-menu-item {
  background: var(--bg-color);
  color: #fff !important;
}

.bybz-menu-item::before {
  position: absolute;
  content: '';
  top: -14px;
  right: 0;
  width: 14px;
  height: 14px;
  border-bottom-right-radius: 14px;
  box-shadow: 5px 5px 0 5px var(--bg-color);
}

.bybz-menu-item::after {
  position: absolute;
  content: '';
  bottom: -14px;
  right: 0;
  width: 14px;
  height: 14px;
  border-top-right-radius: 14px;
  box-shadow: 5px -5px 0 5px var(--bg-color);
}
</style>
