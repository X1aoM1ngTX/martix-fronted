import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUser } from '@/api/userController'
import type { AxiosResponse } from 'axios'

/**
 * 登录用户状态管理 Store
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  // 登录用户信息
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })

  /**
   * 获取当前登录用户信息
   */
  async function fetchLoginUser() {
    const response: AxiosResponse<API.BaseResponseLoginUserVO> = await getLoginUser()
    const data = response.data

    if (data.code === 0 && data.data) {
      loginUser.value = data.data
    }
  }

  return {
    loginUser,
    fetchLoginUser
  }
})
