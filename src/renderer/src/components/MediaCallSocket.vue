<script setup lang="ts">
import { useCallMediaSocketCallback } from '/@/hooks/socket'
import { useUserStore } from '/@/store/user.store'
import { existWind, toVdieo, toRemote } from '/@/utils'

const userData = useUserStore()
const handleOnError = (val: any) => {
  console.log(val)
}
let videoWinId = ''
const openScanner = (data: any) => {
  console.log(data)
  if (data?.classType === 'remote') {
    return toRemote({ type: data.type })
  } else {
    return toVdieo({ type: data.type })
  }
}
const handleOnCall = async (data: {
  roomKey: string
  type: 'sender' | 'receiver'
  classType: string
}) => {
  localStorage.setItem('MEDIA_SENDER_INFO', JSON.stringify(data))
  const flag = await existWind(videoWinId)
  if (flag) return
  if (data.type === 'receiver') {
    videoWinId = await openScanner({ type: 'receiver', classType: data.classType })
  } else {
    videoWinId = await openScanner({ type: 'sender', classType: data.classType })
  }
}
watch(
  () => userData.getUserId,
  () => {
    const { connect } = useCallMediaSocketCallback({
      userId: userData.getUserId as string,
      onError: handleOnError,
      onCall: handleOnCall
    })
    connect()
  }
)
</script>

<template>
  <div></div>
</template>

<style scoped></style>
