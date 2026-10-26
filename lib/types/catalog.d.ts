import type { Api, Model, Provider } from './sdk-types.ts';
import type { LlmDiscoveredModel } from '@deepseek-ai/dsh-llm';
import { type ModelMetadata } from './model-metadata.ts';
import { type ClineModelCatalog } from './models-contract.ts';
import { type DiagnosticTiming } from './diagnostic-timing.ts';
export { PROVIDER_ID, DISPLAY_NAME } from './provider-identity.ts';
export { DEFAULT_BASE_URL } from './gateway-url.ts';
export interface CatalogSnapshot {
    readonly details: ModelMetadata['details'];
    readonly models: ReadonlyMap<string, Model<Api>>;
    /** Advertised ids with missing/unsupported metadata stay visible with a diagnostic. */
    readonly unavailable: ReadonlyMap<string, string>;
    readonly provider: Provider;
    /** The gateway listing was readable on this refresh. */
    readonly live: boolean;
    /**
     * The curated configuration shipped with the plugin is always available, so
     * this is always true. Retained so consumers keep one snapshot shape.
     */
    readonly metadataLive: boolean;
    /** Retained for explicit discovery; runtime callers may still use the last catalog. */
    readonly listingFailure?: unknown;
    readonly listingWarning?: string;
    /** Always absent: there is no online configuration source to fail. */
    readonly metadataFailure?: unknown;
    /** Last successful fetch or revalidation, not the time of a failed attempt. */
    readonly listingUpdatedAtMs?: number;
    /** Always absent: a shipped table has no fetch time to report. */
    readonly metadataUpdatedAtMs?: number;
    readonly fetchedAtMs: number;
}
/** One catalog instance; refresh 0 is the first build, then online refreshes count from 1. */
export interface CatalogDiagnostic extends DiagnosticTiming {
    readonly catalogId: string;
    readonly refresh: number;
    readonly url?: string;
}
/** A valid empty listing means the gateway serves nothing; malformed replies are failures. */
export declare function readLiveModelIds(body: unknown, onInvalidRows?: (warning: string) => void): readonly string[];
/** Runtime requests reuse a snapshot; discovery revalidates it. Concurrent reads coalesce. */
export declare class ClinePassCatalog {
    private readonly baseURL;
    private readonly refreshMs;
    private readonly onFallback;
    /** Kept for API compatibility; now reports advertised ids this build cannot configure. */
    private readonly onOmitted;
    private readonly onRefresh;
    private readonly fetcher?;
    private readonly onWarning?;
    private readonly onDiagnostic?;
    private readonly diagnosticId;
    /** The shipped table, resolved once for this gateway. Membership never depends on the network. */
    private readonly metadata;
    private refreshSequence;
    private served;
    private pending;
    private failures;
    private refreshAtMs;
    constructor(baseURL: string, refreshMs: number, onFallback: (detail: {
        url: string;
        error: unknown;
        kept: number;
    }) => void, 
    /** Kept for API compatibility; now reports advertised ids this build cannot configure. */
    onOmitted: (ids: readonly string[]) => void, onRefresh?: () => void, fetcher?: typeof globalThis.fetch | undefined, onWarning?: ((warning: string) => void) | undefined, onDiagnostic?: ((event: CatalogDiagnostic) => void) | undefined);
    private observer;
    snapshot(force?: boolean, signal?: AbortSignal): Promise<CatalogSnapshot>;
    private currentSnapshot;
    private startRefresh;
    /**
     * The curated table decides membership; the listing only adds diagnostics.
     *
     * Cline's listing advertises the general router catalog and never the
     * `cline-pass/*` ids, so neither an empty listing nor an unreachable one may
     * change what the picker offers. A namespaced id the gateway advertises that
     * this build cannot configure stays visible as an explicit diagnostic instead
     * of being dropped silently or guessed at.
     */
    private build;
    /** New or previously unconfigured ids get a fresh lookup even during the runtime TTL. */
    forModel(id: string, signal?: AbortSignal): Promise<CatalogSnapshot>;
}
/**
 * Explicit discovery revalidates the listing and always returns the curated
 * catalog: membership is shipped, so an unreachable gateway must not leave the
 * picker empty. The listing failure is reported through the snapshot instead.
 */
export declare function discoverCatalogModels(catalog: ClinePassCatalog): Promise<readonly LlmDiscoveredModel[]>;
/** Settings expose the same retained catalog as requests, with a failed-refresh diagnostic. */
export declare function discoverSettingsModels(catalog: ClinePassCatalog): Promise<ClineModelCatalog>;
