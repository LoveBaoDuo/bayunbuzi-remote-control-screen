// @ts-ignore
import * as CryptoJS from 'crypto-js'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { minWindowsConfig, otherWindowsConfig } from '../config/windows.config'
const emitter = new IpcEmitter()

/**
 *  解密
 * @param {*} params 参数列表
 * @returns 明文
 */
export function decryption(src: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  // 解密逻辑
  var decryptd = CryptoJS.AES.decrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  })

  return decryptd.toString(CryptoJS.enc.Utf8)
}

/**
 *加密处理
 */
export function encryption(src: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  // 加密
  var encrypted = CryptoJS.AES.encrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  })
  return encrypted.toString()
}

/**
 * @description 生成唯一 uuid
 * @return string
 */
export function generateUUID() {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(
          16
        )
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow =
    (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (performanceNow + random) % 16 | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

export async function navigationToWin(uri: string) {
  const config = JSON.stringify({
    parent: false,
    url: 'http://localhost:5173' + uri,
    win: minWindowsConfig
  })
  await emitter.invoke('open-custom-window', config)
  emitter.send('close')
}

export const toLogin = async () => {
  const config = JSON.stringify({
    parent: false,
    url: 'http://localhost:5173/login',
    win: otherWindowsConfig
  })
  await emitter.invoke('open-custom-window', config)
  emitter.send('close')
}
