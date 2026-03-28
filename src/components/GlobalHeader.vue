<template>
  <div class="global-header">
    <div class="header-left">
      <img class="logo" src="@/assets/MATRIX.svg" alt="MATRIX" @click="router.push('/')"/>
    </div>
    <Menu
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      :style="{ flex: 1, border: 'none' }"
      @click="handleMenuClick"
    >
      <Menu.Item v-for="item in filteredMenuItems" :key="item.key">
        {{ item.label }}
      </Menu.Item>
    </Menu>
    <div class="header-right">
      <!-- 显示登录用户信息 -->
      <div v-if="loginUserStore.loginUser.id" class="user-info">
        <Dropdown>
          <div class="user-avatar">
            <!-- 用户头像 -->
            <Avatar
              :size="32"
              :src="loginUserStore.loginUser.avatar"
              class="user-avatar-img"
            >
              <template #icon>
                <UserOutlined />
              </template>
            </Avatar>
            <span class="user-name">{{ loginUserStore.loginUser.nickName ?? loginUserStore.loginUser.account ?? '无名' }}</span>
          </div>
          <template #overlay>
            <Menu @click="handleDropdownClick">
              <Menu.Item v-if="loginUserStore.loginUser.role === 'admin'" key="userManage">
                <template #icon>
                  <UserOutlined />
                </template>
                用户管理
              </Menu.Item>
              <Menu.Item key="profile">个人信息</Menu.Item>
              <Menu.Item key="settings">设置</Menu.Item>
              <Menu.Divider />
              <Menu.Item key="logout" @click="handleLogout">退出登录</Menu.Item>
            </Menu>
          </template>
        </Dropdown>
      </div>
      <!-- 未登录显示登录/注册按钮 -->
      <template v-else>
        <Button class="login-button" @click="handleLogin">
          <template #icon>
            <UserOutlined />
          </template>
          登录
        </Button>
        <Button class="register-button" @click="handleRegister">
          <template #icon>
            <UserAddOutlined />
          </template>
          注册
        </Button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, Button, Dropdown, message, Avatar } from 'ant-design-vue'
import { UserOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { userLogout } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import checkAccess from '@/access/checkAccess'
import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'

interface MenuItem {
  key: string
  label: string
  path: string
}

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

const selectedKeys = ref<string[]>([route.name as string || 'home'])

const menuItems: MenuItem[] = [
  { key: 'workbench', label: '工作台', path: '/workbench' },
  { key: 'about', label: '关于', path: '/about' },
]

// 根据权限过滤菜单项
const filteredMenuItems = computed(() => {
  return menuItems.filter(menu => {
    const routeItem = router.resolve(menu.path)
    const access = routeItem.meta?.access as string
    return checkAccess(loginUserStore.loginUser, access)
  })
})

const handleMenuClick = ({ key }: MenuInfo) => {
  const menuItem = menuItems.find(item => item.key === key)
  if (menuItem) {
    router.push(menuItem.path)
  }
}

const handleDropdownClick = ({ key }: MenuInfo) => {
  if (key === 'userManage') {
    router.push('/admin/user')
  }
}

const handleLogin = () => {
  // 跳转到登录页，带上当前页面路径作为 redirect 参数
  const currentPath = route.fullPath
  router.push({
    path: '/user/login',
    query: currentPath !== '/' && currentPath !== '/user/login' ? { redirect: currentPath } : undefined
  })
}

const handleRegister = () => {
  // 跳转到注册页，带上当前页面路径作为 redirect 参数
  const currentPath = route.fullPath
  router.push({
    path: '/user/register',
    query: currentPath !== '/' && currentPath !== '/user/register' ? { redirect: currentPath } : undefined
  })
}

const handleLogout = async () => {
  try {
    const response = await userLogout() as API.BaseResponseBoolean
    if (response.code === 0) {
      message.success('退出登录成功')
      // 清空用户信息
      loginUserStore.loginUser = {} as API.LoginUserVO
      // 刷新页面
      window.location.href = '/'
    }
  } catch {
    message.error('退出登录失败')
  }
}
</script>

<style scoped>
.global-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  margin: 0 auto;
  width: 100%;
}

/* 覆盖 Ant Design 按钮圆角 */
.global-header :deep(.ant-btn) {
  border-radius: 6px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 24px;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
}

.site-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 用户信息展示 */
.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-avatar:hover {
  background: #f5f5f5;
}

.user-avatar-img {
  flex-shrink: 0;
}

.user-name {
  font-size: 14px;
  color: #000;
}

/* 头像样式 */
.user-avatar-img :deep(.ant-avatar) {
  background: #000;
  border: 1px solid #e5e5e5;
}

.user-avatar-img :deep(.ant-avatar-string) {
  background: #000;
}

@media (max-width: 768px) {
  .global-header {
    padding: 0 16px;
  }

  .site-title {
    display: none;
  }

  .header-left {
    margin-right: 16px;
  }

  .user-name {
    display: none;
  }
}

/* 黑白主题样式 */
.login-button {
  background: #000;
  border-color: #000;
  color: #fff;
}

.login-button:hover {
  background: #333;
  border-color: #333;
  color: #fff;
}

.register-button {
  background: #fff;
  border-color: #000;
  color: #000;
}

.register-button:hover {
  background: #f5f5f5;
  border-color: #333;
}
</style>
