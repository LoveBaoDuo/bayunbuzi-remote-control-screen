import { defineStore } from 'pinia'
import { getUserInfo, logout } from '../api/login'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'

const emitter = new IpcEmitter()

interface UserState {
  userInfo: {
    userId: string
    username: string
    avatar: string
    nickname: string
    email: string
    name: string
    phone: string
  }
}

export const useUserStore = defineStore('UserStore', {
  state: (): UserState => ({
    userInfo: {
      userId: '',
      username: '',
      avatar: '',
      nickname: '',
      email: '',
      name: '',
      phone: ''
    }
  }),
  getters: {
    getUserId: (state: UserState) => state.userInfo?.userId
  },
  actions: {
    /**
     * 初始化用户信息
     */
    async initUserInfo() {
      const userInfo = await emitter.invoke('store_get', 'userInfo')
      this.userInfo.username = userInfo.username
      this.userInfo.avatar = userInfo.avatar
      this.userInfo.nickname = userInfo.nickname
      this.userInfo.email = userInfo.email
      this.userInfo.name = userInfo.name
      this.userInfo.phone = userInfo.phone
      this.userInfo.userId = userInfo.userId
    },
    /**
     * 获取用户信息
     */
    async getUserInfo(): Promise<any> {
      try {
        const res = await getUserInfo()
        this.userInfo.username = res.data.sysUser.username
        this.userInfo.avatar = res.data.sysUser.avatar
        this.userInfo.nickname = res.data.sysUser.nickname
        this.userInfo.email = res.data.sysUser.email
        this.userInfo.name = res.data.sysUser.name
        this.userInfo.phone = res.data.sysUser.phone
        this.userInfo.userId = res.data.sysUser.userId
        const userInfo = { ...this.userInfo }
        emitter.send('store_set', 'userInfo', userInfo)
        return true
      } catch (e: any) {
        emitter.send('error', e.msg || e.message || '获取用户信息失败')
      }
      return false
    },
    /**
     *推出登录
     */
    async logout() {
      try {
        await logout()
        emitter.send('store_del', 'userInfo')
      } catch (e: any) {
        emitter.send('error', e.msg || e.message || '推出登录失败')
      }
    }
  }
})
