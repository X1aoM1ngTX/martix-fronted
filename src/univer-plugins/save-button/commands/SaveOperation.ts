import type { IAccessor, ICommand } from '@univerjs/core'
import { CommandType } from '@univerjs/core'

export interface ISaveOperationParams {
  syncToCos: boolean
}

export const SaveOperation: ICommand<ISaveOperationParams> = {
  id: 'save-button.operation.save',
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor, params?: ISaveOperationParams) => {
    // 触发自定义事件，由 Vue 组件监听并处理保存逻辑
    window.dispatchEvent(new CustomEvent('univer-save', {
      detail: { syncToCos: params?.syncToCos ?? true }
    }))
    return true
  },
}
