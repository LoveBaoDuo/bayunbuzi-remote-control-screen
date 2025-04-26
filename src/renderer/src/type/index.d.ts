export interface ChatMessagePropDataType{
  id: string;
  message: string;
  createTime?: string;
  nickname: string;
  avatar: string;
  type: '0' | '1';
  isFriendMsg: boolean;
}
export interface MessageStoreState {
  list: ChatMessagePropDataType[]
  loading: boolean
  nextCursor: string | null
}
