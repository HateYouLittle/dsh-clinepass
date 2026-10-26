import type { Context } from '@deepseek-ai/cordis';
import type { ClinePassConfig } from './config-contract.ts';
import type { AccountSettingsWriter } from './settings-bridge.ts';
export declare function validateClinePassConfig(value: ClinePassConfig): void;
/** Version-specific settings attachment and validation stay at the host boundary. */
export declare function installHostSettings(ctx: Context, entry: ClinePassConfig, options: {
    connect: (settings: AccountSettingsWriter) => () => void;
    setSource: (source: () => ClinePassConfig) => void;
    onChange: () => void;
    recover: () => void;
}): void;
