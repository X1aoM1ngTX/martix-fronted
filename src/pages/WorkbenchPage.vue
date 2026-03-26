<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  listFilesByPage,
  deleteFile,
  downloadFile,
  renameFile,
  createBlankFile,
  uploadFile as uploadFileApi
} from '@/api/fileController'
import { getUserVoById } from '@/api/userController'
import { message, Modal } from 'ant-design-vue'
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  MoreOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import XlsxIcon from '@/components/XlsxIcon.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()

const documents = ref<API.FileVO[]>([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchFileName = ref('')

// 用户信息缓存 (ownerId -> UserVO)
const ownerMap = ref<Map<string, API.UserVO>>(new Map())

// 获取用户信息（带缓存）
const getOwnerInfo = async (ownerId: string): Promise<API.UserVO | undefined> => {
  if (!ownerId) return undefined

  // 检查缓存
  if (ownerMap.value.has(ownerId)) {
    return ownerMap.value.get(ownerId)
  }

  try {
    console.log('获取用户信息, ownerId:', ownerId)
    // 直接传递字符串参数，避免超大整数精度丢失
    const res = await getUserVoById({ id: ownerId })
    console.log('用户信息响应:', res)
    if (res.code === 0 && res.data) {
      ownerMap.value.set(ownerId, res.data)
      return res.data
    } else {
      console.warn('获取用户信息失败:', res.message)
    }
  } catch (error) {
    console.error('获取用户信息异常:', ownerId, error)
  }
  return undefined
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

// 格式化完整时间
const formatFullTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

// 加载文件列表
const loadFiles = async () => {
  loading.value = true
  try {
    const res = await listFilesByPage({
      current: current.value,
      pageSize: pageSize.value,
      fileName: searchFileName.value || undefined
    })
    console.log('API 响应:', res)
    // request 拦截器已经返回 data，所以 res 直接是 BaseResponseIPageFileVO
    if (res.code === 0 && res.data) {
      const records = res.data.records || []
      // 获取所有唯一的 ownerId
      const uniqueOwnerIds = [...new Set(records.map(f => f.ownerId).filter(Boolean))]
      // 并发获取用户信息
      await Promise.all(uniqueOwnerIds.map(id => getOwnerInfo(id!)))
      documents.value = records
      // 确保 total 是 Number 类型
      total.value = Number(res.data.total || 0)
    } else {
      message.error(res.message || '加载文件列表失败')
    }
  } catch (error) {
    message.error('加载文件列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  current.value = 1
  loadFiles()
}

// 分页改变
const handlePageChange = (page: number, size: number) => {
  current.value = page
  pageSize.value = size
  loadFiles()
}

// 打开文件（新标签页）
const openFile = (record: API.FileVO) => {
  const url = router.resolve({
    name: 'Spreadsheet',
    params: { fileId: String(record.id) }
  }).href
  window.open(url, '_blank')
}

// 下载文件
const handleDownload = async (record: API.FileVO) => {
  try {
    const res = await downloadFile({ fileId: record.id || '' })
    // 创建下载链接 - res.data 是实际的 Blob 数据
    const blob = res.data
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = record.fileName || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    message.success('下载成功')
  } catch (error) {
    message.error('下载失败')
    console.error(error)
  }
}

// 重命名
const handleRename = (record: API.FileVO) => {
  Modal.confirm({
    title: '重命名',
    content: h('div', [
      h('p', '请输入新文件名：'),
      h('input', {
        id: 'rename-input',
        type: 'text',
        value: record.fileName,
        class: 'ant-input',
        style: 'width: 100%; margin-top: 8px;'
      })
    ]),
    onOk: async () => {
      const input = document.getElementById('rename-input') as HTMLInputElement
      const newName = input?.value?.trim()
      if (!newName) {
        message.error('文件名不能为空')
        return Promise.reject()
      }
      try {
        await renameFile({ id: record.id, newFileName: newName })
        message.success('重命名成功')
        loadFiles()
      } catch {
        message.error('重命名失败')
        return Promise.reject()
      }
    }
  })
}

// 删除文件
const handleDelete = (record: API.FileVO) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除文件 "${record.fileName}" 吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteFile({ id: record.id })
        message.success('删除成功')
        loadFiles()
      } catch {
        message.error('删除失败')
      }
    }
  })
}

// 表格列配置
const columns = [
  {
    title: '文件名',
    key: 'fileName',
    dataIndex: 'fileName'
  },
  {
    title: '类型',
    dataIndex: 'fileType',
    key: 'fileType',
    width: 80
  },
  {
    title: '大小',
    dataIndex: 'fileSizeDisplay',
    key: 'fileSizeDisplay',
    width: 100
  },
  {
    title: '所有者',
    key: 'owner',
    width: 150
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 180,
    dataIndex: 'createdAt'
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 180,
    dataIndex: 'updatedAt'
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    align: 'center'
  }
]

// 新建文件
const showCreateModal = ref(false)
const createFileName = ref('')
const createFileType = ref<'xlsx' | 'xls' | 'csv'>('xlsx')

const handleCreate = async () => {
  if (!createFileName.value.trim()) {
    message.error('请输入文件名')
    return
  }
  try {
    const res = await createBlankFile({
      fileName: createFileName.value,
      fileType: createFileType.value
    })
    if (res.data) {
      message.success('创建成功')
      showCreateModal.value = false
      createFileName.value = ''
      // 在新标签页打开新创建的文件
      const url = router.resolve({
        name: 'Spreadsheet',
        params: { fileId: String(res.data) }
      }).href
      window.open(url, '_blank')
      // 刷新文件列表
      loadFiles()
    }
  } catch {
    message.error('创建失败')
  }
}

