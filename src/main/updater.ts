// import { join } from 'path'
import electronUpdater from 'electron-updater'
import { dialog } from 'electron'
import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { ipc,emitter } from './ipc'
import {logger} from "./winston";

const { autoUpdater } = electronUpdater
// 自动下载更新
autoUpdater.autoDownload = false
// 退出时自动安装更新
autoUpdater.autoInstallOnAppQuit = false
export const updater = () => {
  if (is.dev) return
  const checkForUpdates = () => {
    autoUpdater.checkForUpdates().catch((error) => {
      dialog.showMessageBox({
        type: 'error',
        title: 'Error checking for updates',
        message: error
      })
      logger.error(JSON.stringify(error))
    })
  }
  // 监听来自渲染进程的手动检查更新请求
  ipc.on('startForCheckUpdate', () => {
    checkForUpdates()
  })

  // 监听来自渲染进程的手动检查更新请求
  ipc.on('CheckForUpdates', () => {
    checkForUpdates()
  })
}

autoUpdater.on('update-available', (info) => {
  dialog
    .showMessageBox({
      type: 'info',
      title: '更新提示',
      message: `发现新版本 ${info.version}，是否更新？`,
      detail: info.releaseNotes ? `更新说明：${info.releaseNotes}` : '',
      buttons: ['更新', '取消'],
      cancelId: 1
    })
    .then((res) => {
      if (res.response === 0) {
        logger.info('开始下载更新...')
        // 开始下载更新
        autoUpdater.downloadUpdate()
      }
    })
})

// 没有新版本时
autoUpdater.on('update-not-available', () => {
  // dialog.showMessageBox({
  //   type: 'info',
  //   title: '更新提示',
  //   message: `当前版本 ${info.version} 已是最新版本`
  // })
})
// 监听下载进度
autoUpdater.on('download-progress', (prog) => {
  const win = BrowserWindow.getAllWindows()[0]
  logger.info(`网速：${prog.bytesPerSecond / 1000}，进度${prog.percent.toFixed(2)}%`)
  win.webContents.send('downloadProgress', {
    speed: Math.ceil(prog.bytesPerSecond / 1000), // 网速
    percent: Math.ceil(prog.percent) // 百分比
  })
  emitter.send(win.webContents, 'download-progress', {
    speed: Math.ceil(prog.bytesPerSecond / 1000), // 网速
    percent: Math.ceil(prog.percent) // 百分比
  })
})
// 更新下载完毕
autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: '更新已就绪',
      message: '更新已下载完成，是否立即安装？',
      buttons: ['是', '否'],
      cancelId: 1
    })
    .then((res) => {

      if (res.response === 0) {
        // 退出并安装更新
        autoUpdater.quitAndInstall()
      }
    })
})
