<template>
  <div class="login-page">
    <Card class="login-card">
      <h2 class="login-title">用户登录</h2>
      <Form :model="formState" layout="vertical">
        <FormItem label="账号" name="account">
          <Input v-model:value="formState.account" placeholder="请输入账号" size="large">
            <template #prefix>
              <UserOutlined />
            </template>
          </Input>
        </FormItem>
        <FormItem label="密码" name="password">
          <Input.Password
            v-model:value="formState.password"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </Input.Password>
        </FormItem>
        <FormItem>
          <Button type="primary" block size="large" :loading="loading" @click="handleLogin">
            登录
          </Button>
        </FormItem>
        <FormItem>
          <div class="login-footer">
            还没有账号？
            <router-link to="/user/register">立即注册</router-link>
          </div>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form, FormItem, Input, Button, Card, message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userLogin } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import type { AxiosResponse } from 'axios'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

const formState = ref({
  account: '',
  password: ''
})

const loading = ref(false)

// 获取 redirect 参数，默认为首页
const redirect = (route.query.redirect as string) || '/'

const handleLogin = async () => {
  // 表单验证
  if (!formState.value.account) {
    message.warning('请输入账号')
    return
  }
  if (!formState.value.password) {
    message.warning('请输入密码')
    return
  }

  loading.value = true
  try {
    const response: AxiosResponse<API.BaseResponseLoginUserVO> = await userLogin({
      account: formState.value.account,
      password: formState.value.password
    })

    // response.data 是实际的 BaseResponseLoginUserVO 对象
    const data = response.data
    if (data.code === 0) {
      message.success('登录成功')
      // 更新登录用户状态到 store
      if (data.data) {
        loginUserStore.loginUser = data.data
      }
      // 登录成功后跳转到之前的页面
      router.push(redirect)
    } else {
      message.error(data.message || '登录失败')
    }
  } catch (error) {
    message.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px - 70px);
  background: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 40px 32px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #000;
}

.login-footer {
  text-align: center;
  color: #666;
}

.login-footer a {
  color: #1890ff;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
