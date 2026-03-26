import { Disposable, ICommandService, Inject, Injector } from '@univerjs/core'
import { ComponentManager, IMenuManagerService } from '@univerjs/ui'
import { RibbonStartGroup } from '@univerjs/ui'
import { SaveOperation } from './commands/SaveOperation'
import { SaveMenuItemFactory } from './SaveButtonMenu'
import { SaveIcon } from './components/SaveIcon'

export class SaveButtonController extends Disposable {
  constructor(
    @Inject(Injector) private readonly _injector: Injector,
    @ICommandService private readonly _commandService: ICommandService,
    @IMenuManagerService private readonly _menuManagerService: IMenuManagerService,
    @Inject(ComponentManager) private readonly _componentManager: ComponentManager,
  ) {
    super()

    this._initCommands()
    this._registerComponents()
    this._initMenus()
  }

  private _initCommands(): void {
    [
      SaveOperation,
    ].forEach((c) => {
      this.disposeWithMe(this._commandService.registerCommand(c))
    })
  }

  private _registerComponents(): void {
    this.disposeWithMe(this._componentManager.register('SaveIcon', SaveIcon))
  }

  private _initMenus(): void {
    this._menuManagerService.mergeMenu({
      [RibbonStartGroup.HISTORY]: {
        [SaveOperation.id]: {
          order: 1,
          menuItemFactory: SaveMenuItemFactory,
        },
      },
    })
  }
}
