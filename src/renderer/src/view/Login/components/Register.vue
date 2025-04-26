<script setup lang="ts">
import mittBus from '/@/utils/mitt'
import { checkAll } from '/@/utils/validator'
import { registerUser } from '../../../api/login'
import { Message } from '../../../../../main/messageBox'
import Button from '/@/components/Button/index.vue'
// 组件内部状态
const state = reactive({
  // 是否显示密码
  isShowPassword: false,
  // 表单内容
  ruleForm: {
    username: '', // 用户名
    password: '', // 密码
    phone: '', // 手机号
    checked: '' // 是否同意条款
  },
  usernameMessage: '',
  passwordMessage: '',
  phoneMessage: ''
})
const loading = ref(false)
// 失去焦点时 单个input框的校验
const handleBlur = async (key: string) => {
  // 调用表单校验的方法
  const result = await checkAll({ [key]: state.ruleForm[key] })
  // 根据参数 key 判断 当前校验的是那个input
  if (key === 'username') {
    // result 如果有值怎么表示验证失败有错误 并返回错误
    return (state.usernameMessage = result ? result[key] : '')
  } else if (key === 'password') {
    return (state.passwordMessage = result[key] ? result[key] : '')
  } else if (key === 'phone') {
    return (state.phoneMessage = result[key] ? result[key] : '')
  }
}
const handleRegister = async () => {
  const result = await checkAll({
    username: state.ruleForm.username,
    password: state.ruleForm.password,
    phone: state.ruleForm.phone
  })
  if (
    result.username !== undefined ||
    result.password !== undefined ||
    result.phone !== undefined
  ) {
    state.usernameMessage = result.username
    state.passwordMessage = result.password
    state.phoneMessage = result.password
    return
  }
  try {
    loading.value = true
    await registerUser(state.ruleForm)
    goLogin()
    Message({
      message: '注册成功',
      type: 'success'
    })
  } catch (e: any) {
    Message({
      message: '注册失败',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}
const goLogin = () => {
  state.usernameMessage = ''
  state.passwordMessage = ''
  state.phoneMessage = ''
  mittBus.emit('onLoginAndRegisterSwitch', 'login')
}
</script>

<template>
  <div class="p-8 max-w-md w-full">
    <h2 class="text-2xl font-bold text-center text-gray-700">注册</h2>
    <form>
      <div class="mb-2">
        <label for="email" class="block text-gray-600">用户名</label>
        <input
          v-model="state.ruleForm.username"
          id="username"
          class="w-full text-gray-600 mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入用户名"
          @blur="handleBlur('username')"
        />
        <p class="text-red-600 text-xs h-4 leading-4" v-text="state.usernameMessage"></p>
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-600">密码</label>
        <input
          v-model="state.ruleForm.password"
          :type="state.isShowPassword ? 'text' : 'password'"
          id="password"
          class="w-full mt-1 px-4 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入密码"
          @blur="handleBlur('password')"
        />
        <p class="text-red-600 text-xs h-4 leading-4" v-text="state.passwordMessage"></p>
      </div>
      <div class="mb-2">
        <label for="email" class="block text-gray-600">手机号</label>
        <input
          v-model="state.ruleForm.phone"
          id="username"
          class="w-full text-gray-600 mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入手机号"
          @blur="handleBlur('phone')"
        />
        <p class="text-red-600 text-xs h-4 leading-4" v-text="state.phoneMessage"></p>
      </div>
      <div class="mb-2">
        <Button
          type="submit"
          :loading="loading"
          :disabled="loading"
          class="w-full text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          @click="handleRegister"
        >
          注册
        </Button>
      </div>
      <p class="text-center text-gray-600 text-sm">
        已有账号？ <span class="text-blue-500 hover:underline no-drag" @click="goLogin">登录</span>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
