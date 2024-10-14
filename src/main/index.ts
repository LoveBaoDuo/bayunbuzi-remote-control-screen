import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import { globalShortcut } from 'electron'
import {createCustomWindow, CustomWindowOptions} from "./utils";
// import { createCustomWindow, CustomWindowOptions} from './utils'

const store = new Store()

function createWindow(): void {
  // Create the browser window.
 const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
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
  // 保存数据
  ipcMain.on('set', (_, key, data) => {
    store.set(key, data)
  })
  // 获取应用数据
  ipcMain.handle('get', (_, key) => {
    return store.get(key)
  })
  // 获取应用路径
  ipcMain.handle('appPath', () => {
    return app.getAppPath()
  })
  // 退出应用
  ipcMain.on('close', () => {
    app.quit()
  })
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()
  // 创建自定义窗口
  ipcMain.handle('open-custom-window', (_, config: CustomWindowOptions) => {
    // {
    //   url,
    //     width: 600,
    //   height: 400,
    //   title: 'Custom Popup',
    //   parent: mainWindow, // 设为主窗口的子窗口
    //   modal: true // 模态窗口
    // }
    // config.parent =
    return  createCustomWindow(config)
  })
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
