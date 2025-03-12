
export interface ContactChildrenType {
  title: string
  avatar: string
}

export interface ContactType {
  group: string
  type: string
  children: ContactChildrenType[]
}
