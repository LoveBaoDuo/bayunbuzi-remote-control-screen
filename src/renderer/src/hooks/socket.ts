import { io, Socket } from 'socket.io-client'
import { MessageType, PayloadType } from '../layouts/type/MessageType'
// websockt链接
let socket: Socket
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
  const connect = () => {
    if (!socket) {
      socket = io(import.meta.env.VITE_API_WS_URL, {
        transports: ['websocket']
      })
    } else {
      socket.connect()
    }
    socket.on('connect', handleConnect)
  }

  const disconnect = () => {
    if (!socket) return
    socket.disconnect()
    socket.removeAllListeners()
  }
  const sendMessage = (payload: PayloadType) => {
    socket.emit('sendMessage', payload)
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
