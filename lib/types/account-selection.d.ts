import type { ClineAccountSettlement } from './adapter.ts';
import { type ClineAccountSwitch } from './accounts.ts';
import type { ClinePassConfig } from './config.ts';
import { type AccountSettingsWriter } from './settings-bridge.ts';
export type { AccountSettingsWriter } from './settings-bridge.ts';
/** Owns both the fallback notice and its optional persisted account selection. */
export declare class ClineAccountSelection {
    private readonly config;
    private readonly logger;
    private settings;
    private connection;
    private credentials;
    private version;
    private signature;
    private latestSeq;
    private notice;
    constructor(config: () => ClinePassConfig, logger: {
        debug(message: string): void;
        warn(message: string): void;
    });
    connect(settings: AccountSettingsWriter): () => void;
    private row;
    /** Reading the revision also catches A → C → A before async change watchers run. */
    capture(): number;
    credentialChanged(): void;
    lastSwitch(): ClineAccountSwitch | undefined;
    /** One freshness decision governs both side effects of a request's outcome. */
    settle(event: ClineAccountSettlement): void;
    private adopt;
}
