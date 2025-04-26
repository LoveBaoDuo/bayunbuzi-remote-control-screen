import request from '@renderer/utils/request'
import { ResultType } from '/@/api/type'

// 发起聊天
export const queryChatHistoryApi = (data): Promise<ResultType<any>> => {
  return request({
    url: `/ns/chat-history/list`,
    method: 'post',
    data: data
  })
}
