// import { join } from 'path'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater
// // 定义 GitHub 仓库的更新 URL
// const feedURL = `https://github.com/LoveBaoDuo/bayunbuzi-remote-control-screen/releases/latest`
//
// autoUpdater.setFeedURL({
//   url: feedURL
// } as any)

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info)
})

autoUpdater.on('update-not-available', () => {
  console.log('No updates available')
})

autoUpdater.on('error', (err) => {
  console.error('Error in auto-updater:', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Downloading update...'
  log_message = log_message + progressObj.percent + '%'
  console.log(log_message)
})

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded')
  // // 弹出对话框提醒用户重新启动应用
  // dialog.showMessageBox({
  //   type: 'info',
  //   title: 'Update Available',
  //   message: 'A new version has been downloaded. Restart the app to apply the update.',
  //   buttons: ['Restart', 'Later']
  // }).then((result) => {
  //   if (result.response === 0) {
  //     autoUpdater.quitAndInstall();
  //   }
  // });
})
// 检查更新
export const checkUpdate = () => {
  // 检查更新
  autoUpdater.checkForUpdatesAndNotify()
}
