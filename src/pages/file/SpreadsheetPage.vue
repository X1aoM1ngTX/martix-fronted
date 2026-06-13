<template>
  <div class="spreadsheet-page">
    <div v-show="loading" class="loading-container">
      <a-spin size="large" tip="加载中..." />
    </div>
    <div v-show="error" class="error-container">
      <a-result status="error" :title="error">
        <template #extra>
          <a-button type="primary" @click="handleBack">返回工作台</a-button>
        </template>
      </a-result>
    </div>
    <div ref="univerContainer" class="univer-container"></div>
    <button
      v-if="!aiPanelOpen"
      class="ai-fab"
      :disabled="loading || !!error"
      aria-label="打开 AI 表格助手"
      type="button"
      @click="aiPanelOpen = true"
    >
      <img :src="matrixLogo" alt="Matrix AI" class="ai-logo-fab" />
    </button>
    <aside v-if="aiPanelOpen" class="ai-panel" aria-label="AI 表格助手">
      <header class="ai-panel-header">
        <div class="ai-panel-title">
          <img :src="matrixLogo" alt="Matrix AI" class="ai-logo-inline" />
          <div>
            <strong>Matrix AI</strong>
            <span>{{ fileName || '表格助手' }}</span>
          </div>
        </div>
        <div class="ai-panel-controls">
          <button
            class="ai-new-chat-button"
            type="button"
            :disabled="aiLoading || aiHistoryLoading"
            @click="startNewAiChat"
          >
            新对话
          </button>
          <label class="ai-history-field" for="ai-history-select">
            <HistoryOutlined />
            <select
              id="ai-history-select"
              v-model="selectedHistorySessionId"
              :disabled="aiHistoryLoading || aiSessions.length === 0"
              aria-label="历史记录"
              @change="handleAiHistoryChange"
            >
              <option value="">{{ aiSessions.length === 0 ? '暂无历史' : '选择历史' }}</option>
              <option v-for="session in aiSessions" :key="session.id" :value="session.id">
                {{ formatAiSessionTitle(session) }}
              </option>
            </select>
          </label>
          <button
            class="ai-icon-button"
            type="button"
            :disabled="aiHistoryLoading"
            aria-label="刷新历史记录"
            @click="loadAiHistory()"
          >
            <ReloadOutlined />
          </button>
          <button class="ai-icon-button" type="button" aria-label="收起 AI 表格助手" @click="aiPanelOpen = false">
            <FullscreenExitOutlined />
          </button>
        </div>
      </header>

      <div ref="aiMessageListRef" class="ai-message-list" aria-live="polite">
        <div v-if="aiHistoryLoading" class="ai-empty">
          <img :src="matrixLogo" alt="Matrix AI" class="ai-logo-inline" />
          正在加载历史记录...
        </div>
        <div v-else-if="aiMessages.length === 0" class="ai-empty">
          <img :src="matrixLogo" alt="Matrix AI" class="ai-logo-inline" />
          选中一块区域，然后告诉我你想做什么。比如：把选区求和并写到下一行。
        </div>
        <article
          v-for="(item, index) in aiMessages"
          :key="item.key || `${item.role}-${index}`"
          class="ai-message"
          :class="`ai-message-${item.role}`"
        >
          <img v-if="item.role === 'assistant'" :src="matrixLogo" alt="Matrix" class="ai-message-avatar" />
          <div class="ai-message-content">
            <span v-if="item.role === 'assistant'" class="ai-message-role">Matrix</span>
            <div class="ai-markdown" v-html="renderMarkdown(item.content)"></div>
          </div>
          <div v-if="item.actions?.length" class="ai-action-list">
            <div v-for="(action, actionIndex) in item.actions" :key="actionIndex" class="ai-action-item">
              <a-tag :color="action.executed ? 'green' : 'gold'">
                {{ action.executed ? '已执行' : '待执行' }}
              </a-tag>
              <span>{{ action.summary || action.type }}</span>
            </div>
          </div>
        </article>
      </div>

      <div v-if="pendingActions.length" class="ai-pending-actions">
        <div>
          <span class="ai-selection-label">待执行</span>
          <strong>{{ pendingActions.length }} 条</strong>
        </div>
        <a-button type="primary" :loading="applyingActions" @click="applyPendingActions">
          应用到表格
        </a-button>
      </div>

      <form class="ai-input-area" @submit.prevent="handleAiSend">
        <label for="ai-chat-input">@ {{ currentSelectionLabel }}</label>
        <a-textarea
          id="ai-chat-input"
          v-model:value="aiInput"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :disabled="aiLoading"
          placeholder="例如：把选区求和，结果写在下一行"
          @keydown.ctrl.enter.prevent="handleAiSend"
        />
        <button class="ai-send-button" type="submit" :disabled="aiLoading" aria-label="发送">
          <span></span>
        </button>
      </form>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, toRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import sheetsCoreZhCN from '@univerjs/preset-sheets-core/locales/zh-CN'
