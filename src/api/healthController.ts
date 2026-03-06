/* eslint-disable */
import request from '@/request'

/** 健康检查 检查服务是否正常运行 GET /health/ */
export async function healthCheck(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/health/', {
    method: 'GET',
    ...(options || {})
  })
}

/** 管理员健康检查 管理员专用的健康检查接口，用于测试权限验证是否正常工作，需要管理员权限 GET /health/admin */
export async function adminHealthCheck(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/health/admin', {
    method: 'GET',
    ...(options || {})
  })
}
