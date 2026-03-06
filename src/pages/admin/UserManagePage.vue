<template>
  <div class="user-manage-page">
    <div class="page-header">
      <h2>用户管理</h2>
      <Button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增用户
      </Button>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-area">
      <Form layout="inline" :model="searchForm">
        <Form.Item label="账号">
          <Input v-model:value="searchForm.account" placeholder="请输入账号" allow-clear style="width: 150px" />
        </Form.Item>
        <Form.Item label="用户名">
          <Input v-model:value="searchForm.nickName" placeholder="请输入用户名" allow-clear style="width: 150px" />
        </Form.Item>
        <Form.Item label="角色">
          <Select v-model:value="searchForm.role" placeholder="请选择角色" allow-clear style="width: 120px">
            <Select.Option value="admin">管理员</Select.Option>
            <Select.Option value="user">普通用户</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" @click="handleSearch">搜索</Button>
            <Button @click="handleReset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>

    <!-- 表格区域 -->
    <div class="table-area">
      <Table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="paginationConfig"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <Avatar :src="record.avatar" :size="40">
              {{ record.nickName?.charAt(0) || record.account?.charAt(0) }}
            </Avatar>
          </template>
          <template v-if="column.key === 'role'">
            <Tag :color="record.role === 'admin' ? 'red' : 'blue'">
              {{ record.role === 'admin' ? '管理员' : '普通用户' }}
            </Tag>
          </template>
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === 0 ? 'green' : 'red'">
              {{ record.status === 0 ? '正常' : '禁用' }}
            </Tag>
          </template>
          <template v-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleEdit(record)">编辑</Button>
              <Button type="link" danger size="small" @click="handleDelete(record)">删除</Button>
            </Space>
          </template>
        </template>
      </Table>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <Modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      width="600px"
    >
      <Form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <Form.Item label="账号" name="account">
          <Input v-model:value="formData.account" placeholder="请输入账号" :disabled="isEdit" />
        </Form.Item>
        <Form.Item v-if="!isEdit" label="密码" name="password">
          <Input.Password v-model:value="formData.password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item label="用户名" name="nickName">
          <Input v-model:value="formData.nickName" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input v-model:value="formData.email" placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input v-model:value="formData.phone" placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item label="角色" name="role">
          <Select v-model:value="formData.role" placeholder="请选择角色">
            <Select.Option value="admin">管理员</Select.Option>
            <Select.Option value="user">普通用户</Select.Option>
          </Select>
        </Form.Item>
        <Form-item v-if="isEdit" label="状态" name="status">
          <Select v-model:value="formData.status" placeholder="请选择状态">
            <Select.Option :value="0">正常</Select.Option>
            <Select.Option :value="1">禁用</Select.Option>
          </Select>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Table, Button, Space, message, Modal, Form, Input, Select, Avatar, Tag } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { listUserByPage, addUser, updateUser, deleteUser } from '@/api/userController'

const loading = ref(false)
const dataSource = ref<API.UserVO[]>([])
const modalVisible = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 搜索表单
const searchForm = reactive({
  account: '',
  nickName: '',
  role: undefined as string | undefined
})

// 新增/编辑表单
const formData = reactive<API.UserAddRequest & API.UserUpdateRequest & { password?: string }>({
  id: undefined,
  account: '',
  password: '',
  nickName: '',
  email: '',
  phone: '',
  role: 'user',
  status: 0
})

// 表单验证规则
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formRules: any = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  nickName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '头像',
    key: 'avatar',
    width: 80
  },
  {
    title: '账号',
    dataIndex: 'account',
    key: 'account',
    width: 120
  },
  {
    title: '用户名',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 180
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 130
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right' as const,
    width: 120
  }
]

// 分页配置
const paginationConfig = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const queryRequest: API.UserQueryRequest = {
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      account: searchForm.account || undefined,
      nickName: searchForm.nickName || undefined,
      role: searchForm.role || undefined
    }
    const res = await listUserByPage(queryRequest)
    if (res.data?.code === 0 && res.data.data) {
      dataSource.value = res.data.data.records || []
      paginationConfig.total = res.data.data.total || 0
    } else {
      message.error(res.data?.message || '获取用户列表失败')
    }
  } catch {
    message.error('获取用户列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  paginationConfig.current = 1
  fetchUsers()
}

// 重置
const handleReset = () => {
  searchForm.account = ''
  searchForm.nickName = ''
  searchForm.role = undefined
  paginationConfig.current = 1
  fetchUsers()
}

// 表格分页变化
const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
  if (pagination.current !== undefined) {
    paginationConfig.current = pagination.current
  }
  if (pagination.pageSize !== undefined) {
    paginationConfig.pageSize = pagination.pageSize
  }
  fetchUsers()
}

// 新增用户
const handleAdd = () => {
  isEdit.value = false
  modalVisible.value = true
  resetForm()
}

// 编辑用户
const handleEdit = (record: API.UserVO) => {
  isEdit.value = true
  modalVisible.value = true
  Object.assign(formData, {
    id: record.id,
    account: record.account,
    nickName: record.nickName,
    email: record.email,
    phone: record.phone,
    role: record.role,
    status: record.status
  })
}

// 删除用户
const handleDelete = (record: API.UserVO) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${record.nickName || record.account}" 吗？`,
    onOk: async () => {
      try {
        const res = await deleteUser({ id: record.id })
        if (res.data?.code === 0) {
          message.success('删除成功')
          fetchUsers()
        } else {
          message.error(res.data?.message || '删除失败')
        }
      } catch {
        message.error('删除失败，请重试')
      }
    }
  })
}

// 弹窗确认
const handleModalOk = async () => {
  try {
    await formRef.value.validate()
    modalLoading.value = true

    if (isEdit.value) {
      // 编辑用户
      const updateData: API.UserUpdateRequest = {
        id: formData.id,
        nickName: formData.nickName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      }
      const res = await updateUser(updateData)
      if (res.data?.code === 0) {
        message.success('更新成功')
        modalVisible.value = false
        fetchUsers()
      } else {
        message.error(res.data?.message || '更新失败')
      }
    } else {
      // 新增用户
      const addData: API.UserAddRequest = {
        account: formData.account,
        password: formData.password,
        nickName: formData.nickName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      }
      const res = await addUser(addData)
      if (res.data?.code === 0) {
        message.success('新增成功')
        modalVisible.value = false
        fetchUsers()
      } else {
        message.error(res.data?.message || '新增失败')
      }
    }
  } catch (error: unknown) {
    console.error('表单验证失败:', error)
  } finally {
    modalLoading.value = false
  }
}

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    account: '',
    password: '',
    nickName: '',
    email: '',
    phone: '',
    role: 'user',
    status: 0
  })
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-manage-page {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 64px - 70px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.search-area {
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.table-area {
  background: #fff;
}
</style>