import { createUniver, LocaleType, mergeLocales, type Univer } from '@univerjs/presets'
import { getSheetData, saveSheetData } from '@/api/sheetController'
import {
  createAiChatSession,
  listAiChatMessages,
  listAiChatSessions,
  sendAiChatMessage,
  type AiChatMessageVO,
  type AiChatReply,
  type ChatSessionVO,
  type ExcelContextInfo,
  type SpreadsheetAction
} from '@/api/aiChatController'
import { UniverSaveButtonPlugin } from '@/univer-plugins/save-button'
import matrixLogo from '@/assets/MATRIX-4.png'
import { FullscreenExitOutlined, HistoryOutlined, ReloadOutlined } from '@ant-design/icons-vue'

import '@univerjs/preset-sheets-core/lib/index.css'
import 'highlight.js/styles/github.css'

// 防抖函数
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as T
}

// Univer 实例
const route = useRoute()
const router = useRouter()

const univerContainer = ref<HTMLDivElement | null>(null)
const aiMessageListRef = ref<HTMLDivElement | null>(null)
let univerInstance: Univer | null = null
let univerAPI: ReturnType<typeof createUniver>['univerAPI'] | null = null
let selectionChangeDisposable: { dispose: () => void } | null = null

type AiMessageItem = {
  id?: string
  key: string
  role: 'user' | 'assistant'
  content: string
  actions?: SpreadsheetAction[]
}

// 状态
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const fileId = ref<string>('')
const autoSaveCount = ref(0)
const lastSaveTime = ref('')
const fileName = ref<string>('')
const originalTitle = ref('')
const aiPanelOpen = ref(false)
const aiInput = ref('')
const aiLoading = ref(false)
const applyingActions = ref(false)
const aiSessionId = ref<string | null>(null)
const aiMessages = ref<AiMessageItem[]>([])
const aiSessions = ref<Array<ChatSessionVO & { id: string }>>([])
const selectedHistorySessionId = ref<string>('')
const aiHistoryLoading = ref(false)
const aiHistoryLoaded = ref(false)
const pendingActions = ref<SpreadsheetAction[]>([])
const latestSelectionContext = ref<ExcelContextInfo | null>(null)
const currentSelectionLabel = ref('未选择区域')
let aiLocalMessageId = 0

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value
      } catch {
        return ''
      }
    }
    return hljs.highlightAuto(code).value
  }
})

// 更新页面标题
const updatePageTitle = (name: string) => {
  document.title = `${name} - Martix 矩阵`
  fileName.value = name
}

const createEmptyWorkbookData = () => ({
  id: 'workbook-1',
  name: '新建表格',
  locale: LocaleType.ZH_CN,
  sheets: {
    'sheet-1': {
      id: 'sheet-1',
      name: 'Sheet1',
      cellData: {},
      tabColor: '',
      hidden: 0,
      rowCount: 1000,
      columnCount: 26,
      zoomRatio: 1,
      scrollTop: 0,
      scrollLeft: 0,
      defaultColumnWidth: 93,
      defaultRowHeight: 27,
      mergeData: [],
      rowData: {},
      columnData: {},
      showGridlines: 1,
      rowHeader: {
        width: 46,
        hidden: 0
      },
      columnHeader: {
        height: 20,
        hidden: 0
      },
      selections: [],
      rightToLeft: 0,
      sheetType: 0,
      pageBreak: [],
      sheetView: {
        showFormulas: 0,
        showGridLines: 1,
        showRowColHeaders: 1,
        showZeros: 1,
        rightToLeft: 0,
        tabSelected: 1,
        showOutlineSymbols: 0,
        defaultGridColor: {
          r: 0,
          g: 0,
          b: 0,
          a: 1
        }
      },
      freeze: {
        xSplit: 0,
        ySplit: 0,
        startRow: 0,
        startColumn: 0
      }
    }
  },
  sheetOrder: ['sheet-1']
})

onMounted(() => {
  // 保存原始标题
  originalTitle.value = document.title

  const id = route.params.fileId as string
  if (!id) {
    error.value = '文件ID不存在'
    loading.value = false
    return
  }
  fileId.value = id
  initUniver()

  // 监听来自 Univer 插件的保存事件
  window.addEventListener('univer-save', handleUniverSave)
})

watch(aiPanelOpen, open => {
  if (open && !aiHistoryLoaded.value) {
    void loadAiHistory()
  }
  if (open) {
    void scrollAiMessagesToBottom()
  }
})

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('univer-save', handleUniverSave)
  selectionChangeDisposable?.dispose()
  selectionChangeDisposable = null
  // 恢复原始标题
  if (originalTitle.value) {
    document.title = originalTitle.value
  }
  // 页面卸载前强制保存到 COS
  if (univerAPI && fileId.value) {
    const activeWorkbook = univerAPI.getActiveWorkbook()
    if (activeWorkbook) {
      const workbookData = activeWorkbook.save()
      const cleanData = JSON.parse(JSON.stringify(toRaw(workbookData)))
      ensureStylesStructure(cleanData)
      saveSheetData(fileId.value, cleanData, true)
    }
  }

  if (univerInstance) {
    univerInstance.dispose()
    univerInstance = null
  }
  if (univerContainer.value) {
    univerContainer.value.classList.remove('visible')
  }
})

