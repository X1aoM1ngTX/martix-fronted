import type { Dependency } from '@univerjs/core'
import { Inject, Injector, Plugin, touchDependencies, UniverInstanceType } from '@univerjs/core'
import { SaveButtonController } from './SaveButtonController'

const SAVE_BUTTON_PLUGIN = 'SAVE_BUTTON_PLUGIN'

export class UniverSaveButtonPlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET
  static override pluginName = SAVE_BUTTON_PLUGIN

  constructor(
    @Inject(Injector) protected readonly _injector: Injector,
  ) {
    super()
  }

   override onStarting(): void {
    ([
      [SaveButtonController],
    ] as Dependency[]).forEach(d => this._injector.add(d))
  }

  override onRendered(): void {
    touchDependencies(this._injector, [[SaveButtonController]])
  }
}
