import request from '@renderer/utils/request'
import { encryption } from '@renderer/utils'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'

const emitter = new IpcEmitter()
// 登录
/**
 * https://www.ietf.org/rfc/rfc6749.txt
 * OAuth 协议 4.3.1 要求格式为 form 而不是 JSON 注意！
 */
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded'

/**
 * 登录
 * @param data
 */
export const login = (data: any) => {
  const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT)
  emitter.send('store_set', 'basicAuth', basicAuth)
  let encPassword = data.password
  // 密码加密
  if (import.meta.env.VITE_PWD_ENC_KEY) {
    encPassword = encryption(data.password, import.meta.env.VITE_PWD_ENC_KEY)
  }
  return request({
    url: '/auth/oauth2/token',
    method: 'post',
    data: { ...data, password: encPassword, scope: 'server' },
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      'Content-Type': FORM_CONTENT_TYPE
    }
  })
}

/**
 * 校验令牌，若有效期小于半小时自动续期
 * @param refreshLock
 */
export const checkTokenApi = async () => {
  // 获取当前选中的 basic 认证信息
  const basicAuth = await emitter.invoke('store_get', 'basicAuth')
  const token = await emitter.invoke('store_get', 'access_token')
  return request({
    url: '/auth/token/check_token',
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      'Content-Type': FORM_CONTENT_TYPE
    },
    method: 'get',
    params: { token: `Bearer ${token}` }
  })
}

export const refreshTokenApi = async () => {
  const refresh_token = await emitter.invoke('store_get', 'refresh_token')
  const grant_type = 'refresh_token'
  const scope = 'server'

  // 获取当前选中的 basic 认证信息
  const basicAuth = await emitter.invoke('store_get', 'basicAuth')
  const params = new URLSearchParams({ refresh_token, grant_type, scope })
  return request({
    url: '/auth/oauth2/token',
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      'Content-Type': FORM_CONTENT_TYPE
    },
    method: 'post',
    data: params
  })
}
/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}
export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}
/**
 * 注册用户
 */
export const registerUser = (userInfo: object) => {
  return request({
    url: '/admin/register/user',
    method: 'post',
    data: userInfo
  })
}
