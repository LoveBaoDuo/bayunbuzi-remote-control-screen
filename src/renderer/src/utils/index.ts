// @ts-ignore
import * as CryptoJS from 'crypto-js'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { pinyin } from 'pinyin-pro'
import {
  minWindowsConfig,
  otherWindowsConfig,
  remoteReceiverWindowsConfig,
  remoteSenderWindowsConfig,
  videoWindowsConfig
} from '../config/windows.config'

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
    url: '' + uri,
    win: minWindowsConfig
  })
  await emitter.invoke('open-custom-window', config)
  emitter.send('close')
}

export const toLogin = async () => {
  emitter.send('store_del', 'refresh_token')
  emitter.send('store_del', 'access_token')
  emitter.send('store_del', 'userInfo')
  const config = JSON.stringify({
    parent: false,
    url: '/login',
    win: otherWindowsConfig
  })
  await emitter.invoke('open-custom-window', config)
  emitter.send('close')
}
export const existWind = async (winId: string) => {
  const winArray = await emitter.invoke('get-wins')
  const winMap = new Map(JSON.parse(winArray))
  return winMap.has(winId)
}

function getFirstLetter(str: string): string {
  if (!str?.trim()) return '#'

  const firstChar = str[0]

  // 英文字母
  if (/[a-z]/i.test(firstChar)) {
    return firstChar.toUpperCase()
  }

  // 中文字符
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    try {
      const [firstPy] = pinyin(firstChar, {
        pattern: 'first',
        type: 'array'
      })
      return firstPy?.[0]?.toUpperCase() || '#'
    } catch {
      return '#'
    }
  }

  // 其他字符
  return '#'
}

export function groupUsersByFirstLetter(users: any[]) {
  const groups: Record<string, any[]> = {}

  users.forEach((user) => {
    const displayName = String(user.nickname || user.username || '')
    const letter = getFirstLetter(displayName)
    ;(groups[letter] ||= []).push(user)
  })

  const groupOrder = Object.keys(groups).sort((a, b) =>
    a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)
  )

  groupOrder.forEach((letter) => {
    groups[letter].sort((a, b) => {
      // 使用相同的名称比较逻辑
      const nameA = String(a.nickname || a.username || '')

      const nameB = String(b.nickname || b.username || '')

      return nameA.localeCompare(nameB)
    })
  })

  return { groupOrder, groups }
}

export const getDeviceUUID = async () => {
  return await emitter.invoke('device_uuid')
}
export const toVdieo = async ({ type }: any) => {
  const config = JSON.stringify({
    parent: true,
    url: `/video?type=${type}`,
    autoSize: true,
    win: videoWindowsConfig
  })
  return await emitter.invoke('open-custom-window', config)
}
export const toRemote = async ({ type }: any) => {
  const windowsConfig = type === 'sender' ? remoteSenderWindowsConfig : remoteReceiverWindowsConfig
  const config = {
    parent: true,
    url: `/remote?type=${type}`,
    autoSize: type === 'sender',
    position: type === 'receiver' ? 'right-bottom' : '',
    win: windowsConfig
  }

  const configStr = JSON.stringify(config)
  return await emitter.invoke('open-custom-window', configStr)
}
