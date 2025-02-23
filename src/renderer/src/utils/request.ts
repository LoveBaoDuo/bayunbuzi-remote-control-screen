import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { encryption, decryption } from './index'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { refreshTokenApi } from '../api/login'

const emitter = new IpcEmitter()
/**
 * 创建并配置一个 Axios 实例对象
 */
const service: AxiosInstance = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000, // 全局超时时间
  paramsSerializer: {
    serialize: (params: any) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
})
// 是否正在请求刷新token接口的标记
let isRefreshing: boolean = false
// 请求队列
let requests: any[] = []
/**
 * Axios请求拦截器，对请求进行处理
 * 1. 序列化get请求参数
 * 2. 统一增加Authorization和TENANT-ID请求头
 * 3. 自动适配单体、微服务架构不同的URL
 * @param config AxiosRequestConfig对象，包含请求配置信息
 */
service.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<any> => {
    // 统一增加Authorization请求头, skipToken 跳过增加token
    const token = await emitter.invoke('store_get', 'access_token')
    if (token && !config.headers?.skipToken) {
      config.headers![CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`
    }

    // 请求报文加密
    if (config.headers![CommonHeaderEnum.ENC_FLAG]) {
      // @ts-ignore
      const enc = encryption(JSON.stringify(config.data), import.meta.env.VITE_PWD_ENC_KEY)
      config.data = {
        encryption: enc
      }
    }

    // 处理完毕，返回config对象
    return config
  },
  (error) => {
    // 对请求错误进行处理
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器处理函数
 * @param response 响应结果
 * @returns 如果响应成功，则返回响应的data属性；否则，抛出错误或者执行其他操作
 */
const handleResponse = (response: AxiosResponse<any>): any => {
  if (response.data.code === 1) {
    throw response.data
  }
  // 针对密文返回解密
  if (response.data.encryption) {
    const originData = JSON.parse(
      decryption(response.data.encryption, import.meta.env.VITE_PWD_ENC_KEY)
    )
    response.data = originData
    return response.data
  }

  return response.data
}

/**
 * 添加 Axios 的响应拦截器，用于全局响应结果处理
 */
service.interceptors.response.use(handleResponse, async (error) => {
  const status = Number(error.response.status) || 200
  if (status === 424) {
    if (error.response.config.data?.grant_type === 'refresh_token') {
      isRefreshing = false
      requests = []
      return Promise.reject(error.response.data)
    }

    isRefreshing = true
    const urls = requests.map((config: any) => config.url)
    if (!urls.includes(error.response.config.url)) {
      requests.push(error.response.config)
    }
    if (isRefreshing) {
      const refresh_token = await emitter.invoke('store_get', 'refresh_token')
      const res = await refreshTokenApi(refresh_token)
      emitter.send('store_set', 'access_token', res.data.access_token)
      emitter.send('store_set', 'refresh_token', res.data.access_token)
      requests.map((config) => {
        service(config)
      })
    }
  }
  return Promise.reject(error.response.data)
})

// 常用header
export enum CommonHeaderEnum {
  'TENANT_ID' = 'TENANT-ID',
  'ENC_FLAG' = 'Enc-Flag',
  'AUTHORIZATION' = 'Authorization'
}

// 导出 axios 实例
export default service
