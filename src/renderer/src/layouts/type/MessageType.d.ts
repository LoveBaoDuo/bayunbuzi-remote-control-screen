export interface PayloadType {
  roomId: string | number
  userId: string | number
  sendUserId: string | number
  message: {
    text: string
    type: string
  }
}

export interface MessageType {
  roomId: string | number
  userId: string | number

  onMessage(payload: PayloadType): any
}
