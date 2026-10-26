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

import type { Api, Model, ThinkingLevelMap } from './sdk-types.ts'
import { migrateGatewayBaseURL } from './gateway-url.ts'
import { SDK_PROVIDER_ID } from './provider-identity.ts'
import { withGatewayReasoning } from './reasoning.ts'

/** Namespaces this table serves and that the live listing may additively name. */
export const CLINEPASS_MODEL_PREFIXES = ['cline-pass/', 'cline-free/'] as const

/** All seven levels supported; `off` maps to the wire value `none`. */
const ALL_THINKING: ThinkingLevelMap = {
  off: 'none', minimal: 'minimal', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh', max: 'max',
}

/** Intrinsic reasoning: every level but `off` and `max`; reasoning cannot be disabled. */
const MANDATORY_REASONING: ThinkingLevelMap = {
  off: null, minimal: 'minimal', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh', max: null,
}

/** Only low/high/max plus Off. */
const MAX_HIGH_LOW: ThinkingLevelMap = {
  off: 'none', minimal: null, low: 'low', medium: null, high: 'high', xhigh: null, max: 'max',
}

/** low/high/max with reasoning always on. */
const MAX_HIGH_LOW_MANDATORY: ThinkingLevelMap = {
  off: null, minimal: null, low: 'low', medium: null, high: 'high', xhigh: null, max: 'max',
}

/** low/medium/xhigh plus Off. */
const XHIGH_MEDIUM_LOW: ThinkingLevelMap = {
  off: 'none', minimal: null, low: 'low', medium: 'medium', high: null, xhigh: 'xhigh', max: null,
}

/**
 * Cline rejects the `developer` role, so it must never be sent. Reasoning is
 * excluded from the completion cap, so pi's default `max_completion_tokens`
 * field is correct and is left unset. `cacheControlFormat: "anthropic"` makes
 * pi send `{type:"ephemeral"}` cache markers (verified to engage real caching),
 * and `supportsLongCacheRetention: false` keeps a `ttl` off the wire — a ttl
 * makes Cline answer HTTP 500.
 */
const COMPAT: NonNullable<Model<'openai-completions'>['compat']> = {
  supportsDeveloperRole: false,
  cacheControlFormat: 'anthropic',
  supportsLongCacheRetention: false,
}

/** One curated row: the shipped facts, before they become an SDK model record. */
export interface CuratedClinePassModel {
  readonly id: string
  readonly name: string
  /** Measured $/1M tokens as `[input, output, cacheRead]`. */
  readonly cost: readonly [input: number, output: number, cacheRead: number]
  readonly contextWindow: number
  readonly maxTokens: number
  readonly input: readonly ('text' | 'image')[]
  readonly thinkingLevelMap: ThinkingLevelMap
}

/** True for the ids the gateway advertises in the ClinePass/free namespaces. */
export function isClinePassNamespaceId(id: string): boolean {
  return CLINEPASS_MODEL_PREFIXES.some(prefix => id.startsWith(prefix))
}

