import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol';
import type { ClineAccountSwitch } from './accounts.ts';
export interface UsageWindow {
    status: 'ok' | 'rate-limited';
    percent: number;
    /**
     * ISO timestamp the provider reported for this window's next reset.
     *
     * Absent when the provider reports no reset time. Measured against the live
     * endpoint: a window that is idle at `percentUsed: 0` carries no `resetsAt`
     * at all (the rolling 5-hour window does this whenever it has gone quiet),
     * while an active or recently used window carries one. Treating a missing
     * value as malformed rejected the whole reading.
     */
    resetsAt?: string;
}
export interface ClineUsage {
    /** Opaque Host identity for this endpoint/account; never a credential or its hash. */
    source?: string;
    lastSwitch?: ClineAccountSwitch;
    rolling: UsageWindow;
    weekly: UsageWindow;
    monthly: UsageWindow;
}
/** The three windows of {@link ClineUsage}, in display order. */
export declare const USAGE_WINDOWS: readonly ["rolling", "weekly", "monthly"];
/**
 * ClinePass `type` values mapped onto the three windows of the contract.
 * `GET {base}/users/me/plan/usage-limits` reports `five_hour`, `weekly`, and
 * `monthly`; anything else the endpoint may add later is ignored.
 */
export declare const USAGE_LIMIT_TYPES: Readonly<Record<string, (typeof USAGE_WINDOWS)[number]>>;
/**
 * Derive a window's status from the percentage ClinePass reports.
 *
 * The usage endpoint publishes no status field, so the contract's two states
 * must be derived deterministically: a window is `rate-limited` exactly when
 * `percentUsed >= 100`, i.e. the window's allowance is exhausted and the next
 * request against it would be refused. Every in-range value below 100 is `ok`;
 * softer warning bands belong to the presentation layer, which already colours
 * by percent (`UsagePill` treats `status === 'rate-limited' || percent >= 100`
 * as limited, so the two agree).
 *
 * @param percent - the provider's `percentUsed`, already validated to 0..100.
 * @returns the contract status for that window.
 */
export declare function usageWindowStatus(percent: number): UsageWindow['status'];
export declare function parseAccountSwitch(value: unknown): ClineAccountSwitch;
/**
 * Validate a Host-produced {@link ClineUsage} value. This is the remote
 * codec's parser, so the browser rejects a malformed result instead of
 * rendering a zeroed window.
 * @param value - the value crossing the remote boundary.
 * @returns the validated snapshot.
 */
export declare function parseClineUsage(value: unknown): ClineUsage;
/**
 * Parse the ClinePass usage endpoint's response body:
 *
 * ```json
 * { "data": { "limits": [
 *   { "type": "five_hour", "percentUsed": 12.5, "resetsAt": "2026-10-26T18:00:00.000Z" },
 *   { "type": "weekly",    "percentUsed": 3,    "resetsAt": "2026-11-02T00:00:00.000Z" },
 *   { "type": "monthly",   "percentUsed": 0.5,  "resetsAt": "2026-11-01T00:00:00.000Z" }
 * ] } }
 * ```
 *
 * Each row must carry a finite `percentUsed` in 0..100. `resetsAt` is
 * OPTIONAL: the live endpoint omits it for a window that is idle at 0% (the
 * rolling 5-hour window does this whenever it has gone quiet), and only a
 * present value must parse. All three windows must be present. A malformed or
 * missing row throws, so the service reports the reading as unavailable instead
 * of presenting a zero. Unknown `type` values are ignored (the endpoint may add
 * windows this contract cannot show), while a duplicated window type is
 * rejected as ambiguous rather than silently resolved.
 *
 * @param body - the decoded JSON body of `GET {base}/users/me/plan/usage-limits`.
 * @returns the three windows, without `source` (the service stamps that).
 */
export declare function parseUsageLimitsResponse(body: unknown): ClineUsage;
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface RemoteErrorDetailsMap {
        'clinepass/usage-unavailable': {
            readonly retryable: boolean;
            readonly retainPrevious: boolean;
            readonly source?: string;
            readonly lastSwitch?: ClineAccountSwitch;
        };
    }
    interface TypertRemoteNamespaceMap {
        clinePassUsage: {
            read(): Promise<RemoteResult<ClineUsage>>;
            readAccount(ref: string): Promise<RemoteResult<ClineUsage>>;
        };
    }
}
export declare const usageRemote: TypertRemoteContribution;