const initUniver = async () => {
  console.log('initUniver called, container:', univerContainer.value)
  if (!univerContainer.value) {
    console.error('univerContainer is null or undefined')
    error.value = '容器初始化失败'
    loading.value = false
    univerContainer.value?.classList.remove('visible')
    return
  }

  try {
    console.log('Creating Univer instance...')
    const { univer, univerAPI: univerApiInstance } = createUniver({
      locale: LocaleType.ZH_CN,
      locales: {
        [LocaleType.ZH_CN]: mergeLocales(sheetsCoreZhCN)
      },
      presets: [
        UniverSheetsCorePreset({
          container: univerContainer.value,
          header: true,
          toolbar: true,
          ribbonType: 'classic',
          footer: false,
          contextMenu: true,
          formulaBar: true
        })
      ]
    })

    // 注册自定义保存按钮插件
    univer.registerPlugin(UniverSaveButtonPlugin)

    console.log('Univer instance created successfully')
    univerAPI = univerApiInstance
    univerInstance = univer

    const res = await getSheetData(fileId.value)
    console.log('getSheetData response:', res)

    let workbookData
    if (res.code === 0 && res.data) {
      workbookData = JSON.parse(JSON.stringify(toRaw(res.data)))
      // 更新页面标题
      if (workbookData.name) {
        updatePageTitle(workbookData.name as string)
      }
    } else {
      error.value = res.message || '加载文件失败'
      loading.value = false
      univerContainer.value.classList.remove('visible')
      return
    }

    normalizeWorkbookData(workbookData)
    univerAPI.createWorkbook(workbookData)
    console.log('Workbook created successfully')

    // 监听编辑事件，触发自动保存
    univerAPI.onCommandExecuted(() => {
      const activeWorkbook = univerAPI?.getActiveWorkbook()
      if (activeWorkbook) {
        const data = activeWorkbook.save()
        handleAutoSave(JSON.parse(JSON.stringify(toRaw(data))))
      }
    })

    const activeWorkbook = univerAPI.getActiveWorkbook()
    if (activeWorkbook) {
      refreshSelectionContext()
      selectionChangeDisposable = activeWorkbook.onSelectionChange(() => {
        refreshSelectionContext()
      })
    }

    loading.value = false
    univerContainer.value.classList.add('visible')
  } catch (e: unknown) {
    console.error('Failed to initialize Univer:', e)
    error.value = e instanceof Error ? e.message : '初始化失败'
    loading.value = false
    univerContainer.value?.classList.remove('visible')
  }
}

/**
 * 规范化工作簿数据，确保符合 Univer 数据结构
 * 主要处理样式引用系统的正确性
 */
const normalizeWorkbookData = (workbookData: Record<string, unknown>) => {
  // 1. 确保 styles 是一个对象（样式引用表）
  if (!workbookData.styles || typeof workbookData.styles !== 'object') {
    workbookData.styles = {}
  }

  // 2. 确保 sheetOrder 是数组
  if (!workbookData.sheetOrder) {
    const sheets = workbookData.sheets as Record<string, unknown> | undefined
    workbookData.sheetOrder = sheets ? Object.keys(sheets) : []
  }

  // 3. 确保 resources 是数组
  if (!Array.isArray(workbookData.resources)) {
    workbookData.resources = []
  }

  const sheets = workbookData.sheets as Record<string, Record<string, unknown>> | undefined
  if (sheets) {
    Object.keys(sheets).forEach(sheetId => {
      const sheet = sheets[sheetId]
      if (!sheet) return

      // 4. 确保必需字段存在
      if (!Array.isArray(sheet.mergeData)) sheet.mergeData = []
      if (!Array.isArray(sheet.selections)) sheet.selections = []
      if (!Array.isArray(sheet.pageBreak)) sheet.pageBreak = []
      if (sheet.rowData === null || sheet.rowData === undefined) sheet.rowData = {}
      if (sheet.columnData === null || sheet.columnData === undefined) sheet.columnData = {}

      // 5. 处理 cellData - 确保样式引用正确
      if (sheet.cellData === null || sheet.cellData === undefined) {
        sheet.cellData = {}
      } else if (typeof sheet.cellData === 'object') {
        // 遍历所有单元格，确保样式引用正确
        const cellData = sheet.cellData as Record<string, Record<string, unknown>>
        Object.keys(cellData).forEach(rowKey => {
          const row = cellData[rowKey]
          if (row && typeof row === 'object') {
            Object.keys(row).forEach(colKey => {
              const cell = row[colKey] as Record<string, unknown>
              if (cell && typeof cell === 'object') {
                // 如果单元格的 s 是对象而非字符串，需要转换为样式引用
                if (cell.s && typeof cell.s === 'object') {
                  const styleObj = cell.s as Record<string, unknown>
                  // 生成样式ID（基于样式内容的哈希）
                  const styleId = generateStyleId(styleObj)
                  // 将样式对象存入 styles 表
                  ;(workbookData.styles as Record<string, unknown>)[styleId] = styleObj
                  // 单元格引用样式ID
                  cell.s = styleId
                }
              }
            })
          }
        })
      }

      // 6. 确保其他必需字段
      if (!sheet.rowHeader) sheet.rowHeader = { width: 46, hidden: 0 }
      if (!sheet.columnHeader) sheet.columnHeader = { height: 20, hidden: 0 }
      if (!sheet.freeze) sheet.freeze = { xSplit: 0, ySplit: 0, startRow: 0, startColumn: 0 }
      if (!sheet.sheetView) {
        sheet.sheetView = {
          showFormulas: 0,
          showGridLines: 1,
          showRowColHeaders: 1,
          showZeros: 1,
          rightToLeft: 0,
          tabSelected: 1,
          showOutlineSymbols: 0,
          defaultGridColor: { r: 0, g: 0, b: 0, a: 1 }
        }
      }
    })
  }
}

