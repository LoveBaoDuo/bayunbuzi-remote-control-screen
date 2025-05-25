import { defineStore } from 'pinia'
import { getRemoteInfo } from '/@/api/home'
import { userUserInfo } from '/@/hooks'
import { getDeviceHostName } from '/@/utils'
import { localStorageKey } from '/@/config'

export interface RemoteInfoType {
  devices?: string
  connectionCode?: string
  userId?: string
  linkPassword?: string
  linkRoom?: string
}

export interface RemoteStateType {
  remoteInfo: RemoteInfoType
  loading: boolean
}

export const useRemoteStore = defineStore('RemoteStore', {
  state: (): RemoteStateType => ({
    remoteInfo: {},
    loading: false
  }),
  getters: {},
  actions: {
    async getRemoteInfo() {
      try {
        const remoteInfo = localStorage.getItem(localStorageKey.remoteInfo)
        if (!!remoteInfo) {
          this.remoteInfo = JSON.parse(remoteInfo)
          return
        }
        this.loading = true
        const { userId } = await userUserInfo()
        const hostname = await getDeviceHostName()
        const res = await getRemoteInfo({
          userId,
          devices: hostname
        })
        this.remoteInfo = res.data
        localStorage.setItem(localStorageKey.remoteInfo, JSON.stringify(res.data))
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})
