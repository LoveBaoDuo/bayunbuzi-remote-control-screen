import WebRTCConnection from '/@/utils/WebRTCConnection'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'

class WebRtCConnectionRemote extends WebRTCConnection {
  private isLocalStream_: boolean = false
  private emitter

  constructor(option: any) {
    super(option)
    this.emitter = new IpcEmitter()
  }

  // 获取本地屏幕流流
  async getLocalStream() {
    if (!this.isLocalStream_) return null
    // 1. 获取屏幕源列表
    const sources = await this.emitter.invoke('get_screen_sources')
    const screenSource = sources[0]
    // 2. 通过主进程获取媒体流
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenSource.id
        }
      }
    }
    // 3.获取屏幕流
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints as any)
    // 添加本地流
    this.options.onLocalStream(this.localStream)
    return this.localStream
  }

  set isLocalStream(value: boolean) {
    this.isLocalStream_ = value
  }

  send(val: any) {
    if (this.dataChannel) {
      this.dataChannel.send(val)
    }
  }
}

export default WebRtCConnectionRemote