/**
 * 生成样式ID
 * 将样式对象转换为唯一的ID字符串
 */
const generateStyleId = (styleObj: Record<string, unknown>): string => {
  // 简单的哈希函数，基于样式内容生成ID
  const str = JSON.stringify(styleObj, Object.keys(styleObj).sort())
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `style_${Math.abs(hash)}`
}

// 自动保存（防抖 2 秒）
const handleAutoSave = debounce(async (workbookData: Record<string, unknown>) => {
  if (!fileId.value) return

  try {
    // 确保保存前样式数据结构正确
    const cleanData = JSON.parse(JSON.stringify(workbookData))
    ensureStylesStructure(cleanData)
    await saveSheetData(fileId.value, cleanData, false)
    autoSaveCount.value = (autoSaveCount.value + 1) % 10
    lastSaveTime.value = new Date().toLocaleTimeString()
    // 通知 Univer 按钮更新最后保存时间
    window.dispatchEvent(new CustomEvent('univer-last-save-time', { detail: lastSaveTime.value }))
    console.log('自动保存成功', autoSaveCount.value)
  } catch (e) {
    console.error('自动保存失败:', e)
  }
}, 2000)

/**
 * 处理来自 Univer 插件的保存事件
 */
const handleUniverSave = async (event: Event) => {
  const customEvent = event as CustomEvent<{ syncToCos: boolean }>
  const { syncToCos } = customEvent.detail

  if (!univerAPI || !fileId.value) {
    message.error('保存失败：编辑器未初始化')
    return
  }

  saving.value = true
  // 通知 Univer 按钮开始保存
  window.dispatchEvent(new CustomEvent('univer-saving-state', { detail: true }))
  try {
    const activeWorkbook = univerAPI.getActiveWorkbook()
    if (!activeWorkbook) {
      message.error('获取工作簿数据失败')
      return
    }

    const workbookData = activeWorkbook.save()
    const cleanData = JSON.parse(JSON.stringify(toRaw(workbookData)))
    ensureStylesStructure(cleanData)

    const res = await saveSheetData(fileId.value, cleanData, syncToCos)

    if (res.code === 0) {
      if (syncToCos) {
        message.success('保存成功')
        autoSaveCount.value = 0
      }
      lastSaveTime.value = new Date().toLocaleTimeString()
      // 通知 Univer 按钮更新最后保存时间
      window.dispatchEvent(new CustomEvent('univer-last-save-time', { detail: lastSaveTime.value }))
    } else {
      message.error(res.message || '保存失败')
    }
  } catch (e: unknown) {
    console.error('保存失败:', e)
    message.error('保存失败')
  } finally {
    saving.value = false
    // 通知 Univer 按钮保存结束
    window.dispatchEvent(new CustomEvent('univer-saving-state', { detail: false }))
  }
}

/**
 * 确保样式结构正确
 * 在保存前调用，确保 styles 对象包含所有被引用的样式
 */
const ensureStylesStructure = (workbookData: Record<string, unknown>) => {
  // 确保 styles 对象存在
  if (!workbookData.styles || typeof workbookData.styles !== 'object') {
    workbookData.styles = {}
  }

  const styles = workbookData.styles as Record<string, unknown>
  const sheets = workbookData.sheets as Record<string, Record<string, unknown>> | undefined

  if (sheets) {
    Object.keys(sheets).forEach(sheetId => {
      const sheet = sheets[sheetId]
      if (!sheet) return

      const cellData = sheet.cellData as Record<string, Record<string, unknown>> | undefined
      if (cellData) {
        Object.keys(cellData).forEach(rowKey => {
          const row = cellData[rowKey]
          if (row && typeof row === 'object') {
            Object.keys(row).forEach(colKey => {
              const cell = row[colKey] as Record<string, unknown>
              if (cell && cell.s) {
                const styleRef = cell.s
                // 如果单元格有样式引用，确保 styles 表中有对应的样式
                if (typeof styleRef === 'string' && !styles[styleRef]) {
                  // 如果引用的样式不存在，创建一个空样式对象
                  styles[styleRef] = {}
                }
              }
            })
          }
        })
      }
    })
  }
}

const refreshSelectionContext = () => {
  const context = getSelectionContext()
  latestSelectionContext.value = context
  currentSelectionLabel.value = context
    ? `${context.sheetName || '当前工作表'}!${toA1(context.startRow ?? 0, context.startCol ?? 0)}:${toA1(context.endRow ?? 0, context.endCol ?? 0)}`
    : '未选择区域'
}

