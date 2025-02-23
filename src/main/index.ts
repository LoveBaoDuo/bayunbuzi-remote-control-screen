import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { globalShortcut } from 'electron'
import { createCustomWindow } from './utils'
import { ipc } from './ipc'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/main'
import electronUpdater from 'electron-updater'
const { autoUpdater } = electronUpdater
// import { IpcEmitter } from '@electron-toolkit/typed-ipc/main';
// 创建 IpcSender 实例
const ipcSender = new IpcEmitter()

let mainWindow
const wins = new Map()
ipc.handle('open-custom-window', async (_, arg) => {
  const win = await createCustomWindow(JSON.parse(arg), mainWindow)
  wins.set(win.id, win)
  return win.id
})
ipc.on('close', (event, id: string) => {
  if (id) {
    const win = wins.get(id)
    if (win) {
      win.hide()
      win.close()
    }
    return
  }
  const webContents = event.sender // 获取 WebContents 对象
  const window = BrowserWindow.fromWebContents(webContents) // 从 WebContents 获取 BrowserWindow 实例
  if (window) {
    window.hide()
    window.close()
  }
})
ipc.on('restart_app', () => {
  autoUpdater.quitAndInstall()
})

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 480,
    show: false,
    frame: false, // 设置无边框
    transparent: true, // 设置窗口透明
    backgroundColor: '#00000000',
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  checkUpdate()
}

// 快捷键注册
function registryShortcut() {
  globalShortcut.register('CommandOrControl+J+K', () => {
    // 获取当前窗口
    BrowserWindow.getFocusedWindow()?.webContents.openDevTools()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // 全屏切换
  ipcMain.on('ToggleFullScreen', (event, isFullScreen) => {
    const webContents = event.sender // 获取 WebContents 对象
    const window = BrowserWindow.fromWebContents(webContents) // 从 WebContents 获取 BrowserWindow 实例
    if (window) {
      window.setFullScreen(isFullScreen) // 切换全屏状态
    }
  })

  // 最小化
  ipcMain.on('minimize', (event) => {
    const webContents = event.sender // 获取 WebContents 对象
    const window = BrowserWindow.fromWebContents(webContents) // 从 WebContents 获取 BrowserWindow 实例
    if (window) {
      window.minimize()
    }
  })
  // 获取应用路径
  ipcMain.handle('appPath', () => {
    return app.getAppPath()
  })
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // // 创建自定义窗口
  // ipcMain.handle('open-custom-window', (_, config: string) => {
  //   return createCustomWindow(JSON.parse(config), mainWindow)
  // })
  createWindow()
  registryShortcut()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
// 检查更新
export const checkUpdate = () => {
  console.log(mainWindow)
  const win = BrowserWindow.getAllWindows()[0]
  // 检查更新
  autoUpdater.checkForUpdatesAndNotify()
  // 自动更新相关事件
  autoUpdater.on('update-available', () => {
    ipcSender.send(win.webContents, 'update_available')
  })

  autoUpdater.on('update-downloaded', () => {
    ipcSender.send(win.webContents, 'update_downloaded')
  })
}
