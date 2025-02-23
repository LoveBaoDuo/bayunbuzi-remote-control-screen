<template>
  <svg class="svg-icon icon" :style="setIconImgOutStyle">
    <use :xlink:href="`#${getIconName}`" />
  </svg>
</template>

<script setup lang="ts" name="svgIcon">
// 定义父组件传过来的值
const props = defineProps({
  // svg 图标组件名字
  name: {
    type: String,
  },
  // svg 大小
  size: {
    type: Number,
    default: () => 14,
  },
  // svg 颜色
  color: {
    type: String,
  },
});
// 获取 icon 图标名称
const getIconName = computed(() => {
  return `icon-${props?.name}` ;
});
// 设置图片样式
const setIconImgOutStyle = computed(() => {
  return `width: ${props.size}px;height: ${props.size}px;display: inline-block;overflow: hidden;-webkit-app-region: no-drag;color: ${props.color};fill: ${props.color};stroke:${props.color}`;
});
</script>
