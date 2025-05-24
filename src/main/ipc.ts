import { IpcListener, IpcEmitter } from '@electron-toolkit/typed-ipc/main'
import ElectronStore from 'electron-store'
import { logger } from './winston'
import { getDeviceUUID } from './deviceInfo'

const store = new ElectronStore()
export const ipc = new IpcListener()
export const emitter = new IpcEmitter()
// 保存数据
ipc.on('store_set', (_, key, data) => {
  if (!data) return
  // @ts-ignore
  store.set(key, data)
})
// 获取应用数据
ipc.handle('store_get', (_, key) => {
  // @ts-ignore
  return store.get(key)
})
ipc.handle('device_uuid', async () => {
  return await getDeviceUUID()
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
