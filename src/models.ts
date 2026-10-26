import type { Context } from '@deepseek-ai/cordis'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { discoverSettingsModels, type ClinePassCatalog } from './catalog.ts'
import type { ClineModelCatalog } from './models-contract.ts'

/** Uses the same gateway snapshot as the adapter, including models hidden from pickers. */
export class ClineModelsService extends TypertRemoteService {
  constructor(ctx: Context, private readonly options: {
    catalog: () => ClinePassCatalog
    onRefresh?: () => void
  }) {
    super(ctx, 'clinePassModels')
  }

  async read(): Promise<ClineModelCatalog> {
    try {
      return await discoverSettingsModels(this.options.catalog())
    } finally {
      // Settings and pickers consume the same freshly committed or retained snapshot.
      this.options.onRefresh?.()
    }
  }
}
