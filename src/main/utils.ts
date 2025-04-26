// main/utils.ts
import { BrowserWindow } from 'electron'
import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'

interface WinType {
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

export interface CustomWindowOptions {
  url: string
  parent: boolean
  win: WinType
}

export const createCustomWindow = async (
  options: CustomWindowOptions,
  parent: BrowserWindow
): Promise<BrowserWindow> => {
  const defaultValue = {
    width: 900,
    height: 670,
    show: false,
    frame: false, // 设置无边框
    transparent: true, // 设置透明
    backgroundColor: '#00000000',
    icon,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.mjs'), // 如果有 preload 脚本
      sandbox: false
    }
  }

  const config = { ...defaultValue, ...options.win }
  if (options.parent) {
    config.parent = parent
  }
  const customWindow = new BrowserWindow(config)
  customWindow.once('ready-to-show', () => {
    customWindow.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    await customWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#' + options.url)
  } else {
    await customWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: options.url
    })
  }
  // 关闭右键菜单
  customWindow.hookWindowMessage(278, () => {
    customWindow.setEnabled(false)
    setTimeout(() => {
      customWindow.setEnabled(true)
    }, 100)
    // e.setEnabled(false) // 窗口禁用
    return true
  })

  return customWindow
}
