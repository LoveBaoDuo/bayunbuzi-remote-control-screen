import { useSendMediaInfo } from '/@/hooks/socket'

const defaultOptions = {
  roomKey: '',
  iceServers: [
    { urls: import.meta.env.VITE_API_STUN_URL }, // 默认STUN
    // TURN 示例（需替换成你的Coturn服务器）
    {
      urls: import.meta.env.VITE_API_TURN_URL,
      username: import.meta.env.VITE_API_TURN_USERNAME,
      credential: import.meta.env.VITE_API_TURN_PASSWORD
    }
  ],
  onRemoteStream: (stram: MediaStream) => {
    console.log('远程流', stram)
  },
  onLocalStream: (stram: MediaStream) => {
    console.log('本地流', stram)
  },
  onDataChannelMessage: (data: string) => {
    console.log('数据通道信息', data)
  },
  onConnectionStateChange: (state: string) => {
    console.log('链接状态', state)
  },
  onIceCandidate: (candidate: RTCIceCandidate) => {
    console.log('ICE候选信息', candidate)
  },
  onGetMediaError: (str: string) => {
    console.log(str)
  }
}
// new（新建）、connecting（连接中）、connected（已连接）、disconnected（已断开连接）、failed（连接失败）或 closed（已关闭）
export type ConnectionState =
  | 'closed'
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'failed'
  | 'new'

export interface WebRTCOptionType {
  roomKey?: string
  iceServers?: any[]
  onRemoteStream?: (stram: MediaStream) => any
  onLocalStream?: (stram: MediaStream) => any
  onDataChannelMessage?: (data: any) => any
  onConnectionStateChange?: (state: ConnectionState) => any
  onIceCandidate?: (candidate: RTCIceCandidate) => any
  onGetMediaError?: (str: string) => any
}

class WebRTCConnection {
  //  WebRTC 连接实例
  private peerConnection: RTCPeerConnection | null = null
  private readonly options: any
  // 远程流
  private remoteStream: MediaStream | null = null
  // 本地流
  private localStream: MediaStream | null = null
  // 数据传输渠道
  private dataChannel: RTCDataChannel | null = null

  constructor(options?: WebRTCOptionType) {
    if (options === null) {
      this.options = { ...defaultOptions }
    } else {
      this.options = { ...defaultOptions, ...options }
    }
  }

  // 初始化 PeerConnection
  async init(initiator = false) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: this.options.iceServers
    })

    // 当接收到新的 ICE 候选者时触发。
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({ type: 'ice-candidate', candidate: event.candidate })
        this.options.onIceCandidate(event.candidate)
      }
    }

    // 监听远程流
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      console.log(event)
      this.options.onRemoteStream(this.remoteStream)
    }

    // 监听连接状态
    this.peerConnection.onconnectionstatechange = () => {
      // connectionState:  new（新建）、connecting（连接中）、connected（已连接）、disconnected（已断开连接）、failed（连接失败）或 closed（已关闭）
      this.options.onConnectionStateChange(this.peerConnection?.connectionState)
    }

    // 如果是发起方，创建 DataChannel（可选）
    if (initiator) {
      // 创建数据传输渠道
      this.dataChannel = this.peerConnection?.createDataChannel('chat')
      this.dataChannel.onmessage = (event) => {
        this.options.onDataChannelMessage(event.data)
      }
    } else {
      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel
        this.dataChannel.onmessage = (event) => {
          this.options.onDataChannelMessage(event.data)
        }
      }
    }
  }

  // 获取本地媒体流（摄像头+麦克风）
  async getLocalStream() {
    const enumerator = await navigator.mediaDevices.enumerateDevices()
    const hasAudio = enumerator.some((d) => d.kind === 'audioinput')
    const hasVideo = enumerator.some((d) => d.kind === 'videoinput')
    if (!hasAudio && !hasVideo) {
      this.options.onGetMediaError('未找到摄像头或者麦克风，请检查是否存在设备或者设备被占用')
      return null
    }
    // 根据设备情况请求媒体流
    const constraints = {
      audio: hasAudio,
      video: hasVideo
    }
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
    console.log(this.localStream)
    // 添加本地流
    this.options.onLocalStream(this.localStream)
    return this.localStream
  }

  // 添加本地流到 PeerConnection
  async addLocalStream() {
    if (!this.localStream) await this.getLocalStream()
    this.localStream?.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, this.localStream as MediaStream)
    })
  }

  // 创建 Offer（发起方调用） 媒体协商
  async createOffer() {
    await this.addLocalStream()
    const offer = await this.peerConnection?.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true // 关键设置
    })
    await this.peerConnection?.setLocalDescription(offer)
    this.sendSignalingMessage({ type: 'offer', offer })
  }

  // 处理 Answer（接收方调用）媒体协商
  async handleAnswer(answer) {
    await this.peerConnection?.setRemoteDescription(answer)
  }

  // 处理 Offer（接收方调用）
  async handleOffer(offer) {
    await this.addLocalStream()
    await this.peerConnection?.setRemoteDescription(offer)
    const answer = await this.peerConnection?.createAnswer()
    await this.peerConnection?.setLocalDescription(answer)
    this.sendSignalingMessage({ type: 'answer', answer })
  }

  // 处理 ICE Candidate 每个ICE Candidate代表一个可能的通信路径（如本地IP、公网IP、中继服务器地址等），包含协议（UDP/TCP）、IP地址、端口和类型（主机/反射/中继候选）。
  async handleIceCandidate(candidate) {
    if (candidate) {
      await this.peerConnection?.addIceCandidate(candidate)
    }
  }

  // 发送信令消息（WebSocket）
  sendSignalingMessage(message: any) {
    useSendMediaInfo({ roomKey: this.options.roomKey, data: message })
  }

  // 处理信令消息（WebSocket）
  handleSignalingMessage(message: any) {
    switch (message.type) {
      case 'offer':
        this.handleOffer(message.offer)
        break
      case 'answer':
        this.handleAnswer(message.answer)
        break
      case 'ice-candidate':
        this.handleIceCandidate(message.candidate)
        break
      case 'close':
        this.close()
        break
      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  // 关闭连接
  close() {
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track?.stop())
    }
  }
}

export default WebRTCConnection
