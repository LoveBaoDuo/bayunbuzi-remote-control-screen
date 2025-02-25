<script setup lang="ts">
import mittBus from '/@/utils/mitt'
import { checkAll } from '/@/utils/validator'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { login } from '@renderer/api/login'
import { generateUUID, navigationToWin } from '@renderer/utils'
import { useUserStore } from '../../../store/user.store'
import { Message } from '../../../../../main/messageBox'

const emitter = new IpcEmitter()
// 登入表单的数据
const fromData: { username?: string; password?: string; [key: string]: any } = reactive({
  grant_type: 'password',
  client_id: 'server',
  username: '',
  password: '',
  randomStr: '',
  code: ''
})
const imgSrc = ref('')
// 错误信息DOM元素
const resErrorInfo = ref('')
const username = ref('')
const password = ref('')
const code = ref('')
const useUser = useUserStore()
//获取验证码图片
const getVerifyCode = () => {
  fromData.randomStr = generateUUID()
  imgSrc.value = `${import.meta.env.VITE_API_URL}/auth/code/image?randomStr=${fromData.randomStr}`
}

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
  } else if (key === 'code') {
    return (code.value = result[key] ? result[key] : '')
  }
}
const handleLogin = async () => {
  try {
    // 提交表单时进行全体校验
    const result = await checkAll({
      username: fromData.username,
      password: fromData.password,
      code: fromData.code
    })
    if (
      result.username !== undefined ||
      result.password !== undefined ||
      result.code !== undefined
    ) {
      username.value = result.username
      password.value = result.password
      code.value = result.code
      return
    }
    const res = (await login(fromData)) as any
    emitter.send('store_set', 'access_token', res.access_token)
    emitter.send('store_set', 'refresh_token', res.refresh_token)
    await useUser.getUserInfo()
    await navigationToWin('/home')
  } catch (e: any) {
    resErrorInfo.value = e.msg || e.error || '登录失败'
    Message({
      message: resErrorInfo.value
    })
  } finally {
    getVerifyCode()
  }
}
const goRegister = () => {
  mittBus.emit('onLoginAndRegisterSwitch', 'register')
}
onMounted(() => {
  getVerifyCode()
})
</script>

<template>
  <div class="p-8 max-w-md w-full">
    <h2 class="text-2xl font-bold text-center text-gray-700">登录</h2>
    <p class="text-red-600" v-text="resErrorInfo"></p>
    <form style="-webkit-app-region: no-drag">
      <div class="mb-2">
        <label for="username" class="block text-gray-600">用户名</label>
        <input
          v-model="fromData.username"
          id="username"
          class="w-full text-gray-600 mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入用户名"
          @blur="handleBlur('username')"
        />
        <p class="text-red-600 text-xs h-4 leading-4" v-text="username"></p>
      </div>
      <div class="mb-2">
        <label for="password" class="block text-gray-600">密码</label>
        <input
          v-model="fromData.password"
          type="password"
          id="password"
          class="w-full mt-1 px-4 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入密码"
          @blur="handleBlur('password')"
        />
        <p class="text-red-600 text-xs h-4 leading-4" v-text="password"></p>
      </div>
      <div class="mb-2">
        <label for="password" class="block text-gray-600">验证码</label>
        <div class="flex items-center space-x-2">
          <input
            v-model="fromData.code"
            class="w-3/4 mt-1 px-4 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="请输入验证码"
            @blur="handleBlur('code')"
          />
          <img
            :src="imgSrc"
            @click="getVerifyCode"
            class="cursor-pointer w-24 h-10 object-cover border rounded-lg mt-2"
            alt="验证码"
          />
        </div>
        <p class="text-red-600 text-xs h-4 leading-4" v-text="code"></p>
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
        没有账号？ <span  class="text-blue-500 hover:underline" @click="goRegister">注册</span>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
