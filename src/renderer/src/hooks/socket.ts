import { io, Socket } from 'socket.io-client'
import { MessageType, PayloadType } from '../layouts/type/MessageType'
// websockt链接
let socket: Socket
const socketConnect = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_WS_URL, {
      transports: ['websocket']
    })
  } else {
    socket.connect()
  }
  return new Promise((resolve, reject) => {
    const time = setTimeout(() => {
      reject()
    }, 20000)
    socket.on('connect', () => {
      clearTimeout(time)
      resolve(true)
    })
  })
}
// 基础链接成功回调
const baseConnect = async (callBack: () => any) => {
  if (socket && socket.connected) {
    callBack()
  } else {
    try {
      await socketConnect()
      callBack()
    } catch (e) {
      console.log('链接超时')
    }
  }
}

// 聊天socket
export const useSocket = ({ roomId, onMessage }: MessageType) => {
  const handleJoinStatus = () => {
    console.log('join success')
  }
  const handleConnect = () => {
    // 链接到房间
    socket.emit('joinRoom', { roomId })
    socket.on('joinStatus', handleJoinStatus)
    socket.on('message', onMessage)
  }
  const connect = () => baseConnect(handleConnect)

  const sendMessage = (payload: PayloadType) => {
    socket.emit('sendMessage', payload)
  }
  const disconnect = () => {
    if (!socket) return
    socket.off('joinStatus', handleJoinStatus)
    socket.off('message', onMessage)
  }
  onMounted(() => {
    connect()
  })
  return {
    connect,
    sendMessage,
    disconnect
  }
}

export interface CallPayloadType {
  sendUserId: string
  receiverId: string
  senderInfo?: any
  media: 'video' | 'audio'
  type: 'sender' | 'receiver'
}

// 视频-发起呼叫
export const useStartCallMedia = (callPayloadType: CallPayloadType) => {
  if (socket) {
    socket.emit('cell-media', callPayloadType)
  }
}
// 视频-呼叫socket
export const useCallMediaSocketCallback = ({ userId, onError, onCall }) => {
  const handleConnect = () => {
    //  处理呼叫信息
    socket.on(`bayunbuzi_public_channel_${userId}`, onCall)
    // 处理失败信息
    socket.on(`media-error`, onError)
  }
  const connect = () => baseConnect(handleConnect)
  const disconnect = () => {
    if (!socket) return
    socket.off(`media-error`, onError)
    socket.off(`media-error-${userId}`, onCall)
  }
  return {
    connect,
    disconnect
  }
}
// 视频-发送消息
export const useSendMediaInfo = (mediaInfo: { roomKey: string; data: any }) => {
  if (socket) {
    socket.emit('sendMideaMessage', mediaInfo)
  }
}
// 视频-socket
export const useMediaSocketCallback = ({ joinData, handleSignalingMessage }) => {
  const handleConnect = () => {
    socket.emit('joinVideoRoom', joinData)
    socket.on('media-message', handleSignalingMessage)
  }
  const connect = () => baseConnect(handleConnect)
  const disconnect = () => {
    if (!socket) return
    socket.off('media-message', handleSignalingMessage)
  }
  return {
    connect,
    disconnect
  }
}
