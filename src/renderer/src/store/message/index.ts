import { defineStore } from 'pinia'
import { ChatMessagePropDataType, MessageStoreState } from '/@/type'
import { SuccessType } from '/@/layouts/type/MessageType'
import { ChatMember } from '/@/view/Info'
import { queryChatHistoryApi } from '/@/api/chatHistory'

export const useMessageStore = defineStore('MessageStore', {
  state: (): MessageStoreState => ({
    list: [],
    loading: false,
    nextCursor: null
  }),
  getters: {},
  actions: {
    addMessage(message: SuccessType, firendUser: ChatMember) {
      message.data.map((item: any) => {
        this.list.push(this.formattingData(item, firendUser))
      })
    },
    formattingData(data: any, firendUser: ChatMember) {
      let temp: ChatMessagePropDataType
      if (firendUser.userId === data?.userId || firendUser.userId === data?.sendUserId) {
        temp = {
          id: data?.id || '',
          message: data.content,
          type: data.type,
          nickname: firendUser.nickname,
          avatar: firendUser.avatar,
          isFriendMsg: false
        }
      } else {
        temp = {
          id: data?.id || '',
          message: data.content,
          type: data.type,
          nickname: '',
          avatar: '',
          isFriendMsg: true
        }
      }
      return temp
    },
    async queryMessageList(roomId: string, firendUser: ChatMember) {
      try {
        this.loading = true
        const res = await queryChatHistoryApi({
          roomId,
          take: 10,
          cursorId: this.nextCursor
        })
        this.list = res.data.data
          .map((item: any) => {
            return this.formattingData(item, firendUser)
          })
          .reverse()
        this.nextCursor = res.data.nextCursor
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    async queryMessagePage(roomId: string, firendUser: ChatMember) {
      if (!this.nextCursor) return
      try {
        const res = await queryChatHistoryApi({
          roomId,
          take: 10,
          cursorId: this.nextCursor
        })
        res.data.data.map((item: any) => {
          this.list.unshift(this.formattingData(item, firendUser))
        })
        this.nextCursor = res.data.nextCursor
      } catch (e) {}
    },
    clear() {
      this.nextCursor = null
      this.list = []
    }
  }
})