/** Curated rows in picker order: subscription models first, free tier last. */
export const CURATED_CLINEPASS_MODELS: readonly CuratedClinePassModel[] = [
  // ── ClinePass subscription models (measured billing rates) ───────────────
  { id: 'cline-pass/glm-5.3', name: 'GLM-5.3', cost: [1.4, 4.4, 0.26], contextWindow: 921_600, maxTokens: 131_072, input: ['text'], thinkingLevelMap: MAX_HIGH_LOW_MANDATORY },
  { id: 'cline-pass/glm-5.3-flash', name: 'GLM-5.3 Flash', cost: [0.15, 0.5, 0.03], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: MAX_HIGH_LOW_MANDATORY },
  { id: 'cline-pass/kimi-k3', name: 'Kimi K3', cost: [6.0, 30.0, 0.6], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: MAX_HIGH_LOW },
  { id: 'cline-pass/deepseek-v4-pro', name: 'DeepSeek V4 Pro', cost: [1.65, 4.95, 0.06], contextWindow: 921_600, maxTokens: 131_072, input: ['text'], thinkingLevelMap: MAX_HIGH_LOW },
  { id: 'cline-pass/deepseek-v4.1-flash', name: 'DeepSeek V4.1 Flash', cost: [0.3, 1.2, 0.006], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: MAX_HIGH_LOW },
  { id: 'cline-pass/mimo-v2.5', name: 'MiMo-V2.5', cost: [0.14, 0.28, 0.0028], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: ALL_THINKING },
  { id: 'cline-pass/mimo-v2.5-pro', name: 'MiMo-V2.5-Pro', cost: [0.435, 0.87, 0.0036], contextWindow: 921_600, maxTokens: 131_072, input: ['text'], thinkingLevelMap: ALL_THINKING },
  { id: 'cline-pass/minimax-m3', name: 'MiniMax M3', cost: [0.5, 2.0, 0.1], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: ALL_THINKING },
  { id: 'cline-pass/muse-spark-1.3-contributor', name: 'Muse Spark 1.3 Contributor', cost: [0.10, 0.20, 0.01], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: MANDATORY_REASONING },
  { id: 'cline-pass/qwen3.8-max', name: 'Qwen3.8 Max', cost: [2.75, 8.25, 0.34], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: XHIGH_MEDIUM_LOW },
  { id: 'cline-pass/qwen3.7-max', name: 'Qwen3.7 Max', cost: [4.17, 12.5, 0.83], contextWindow: 921_600, maxTokens: 131_072, input: ['text'], thinkingLevelMap: ALL_THINKING },
  { id: 'cline-pass/qwen3.7-plus', name: 'Qwen3.7 Plus', cost: [0.67, 2.67, 0.07], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: ALL_THINKING },
  // ── Cline free tier (cost 0) ────────────────────────────────────────────
  { id: 'cline-free/mimo-v2.6-flash', name: 'MiMo-V2.6-Flash', cost: [0, 0, 0], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: ALL_THINKING },
  { id: 'cline-free/deepseek-v4.1-flash', name: 'DeepSeek V4.1 Flash', cost: [0, 0, 0], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: MAX_HIGH_LOW },
  { id: 'cline-free/muse-spark-1.3-contributor', name: 'Muse Spark 1.3 Contributor', cost: [0, 0, 0], contextWindow: 921_600, maxTokens: 131_072, input: ['text', 'image'], thinkingLevelMap: MANDATORY_REASONING },
]

/** The shipped ids, in picker order. */
export function curatedModelIds(): readonly string[] {
  return CURATED_CLINEPASS_MODELS.map(row => row.id)
}

/**
 * The picker label for one row. Cost-0 rows are marked so a free row cannot be
 * mistaken for the paid row that shares its name.
 */
export function curatedModelName(row: CuratedClinePassModel): string {
  return row.cost[0] === 0 ? `${row.name} (free)` : row.name
}

/** Convert one row into the SDK record the adapter streams with. */
function curatedModel(row: CuratedClinePassModel, baseURL: string): Model<Api> {
  return withGatewayReasoning({
    id: row.id,
    name: curatedModelName(row),
    provider: SDK_PROVIDER_ID,
    api: 'openai-completions',
    // Cline serves every resource from the one configured base; there is no
    // per-protocol sibling address to select.
    baseUrl: baseURL,
    reasoning: true,
    thinkingLevelMap: { ...row.thinkingLevelMap },
    input: [...row.input],
    contextWindow: row.contextWindow,
    maxTokens: row.maxTokens,
    cost: { input: row.cost[0], output: row.cost[1], cacheRead: row.cost[2], cacheWrite: 0 },
    compat: { ...COMPAT },
  })
}

/**
 * The curated catalog as pi-ai model records, keyed by id.
 * @param baseURL - the configured Cline base URL.
 * @returns a fresh map; callers may extend or replace entries without mutating the table.
 */
export function curatedClinePassModels(baseURL: string): Map<string, Model<Api>> {
  const base = migrateGatewayBaseURL(baseURL).replace(/\/+$/, '')
  return new Map(CURATED_CLINEPASS_MODELS.map(row => [row.id, curatedModel(row, base)]))
}
