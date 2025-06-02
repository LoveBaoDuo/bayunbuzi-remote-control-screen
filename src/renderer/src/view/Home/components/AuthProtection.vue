<script setup>
import { useRemoteStore } from '/@/view/Home/store'
import { storeToRefs } from 'pinia'
import { useClipboard } from '@vueuse/core'
import Icon from '/@/components/Icon.vue'
import { useMessage } from '/@/hooks/useMessage'
import { ElMessageBox } from 'element-plus'
import { remoteLink } from '/@/api/home/index'
import { useStartCallMedia } from '/@/hooks/socket'
import { useUserStore } from '/@/store/user.store'

const useUser = useUserStore()
const useRemote = useRemoteStore()
const { remoteInfo, loading } = storeToRefs(useRemote)
const formattedString = computed(() => {
  return remoteInfo.value.connectionCode?.replace(/(\d{3})(?=\d)/g, '$1  ') || '000 000'
})
const isEye = ref(false)
const linkCode = ref('')
const handleCopy = (text) => {
  const { copy } = useClipboard()
  copy(text)
  useMessage().success('复制成功')
}
const linkRemote = async () => {
  if (!linkCode.value) {
    return useMessage().warning('请输入远程码')
  }
  if (linkCode.value === formattedString.value) {
    return useMessage().warning('不能输入本设备设备码')
  }
  const { value } = await ElMessageBox.prompt('请输入远程密码', '远程密码', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.+$/,
    customClass: 'no-drag',
    cancelButtonClass: 'no-drag',
    confirmButtonClass: 'no-drag',
    inputErrorMessage: '请输入远程密码'
  })
  try {
    const res = await remoteLink({
      connectionCode: linkCode.value.replaceAll(' ', ''),
      linkPassword: value
    })
    // 发起远程控制申请
    useStartCallMedia({
      sendUserId: useUser.getUserId,
      receiverId: res.data.userId,
      linkInfo: res.data,
      senderInfo: useUser.userInfo,
      media: 'video',
      type: 'sender',
      classType: 'remote'
    })
  } catch (e) {
    useMessage().error('链接失败')
  }
}
onActivated(() => {
  useRemote.getRemoteInfo()
})
</script>

<template>
  <div v-loading="loading" class="w-[90%] mx-auto p-6 bg-white rounded-lg">
    <!-- 标题 -->
    <div class="flex flex-col mb-10">
      <h1 class="text-4xl font-semibold text-gray-800">此设备</h1>
      <h4 class="mt-4 font-semibold">{{ remoteInfo.devices }}</h4>
    </div>

    <div class="flex items-center gap-6">
      <!-- 设备代码 -->
      <div class="mb-4 w-[60%]">
        <p class="text-1xl text-gray-600 mb-1">设备代码</p>
        <div class="flex items-center gap-6 w-full">
          <div
            class="no-drag text-2xl p-3 bg-gray-100 rounded-md text-center font-mono text-gray-800 w-[80%]"
          >
            {{ formattedString }}
          </div>
          <Icon
            class="mr-2 cursor-pointer haver:text-blur"
            name="copy"
            :size="20"
            @click="handleCopy(formattedString)"
          />
        </div>
      </div>

      <!-- 临时密码 -->
      <div class="mb-4">
        <p class="text-1xl text-gray-600 mb-1">临时密码</p>
        <div class="flex items-center gap-3">
          <div
            class="flex items-center text-2xl p-3 bg-gray-100 rounded-md text-center font-mono text-gray-800"
          >
            <span class="mr-2 no-drag">{{ remoteInfo.linkPassword }}</span>
          </div>
          <div>
            <Icon
              class="mr-2 cursor-pointer haver:text-blur"
              name="copy"
              :size="20"
              @click="handleCopy(remoteInfo.linkPassword)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <hr class="my-10 border-gray-200" />

    <!-- 远程控制部分 -->
    <div>
      <p class="text-sm text-gray-600 mb-2">远程控制设备</p>
      <input
        v-model="linkCode"
        type="text"
        class="w-full text-2xl p-3 bg-gray-100 rounded-md text-center font-mono text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="输入设备代码"
        value=""
      />

      <button
        class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        @click="linkRemote"
      >
        连接
      </button>
    </div>
  </div>
</template>
