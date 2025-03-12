import { io } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { MessageType, PayloadType } from '../layouts/type/MessageType'

export const useSocket = ({ roomId, userId, onMessage }: MessageType) => {
  const socket = io('ws://localhost:8099', {
    transports: ['websocket'],
  })

  onMounted(() => {
    socket.on('connect', () => {
      socket.emit('joinRoom', { roomId, userId })
      socket.on('message', onMessage)
    })
  })
  onUnmounted(() => {
    socket.disconnect()
  })
  const sendMessage = (payload: PayloadType) => {
    socket.emit('message', payload)
  }
  return {
    sendMessage
  }
}
