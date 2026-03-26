import type { IMenuButtonItem } from '@univerjs/ui'
import { MenuItemType } from '@univerjs/ui'
import { SaveOperation } from './commands/SaveOperation'

export function SaveMenuItemFactory(): IMenuButtonItem<string> {
  return {
    id: SaveOperation.id,
    type: MenuItemType.BUTTON,
    icon: 'SaveIcon',
    tooltip: '保存文件到云端',
    title: '保存',
  }
}
