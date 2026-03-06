<template>
  <Layout class="basic-layout">
    <Header class="layout-header">
      <GlobalHeader />
    </Header>
    <Content class="layout-content">
      <RouterView />
    </Content>
    <Footer class="layout-footer">
      <GlobalFooter />
    </Footer>
  </Layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'

const { Header, Content, Footer } = Layout
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  padding: 0;
  line-height: 64px;
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 999;
}

.layout-content {
  flex: 1;
  background: #f0f2f5;
  min-height: calc(100vh - 64px - 70px);
}

.layout-footer {
  padding: 0;
  text-align: center;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

@media (max-width: 768px) {
  .layout-content {
    padding: 16px;
  }
}
</style>
