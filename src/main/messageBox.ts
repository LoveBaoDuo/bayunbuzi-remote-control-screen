export const MessageBox = ({
  title = '温馨提示',
  content = '内容',
  closeText = '取消',
  confirmText = '确定',
  onClose = () => {},
  onConfirm = () => {}
}) => {
  const mark = document.createElement('div')
  const div = document.createElement('div')
  const head = document.createElement('div')
  const titleEl = document.createElement('span')
  const i = document.createElement('i')
  const contentEl = document.createElement('div')
  const buttonContainer = document.createElement('div')
  const cancelBtn = document.createElement('button')
  const confirmBtn = document.createElement('button')
  titleEl.innerText = title
  titleEl.className = 'font-bold'
  i.className = 'iconfont icon-close cursor-pointer'
  i.onclick = () => mark.remove()
  head.className = 'flex justify-between items-center h-[40px] px-[10px] border-b border-gray-200'
  contentEl.className =
    'flex flex-col items-start justify-center h-[calc(100%-80px)] px-[10px] text-center'
  contentEl.innerText = content
  buttonContainer.className =
    'flex justify-end items-center h-[40px] px-[10px] border-t border-gray-200'
  cancelBtn.className =
    'px-[5px] py-[2px] mx-[5px] rounded-md border border-gray-200 text-sm cursor-pointer'
  cancelBtn.innerText = closeText
  cancelBtn.onclick = () => {
    onClose()
    mark.remove()
  }
  confirmBtn.className =
    'px-[5px] py-[2px] mx-[5px] rounded-md border border-gray-200 bg-blue-500 text-white text-sm cursor-pointer'
  confirmBtn.innerText = confirmText
  confirmBtn.onclick = () => {
    onConfirm()
    mark.remove()
  }
  div.className =
    'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[40vw] h-[35vh] bg-white text-black rounded-md shadow-2xl z-[99999]'
  mark.className = 'fixed top-0 left-0 w-full h-full bg-black/50 z-[99999]'

  head.append(titleEl)
  head.append(i)
  buttonContainer.append(cancelBtn)
  buttonContainer.append(confirmBtn)
  div.append(head)
  div.append(contentEl)
  div.append(buttonContainer)
  mark.append(div)
  document.body.append(mark)
  // setTimeout(() => {
  //   mark.remove()
  // }, duration)
}
export const Message = ({ message = '内容', type = 'info', duration = 300000 }) => {
  const div = document.createElement('div')
  const messageEl = document.createElement('span')
  const colse = document.createElement('i')
  const icon = document.createElement('i')
  if (type === 'info') {
    icon.className = 'iconfont icon-gantanhao px-2 !text-2xl'
  }
  messageEl.innerText = message
  messageEl.className = 'font-bold flex-1'
  colse.className = 'iconfont icon-close cursor-pointer px-2'
  colse.onclick = () => div.remove()
  div.className =
    'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-between items-center w-[20vw] h-[10vh] bg-white text-black rounded-md shadow-2xl z-[99999]'
  div.append(icon)
  div.append(messageEl)
  div.append(colse)
  document.body.append(div)
  setTimeout(() => {
    div.remove()
  }, duration)
}
