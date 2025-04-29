
export interface ContactChildrenType {
  title: string
  avatar: string
  phone?: string
  userId?: string
  friendId?: string
}

export interface ContactType {
  group: string
  type: string
  children: ContactChildrenType[]
}