const getSelectionContext = (): ExcelContextInfo | null => {
  const activeWorkbook = univerAPI?.getActiveWorkbook()
  if (!activeWorkbook) return null

  const activeSheet = activeWorkbook.getActiveSheet()
  if (!activeSheet) return null

  const activeRange = activeWorkbook.getActiveRange() || activeSheet.getActiveRange()
  if (!activeRange) return null

  return {
    sheetName: activeSheet.getSheetName(),
    startRow: activeRange.getRow(),
    startCol: activeRange.getColumn(),
    endRow: activeRange.getLastRow(),
    endCol: activeRange.getLastColumn(),
    includeHeaders: true
  }
}

const normalizeEntityId = (id?: string | number | null) => {
  if (id === null || id === undefined || id === '') return ''
  return String(id)
}

const normalizeAiSession = (session: ChatSessionVO): (ChatSessionVO & { id: string }) | null => {
  const id = normalizeEntityId(session.id)
  if (!id) return null
  return {
    ...session,
    id
  }
}

const loadAiHistory = async (preferredSessionId?: string | number | null) => {
  if (aiHistoryLoading.value || !fileId.value) return

  aiHistoryLoading.value = true
  try {
    const res = await listAiChatSessions(fileId.value)
    if (res.code !== 0) {
      throw new Error(res.message || '加载 AI 历史失败')
    }

    const sessions = (res.data || [])
      .map(normalizeAiSession)
      .filter((session): session is ChatSessionVO & { id: string } => Boolean(session))
    aiSessions.value = sessions
    aiHistoryLoaded.value = true

    const nextSessionId =
      preferredSessionId ||
      aiSessionId.value ||
      selectedHistorySessionId.value ||
      null

    if (nextSessionId) {
      await loadAiMessages(nextSessionId)
    } else {
      aiSessionId.value = null
      selectedHistorySessionId.value = ''
      aiMessages.value = []
      pendingActions.value = []
    }
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : '加载 AI 历史失败'
    message.error(errorMessage)
  } finally {
    aiHistoryLoading.value = false
  }
}

const loadAiMessages = async (sessionId: string | number) => {
  const normalizedSessionId = normalizeEntityId(sessionId)
  if (!normalizedSessionId) return

  const res = await listAiChatMessages(normalizedSessionId, 1, 100)
  if (res.code !== 0) {
    throw new Error(res.message || '加载 AI 消息失败')
  }

  aiSessionId.value = normalizedSessionId
  selectedHistorySessionId.value = normalizedSessionId
  aiMessages.value = (res.data || [])
    .filter(item => item.role === 'user' || item.role === 'assistant')
    .map(mapAiHistoryMessage)
  pendingActions.value = []
  await scrollAiMessagesToBottom()
}

const mapAiHistoryMessage = (item: AiChatMessageVO): AiMessageItem => {
  const role = item.role === 'user' ? 'user' : 'assistant'
  const hasToolCalls = Array.isArray(item.toolCalls) && item.toolCalls.length > 0
  const id = normalizeEntityId(item.id)
  const sessionId = normalizeEntityId(item.sessionId)
  return {
    id: id || undefined,
    key: id ? `history-${id}` : `history-${sessionId || 'unknown'}-${role}-${item.createTime || aiLocalMessageId++}`,
    role,
    content: item.content || (hasToolCalls ? '这条回复包含工具调用记录。' : '')
  }
}

const handleAiHistoryChange = async () => {
  if (!selectedHistorySessionId.value) {
    startNewAiChat()
    return
  }
  try {
    await loadAiMessages(selectedHistorySessionId.value)
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : '切换历史记录失败'
    message.error(errorMessage)
  }
}

const formatAiSessionTitle = (session: ChatSessionVO) => {
  const title = session.title || '未命名会话'
  const time = session.updateTime || session.createTime
  if (!time) {
    return title
  }
  return `${title} · ${new Date(time).toLocaleString()}`
}

const createLocalAiMessage = (
  role: AiMessageItem['role'],
  content: string,
  actions?: SpreadsheetAction[],
  id?: string | number
): AiMessageItem => ({
  id: normalizeEntityId(id) || undefined,
  key: normalizeEntityId(id) ? `message-${normalizeEntityId(id)}` : `local-${Date.now()}-${aiLocalMessageId++}`,
  role,
  content,
  actions
})

const startNewAiChat = () => {
  aiSessionId.value = null
  selectedHistorySessionId.value = ''
  aiMessages.value = []
  pendingActions.value = []
  aiInput.value = ''
  void scrollAiMessagesToBottom()
}

const scrollAiMessagesToBottom = async () => {
  await nextTick()
  const list = aiMessageListRef.value
  if (!list) return
  list.scrollTop = list.scrollHeight
}

const createAiSessionTitle = (messageText: string) => {
  const normalized = messageText.replace(/\s+/g, ' ').trim()
  if (!normalized) return fileName.value || '表格助手'
  return normalized.length > 28 ? `${normalized.slice(0, 28)}...` : normalized
}

