import request from '@renderer/utils/request'
import { ResultType } from '/@/api/type'

// 发起聊天
export const getRemoteInfo = (data): Promise<ResultType<any>> => {
  return request({
    url: `/ns/remote/query/code`,
    method: 'post',
    data: data
  })
}
// 验证链接
export const remoteLink = (data: any) => {
  return request({
    url: `/ns/remote/link`,
    method: 'post',
    data: data
  })
}
