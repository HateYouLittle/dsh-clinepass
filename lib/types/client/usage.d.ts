import type { Context } from '@deepseek-ai/cordis';
import type { SettingsScope } from './settings.ts';
import type { ClinePassSettings } from './section-controller.ts';
export declare function registerUsagePill(ctx: Context, settings: SettingsScope<ClinePassSettings>, selectAccount?: (ref: string) => Promise<boolean>): void;
