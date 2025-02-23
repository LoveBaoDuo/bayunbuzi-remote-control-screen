// import { contextBridge } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'
// import { v5 as uuidv5 } from 'uuid';
import { exposeElectronAPI } from '@electron-toolkit/preload'
exposeElectronAPI() // 将 Electron API 暴露给渲染进程

