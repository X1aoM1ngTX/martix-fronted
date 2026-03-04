<template>
  <div class="global-header">
    <div class="header-left">
      <img class="logo" src="@/assets/MATRIX-ALPHA.png" alt="MATRIX" style="height: 200px;"/>
    </div>
    <Menu
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      :style="{ flex: 1, border: 'none' }"
      @click="handleMenuClick"
    >
      <Menu.Item v-for="item in menuItems" :key="item.key">
        {{ item.label }}
      </Menu.Item>
    </Menu>
    <div class="header-right">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, Button } from 'ant-design-vue'
import { UserOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'

interface MenuItem {
  key: string
  label: string
  path: string
}

const router = useRouter()
const route = useRoute()

const selectedKeys = ref<string[]>([route.name as string || 'home'])

const menuItems: MenuItem[] = [
  { key: 'home', label: '首页', path: '/' },
  { key: 'about', label: '关于', path: '/about' },
]

const handleMenuClick = ({ key }: MenuInfo) => {
  const menuItem = menuItems.find(item => item.key === key)
  if (menuItem) {
    router.push(menuItem.path)
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
