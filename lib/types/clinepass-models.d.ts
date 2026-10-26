/**
 * Curated ClinePass model table, converted into pi-ai {@link Model} records.
 *
 * Cline publishes no per-model capability document and its `GET {base}/models`
 * listing advertises the general Cline router catalog (OpenRouter-style ids
 * such as `moonshotai/kimi-k3.1-pro`) — it never carries the `cline-pass/*`
 * subscription ids. Membership, protocol, capability, context and cost
 * therefore come from this shipped table, and the live listing is only an
 * additive diagnostic (see `catalog.ts`).
 *
 * Prices are the measured billing rates of the Cline `/usages` API rather than
 * the published reference table, which drifts from real billing. `cacheWrite`
 * is 0: pi's cost model requires the field, but Cline bills no separate
 * cache-write rate. Context is capped at 921,600 for the models whose upstream
 * reports ~1M (the pool maximum, not a single node) to leave headroom, and
 * maximum output is capped at 131,072.
 *
 * Scope decisions (deliberate, documented):
 * - The `cline-pass/*` rows are the ClinePass subscription models and are
 *   always included.
 * - The `cline-free/*` rows are the Cline free tier, served from the same base
 *   URL with the same `CLINE_API_KEY`. They are included as cost-0 models so
 *   the picker can offer them; their display name carries " (free)" because
 *   two of them share a name with a paid row.
 * - `stealth/space-bunny-alpha` (free in the reference table) is deliberately
 *   excluded: it sits outside both namespaces this table serves, and a stealth
 *   codename is too ephemeral to pin into a shipped catalog.
 */
import type { Api, Model, ThinkingLevelMap } from './sdk-types.ts';
/** Namespaces this table serves and that the live listing may additively name. */
export declare const CLINEPASS_MODEL_PREFIXES: readonly ["cline-pass/", "cline-free/"];
/** One curated row: the shipped facts, before they become an SDK model record. */
export interface CuratedClinePassModel {
    readonly id: string;
    readonly name: string;
    /** Measured $/1M tokens as `[input, output, cacheRead]`. */
    readonly cost: readonly [input: number, output: number, cacheRead: number];
    readonly contextWindow: number;
    readonly maxTokens: number;
    readonly input: readonly ('text' | 'image')[];
    readonly thinkingLevelMap: ThinkingLevelMap;
}
/** True for the ids the gateway advertises in the ClinePass/free namespaces. */
export declare function isClinePassNamespaceId(id: string): boolean;
/** Curated rows in picker order: subscription models first, free tier last. */
export declare const CURATED_CLINEPASS_MODELS: readonly CuratedClinePassModel[];
/** The shipped ids, in picker order. */
export declare function curatedModelIds(): readonly string[];
/**
 * The picker label for one row. Cost-0 rows are marked so a free row cannot be
 * mistaken for the paid row that shares its name.
 */
export declare function curatedModelName(row: CuratedClinePassModel): string;
/**
 * The curated catalog as pi-ai model records, keyed by id.
 * @param baseURL - the configured Cline base URL.
 * @returns a fresh map; callers may extend or replace entries without mutating the table.
 */
export declare function curatedClinePassModels(baseURL: string): Map<string, Model<Api>>;
