import request from '../request'

export type ExcelContextInfo = {
  sheetName?: string
  startRow?: number
  startCol?: number
  endRow?: number
  endCol?: number
  includeHeaders?: boolean
}

export type SpreadsheetAction = {
  type?: 'SET_CELL_VALUE' | 'SET_RANGE_VALUES' | 'SET_FORMULA' | 'INSERT_COLUMN_WITH_VALUES' | string
  sheetName?: string
  row?: number
  col?: number
  startRow?: number
  startCol?: number
  insertAfterCol?: number
  targetCol?: number
  headerRow?: number
  headerValue?: string
  endRow?: number
  endCol?: number
  value?: unknown
  values?: unknown[][]
  formula?: string
  executed?: boolean
  summary?: string
  metadata?: Record<string, unknown>
}

export type AiChatReply = {
  sessionId?: string | number
  userMessageId?: string | number
  assistantMessageId?: string | number
  reply?: string
  actions?: SpreadsheetAction[]
  toolCalls?: Array<{
    toolName?: string
    arguments?: string
    result?: string
    success?: boolean
    durationMs?: number
  }>
}

export type AiChatMessageVO = {
  id?: string | number
  sessionId?: string | number
  role?: 'user' | 'assistant' | 'system' | string
  content?: string
  toolCall?: string
  toolCalls?: AiChatReply['toolCalls']
  tokens?: number
  createTime?: string
}

type BaseResponse<T> = {
  code?: number
  data?: T
  message?: string
}

export type ChatSessionVO = {
  id?: string | number
  userId?: string | number
  fileId?: string | number
  title?: string
  modelName?: string
  createTime?: string
  updateTime?: string
}

export type AiChatSendRequest = {
  sessionId: string | number
  message: string
  context?: ExcelContextInfo | null
}

export const createAiChatSession = (fileId?: string | number, title?: string) => {
  return request<BaseResponse<ChatSessionVO>>({
    url: '/ai/chat/session',
    method: 'post',
    data: {
      fileId,
      title
    }
  })
}

export const listAiChatSessions = (fileId?: string | number) => {
  return request<BaseResponse<ChatSessionVO[]>>({
    url: '/ai/chat/session',
    method: 'get',
    params: {
      fileId
    }
  })
}

export const listAiChatMessages = (sessionId: string | number, pageNum = 1, pageSize = 100) => {
  return request<BaseResponse<AiChatMessageVO[]>>({
    url: `/ai/chat/session/${sessionId}/messages`,
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

export const sendAiChatMessage = (data: AiChatSendRequest) => {
  return request<BaseResponse<AiChatReply>>({
    url: '/ai/chat',
    method: 'post',
    data,
    timeout: 180000,  // AI 带工具调用可能需要多轮，给 3 分钟
  })
}
