import type { Context } from '@deepseek-ai/cordis'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { AccountCommand } from './accounts-contract.ts'
import type { ClineAccountManager } from './account-manager.ts'

/** The browser sends commands; the host owns credentials, revisions and recovery. */
export class ClineAccountsService extends TypertRemoteService {
  constructor(ctx: Context, private readonly options: { manager: ClineAccountManager }) {
    super(ctx, 'clinePassAccounts')
  }

  execute(command: AccountCommand) {
    return this.options.manager.execute(command)
  }
}
