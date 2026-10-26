import type { Context } from '@deepseek-ai/cordis';
import { type ClinePassSettings } from '../config-contract.ts';
import type { SettingsScope } from './settings.ts';
import type { ExecuteAccountCommand } from './accounts-controller.ts';
/** Only the boundary knows whether the host exposes profile forms or legacy scopes. */
export declare function mountSettingsScopes(ctx: Context, mount: (ctx: Context, scope: SettingsScope<ClinePassSettings>) => void): void;
export declare function accountCommands(ctx: Context): ExecuteAccountCommand;
