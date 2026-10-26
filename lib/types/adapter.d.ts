/**
 * The ClinePass adapter: one route, one catalog, one task identity per call.
 *
 * Every request to the API carries two Harness-owned headers: the attribution
 * User-Agent (`deepseek-harness/<version>`), which pi-ai's client lets request
 * headers override, and `X-Task-ID`, the documented Cline request identity that
 * the extension itself uses to group a conversation's calls. The header value
 * follows the request's session id, with special strings mapped to stable ASCII
 * values across continuation and restore. A request with no session id gets one
 * fresh random value shared by every account attempt in that logical call.
 *
 * Multi-turn correctness rides on the shared pi-ai conversion machinery
 * (`toPiContext` reconstructs provider-native replay state from the session
 * log; `toStreamChunks` maps events to seam chunks), so assistant history,
 * tool calls, and usage land in the session log exactly as the generic pi-ai
 * adapter records them. Image content rides the same machinery: models whose
 * catalog entry declares the image modality convert attachments through the
 * durable attachment service, and every other model refuses image content
 * before any provider I/O.
 *
 * @module dsh-llm-clinepass/adapter
 */
import type { ClinePassRequestExecutorOptions } from './request-executor.ts';
import { LlmAdapter } from '@deepseek-ai/dsh-llm';
import type { GenerateOptions, LlmModelInfo, LlmResolvedModelInfo, StreamChunk } from '@deepseek-ai/dsh-llm';
import { ClinePassCatalog, type CatalogDiagnostic } from './catalog.ts';
import { ProxyTransport } from './proxy.ts';
import type { ClinePassConfig } from './config.ts';
import { type ClineAccountSwitch } from './accounts.ts';
import { type ClineCallTrace } from './call-trace.ts';
export type { ClineCallTrace } from './call-trace.ts';
export type { ClinePassImageAccess } from './request-executor.ts';
/** One request's serving account, with the identity captured before discovery. */
export interface ClineAccountSettlement {
    seq: number;
    generation: number;
    config: ClinePassConfig;
    ref: string;
    notice?: ClineAccountSwitch;
}
/** Constructor inputs for {@link ClinePassAdapter}. */
export interface ClinePassAdapterOptions extends ClinePassRequestExecutorOptions {
    /** Shared with Host usage reads for this plugin mount. */
    transport?: ProxyTransport;
    /** Mount-owned discovery; direct construction supplies its own manager. */
    catalog?: (config: ClinePassConfig) => ClinePassCatalog;
    /**
     * The current configuration, re-read at every operation: a settings write
     * reaches the next request without a restart, and one operation never mixes
     * two configuration generations.
     */
    config: () => ClinePassConfig;
    /** Observe one bounded, content-free summary for every dispatched call. */
    onCallTrace?: (trace: ClineCallTrace) => void;
    /** Observe the catalog falling back to the curated table. */
    onFallback?: (detail: {
        url: string;
        error: unknown;
        kept: number;
    }) => void;
    /** Observe live ids the curated table cannot route. */
    onOmitted?: (ids: readonly string[]) => void;
    onCatalogWarning?: (warning: string) => void;
    /** Content-free timings for cache restoration and each shared online refresh. */
    onCatalogDiagnostic?: (event: CatalogDiagnostic) => void;
    /** Re-read picker models after a background catalog refresh commits. */
    onCatalogRefresh?: () => void;
    /** Host account-state version for actual requests, captured before asynchronous model discovery. */
    accountGeneration?: () => number;
    /** One outcome for both the displayed notice and the persisted selection. */
    onAccountSettled?: (event: ClineAccountSettlement) => void;
    /** Legacy notice observer. Hosts that persist selection should use onAccountSettled. */
    onAccountSwitch?: (notice: ClineAccountSwitch | undefined, config: ClinePassConfig, seq: number) => void;
}
/**
 * The single route's adapter. The catalog snapshot freezes at each operation,
 * so a refresh between two requests never mixes model generations inside one
 * call.
 */
export declare class ClinePassAdapter extends LlmAdapter {
    private readonly options;
    private readonly resolveCatalog;
    private readonly transport;
    private readonly requestExecutor;
    /** Per-reference rejection deadlines, isolated by the gateway that rejected it. */
    private readonly rejectedKeys;
    /** Reference updates invalidate rejections from attempts using an older key. */
    private readonly credentialVersions;
    /** Monotonic sequence of the latest request this adapter started. */
    private callSeq;
    constructor(options: ClinePassAdapterOptions);
    dispose(): Promise<void>;
    /**
     * The catalog resolver for one configuration, rebuilding on the facts it
     * owns. Public for the plugin's discovery registration, which resolves the
     * current configuration the same way the adapter does.
     * @param config - the endpoint and refresh interval for the raw catalog.
     * @returns the resolver caching catalog values, independent of deployment limits.
     */
    catalogOf(config: ClinePassConfig): ClinePassCatalog;
    providerInfo(provider: string): {
        id: string;
        name: string;
    };
    listModels(_provider: string): Promise<readonly LlmModelInfo[]>;
    resolveModel(_provider: string, model: string, signal?: AbortSignal): Promise<LlmResolvedModelInfo>;
    /** Capture limits and protocol before discovery can yield to a settings update. */
    private modelSnapshot;
    /** Keep capability resolution and eventual dispatch on the same configuration. */
    prepareCall(_provider: string, model: string, signal?: AbortSignal): Promise<{
        model: LlmResolvedModelInfo;
        stream: (options: GenerateOptions) => AsyncIterable<StreamChunk>;
    }>;
    /** Report the same default allowance used by dispatch so the host can budget compaction. */
    private modelInfo;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
    private streamWithSnapshot;
    private dispatch;
    private streamAccounts;
    private rememberRejectedKey;
    /** A stored change to a reference outranks the gateway's last rejection of it. */
    forgetRejectedKey(ref: string): void;
}
