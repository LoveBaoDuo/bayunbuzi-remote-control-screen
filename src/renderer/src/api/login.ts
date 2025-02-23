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
    data: { ...data, password: encPassword },
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      'Content-Type': FORM_CONTENT_TYPE
    }
  })
}
export const refreshTokenApi = async (refresh_token: string) => {
  const grant_type = 'refresh_token'
  const scope = 'server'

  // 获取当前选中的 basic 认证信息
  const basicAuth = await emitter.invoke('store_get')

  return request({
    url: '/auth/oauth2/token',
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      'Content-Type': FORM_CONTENT_TYPE
    },
    method: 'post',
    data: { refresh_token, grant_type, scope }
  })
}
/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get',
  });
};
export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete',
  });
};