const ensureAiSession = async (messageText = '') => {
  if (aiSessionId.value) {
    return aiSessionId.value
  }

  const res = await createAiChatSession(fileId.value || undefined, createAiSessionTitle(messageText))
  if (res.code !== 0 || !res.data?.id) {
    throw new Error(res.message || '创建 AI 会话失败')
  }
  const createdSession = normalizeAiSession(res.data)
  if (!createdSession) {
    throw new Error('创建 AI 会话失败：缺少会话 ID')
  }
  aiSessionId.value = createdSession.id
  selectedHistorySessionId.value = createdSession.id
  aiSessions.value = [createdSession, ...aiSessions.value.filter(session => session.id !== createdSession.id)]
  aiHistoryLoaded.value = true
  return createdSession.id
}

const handleAiSend = async () => {
  const text = aiInput.value.trim()
  if (!text || aiLoading.value) return

  aiLoading.value = true
  aiMessages.value.push(createLocalAiMessage('user', text))
  aiInput.value = ''
  void scrollAiMessagesToBottom()

  try {
    refreshSelectionContext()
    const sessionId = await ensureAiSession(text)
    const res = await sendAiChatMessage({
      sessionId,
      message: text,
      context: latestSelectionContext.value
    })

    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || 'AI 回复失败')
    }

    appendAiReply(res.data)
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'AI 请求失败'
    aiMessages.value.push(createLocalAiMessage('assistant', errorMessage))
    message.error(errorMessage)
  } finally {
    aiLoading.value = false
  }
}

const appendAiReply = (reply: AiChatReply) => {
  const actions = reply.actions || []
  const replySessionId = normalizeEntityId(reply.sessionId)
  if (replySessionId) {
    aiSessionId.value = replySessionId
    selectedHistorySessionId.value = replySessionId
  }
  aiMessages.value.push(createLocalAiMessage(
    'assistant',
    reply.reply || '我生成了一组表格操作计划。',
    actions,
    reply.assistantMessageId
  ))
  pendingActions.value = actions.filter(action => !action.executed)
  void scrollAiMessagesToBottom()
}

const renderMarkdown = (source: string) => {
  return markdown.render(source || '')
}

const applyPendingActions = async () => {
  if (!pendingActions.value.length || applyingActions.value) return

  applyingActions.value = true
  try {
    const appliedCount = applySpreadsheetActions(pendingActions.value)
    await saveActiveWorkbook(false)
    pendingActions.value = []
    aiMessages.value.push(createLocalAiMessage('assistant', `已应用 ${appliedCount} 条操作，并保存到缓存。`))
    void scrollAiMessagesToBottom()
    message.success('AI 操作已应用')
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : '应用 AI 操作失败'
    message.error(errorMessage)
  } finally {
    applyingActions.value = false
  }
}

const applySpreadsheetActions = (actions: SpreadsheetAction[]) => {
  const activeWorkbook = univerAPI?.getActiveWorkbook()
  if (!activeWorkbook) {
    throw new Error('编辑器未初始化')
  }

  let appliedCount = 0
  for (const action of actions) {
    const targetSheet = action.sheetName
      ? activeWorkbook.getSheetByName(action.sheetName)
      : activeWorkbook.getActiveSheet()

    if (!targetSheet) {
      throw new Error(`未找到工作表：${action.sheetName || '当前工作表'}`)
    }

    if (action.type === 'SET_CELL_VALUE') {
      assertCellPosition(action)
      targetSheet.getRange(action.row, action.col, 1, 1).setValue(action.value as string | number | boolean | null)
      appliedCount++
      continue
    }

    if (action.type === 'SET_RANGE_VALUES') {
      assertRangePosition(action)
      const values = normalizeMatrix(action.values)
      if (!values.length) {
        continue
      }
      const columnCount = values.reduce((max, row) => Math.max(max, row.length), 0)
      targetSheet.getRange(action.startRow, action.startCol, values.length, columnCount).setValues(values)
      appliedCount++
      continue
    }

    if (action.type === 'INSERT_COLUMN_WITH_VALUES') {
      assertInsertColumnAction(action)
      const values = normalizeMatrix(action.values)
      const targetCol = action.targetCol ?? action.insertAfterCol + 1
      targetSheet.insertColumnsAfter(action.insertAfterCol, 1)
      if (typeof action.headerRow === 'number' && action.headerValue) {
        targetSheet.getRange(action.headerRow, targetCol, 1, 1).setValue(action.headerValue)
      }
      if (values.length) {
        targetSheet.getRange(action.startRow, targetCol, values.length, 1).setValues(values)
      }
      appliedCount++
      continue
    }

    if (action.type === 'SET_FORMULA') {
      assertCellPosition(action)
      targetSheet.getRange(action.row, action.col, 1, 1).setFormula(action.formula || '')
      appliedCount++
    }
  }

  return appliedCount
}

const saveActiveWorkbook = async (syncToCos: boolean) => {
  const activeWorkbook = univerAPI?.getActiveWorkbook()
  if (!activeWorkbook || !fileId.value) {
    throw new Error('无法保存：编辑器或文件 ID 不存在')
  }

  const workbookData = activeWorkbook.save()
  const cleanData = JSON.parse(JSON.stringify(toRaw(workbookData)))
  ensureStylesStructure(cleanData)
  const res = await saveSheetData(fileId.value, cleanData, syncToCos)
  if (res.code !== 0) {
    throw new Error(res.message || '保存失败')
  }
  lastSaveTime.value = new Date().toLocaleTimeString()
  window.dispatchEvent(new CustomEvent('univer-last-save-time', { detail: lastSaveTime.value }))
}

