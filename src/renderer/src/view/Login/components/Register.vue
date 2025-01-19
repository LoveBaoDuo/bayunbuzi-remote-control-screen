<script setup lang="ts">
import mittBus from '/@/utils/mitt'

const goLogin = () => {
  mittBus.emit('onLoginAndRegisterSwitch', 'login')
}
</script>

<template>
  <div class="p-8 max-w-md w-full">
    <h2 class="text-2xl font-bold text-center text-gray-700">注册</h2>
    <form class="mt-6" style="-webkit-app-region: no-drag">
      <div class="mb-4">
        <label for="email" class="block text-gray-600">邮箱</label>
        <input
          type="email"
          id="email"
          class="w-full text-gray-600 mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入邮箱"
          required
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-600">密码</label>
        <input
          type="password"
          id="password"
          class="w-full text-gray-600 mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入密码"
          required
        />
      </div>
      <div class="mb-6">
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          注册
        </button>
      </div>
      <p class="text-center text-gray-600 text-sm">
        已有账号？ <a href="#" class="text-blue-500 hover:underline" @click="goLogin">登录</a>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
