import { IpcListener, IpcEmitter } from '@electron-toolkit/typed-ipc/main'
import ElectronStore from 'electron-store'
import { desktopCapturer } from 'electron'
import { logger } from './winston'
import { getDeviceHostName } from './deviceInfo'
import { getCoordinateAtio, processingWindows } from './utils'

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
  return await getDeviceHostName()
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
ipc.handle('get_screen_sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window']
  })
  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL()
  }))
})
ipc.handle('coordinate_atio', (_, winId) => {
  return getCoordinateAtio(winId)
})
ipc.on('set_window_event', (_, data) => {
  processingWindows(data)
})
