import request from '../request'

/**
 * 初始化表格数据
 * @returns 最小化的 Univer 工作簿数据
 */
export const initSheet = () => {
  return request({
    url: '/sheet/init',
    method: 'get'
  })
}

/**
 * 上传 Excel 文件并转换为 Univer 格式
 * @param file Excel 文件
 * @returns Univer 工作簿数据
 */
export const uploadExcel = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/sheet/fesod-demo',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取 Univer 工作簿数据
 * @param fileId 文件ID
 * @returns Univer 工作簿数据
 */
export const getSheetData = (fileId: string | number) => {
  return request({
    url: `/sheet/data/${fileId}`,
    method: 'get'
  })
}

/**
 * 保存 Univer 工作簿数据
 * @param fileId 文件ID
 * @param univerData Univer 工作簿数据
 * @param syncToCos 是否同步到 COS（默认 false，自动保存；true 强制同步）
 * @returns 保存结果
 */
export const saveSheetData = (
  fileId: string | number,
  univerData: Record<string, unknown>,
  syncToCos = false
) => {
  return request({
    url: `/sheet/save/${fileId}`,
    method: 'post',
    params: { syncToCos },
    data: univerData
  })
}
