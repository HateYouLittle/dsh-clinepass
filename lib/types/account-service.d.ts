import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { AccountCommand } from './accounts-contract.ts';
import type { ClineAccountManager } from './account-manager.ts';
/** The browser sends commands; the host owns credentials, revisions and recovery. */
export declare class ClineAccountsService extends TypertRemoteService {
    private readonly options;
    constructor(ctx: Context, options: {
        manager: ClineAccountManager;
    });
    execute(command: AccountCommand): Promise<import("./settings-bridge.ts").SettingsWriteResult>;
}
