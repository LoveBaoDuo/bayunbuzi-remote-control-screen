<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    threshold?: number
    loading?: boolean
    noMore?: boolean
  }>(),
  {
    threshold: 0.5,
    loading: false,
    noMore: false
  }
)
const emit = defineEmits<{
  (e: 'loading'): void
}>()
const loadTrigger = ref()
let observer
const handleIntersectionObserver = (entries: any[]) => {
  if (entries[0]?.isIntersecting && !props.loading) {
    emit('loading')
  }
}
const init = () => {
  // 创建 Intersection Observer
  observer = new IntersectionObserver(handleIntersectionObserver, {
    threshold: props.threshold
  })
  observer?.observe(loadTrigger.value)
}

onMounted(() => {
  init()
})
onActivated(() => {
  init()
})
onDeactivated(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="loadTrigger" class="h-2">
    <!-- 加载指示器 -->
    <div v-if="loading" class="p-2 text-center">
      <el-icon class="is-loading animate-spin">
        <Loading />
      </el-icon>
      <span class="ml-1 text-gray-600">加载中...</span>
    </div>

    <!-- 无更多数据提示 -->
    <div v-if="noMore" id="no-more-data" class="p-2 text-center text-gray-500">
      <i class="fas fa-check-circle text-green-500 mr-2"></i>
      没有更多历史消息了
    </div>
  </div>
</template>

<style scoped></style>
