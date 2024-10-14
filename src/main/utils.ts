// main/utils.ts
import { BrowserWindow } from 'electron'
import path from 'path'

export interface CustomWindowOptions {
  width?: number
  height?: number
  resizable?: boolean
  movable?: boolean
  title?: string
  modal?: boolean
  parent?: BrowserWindow | undefined
  preload?: string
  url: string // 窗口加载的 URL
}

export const createCustomWindow = (options: CustomWindowOptions): BrowserWindow => {
  const {
    width = 800,
    height = 600,
    resizable = true,
    movable = true,
    title = 'Custom Window',
    modal = false,
    parent = null,
    preload = path.join(__dirname, 'preload.js'), // 如果有 preload 脚本
    url
  } = options

  const customWindow = new BrowserWindow({
    width,
    height,
    resizable,
    movable,
    title,
    modal,
    // @ts-ignore
    parent,
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  customWindow.loadURL(url) // 加载指定的 URL

  // 如果需要，添加窗口事件监听器
  customWindow.on('closed', () => {
    // 处理关闭事件
  })

  return customWindow
}
