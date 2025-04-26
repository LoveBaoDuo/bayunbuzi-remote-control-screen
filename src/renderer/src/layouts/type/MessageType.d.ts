export interface ContentType{
  id?: string;
  content: string;
  type: '0' | '1',
  userId: string
}

export interface PayloadType {
  roomId: string | number;
  // 业务数据
  content: ContentType[];
}
export interface SuccessType {
  code: 0 | 1
  data: any,
  msg: string,
}
export interface MessageType {
  roomId: string | number
  onMessage(payload: SuccessType): any
}
