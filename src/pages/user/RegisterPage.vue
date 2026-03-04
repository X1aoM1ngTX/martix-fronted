<template>
  <div class="register-page">
    <Card class="register-card">
      <h2 class="register-title">用户注册</h2>
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
        <FormItem label="确认密码" name="checkPassword">
          <Input.Password
            v-model:value="formState.checkPassword"
            placeholder="请再次输入密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </Input.Password>
        </FormItem>
        <FormItem>
          <Button type="primary" block size="large" :loading="loading" @click="handleRegister">
            注册
          </Button>
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
import myAxios from '@/request'

const router = useRouter()
const route = useRoute()

const formState = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})

const loading = ref(false)

// 获取 redirect 参数，默认为首页
const redirect = (route.query.redirect as string) || '/'

const handleRegister = async () => {
  // 校验密码
  if (formState.value.userPassword !== formState.value.checkPassword) {
    message.error('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    const res = await myAxios.post('/user/register', {
      userAccount: formState.value.userAccount,
      userPassword: formState.value.userPassword
    })
    if (res.data.code === 0) {
      message.success('注册成功')
      // 注册成功后跳转到登录页
      router.push({
        path: '/user/login',
        query: redirect !== '/' ? { redirect } : undefined
      })
    } else {
      message.error(res.data.message || '注册失败')
    }
  } catch (error) {
    message.error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px - 70px);
  background: #f0f2f5;
}

.register-card {
  width: 400px;
  padding: 20px;
}

.register-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #000;
}
</style>
