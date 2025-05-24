import { defineStore } from 'pinia'
import { getRemoteInfo } from '/@/api/home'
import { userUserInfo } from '/@/hooks'
import { getDeviceUUID } from '/@/utils'

export interface RemoteInfoType {
  devices?: string
  connectionCode?: string
  userId?: string
  linkPassword?: string
  linkRoom?: string
}

export interface RemoteStateType {
  remoteInfo: RemoteInfoType
}

export const useRemoteStore = defineStore('RemoteStore', {
  state: (): RemoteStateType => ({
    remoteInfo: {}
  }),
  getters: {},
  actions: {
    async getRemoteInfo() {
      try {
        const { userId } = await userUserInfo()
        const deviceInfo = await getDeviceUUID()
        const res = await getRemoteInfo({
          userId,
          devices: deviceInfo.os
        })
        this.remoteInfo = res.data
      } catch (e) {
        console.error(e)
      }
    }
  }
})
