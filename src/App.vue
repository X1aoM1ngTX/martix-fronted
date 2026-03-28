<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ConfigProvider, theme } from 'ant-design-vue'
import BasicLayout from '@/layouts/BasicLayout.vue'

const route = useRoute()

// 根据路由 meta 信息判断是否使用布局
const useLayout = computed(() => {
  return route.meta?.layout !== false
})

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
    <BasicLayout v-if="useLayout">
      <RouterView />
    </BasicLayout>
    <RouterView v-else />
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

/* 全局隐藏滚动条但保持滚动功能 */
html {
  overflow-y: scroll;
}

body {
  overflow-y: scroll;
}

/* 隐藏滚动条 */
html::-webkit-scrollbar,
body::-webkit-scrollbar,
#app::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

html {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

body {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
