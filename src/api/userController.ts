/* eslint-disable */
import request from '@/request'

/** 创建用户 管理员创建新用户，需要管理员权限 POST /user/add */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新用户 管理员更新用户信息，需要管理员权限 PUT /user/admin/update */
export async function updateUser(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/admin/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除用户 管理员删除指定用户，需要管理员权限 POST /user/delete */
export async function deleteUser(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 获取用户详情 管理员根据用户 ID 获取用户完整信息（未脱敏），需要管理员权限 GET /user/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUser>('/user/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取当前登录用户 获取当前登录用户的信息（脱敏），需要先登录 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserVO>('/user/get/login', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取用户信息 根据用户 ID 获取用户信息（脱敏），任何人都可以访问 GET /user/get/vo */
export async function getUserVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserVO>('/user/get/vo', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 分页获取用户列表 管理员分页查询用户列表（脱敏），支持按昵称、账号等条件筛选，需要管理员权限 POST /user/list/page */
export async function listUserByPage(body: API.UserQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseIPageUserVO>('/user/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 用户登录 用户通过账号和密码登录，成功后返回用户信息（脱敏）和 Token POST /user/login */
export async function userLogin(body: API.UserLoginRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserVO>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 用户注销 用户退出登录，清除登录状态 POST /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/logout', {
    method: 'POST',
    ...(options || {})
  })
}

/** 用户注册 用户通过账号和密码注册新账号，需要输入两次密码进行确认 POST /user/register */
export async function userRegister(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 修改个人信息 用户修改自己的个人信息，如昵称、头像等 PUT /user/update */
export async function updateMyInfo(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