const assertCellPosition = (action: SpreadsheetAction): asserts action is SpreadsheetAction & { row: number; col: number } => {
  if (typeof action.row !== 'number' || typeof action.col !== 'number') {
    throw new Error(`操作 ${action.type || ''} 缺少单元格位置`)
  }
}

const assertRangePosition = (
  action: SpreadsheetAction
): asserts action is SpreadsheetAction & { startRow: number; startCol: number } => {
  if (typeof action.startRow !== 'number' || typeof action.startCol !== 'number') {
    throw new Error(`操作 ${action.type || ''} 缺少区域起点`)
  }
}

const assertInsertColumnAction = (
  action: SpreadsheetAction
): asserts action is SpreadsheetAction & { insertAfterCol: number; startRow: number } => {
  if (typeof action.insertAfterCol !== 'number' || typeof action.startRow !== 'number') {
    throw new Error(`操作 ${action.type || ''} 缺少插入列位置`)
  }
}

const normalizeMatrix = (values?: unknown[][]) => {
  if (!Array.isArray(values)) return []
  const columnCount = values.reduce((max, row) => Math.max(max, Array.isArray(row) ? row.length : 0), 0)
  return values.map(row => {
    const normalizedRow = Array.isArray(row) ? [...row] : []
    while (normalizedRow.length < columnCount) {
      normalizedRow.push(null)
    }
    return normalizedRow
  })
}

const toA1 = (row: number, col: number) => {
  let current = col
  let columnName = ''
  while (current >= 0) {
    columnName = String.fromCharCode(65 + (current % 26)) + columnName
    current = Math.floor(current / 26) - 1
  }
  return `${columnName}${row + 1}`
}

const handleBack = () => {
  univerContainer.value?.classList.remove('visible')
  router.push('/workbench')
}
</script>

<style scoped>
.spreadsheet-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.loading-container,
.error-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 100;
}

.univer-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ai-fab {
  position: fixed;
  right: 22px;
  bottom: 30px;
  z-index: 130;
  display: grid;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
  cursor: pointer;
  place-items: center;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.ai-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 52px rgba(15, 23, 42, 0.22);
}

.ai-fab:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ai-logo-fab {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.ai-logo-inline {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex: 0 0 auto;
}

.ai-message-avatar {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  margin-top: 2px;
  object-fit: contain;
  border-radius: 6px;
}

.ai-panel {
  --ai-ink: #202124;
  --ai-muted: #6b7280;
  --ai-line: rgba(100, 116, 139, 0.24);
  position: fixed;
  top: 96px;
  right: 22px;
  bottom: 30px;
  z-index: 129;
  display: flex;
  width: min(620px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.92);
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.97) 82%, rgba(239, 253, 250, 0.96) 100%);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.14);
  color: var(--ai-ink);
  flex-direction: column;
  backdrop-filter: blur(16px);
}

.ai-panel::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: linear-gradient(90deg, rgba(240, 253, 250, 0.8), transparent 24%, transparent 76%, rgba(240, 253, 250, 0.7));
}

.ai-panel-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 58px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.92);
  background: rgba(255, 255, 255, 0.94);
}

