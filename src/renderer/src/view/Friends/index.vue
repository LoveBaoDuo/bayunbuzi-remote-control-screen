<script setup lang="ts">
import Search from '/@/components/Search/index.vue'
import Avatar from '@renderer/layouts/components/Avatar/index.vue'
import NewFriends from './components/NewFriends.vue'
import FriendDetails from './components/FriendDetails.vue'
import GroupChatDetails from './components/GroupChatDetails.vue'
import MainContainer from '/@/layouts/components/MainContainer.vue'
import { ContactType } from './friends'

const current = reactive<any>({
  component: NewFriends,
  data: {},
  index: '',
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
      },
      {
        title: '333',
        avatar: ''
      }
    ]
  },
  {
    group: 'B',
    type: 'FriendDetails',
    children: [
      {
        title: 'bbb',
        avatar: ''
      },
      {
        title: '222',
        avatar: ''
      }
    ]
  },
  {
    group: 'C',
    type: 'FriendDetails',
    children: [
      {
        title: 'ccc',
        avatar: ''
      }
    ]
  }
]
const handleClick = (val: ContactType,index: string) => {
  current.data = val.children[0]
  current.index = index
  switch (val.type) {
    case 'NewFriends':
      current.component = NewFriends
      break
    case 'GroupChatDetails':
      current.component = GroupChatDetails
      break
    case 'FriendDetails':
      current.component = FriendDetails
    default:
      current.component = FriendDetails
  }
}
</script>

<template>
  <div class="h-full">
    <MainContainer>
      <template #menu>
        <div class="h-[60px] border-b-2" style="-webkit-app-region: no-drag">
          <Search />
        </div>
        <ul class="mt-5">
          <li class="border-b" v-for="(item, index) in data" :key="item.group">
            <p class="pl-2 text-xs">{{ item.group }}</p>
            <ul>
              <li
                v-for="(subitem, subIndex) in item.children"
                :class="['flex items-center h-12 pl-2 hover:bg-[#dfdcda]/70', `${index}:${subIndex}` === current.index ? 'bg-[#dfdcda]/70' : '']"
                :key="subIndex"
                style="-webkit-app-region: no-drag"
                @click="
                  handleClick({
                    ...item,
                    children: [subitem]
                  }, `${index}:${subIndex}`)
                "
              >
                <Avatar class="!h-8 !w-8 !leading-8 !ml-0" :nickname="subitem.title" />
                <span class="ml-3">{{ subitem.title }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </template>
      <template #container>
        <component :is="current.component" :data="current.data" />
      </template>
    </MainContainer>
  </div>
</template>

<style scoped></style>
