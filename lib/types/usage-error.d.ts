/**
 * Classify a Cline usage HTTP failure.
 *
 * Cline rejects a missing, expired, or unauthorized key with 401/403 — the
 * key or the ClinePass entitlement is the problem, and retrying cannot fix it.
 * 429 means Cline is throttling the plan's window, which clears on its own.
 * 408 and 5xx are upstream faults. The hint is appended to the caller's
 * `RemoteError` message; the upstream reason (if any) comes from
 * {@link readUsageError}.
 *
 * @param status - the HTTP status of the usage response.
 * @returns whether a retry may succeed, and the guidance to append.
 */
export declare function usageHttpFailure(status: number): {
    readonly retryable: boolean;
    readonly hint: string;
};
interface UsageErrorOptions {
    apiKey: string;
    baseURL: string;
    proxyURL: string;
    signal: AbortSignal;
}
/** Read only diagnostic text; a slow/broken error body cannot hide its HTTP status. */
export declare function readUsageError(response: Response, options: UsageErrorOptions): Promise<string | undefined>;
export {};
