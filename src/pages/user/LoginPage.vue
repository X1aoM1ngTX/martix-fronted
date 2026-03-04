<template>
  <div class="login-page">
    <Card class="login-card">
      <h2 class="login-title">用户登录</h2>
      <Form :model="formState" layout="vertical">
        <FormItem label="账号" name="userAccount">
          <Input v-model:value="formState.userAccount" placeholder="请输入账号" size="large">
            <template #prefix>
              <UserOutlined />
            </template>
          </Input>
        </FormItem>
        <FormItem label="密码" name="userPassword">
          <Input.Password
            v-model:value="formState.userPassword"
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
      </Form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form, FormItem, Input, Button, Card, message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import myAxios from '@/request'

const router = useRouter()
const route = useRoute()

const formState = ref({
  userAccount: '',
  userPassword: ''
})

const loading = ref(false)

// 获取 redirect 参数，默认为首页
const redirect = (route.query.redirect as string) || '/'

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await myAxios.post('/user/login', formState.value)
    if (res.data.code === 0) {
      message.success('登录成功')
      // 登录成功后跳转到之前的页面
      router.push(redirect)
    } else {
      message.error(res.data.message || '登录失败')
    }
  } catch (error) {
    message.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('redirect:', redirect)
})
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px - 70px);
  background: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #000;
}
</style>
