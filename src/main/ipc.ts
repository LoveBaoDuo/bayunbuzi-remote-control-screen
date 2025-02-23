import { IpcListener } from '@electron-toolkit/typed-ipc/main'
import ElectronStore from 'electron-store'
import { logger } from './winston'
const store = new ElectronStore()
export const ipc = new IpcListener()

// 保存数据
ipc.on('store_set', (_, key, data) => {
  console.log(key, data)
  if (!data) return
  // @ts-ignore
  store.set(key, data)
})
// 获取应用数据
ipc.handle('store_get', (_, key) => {
  // @ts-ignore
  return store.get(key)
})
// 删除应用数据
ipc.on('store_del', (_, key) => {
  // @ts-ignore
  store.delete(key)
})
ipc.on('info', (_, data) => {
  logger.info(data)
})

ipc.on('error', (_, data) => {
  logger.error(data)
})

ipc.on('log', (_, data) => {
  logger.log(data)
})
