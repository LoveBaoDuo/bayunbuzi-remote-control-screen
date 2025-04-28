<script setup lang="ts">
import Search from '/@/components/Search/index.vue'
import Avatar from '/@/components/Avatar/index.vue'
import NewFriends from './components/NewFriends.vue'
import FriendDetails from './components/FriendDetails.vue'
import GroupChatDetails from './components/GroupChatDetails.vue'
import MainContainer from '/@/layouts/components/MainContainer.vue'
import FriendSerachResult from './components/FriendSerachResult/index.vue'
import { ContactType } from './friends'
import Icon from '@renderer/components/Icon.vue'
import { onActivated, onDeactivated, reactive, shallowReactive } from '@vue/runtime-core'
import QueryUser from './components/QueryUser.vue'
import { useFriendsStore } from '/@/view/Friends/store'
import { storeToRefs } from 'pinia'

const useFriends = useFriendsStore()
const { friends } = storeToRefs(useFriends)
const current = shallowReactive<any>({
  component: null,
  data: {},
  index: ''
})
const searchOption = reactive({
  icon: 'serach',
  placeholder: '搜索',
  isAddFriend: false,
  searchStr: ''
})
const data: ContactType[] = [
  {
    group: '新的朋友',
    type: 'NewFriends',
    children: [
      {
        title: '新的朋友',
        avatar: ''
      }
    ]
  },
  {
    group: '群聊',
    type: 'GroupChatDetails',
    children: [
      {
        title: 'aaa',
        avatar: ''
      }
    ]
  }
]
const menuList = computed(() => {
  const temp: any = []
  for (const [key, value] of Object.entries(friends.value?.data)) {
    const children = value?.map((item: any) => ({
      title: item.nickname || item.username || '',
      avatar: item.avatar || '',
      ...item
    }))
    temp.push({
      group: key,
      type: 'FriendDetails',
      children: children
    })
  }
  return [...data, ...temp]
})
const handleAddtteam = () => {
  searchOption.icon = 'addteam'
  searchOption.placeholder = '昵称+手机号'
  searchOption.isAddFriend = true
  searchOption.searchStr = ''
}
const handleCloseAddtteam = () => {
  searchOption.icon = 'serach'
  searchOption.placeholder = '搜索'
  searchOption.isAddFriend = false
  searchOption.searchStr = ''
  resize()
}
const handleClick = (val: ContactType, index: string) => {
  current.data = val.children[0]
  current.index = index
  switch (val.type) {
    case 'NewFriends':
      current.component = NewFriends
      useFriends.getFriendRequestList()
      break
    case 'GroupChatDetails':
      current.component = GroupChatDetails
      break
    case 'FriendDetails':
      current.component = FriendDetails
      break
    case 'FriendSerachResult':
      current.component = FriendSerachResult
      current.data = {
        searchStr: searchOption.searchStr
      }
      searchOption.searchStr = ''
      break
    default:
      current.component = FriendDetails
  }
}
const handleInput = () => {}
const resize = () => {
  current.index = -1
  current.data = {}
  current.component = null
}
onActivated(() => {
  useFriends.getFriendList()
  searchOption.searchStr = ''
  searchOption.isAddFriend = false
})
onDeactivated(() => {
  resize()
})
</script>

<template>
  <div v-loading="friends.loading" class="h-full">
    <MainContainer>
      <template #menu>
        <div class="w-full no-drag">
          <div class="h-[60px] border-b-2 w-full">
            <Search
              v-model="searchOption.searchStr"
              :icon="searchOption.icon"
              :placeholder="searchOption.placeholder"
              @input="handleInput"
            >
              <template #after>
                <button
                  v-if="!searchOption.isAddFriend"
                  class="px-1 ml-2 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
                  tabindex="200"
                  data-key="add"
                  style="-webkit-app-region: no-drag; pointer-events: auto"
                  @click="handleAddtteam"
                >
                  <Icon :size="20" color="#9ca3af" name="addteam" />
                </button>
                <button
                  v-else
                  data-key="close"
                  class="w-10 text-xs text-center leading-6"
                  @click="handleCloseAddtteam"
                >
                  取消
                </button>
              </template>
            </Search>
          </div>
          <QueryUser
            v-if="!!searchOption.searchStr"
            :search-str="searchOption.searchStr"
            @search="
              handleClick(
                {
                  type: 'FriendSerachResult',
                  group: '',
                  children: []
                },
                '-1'
              )
            "
          />
          <el-scrollbar  v-if="!searchOption.searchStr" height="calc(100vh - 60px)">
            <el-menu class="!border-none">
              <div
                :class="{ 'border-b': menuList.length !== index + 1 }"
                v-for="(item, index) in menuList"
                :key="item.group"
              >
                <p class="pl-2 pt-2 pb-2 text-xs">{{ item.group }}</p>
                <template v-for="(subitem, subIndex) in item.children" :key="subIndex">
                  <el-menu-item
                    class="!px-2"
                    :index="`${index}:${subIndex}`"
                    @click="
                      handleClick(
                        {
                          ...item,
                          children: [subitem]
                        },
                        `${index}:${subIndex}`
                      )
                    "
                  >
                    <Avatar class="!h-8 !w-8 !leading-8 !ml-0" :nickname="subitem.title" />
                    <span class="ml-3">{{ subitem.title }}</span>
                  </el-menu-item>
                </template>
              </div>
            </el-menu>
          </el-scrollbar>
        </div>
      </template>
      <template #container>
        <component v-if="current.component" :is="current.component" :data="current.data" />
      </template>
    </MainContainer>
  </div>
</template>

<style scoped></style>
