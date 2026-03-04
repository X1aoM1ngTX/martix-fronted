<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue'
import BasicLayout from '@/layouts/BasicLayout.vue'

// 黑白主题配置
const themeConfig = {
  token: {
    colorPrimary: '#000000',
    colorSuccess: '#000000',
    colorWarning: '#000000',
    colorError: '#000000',
    colorInfo: '#000000',
    colorBgBase: '#ffffff',
    borderRadius: 2,
  },
  algorithm: theme.defaultAlgorithm,
}
</script>

<template>
  <ConfigProvider :theme="themeConfig">
    <BasicLayout />
  </ConfigProvider>
</template>

<style>
/* Global styles reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
