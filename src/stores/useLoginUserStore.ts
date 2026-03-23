import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUser } from '@/api/userController'

/**
 * 登录用户状态管理 Store
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  // 登录用户信息
  const loginUser = ref<API.LoginUserVO>({} as API.LoginUserVO)

  /**
   * 获取当前登录用户信息
   */
  async function fetchLoginUser() {
    const response: API.BaseResponseLoginUserVO = await getLoginUser()

    if (response.code === 0 && response.data) {
      loginUser.value = response.data
    }
  }

  return {
    loginUser,
    fetchLoginUser
  }
})
