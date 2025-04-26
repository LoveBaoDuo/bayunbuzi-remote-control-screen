import request from '@renderer/utils/request'
import { ResultType } from '/@/api/type'

// 发起聊天
export const startChatApi = (params): Promise<ResultType<any>> => {
  return request({
    url: `/ns/chat-room/start/chat`,
    method: 'get',
    params: params
  })
}
// 聊天室列表
export const chatRoomListApi = (userId: string) => {
  return request({
    url: `/ns/chat-room/list/${userId}`,
    method: 'get'
  })
}
