import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { type ClineUsage } from './usage-contract.ts';
import type { ClineAccountSwitch } from './accounts.ts';
import { ProxyTransport } from './proxy.ts';
interface UsageOptions {
    baseURL: () => string;
    proxyURL?: () => string;
    transport?: ProxyTransport;
    resolveApiKey: (ref?: string) => Promise<string | undefined>;
    activeRef?: () => string;
    accountRefs?: () => readonly string[];
    lastSwitch?: () => ClineAccountSwitch | undefined;
}
/**
 * ClinePass plan usage for the settings UI.
 *
 * Reads `GET {base}/users/me/plan/usage-limits`, whose `data.limits` rows
 * carry the 5-hour rolling, weekly, and monthly windows as `percentUsed` plus
 * a reset timestamp. Account statistics are fetched on the Host; credentials
 * never enter the browser.
 */
export declare class ClineUsageService extends TypertRemoteService {
    private readonly options;
    private readonly identities;
    private readonly pending;
    private readonly transport;
    constructor(ctx: Context, options: UsageOptions);
    read(): Promise<ClineUsage>;
    readAccount(ref: string): Promise<ClineUsage>;
    private readRef;
    private fetchUsage;
}
export {};
