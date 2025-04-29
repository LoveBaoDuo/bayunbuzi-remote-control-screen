<script setup lang="ts">
import { userUserInfo } from '/@/hooks'

const editor = ref<any>(null)
const emits = defineEmits<{
  (e: 'send', message: Array<any>): void
}>()
const insertNode = (dom) => {
  // 获取光标
  const selection = window.getSelection()
  if (!selection) {
    return
  }
  // 获取选中的内容
  const range = selection.getRangeAt(0)
  // 删除选中的内容
  range?.deleteContents()
  // 将节点插入范围最前面添加节点
  range.insertNode(dom)
  // 将光标移到选中范围的最后面
  selection.collapseToEnd()
  setTimeout(() => {
    editor.value?.focus()
  }, 100)
}
const handleImage = (imageFile: any) => {
  // 创建文件读取器
  const reader = new FileReader()
  // 读取完成
  reader.onload = (e) => {
    // 创建img标签
    const img = new Image()
    img.classList.add('max-w-[120px]')
    img.classList.add('max-h-[120px]')
    img.src = e.target?.result as any
    // editor.value.appendChild(img)
    insertNode(img)
  }

  reader.readAsDataURL(imageFile)
}
const handlePaste = (e) => {
  const files = e.clipboardData.files
  const filesLen = files.length
  //禁止默认事件
  e.preventDefault()
  // 粘贴内用是否存在文件
  if (filesLen > 0) {
    for (let i = 0; i < filesLen; i++) {
      const file = files[i]
      if (file.type.indexOf('image') === 0) {
        // 粘贴的文件为图片
        handleImage(file)
        continue
      }
    }
  } else {
    insertNode(document.createTextNode(e.clipboardData.getData('text')))
    // console.log(e.clipboardData.getData('text'))
  }
}

const handelEmoijSend = async (emoji: any) => {
  editor.value?.focus()
  insertNode(document.createTextNode(emoji.unicode))

  // editor.value?.focus()
}
// 发送消息
const sendMessage = async () => {
  const childNodes = editor.value.childNodes
  if (!childNodes || childNodes.length === 0) return
  const { userId } = await userUserInfo()
  const messageList: Record<string, any>[] = []
  let finalMessage = ''
  childNodes.forEach((dom) => {
    if (dom.nodeName === 'IMG') {
      messageList.push({
        content: finalMessage,
        userId: userId,
        type: '0'
      })
      messageList.push({
        content: dom.src,
        userId: userId,
        type: '1'
      })
      finalMessage = ''
    } else if (dom.nodeName === '#text' && dom.textContent !== '') {
      finalMessage += dom.textContent
    }
  })
  if (finalMessage.length > 0) {
    messageList.push({
      content: finalMessage,
      userId: userId,
      type: '0'
    })
    finalMessage = ''
  }
  emits('send', messageList)
  // 清空输入框
  editor.value.innerHTML = ''
}
const handelInputEdit = () => {
  if (editor.value?.innerHTML === '<br>') {
    editor.value.innerHTML = ''
  }
}
const handleClick = () => {
  editor.value?.focus()
}
</script>

<template>
  <div class="h-36 border-t-2">
    <div class="h-[24px] px-2">
      <ByEmojiPicker @send-message="handelEmoijSend" />
      <!--          <emoji-picker></emoji-picker>-->
    </div>
    <el-scrollbar style="height: 90px" @click="handleClick">
      <div
        class="editbox w-full cursor-pointer h-[90px] min-h-[20px] focus:outline-none px-2 py-1 flex flex-wrap text-wrap break-words"
        ref="editor"
        contenteditable="true"
        placeholder="输入消息..."
        style="min-height: 20px"
        @input="handelInputEdit"
        @paste="handlePaste"
        @click="handleClick"
        @keydown.enter="sendMessage"
      ></div>
    </el-scrollbar>
    <div class="flex justify-end" style="height: calc(100vh - 40px)">
      <el-button class="mr-2" type="primary" size="small" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.editbox:empty::before {
  content: '输入消息...';
  color: #999;
}
</style>
