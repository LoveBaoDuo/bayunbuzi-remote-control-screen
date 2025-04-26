import { defineStore } from 'pinia'
import { userUserInfo } from '/@/hooks'
import { startChatApi, chatRoomListApi } from '/@/api/chat'
import { ChatListType, ChatState } from '/@/view/Info/index'

export const useChatStore = defineStore('ChatStore', {
  state: (): ChatState => ({
    userId: '',
    chatList: [],
    chatLoading: false,
    currentChat: null,
    currentFriend: null
  }),
  getters: {},
  actions: {
    setCurrentInfo(data: ChatListType) {
      this.currentChat = data
      const friend = data.members.filter((item: any) => item.userId !== this.userId)
      if (friend) {
        this.currentFriend = friend[0]
      } else {
        this.currentFriend = null
      }
    },
    // 发起聊天
    async startChat(friendId: string) {
      try {
        const { userId } = await userUserInfo()
        this.userId = userId
        await startChatApi({ friendId: friendId, userId })
        return true
      } catch (e) {
        return false
      }
    },
    async getChatRoomList(userId: string) {
      try {
        this.chatLoading = true
        this.userId = userId
        const res = await chatRoomListApi(userId)
        if (res.data) {
          this.chatList = res.data
        }
        return true
      } catch (e) {
        return false
      }finally {
        this.chatLoading = false
      }
    }
  }
})
