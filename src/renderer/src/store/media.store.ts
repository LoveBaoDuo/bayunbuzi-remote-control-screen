import { defineStore } from 'pinia'

export const useMediaStore = defineStore('MediaStore', {
  state: () => ({
    roomKey: '',
    senderInfo: {}
  }),
  getters: {
    getRoomKey: (state) => state.roomKey,
    getSenderInfo: (state) => state.senderInfo
  },
  actions: {
    setInit(data: any) {
      this.roomKey = data.roomKey
      this.senderInfo = data.senderInfo
    }
  }
})
