import { defineStore } from 'pinia'
import { getFriendListApi, getNormalUserInfoApi, updateFriendUserInfoApi } from '../../../api/user'
import { Message } from '../../../../../main/messageBox'
import { code } from '@renderer/config'
import { userUserInfo } from '/@/hooks'
import { groupUsersByFirstLetter } from '/@/utils'

interface Result {
  data: any[]
  loading: boolean
}

interface FriendSearchResultType extends Result {
  currentSearchData: any
}

export interface FriendsState {
  friendSearchResult: FriendSearchResultType
  friendRequestList: Result
  friends: {
    data: Record<string, any[]>
    loading: boolean
  }
}

export const useFriendsStore = defineStore('friends', {
  state: (): FriendsState => ({
    friendSearchResult: {
      currentSearchData: {},
      data: [],
      loading: false
    },
    friendRequestList: {
      data: [],
      loading: false
    },
    friends: {
      data: {},
      loading: false
    }
  }),
  actions: {
    /**
     * 根据搜索字符串查询普通用户
     * @param searchStr 搜索字符串
     */
    async getNormalUserInfo(searchStr, userId: string) {
      this.friendSearchResult.loading = true
      try {
        const result = await getNormalUserInfoApi({ username: searchStr }, userId)
        if (result.code === code.success) {
          this.friendSearchResult.data = result?.data || []
        }
        this.friendSearchResult.currentSearchData = {
          searchStr,
          userId
        }
      } catch (e: any) {
        Message({
          message: e?.msg || e?.message || '未知错误',
          type: 'error'
        })
      } finally {
        this.friendSearchResult.loading = false
      }
    },
    // 刷新搜索条件
    refreshFiendSearchResult() {
      this.getNormalUserInfo(
        this.friendSearchResult.currentSearchData.searchStr,
        this.friendSearchResult.currentSearchData.userId
      )
    },
    /**
     * 查询申请好友列表
     */
    async getFriendRequestList() {
      try {
        const { userId } = await userUserInfo()
        const result = await updateFriendUserInfoApi({ userId })
        if (result.code === code.success) {
          this.friendRequestList.data = result?.data || []
        }
      } catch (e: any) {
        console.log(e?.msg || e)
      }
    },
    /**
     * 查询好友列表
     */
    async getFriendList() {
      try {
        const { userId } = await userUserInfo()
        const result = await getFriendListApi({ id: userId })
        if (result.code === code.success) {
          const { groups } = groupUsersByFirstLetter(result?.data || [])
          this.friends.data = groups
        }
      } catch (e) {
        console.log(e)
      }
    },

  }
})