// 上传文件
const showUploadModal = ref(false)
const uploadFile = ref<File | null>(null)
const uploadLoading = ref(false)

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadFile.value = target.files[0]
  }
}

const handleUpload = async () => {
  if (!uploadFile.value) {
    message.error('请选择文件')
    return
  }
  uploadLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadFile.value)
    const res = await uploadFileApi(formData)
    if (res.data) {
      message.success('上传成功')
      showUploadModal.value = false
      uploadFile.value = null
      loadFiles()
    }
  } catch {
    message.error('上传失败')
  } finally {
    uploadLoading.value = false
  }
}

onMounted(() => {
  loadFiles()
})
</script>

<template>
  <div class="home-page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-search" @click="() => {}">
        <SearchOutlined />
        <span>搜索</span>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-divider"></div>
        <div class="nav-section-title">我的文档库</div>
        <div class="nav-item active">全部文件</div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Header -->
      <header class="header">
        <div class="header-left">
          <a-input
            v-model:value="searchFileName"
            placeholder="搜索文件..."
            style="width: 200px"
            @pressEnter="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </div>
        <div class="header-actions">
          <a-button type="primary" @click="showCreateModal = true">
            <PlusOutlined />
            新建
          </a-button>
          <a-button @click="showUploadModal = true">
            <UploadOutlined />
            上传
          </a-button>
          <a-button shape="circle" @click="loadFiles">
            <ReloadOutlined />
          </a-button>
        </div>
      </header>

      <!-- Table -->
      <div class="table-container">
        <a-table
          :columns="columns"
          :data-source="documents"
          :loading="loading"
          :pagination="{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: t => `共 ${t} 个文件`
          }"
          @change="handlePageChange"
          :row-key="record => record.id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fileName'">
              <div class="doc-title-cell" @click="openFile(record)">
                <XlsxIcon />
                <span class="file-link">{{ record.fileName }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'owner'">
              <div class="owner-cell">
                <a-avatar
                  v-if="ownerMap.get(record.ownerId)?.avatar"
                  :src="ownerMap.get(record.ownerId)?.avatar"
                  :size="24"
                />
                <a-avatar v-else :size="24">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <span class="owner-name">{{
                  ownerMap.get(record.ownerId)?.nickName || record.ownerId
                }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'createdAt'">
              <span :title="formatFullTime(record.createdAt)">{{
                formatTime(record.createdAt)
              }}</span>
            </template>
            <template v-else-if="column.key === 'updatedAt'">
              <span :title="formatFullTime(record.updatedAt)">{{
                formatTime(record.updatedAt)
              }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-dropdown trigger="click" placement="bottomRight">
                <MoreOutlined class="more-icon" @click.prevent />
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleDownload(record)">
                      <DownloadOutlined />
                      下载
                    </a-menu-item>
                    <a-menu-item @click="handleRename(record)">
                      <EditOutlined />
                      重命名
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item @click="handleDelete(record)" class="delete-menu-item">
                      <DeleteOutlined />
                      删除
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </template>
        </a-table>
      </div>
    </main>

    <!-- 新建文件弹窗 -->
    <a-modal
      v-model:open="showCreateModal"
      title="新建空白表格"
      @ok="handleCreate"
      @cancel="createFileName = ''"
    >
      <a-form layout="vertical">
        <a-form-item label="文件名">
          <a-input v-model:value="createFileName" placeholder="请输入文件名" allow-clear />
        </a-form-item>
        <a-form-item label="文件类型">
          <a-radio-group v-model:value="createFileType">
            <a-radio-button value="xlsx">XLSX</a-radio-button>
            <a-radio-button value="xls">XLS</a-radio-button>
            <a-radio-button value="csv">CSV</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 上传文件弹窗 -->
    <a-modal
      v-model:open="showUploadModal"
      title="上传文件"
      @ok="handleUpload"
      @cancel="uploadFile = null"
      :confirm-loading="uploadLoading"
    >
      <a-form layout="vertical">
        <a-form-item label="选择文件">
          <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileSelect" />
          <div v-if="uploadFile" class="file-info">已选择: {{ uploadFile.name }}</div>
        </a-form-item>
        <a-alert
          message="支持格式"
          description="仅支持 .xlsx、.xls、.csv 格式的文件"
          type="info"
          show-icon
        />
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  min-height: 100vh;
  background: #fff;
  color: #000;
}

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
}

.header-left {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Table */
.table-container {
  flex: 1;
  overflow: auto;
  padding: 0 24px 24px;
}

.doc-title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
}

.file-link {
  color: #000;
  text-decoration: none;
}

.file-link:hover {
  color: #1890ff;
}

.more-icon {
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.more-icon:hover {
  color: #1890ff;
  background: rgba(0, 0, 0, 0.04);
}

.delete-menu-item {
  color: #ff4d4f;
}

.delete-menu-item:hover {
  color: #ff4d4f;
  background: #fff1f0;
}

.owner-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.owner-name {
  font-size: 13px;
  color: #333;
}

.file-info {
  margin-top: 8px;
  color: #52c41a;
  font-size: 12px;
}
</style>
