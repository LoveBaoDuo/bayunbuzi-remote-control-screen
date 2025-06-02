import { screen } from 'electron'
import { logger } from '../winston'
import { mouse, keyboard, Key } from '@nut-tree/nut-js'
import { multiply } from 'mathjs'
import { getScreenSize } from '../utils'
import { keymap } from './keyMap'

mouse.config.mouseSpeed = 0
mouse.config.autoDelayMs = 0
keyboard.config.autoDelayMs = 10
// 获取坐标比
export const getCoordinateAtio = (option: {
  winId: string
  x: number
  y: number
  width: number
  height: number
}) => {
  // const point = screen.getCursorScreenPoint()
  // 考虑 DPI 缩放
  const scaleFactor = screen.getDisplayNearestPoint({ x: option.x, y: option.y }).scaleFactor
  const scaledWidth = multiply(option.width, scaleFactor)
  const scaledHeight = multiply(option.height - 40, scaleFactor)
  // 防止除零错误和越界
  const safeWidth = Math.max(1, scaledWidth)
  const safeHeight = Math.max(1, scaledHeight)
  // 返回标准化比例（限制在0-1范围）
  return {
    xAtio: Math.min(1, Math.max(0, option.x / safeWidth)),
    yAtio: Math.min(1, Math.max(0, option.y / safeHeight))
  }
}

// 处理鼠标移动
const processingWindowsMouseMove = (data: any) => {
  const { width, height } = getScreenSize() // 获取被控端屏幕分辨率（如 1920x1080）
  logger.info({ ...data, message: '坐标比例' })
  // 计算鼠标的绝对坐标（未缩放）
  const unscaledX = data.xAtio * width
  const unscaledY = data.yAtio * height
  //
  // 获取当前屏幕的 DPI 缩放比例
  const scaleFactor = screen.getDisplayNearestPoint({ x: unscaledX, y: unscaledY }).scaleFactor
  logger.info({ x: unscaledX, y: unscaledY, message: '缩放比例前' })
  // 修正坐标（乘以缩放比例）
  const scaledX = unscaledX * scaleFactor
  const scaledY = unscaledY * scaleFactor
  logger.info({ x: scaledX, y: scaledY, message: '缩放比例后' })
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
// 处理鼠标滚轮滚动
const processingWhell = async (data: any) => {
  // 获取水平滚动量
  const deltaX = data.deltaX
  if (deltaX > 0) {
    // 水平滚动 - 向右滚动
    await mouse.scrollRight(deltaX)
  } else if (deltaX < 0) {
    // 水平滚动 - 向左滚动
    await mouse.scrollLeft(Math.abs(deltaX))
  }

  // 获取垂直滚动量
  const deltaY = data.deltaY
  if (deltaY > 0) {
    // 垂直滚动 - 向下滚动
    await mouse.scrollDown(deltaY)
  } else if (deltaY < 0) {
    // 垂直滚动 - 向上滚动
    await mouse.scrollUp(Math.abs(deltaY))
  }
}
// 处理键盘
const processingKeyDown = async (data: any) => {
   try{
     // 按下C (复制快捷键)
     await keyboard.pressKey(keymap.get(data.code) as Key)
     //
     // // 释放C
     await keyboard.releaseKey(keymap.get(data.code) as Key)
   }catch (e) {
     logger.error(JSON.stringify(e))
   }
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
      case 'wheel':
        processingWhell(data)
        break
      case 'keydown':
        processingKeyDown(data)
        break
      default:
        break
    }
  } catch (e) {
    logger.error(e)
  }
}
