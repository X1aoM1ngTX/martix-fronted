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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import sheetsCoreZhCN from '@univerjs/preset-sheets-core/locales/zh-CN'
import { createUniver, LocaleType, mergeLocales, type Univer } from '@univerjs/presets'
import { getSheetData, saveSheetData } from '@/api/sheetController'
import { UniverSaveButtonPlugin } from '@/univer-plugins/save-button'

import '@univerjs/preset-sheets-core/lib/index.css'

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
let univerInstance: Univer | null = null
let univerAPI: ReturnType<typeof createUniver>['univerAPI'] | null = null

// 状态
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const fileId = ref<string>('')
const autoSaveCount = ref(0)
const lastSaveTime = ref('')
const fileName = ref<string>('')
const originalTitle = ref('')

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

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('univer-save', handleUniverSave)
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

</style>
