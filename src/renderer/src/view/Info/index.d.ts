export interface ChatMember {
  id: string
  userId: string
  avatar: string
  nickname: string
  roomId: string
}

export interface ChatListType {
  id: string
  code: string
  type: string
  name: string
  desc: string
  members: ChatMember[]
}

export interface ChatState {
  userId: string
  chatList: ChatListType[]
  chatLoading: boolean
  currentChat: ChatListType | null
  currentFriend:  ChatMember | null
}


