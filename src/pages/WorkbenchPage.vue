<script setup lang="ts">
import { ref, h } from 'vue'

interface Document {
  id: number
  title: string
  location: string
  owner: string
  createTime: string
  lastVisit: string
  type: 'document' | 'spreadsheet'
}

interface ColumnCustomRenderParam {
  record: Document
}
import {
  SearchOutlined,
  FileTextOutlined,
  TableOutlined,
  SettingOutlined,
  BorderOutlined,
  UserOutlined,
  MenuOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  MoreOutlined
} from '@ant-design/icons-vue'

const documents = ref([
  {
    id: 1,
    title: '矩阵Martix开发文档一、需求文档的结构',
    location: '我的文档库',
    owner: 'MaiMingqi',
    createTime: '今天 19:41',
    lastVisit: '今天 20:04',
    type: 'document'
  },
  {
    id: 2,
    title: '未命名表格',
    location: '我的文档库',
    owner: 'MaiMingqi',
    createTime: '今天 19:54',
    lastVisit: '今天 20:02',
    type: 'spreadsheet'
  }
])

const activeFilter = ref('recent')
const viewMode = ref('list')

const filters = [
  { key: 'recent', label: '最近访问' },
  { key: 'owned', label: '归我所有' },
  { key: 'shared', label: '与我共享' },
  { key: 'favorite', label: '收藏' }
]

const columns = [
  {
    title: '标题',
    key: 'title',
    customRender: ({ record }: ColumnCustomRenderParam) => {
      return h('div', { class: 'doc-title-cell' }, [
        record.type === 'document' ? h(FileTextOutlined) : h(TableOutlined),
        h('span', record.title)
      ])
    }
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location'
  },
  {
    title: '所有者',
    dataIndex: 'owner',
    key: 'owner'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '最近访问',
    dataIndex: 'lastVisit',
    key: 'lastVisit'
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    customRender: () => {
      return h('a-button', { type: 'text', size: 'small' }, () => h(MoreOutlined))
    }
  }
]

const sidebarDocs = ref([
  { id: 1, title: '矩阵Martix开发文档一、需求文档…', type: 'document' },
  { id: 2, title: '未命名表格', type: 'spreadsheet' }
])

const selectedDoc = ref<number | null>(null)
</script>

<template>
  <div class="home-page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <!-- Search -->
      <div class="sidebar-search">
        <SearchOutlined />
        <span>搜索</span>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">

        <div class="nav-divider"></div>

        <div class="nav-section-title">我的文档库</div>

        <div
          v-for="doc in sidebarDocs"
          :key="doc.id"
          class="nav-doc-item"
          :class="{ selected: selectedDoc === doc.id }"
          @click="selectedDoc = doc.id"
        >
          <FileTextOutlined v-if="doc.type === 'document'" />
          <TableOutlined v-else />
          <span class="doc-title">{{ doc.title }}</span>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Header -->
      <header class="header">
        <div class="header-left">
          <div class="header-actions">
            <a-button type="text" size="large">
              <template #icon>
                <SearchOutlined />
              </template>
            </a-button>
            <a-button type="text" size="large">
              <template #icon>
                <SettingOutlined />
              </template>
            </a-button>
            <a-button type="text" size="large">
              <template #icon>
                <BorderOutlined />
              </template>
            </a-button>
            <a-button type="text" size="large">
              <template #icon>
                <UserOutlined />
              </template>
            </a-button>
          </div>
        </div>
        <div class="header-title">主页</div>
      </header>

      <!-- Action Bar -->
      <div class="action-bar">
        <div class="action-buttons">
          <a-button type="primary">新建</a-button>
          <a-button type="primary">上传</a-button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-tabs">
          <a-radio-group v-model:value="activeFilter" button-style="solid" size="small">
            <a-radio-button v-for="filter in filters" :key="filter.key" :value="filter.key">
              {{ filter.label }}
            </a-radio-button>
          </a-radio-group>
          <a-button type="text" size="small" class="add-filter">+</a-button>
        </div>
        <div class="filter-actions">
          <a-button type="text" size="small">筛选 ▼</a-button>
          <a-button type="text" size="small">显示设置 ▼</a-button>
          <a-button type="text" size="small">
            <template #icon>
              <MenuOutlined />
            </template>
          </a-button>
          <a-button
            type="text"
            size="small"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <template #icon>
              <UnorderedListOutlined />
            </template>
          </a-button>
          <a-button
            type="text"
            size="small"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <template #icon>
              <AppstoreOutlined />
            </template>
          </a-button>
        </div>
      </div>

      <!-- Document Table -->
      <div class="table-container">
        <a-table :columns="columns" :data-source="documents" :pagination="false" :show-header="true" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  min-height: 100vh;
  background: #fff;
  color: #000;
}

/* 覆盖 Ant Design 按钮圆角 */
.home-page :deep(.ant-btn) {
  border-radius: 6px;
}

.home-page :deep(.ant-btn-sm) {
  border-radius: 4px;
}

.home-page :deep(.ant-radio-button-wrapper) {
  border-radius: 6px;
}

.home-page :deep(.ant-radio-button-wrapper:first-child) {
  border-radius: 6px 0 0 6px;
}

.home-page :deep(.ant-radio-button-wrapper:last-child) {
  border-radius: 0 6px 6px 0;
}

.home-page :deep(.ant-radio-button-wrapper:not(:first-child):not(:last-child)) {
  border-radius: 0;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #f5f5f5;
  border-right: 1px solid #e5e5e5;
  padding: 16px 0;
  flex-shrink: 0;
}

.sidebar-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.sidebar-nav {
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.nav-item.active {
  background: #000;
  color: #fff;
}

.nav-divider {
  height: 1px;
  background: #e5e5e5;
  margin: 12px 12px;
}

.nav-section-title {
  padding: 8px 12px;
  font-size: 12px;
  color: #999;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-doc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-doc-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.nav-doc-item.selected {
  background: rgba(0, 0, 0, 0.06);
}

.nav-doc-item .doc-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e5e5;
  height: 52px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.btn-icon:hover {
  background: #f5f5f5;
  color: #000;
}

.header-title {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

/* Action Bar */
.action-bar {
  padding: 20px 24px 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary:hover {
  background: #222;
}

.btn-secondary {
  padding: 8px 16px;
  background: transparent;
  color: #000;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  border-color: #000;
  background: #f5f5f5;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 16px;
}

.filter-tabs {
  display: flex;
  gap: 4px;
}

.filter-tab {
  padding: 6px 12px;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-tab:hover {
  background: #f5f5f5;
  color: #000;
}

.filter-tab.active {
  background: #f5f5f5;
  color: #000;
  font-weight: 500;
}

.filter-tab.add-filter {
  color: #999;
}

.filter-actions {
  display: flex;
  gap: 4px;
}

.btn-icon-small {
  padding: 6px 10px;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon-small:hover {
  background: #f5f5f5;
  color: #000;
}

.btn-icon-small.active {
  background: #f5f5f5;
  color: #000;
}

/* Table */
.table-container {
  flex: 1;
  overflow: auto;
  padding: 0 24px 24px;
}

.doc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.doc-table thead {
  position: sticky;
  top: 0;
  background: #fff;
}

.doc-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 500;
  color: #666;
  font-size: 12px;
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
}

.doc-row {
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.15s ease;
}

.doc-row:hover {
  background: #fafafa;
}

.doc-table td {
  padding: 12px 16px;
  color: #333;
}

.doc-title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.btn-more {
  padding: 4px 8px;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s ease;
}

.btn-more:hover {
  background: #f5f5f5;
  color: #000;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }

  .filter-bar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .filter-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>
