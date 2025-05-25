// main/utils.ts
import { BrowserWindow, screen } from 'electron'
import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { logger } from './winston'
import { mouse } from '@nut-tree/nut-js'

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

type PositionType = 'top' | 'bottom' | 'left' | 'right' | 'right-bottom'

export interface CustomWindowOptions {
  url: string
  parent: boolean
  win: WinType
  autoSize?: boolean
  position?: PositionType
}

const getPositionInfo = (options: CustomWindowOptions) => {
  const { width, height } = getScreenSize()

  if (options.position === 'right-bottom') {
    return {
      x: width - (options.win.width || 0) - 10, // 右边距10像素
      y: height - (options.win.height || 0) - 10 // 下边距10像素
    }
  }
  return null
}
export const getScreenSize = () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  console.log(primaryDisplay)
  return primaryDisplay.workAreaSize
}
export const getCoordinateAtio = (winId: string) => {
  const point = screen.getCursorScreenPoint()
  // 显示器大小
  const viceWindow = BrowserWindow.fromId(Number(winId))
  if (!viceWindow) return {}
  // 应用大小
  const { x: winx, y: winy, width, height } = viceWindow.getContentBounds()
  // 考虑 DPI 缩放
  const scaleFactor = screen.getDisplayNearestPoint(point).scaleFactor
  const scaledWidth = width * scaleFactor
  const scaledHeight = height * scaleFactor
  return {
    xAtio: (point.x - winx) / scaledWidth,
    yAtio: (point.y - winy) / scaledHeight
  }
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

  const config: any = { ...defaultValue, ...options.win }
  if (options.parent) {
    config.parent = parent
  }
  if (options.autoSize) {
    const { width, height } = getScreenSize()
    config.width = width * 0.6
    config.height = height * 0.6
  }
  const position = getPositionInfo(options)
  if (position) {
    config.x = position.x
    config.y = position.y
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
mouse.config.mouseSpeed = 0
const processingWindowsMouseMove = (data: any) => {
  const { width, height } = getScreenSize() // 获取被控端屏幕分辨率（如 1920x1080）

  // 计算鼠标的绝对坐标（未缩放）
  const unscaledX = data.xAtio * width
  const unscaledY = data.yAtio * height

  // 获取当前屏幕的 DPI 缩放比例
  const scaleFactor = screen.getDisplayNearestPoint({ x: unscaledX, y: unscaledY }).scaleFactor

  // 修正坐标（除以缩放比例）
  const scaledX = unscaledX * scaleFactor
  const scaledY = unscaledY * scaleFactor

  // 移动鼠标
  mouse.move([{ x: scaledX, y: scaledY }])
}
const processingWindowsMousedown = (data: any) => {
  processingWindowsMouseMove(data)
  mouse.leftClick()
}
const processingWindowsMousedownRight = (data: any) => {
  processingWindowsMouseMove(data)
  mouse.rightClick()
}
// 处理操作windows
export const processingWindows = (str: string) => {
  try {
    const data = JSON.parse(str)
    switch (data.type) {
      case 'mousemove':
        processingWindowsMouseMove(data)
        break
      case 'mousedownLeft':
        processingWindowsMousedown(data)
        break
      case 'mousedownRight':
        processingWindowsMousedownRight(data)
        break
      default:
        break
    }
  } catch (e) {
    logger.error(e)
  }
}
