/* eslint-disable */
import request from '@/request'

/** 创建空白表格 创建一个新的空白 Excel 表格文件 POST /file/create */
export async function createBlankFile(
  body: API.FileCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/file/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除文件 删除文件 DELETE /file/delete */
export async function deleteFile(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/file/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 下载文件 根据文件ID下载文件 GET /file/download */
export async function downloadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.downloadFileParams,
  options?: { [key: string]: any }
) {
  return request<string>('/file/download', {
    method: 'GET',
    responseType: 'blob',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取文件详情 根据文件ID获取文件详细信息 GET /file/get */
export async function getFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFileParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseFileVO>('/file/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 分页获取文件列表 分页查询当前用户的文件列表，支持按文件名、文件类型等条件筛选 POST /file/list/page */
export async function listFilesByPage(
  body: API.FileQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageFileVO>('/file/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 重命名文件 重命名文件 PUT /file/rename */
export async function renameFile(body: API.FileRenameRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/file/rename', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 上传文件 上传 Excel 文件，支持 .xlsx、.xls、.csv 格式，通过MD5去重 POST /file/upload */
export async function uploadFile(
  formData: FormData,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/file/upload', {
    method: 'POST',
    // 注意：不要手动设置 Content-Type，让 axios 自动设置 multipart/form-data boundary
    data: formData,
    ...(options || {})
  })
}
