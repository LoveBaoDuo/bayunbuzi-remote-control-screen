<script setup lang="ts">
import mittBus from '/@/utils/mitt'
import { checkAll } from '/@/utils/validator'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { login } from '@renderer/api/login'

const emitter = new IpcEmitter()
// 登入表单的数据
const fromData: { username?: string; password?: string; [key: string]: any } = reactive({
  grant_type: 'password',
  client_id: 'server',
  username: '',
  password: ''
})
// 错误信息DOM元素
const username = ref('')
const password = ref('')
// 失去焦点时 单个input框的校验
const handleBlur = async (key: string) => {
  // 调用表单校验的方法
  const result = await checkAll({ [key]: fromData[key] })
  // 根据参数 key 判断 当前校验的是那个input
  if (key === 'username') {
    // result 如果有值怎么表示验证失败有错误 并返回错误
    return (username.value = result ? result[key] : '')
  } else if (key === 'password') {
    return (password.value = result[key] ? result[key] : '')
  }
}
const handleLogin = () => {
  login
  emitter.send('store_set', 'username', fromData.username)
}
const goRegister = () => {
  mittBus.emit('onLoginAndRegisterSwitch', 'register')
}
</script>

<template>
  <div class="p-8 max-w-md w-full">
    <h2 class="text-2xl font-bold text-center text-gray-700">登录</h2>
    <form class="mt-6" style="-webkit-app-region: no-drag">
      <div class="mb-4">
        <label for="username" class="block text-gray-600">用户名</label>
        <input
          v-model="fromData.username"
          id="username"
          class="w-full text-gray-600 mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入用户名"
          @blur="handleBlur('username')"
        />
        <p class="text-red-600 text-xs" v-text="username"></p>
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-600">密码</label>
        <input
          v-model="fromData.password"
          type="password"
          id="password"
          class="w-full mt-2 px-4 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入密码"
          @blur="handleBlur('password')"
        />
        <p class="text-red-600 text-xs" v-text="password"></p>
      </div>
      <div class="mb-6">
        <button
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          @click.prevent="handleLogin"
        >
          登录
        </button>
      </div>
      <p class="text-center text-gray-600 text-sm">
        没有账号？ <a href="#" class="text-blue-500 hover:underline" @click="goRegister">注册</a>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
