import request from '@renderer/utils/request'
import { ResultType } from '/@/api/type'
// 根据用户名或者手机号查询普通用户名
export const getNormalUserInfoApi = (params, userId: string): Promise<ResultType<any>> => {
  return request({
    url: `/ns/user/normal/info/${userId}`,
    method: 'get',
    params: params
  })
}

// 发起好友申请
export const addFriendUserInfoApi = (data): Promise<ResultType<any>> => {
  return request({
    url: `/ns/friends/apply`,
    method: 'post',
    data
  })
}
// 获取好友申请列表
export const updateFriendUserInfoApi = (params): Promise<ResultType<any>> => {
  return request({
    url: `/ns/friends/apply/list`,
    method: 'get',
    params: params
  })
}
// 获取好友列表
export const getFriendListApi = (params): Promise<ResultType<any>> => {
  return request({
    url: `/ns/friends/list`,
    method: 'get',
    params: params
  })
}

// 好友申请同意
export const friendApplyAgree = (params): Promise<ResultType<any>> => {
  return request({
    url: `/ns/friends/agree`,
    method: 'get',
    params: params
  })
}
// 好友申请拒绝
export const friendApplyReject = (params): Promise<ResultType<any>> => {
  return request({
    url: `/ns/friends/reject`,
    method: 'get',
    params: params
  })
}
