import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { uuidv5 } from 'uuid'
import { CustomWindowOptions } from '../main/utils'
// Custom APIs for renderer
const api = {
  close: () => electronAPI.ipcRenderer.send('close'),
  toggleFullScreen: (isFullScreen) =>
    electronAPI.ipcRenderer.send('ToggleFullScreen', isFullScreen),
  minimize: () => electronAPI.ipcRenderer.send('minimize'),
  uniqueId: async () => {
    const NAMESPACE_DNS = 'U7ZE$nVm'
    const path = await electronAPI.ipcRenderer.invoke('appPath')
    return uuidv5(path, NAMESPACE_DNS)
  },
  set: (key, value) => {
    electronAPI.ipcRenderer.send('set', key, value)
  },
  get: async (key) => {
    return electronAPI.ipcRenderer.invoke('get', key)
  },
  createWindow: async (config: CustomWindowOptions) => {
    return electronAPI.ipcRenderer.invoke('open-custom-window', config)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
