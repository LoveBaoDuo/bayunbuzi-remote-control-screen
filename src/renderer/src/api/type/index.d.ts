export interface ResultType<T> {
  code: string | number
  msg: string
  data?: T
}
