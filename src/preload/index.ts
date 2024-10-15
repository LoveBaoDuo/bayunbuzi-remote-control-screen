// import { contextBridge } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'
// import { v5 as uuidv5 } from 'uuid';
import { exposeElectronAPI } from '@electron-toolkit/preload';

exposeElectronAPI();  // 将 Electron API 暴露给渲染进程

// Custom APIs for renderer
// const api = {
//   // close: () => electronAPI.ipcRenderer.send('close'),
//   toggleFullScreen: (isFullScreen) =>
//     electronAPI.ipcRenderer.send('ToggleFullScreen', isFullScreen),
//   minimize: () => electronAPI.ipcRenderer.send('minimize'),
//   uniqueId: async () => {
// // 定义命名空间，UUID v5 需要一个命名空间
//     const MY_NAMESPACE = uuidv5('https://example.com', uuidv5.DNS);
//     const path = await electronAPI.ipcRenderer.invoke('appPath')
//     try {
//       return uuidv5(path, MY_NAMESPACE )
//     } catch (error) {
//       console.log(error)
//     }
//
//   },
//   set: (key, value) => {
//     electronAPI.ipcRenderer.send('set', key, value)
//   },
//   get: async (key) => {
//     return electronAPI.ipcRenderer.invoke('get', key)
//   },
//   createWindow: async (config: string) => {
//     return electronAPI.ipcRenderer.invoke('open-custom-window', config)
//   }
// }

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
// if (process.contextIsolated) {
//   try {
//     contextBridge.exposeInMainWorld('electron', electronAPI)
//     contextBridge.exposeInMainWorld('api', api)
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   // @ts-ignore (define in dts)
//   window.electron = electronAPI
//   // @ts-ignore (define in dts)
//   window.api = api
// }
