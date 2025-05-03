<script setup lang="ts">
import { useCallMediaSocketCallback } from '/@/hooks/socket'
import { useUserStore } from '/@/store/user.store'
import { existWind, toVdieo } from '/@/utils'

const userData = useUserStore()
const handleOnError = (val: any) => {
  console.log(val)
}
let videoWinId = ''
const handleOnCall = async (data: { roomKey: string; type: 'sender' | 'receiver' }) => {
  localStorage.setItem('MEDIA_SENDER_INFO',JSON.stringify(data))
  const flag = await existWind(videoWinId)
  if (flag) return
  if (data.type === 'receiver') {
    videoWinId = await toVdieo({ type: 'receiver' })
  } else {
    videoWinId = await toVdieo({ type: 'sender' })
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
