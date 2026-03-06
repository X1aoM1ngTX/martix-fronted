<template>
  <div class="no-auth-page">
    <Result status="403" title="403" sub-title="抱歉，您没有权限访问该页面">
      <template #extra>
        <Button type="primary" @click="goBack">返回</Button>
        <Button @click="goHome">回到首页</Button>
      </template>
    </Result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Result, Button } from 'ant-design-vue'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.no-auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px - 70px);
  background: #fff;
}
</style>