.ai-panel-title {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.ai-panel-title div {
  display: grid;
  min-width: 0;
}

.ai-panel-title strong {
  color: #111827;
  font-size: 14px;
  line-height: 1.3;
}

.ai-panel-title span {
  overflow: hidden;
  color: var(--ai-muted);
  font-size: 12px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-panel-controls {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 8px;
}

.ai-new-chat-button {
  height: 34px;
  padding: 0 10px;
  border: 1px solid rgba(15, 118, 110, 0.24);
  border-radius: 8px;
  background: #f0fdfa;
  color: #0f766e;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

.ai-new-chat-button:hover:not(:disabled) {
  border-color: #0f766e;
  background: #ccfbf1;
}

.ai-new-chat-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.ai-history-field {
  display: flex;
  align-items: center;
  width: 220px;
  min-width: 0;
  height: 34px;
  gap: 6px;
  padding: 0 8px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 8px;
  background: #fff;
  color: #475569;
}

.ai-history-field select {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #334155;
  cursor: pointer;
  font-size: 12px;
}

.ai-history-field select:disabled {
  cursor: not-allowed;
  color: #94a3b8;
}

.ai-icon-button {
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 8px;
  background: #fff;
  color: #475569;
  cursor: pointer;
  place-items: center;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

.ai-icon-button:hover:not(:disabled) {
  border-color: #0f766e;
  background: #f0fdfa;
  color: #0f766e;
}

.ai-icon-button:disabled {
  cursor: wait;
  opacity: 0.5;
}

.ai-selection-label,
.ai-message-role {
  margin: 0 0 4px;
  color: var(--ai-muted);
  font-size: 12px;
  font-weight: 700;
}

.ai-message-list {
  flex: 1;
  z-index: 1;
  margin: 0;
  padding: 14px 16px 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.ai-empty {
  display: flex;
  gap: 12px;
  padding: 24px 16px;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  border-radius: 10px;
  background: transparent;
  color: var(--ai-muted);
  font-size: 14px;
  line-height: 1.6;
}

.ai-message {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
  line-height: 1.58;
}

.ai-message-user {
  justify-content: flex-end;
  margin: 0 0 16px auto;
  padding-right: 2px;
}

.ai-message-user .ai-message-content {
  max-width: 82%;
  padding: 8px 13px;
  border-radius: 12px 12px 4px 12px;
  background: linear-gradient(135deg, #0f8d7d, #0b756a);
  color: #fff;
  font-weight: 500;
  box-shadow: 0 10px 24px rgba(15, 141, 125, 0.22);
}

.ai-message-user .ai-message-role {
  display: none;
}

.ai-message-user .ai-markdown {
  color: #fff;
}

.ai-message-assistant {
  align-items: flex-start;
  margin-right: 0;
}

.ai-message-assistant .ai-message-content {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}

.ai-markdown {
  color: #2f3437;
  max-width: 100%;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.58;
  overflow-wrap: anywhere;
}

.ai-markdown :deep(p) {
  margin: 0;
}

.ai-markdown :deep(p + p),
.ai-markdown :deep(ul + p),
.ai-markdown :deep(pre + p) {
  margin-top: 10px;
}

.ai-markdown :deep(h1),
.ai-markdown :deep(h2),
.ai-markdown :deep(h3),
.ai-markdown :deep(h4),
.ai-markdown :deep(h5),
.ai-markdown :deep(h6) {
  margin: 0 0 8px;
  color: inherit;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}

.ai-markdown :deep(ul) {
  margin: 8px 0 0;
  padding-left: 22px;
}

.ai-markdown :deep(li + li) {
  margin-top: 4px;
}

.ai-markdown :deep(code) {
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  font-size: 13px;
  font-family: 'Cascadia Code', 'JetBrains Mono', monospace;
}

.ai-markdown :deep(pre) {
  margin: 10px 0 0;
  padding: 12px;
  overflow-x: auto;
  border-radius: 14px;
  background: #10201d;
  color: #e6fffb;
}

.ai-markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

.ai-markdown :deep(a) {
  color: #0f766e;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.ai-markdown :deep(table) {
  width: max-content;
  min-width: 100%;
  margin: 10px 0;
  border: 1px solid #cbd5e1;
  border-collapse: collapse;
  background: #fff;
  font-size: 13px;
  line-height: 1.45;
}

.ai-markdown :deep(th),
.ai-markdown :deep(td) {
  padding: 7px 9px;
  border: 1px solid #cbd5e1;
  text-align: left;
  vertical-align: top;
  white-space: nowrap;
}

.ai-markdown :deep(th) {
  background: #f8fafc;
  color: #1f2937;
  font-weight: 700;
}

.ai-markdown :deep(tr:nth-child(even) td) {
  background: #f9fafb;
}

.ai-action-list {
  display: grid;
  flex: 0 0 calc(100% - 40px);
  gap: 8px;
  margin: 2px 0 0 40px;
}

.ai-action-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px;
  border-radius: 12px;
  background: rgba(15, 118, 110, 0.08);
  font-size: 13px;
}

.ai-pending-actions {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 16px 0;
  padding: 12px;
  border: 1px solid var(--ai-line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.84);
}

.ai-input-area {
  position: relative;
  z-index: 1;
  display: block;
  margin: 16px;
  padding: 8px 46px 10px 12px;
  border: 1px solid rgba(226, 232, 240, 0.96);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
}

.ai-input-area label {
  color: var(--ai-muted);
  font-size: 14px;
  font-weight: 800;
  line-height: 1.6;
}

.ai-input-area :deep(.ant-input) {
  padding: 2px 0 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  font-size: 14px;
  resize: none;
}

.ai-input-area :deep(.ant-input:focus) {
  border: 0;
  box-shadow: none;
}

.ai-send-button {
  position: absolute;
  right: 11px;
  bottom: 10px;
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: #2f55ff;
  cursor: pointer;
  place-items: center;
}

.ai-send-button span {
  width: 0;
  height: 0;
  margin-left: 2px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 11px solid #fff;
}

.ai-send-button:disabled {
  cursor: wait;
  opacity: 0.58;
}

/* 保存状态指示器 - 定位到工具栏右侧 */
.save-indicator {
  position: absolute;
  top: 12px;
  right: 60px;
  z-index: 10;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.saving-text {
  color: #1890ff;
}

.auto-save-count {
  color: #faad14;
}

.last-save-time {
  color: #52c41a;
}

/* 返回按钮 - 左上角 */
.back-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

@media (max-width: 640px) {
  .ai-panel {
    top: 78px;
    right: 12px;
    bottom: 76px;
    width: calc(100vw - 24px);
    border-radius: 18px;
  }

  .ai-panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .ai-panel-controls {
    width: 100%;
  }

  .ai-new-chat-button {
    flex: 0 0 auto;
  }

  .ai-history-field {
    flex: 1;
    width: auto;
  }

  .ai-message-list {
    padding: 12px 12px 0;
  }

  .ai-message-user .ai-message-content {
    max-width: 92%;
  }

  .ai-fab {
    right: 16px;
    bottom: 18px;
  }
}

</style>
