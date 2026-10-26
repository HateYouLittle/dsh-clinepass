/** Runtime discovery: gateway availability plus the curated ClinePass model catalog. */
import { randomUUID } from 'node:crypto'
import { createProvider } from 'clinepass-pi-ai'
import type { Api, Model, Provider } from './sdk-types.ts'
import * as openAICompletionsApi from 'clinepass-pi-ai/api/openai-completions'
import { attributionHeaders, LlmError } from '@deepseek-ai/dsh-llm'
import type { LlmDiscoveredModel } from '@deepseek-ai/dsh-llm'
import { curatedModelMetadata, type ModelMetadata } from './model-metadata.ts'
import { isClinePassNamespaceId } from './clinepass-models.ts'
import { sortModels, type ClineModelCatalog } from './models-contract.ts'
import { diagnosticURL, fetchJsonResponse, transportFailure } from './json-response.ts'
import { DISPLAY_NAME, SDK_PROVIDER_ID } from './provider-identity.ts'
import { reasoningBudgetRange } from './reasoning.ts'
import { migrateGatewayBaseURL } from './gateway-url.ts'
import { measureTiming, type DiagnosticTiming, type TimingObserver } from './diagnostic-timing.ts'

export { PROVIDER_ID, DISPLAY_NAME } from './provider-identity.ts'
export { DEFAULT_BASE_URL } from './gateway-url.ts'
const MODELS_FETCH_TIMEOUT_MS = 10_000
const STALE_WHILE_REVALIDATE_MS = 5 * 60_000
const MODEL_LISTING_MAX_BYTES = 1024 * 1024
const RETRY_MIN_MS = 5_000
const RETRY_MAX_MS = 60_000

/** A namespaced id the gateway advertises that this build cannot configure. */
const UNCONFIGURED_ADVERTISEMENT = 'not in this build\'s curated ClinePass table; update the plugin to configure it'

type ListingResult = PromiseSettledResult<{ ids: readonly string[]; warning?: string; updatedAtMs: number }>

async function settled<T>(promise: Promise<T>): Promise<PromiseSettledResult<T>> {
  const [result] = await Promise.allSettled([promise])
  return result!
}

export interface CatalogSnapshot {
  readonly details: ModelMetadata['details']
  readonly models: ReadonlyMap<string, Model<Api>>
  /** Advertised ids with missing/unsupported metadata stay visible with a diagnostic. */
  readonly unavailable: ReadonlyMap<string, string>
  readonly provider: Provider
  /** The gateway listing was readable on this refresh. */
  readonly live: boolean
  /**
   * The curated configuration shipped with the plugin is always available, so
   * this is always true. Retained so consumers keep one snapshot shape.
   */
  readonly metadataLive: boolean
  /** Retained for explicit discovery; runtime callers may still use the last catalog. */
  readonly listingFailure?: unknown
  readonly listingWarning?: string
  /** Always absent: there is no online configuration source to fail. */
  readonly metadataFailure?: unknown
  /** Last successful fetch or revalidation, not the time of a failed attempt. */
  readonly listingUpdatedAtMs?: number
  /** Always absent: a shipped table has no fetch time to report. */
  readonly metadataUpdatedAtMs?: number
  readonly fetchedAtMs: number
}

/** One catalog instance; refresh 0 is the first build, then online refreshes count from 1. */
export interface CatalogDiagnostic extends DiagnosticTiming {
  readonly catalogId: string
  readonly refresh: number
  readonly url?: string
}

/** Cancelling one waiter must not cancel a catalog refresh shared with other calls. */
function waitForSnapshot(pending: Promise<CatalogSnapshot>, signal?: AbortSignal): Promise<CatalogSnapshot> {
  if (signal === undefined) return pending
  return new Promise((resolve, reject) => {
    const abort = (): void => {
      signal.removeEventListener('abort', abort)
      reject(new LlmError('clinepass catalog request aborted by caller', 'ABORTED', { cause: signal.reason }))
    }
    pending.then(value => {
      signal.removeEventListener('abort', abort)
      resolve(value)
    }, error => {
      signal.removeEventListener('abort', abort)
      reject(error)
    })
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
}

/** A valid empty listing means the gateway serves nothing; malformed replies are failures. */
export function readLiveModelIds(body: unknown, onInvalidRows?: (warning: string) => void): readonly string[] {
  const data = (body as { data?: unknown } | null)?.data
  if (!Array.isArray(data)) throw new Error('the model listing has no "data" array')
  const ids: string[] = []
  const invalidRows: number[] = []
  let invalidCount = 0
  for (const [index, entry] of data.entries()) {
    const id = (entry as { id?: unknown } | null)?.id
    if (typeof id === 'string' && id.trim().length > 0) ids.push(id)
    else { invalidCount++; if (invalidRows.length < 8) invalidRows.push(index + 1) }
  }
  if (data.length > 0 && ids.length === 0) throw new Error('the nonempty model listing has no valid model ids')
  if (invalidCount > 0) onInvalidRows?.(`Model listing ignored ${invalidCount} of ${data.length} rows with invalid model ids (rows ${invalidRows.join(', ')}${invalidCount > invalidRows.length ? ', …' : ''}); the listing may be incomplete`)
  return [...new Set(ids)]
}

async function fetchLiveModelIds(baseURL: string, fetcher?: typeof globalThis.fetch, onTiming?: TimingObserver): Promise<{ ids: readonly string[]; warning?: string }> {
  const url = `${baseURL.replace(/\/+$/, '')}/models`
  const endpoint = diagnosticURL(url)
  let result: Awaited<ReturnType<typeof fetchJsonResponse>>
  try {
    result = await fetchJsonResponse(url, {
      method: 'GET', cache: 'no-cache',
      headers: { ...attributionHeaders(), accept: 'application/json' },
      signal: AbortSignal.timeout(MODELS_FETCH_TIMEOUT_MS),
    }, MODEL_LISTING_MAX_BYTES, 'identity', fetcher, undefined, onTiming)
  } catch (error: unknown) {
    const detail = error instanceof SyntaxError
      ? 'invalid JSON response'
      : error instanceof RangeError ? `response exceeds the ${MODEL_LISTING_MAX_BYTES} byte limit`
        : transportFailure(error)
    const action = error instanceof SyntaxError || error instanceof RangeError ? 'read' : 'reach'
    throw new LlmError(`could not ${action} ${endpoint}: ${detail}`, 'DISCOVERY_FAILED', { cause: error })
  }
  const { response, body } = result
  if (!response.ok) throw new LlmError(`${endpoint} answered HTTP ${response.status}`, 'DISCOVERY_FAILED')
  try {
    let warning: string | undefined
    const ids = readLiveModelIds(body, value => { warning = value })
    return { ids, ...warning === undefined ? {} : { warning } }
  } catch (error: unknown) {
    throw new LlmError(`${endpoint} returned an invalid model listing: ${error instanceof Error ? error.message : 'invalid data'}`, 'DISCOVERY_FAILED', { cause: error })
  }
}

/** The adapter resolves and passes credentials for each generation request. */
function harnessApiKeyAuth(): Provider['auth'] {
  return { apiKey: {
    name: 'Cline API key',
    resolve: () => Promise.resolve({ auth: {}, source: 'Cline API key' }),
  } }
}

/** Cline exposes exactly one chat protocol; the curated table uses only this one. */
function buildProvider(baseURL: string, models: readonly Model<Api>[]): Provider {
  return createProvider({
    id: SDK_PROVIDER_ID, name: DISPLAY_NAME, baseUrl: baseURL,
    auth: harnessApiKeyAuth(), models: [...models],
    api: { 'openai-completions': openAICompletionsApi },
  })
}

/** Runtime requests reuse a snapshot; discovery revalidates it. Concurrent reads coalesce. */
export class ClinePassCatalog {
  private readonly diagnosticId = randomUUID()
  /** The shipped table, resolved once for this gateway. Membership never depends on the network. */
  private readonly metadata: ModelMetadata
  private refreshSequence = 0
  private served: CatalogSnapshot | undefined
  private pending: Promise<CatalogSnapshot> | undefined
  private failures = 0
  private refreshAtMs = 0

  constructor(
    private readonly baseURL: string,
    private readonly refreshMs: number,
    private readonly onFallback: (detail: { url: string; error: unknown; kept: number }) => void,
    /** Kept for API compatibility; now reports advertised ids this build cannot configure. */
    private readonly onOmitted: (ids: readonly string[]) => void,
    // Notify consumers after a background refresh commits its complete snapshot.
    private readonly onRefresh: () => void = () => {},
    private readonly fetcher?: typeof globalThis.fetch,
    private readonly onWarning?: (warning: string) => void,
    private readonly onDiagnostic?: (event: CatalogDiagnostic) => void,
  ) {
    this.baseURL = migrateGatewayBaseURL(baseURL)
    this.metadata = curatedModelMetadata(this.baseURL)
  }

  private observer(refresh: number, prefix = '', url?: string): TimingObserver | undefined {
    const onDiagnostic = this.onDiagnostic
    if (onDiagnostic === undefined) return undefined
    const endpoint = url === undefined ? undefined : diagnosticURL(url)
    return event => onDiagnostic({ ...event, stage: `${prefix}${event.stage}`,
      catalogId: this.diagnosticId, refresh, ...(endpoint === undefined ? {} : { url: endpoint }) })
  }

  snapshot(force = false, signal?: AbortSignal): Promise<CatalogSnapshot> {
    if (signal?.aborted) {
      return Promise.reject(new LlmError('clinepass catalog request aborted by caller', 'ABORTED', { cause: signal.reason }))
    }
    return waitForSnapshot(this.currentSnapshot(force), signal)
  }

  private currentSnapshot(force: boolean): Promise<CatalogSnapshot> {
    if (!force && this.served !== undefined && Date.now() < this.refreshAtMs) return Promise.resolve(this.served)
    if (this.pending === undefined) this.startRefresh(force)
    return this.pending!
  }

  private startRefresh(force: boolean): void {
    const refresh = ++this.refreshSequence
    const observer = this.observer(refresh)
    // Only a background refresh that replaced an existing snapshot notifies
    // consumers; a forced refresh reports to the caller that asked for it.
    const notify = !force && this.served !== undefined
    this.pending = measureTiming(observer, 'refresh', async () => {
      const listing = settled(measureTiming(observer, 'listing', async () => ({
        ...await fetchLiveModelIds(this.baseURL, this.fetcher, this.observer(refresh, 'listing.', `${this.baseURL.replace(/\/+$/, '')}/models`)),
        updatedAtMs: Date.now(),
      })))
      const listingResult = await listing
      const snapshot = await measureTiming(observer, 'build', () => this.build(listingResult))
      this.served = snapshot
      this.failures = snapshot.live ? 0 : Math.min(this.failures + 1, 5)
      if (snapshot.listingWarning && snapshot.live) {
        try { this.onWarning?.(snapshot.listingWarning) } catch { /* Diagnostics cannot reject a refresh. */ }
      }
      const lifetime = this.failures === 0 ? this.refreshMs
        : Math.min(this.refreshMs, RETRY_MIN_MS * 2 ** (this.failures - 1), RETRY_MAX_MS)
      this.refreshAtMs = snapshot.fetchedAtMs + lifetime
      if (notify) this.onRefresh()
      return snapshot
    }).finally(() => { this.pending = undefined })
    // Runtime callers may already have received the previous snapshot; manual callers still observe errors.
    void this.pending.catch(() => {})
  }

  /**
   * The curated table decides membership; the listing only adds diagnostics.
   *
   * Cline's listing advertises the general router catalog and never the
   * `cline-pass/*` ids, so neither an empty listing nor an unreachable one may
   * change what the picker offers. A namespaced id the gateway advertises that
   * this build cannot configure stays visible as an explicit diagnostic instead
   * of being dropped silently or guessed at.
   */
  private build(listing: ListingResult): CatalogSnapshot {
    const models = new Map(this.metadata.models)
    const unavailable = new Map<string, string>()
    const base = {
      details: new Map(this.metadata.details), models,
      provider: buildProvider(this.baseURL, [...models.values()]),
      metadataLive: true, fetchedAtMs: Date.now(),
    }
    if (listing.status === 'rejected') {
      this.onFallback({ url: `${this.baseURL.replace(/\/+$/, '')}/models`, error: listing.reason, kept: models.size })
      return { ...base, unavailable, live: false, listingFailure: listing.reason }
    }
    for (const id of listing.value.ids) {
      if (!models.has(id) && isClinePassNamespaceId(id)) unavailable.set(id, UNCONFIGURED_ADVERTISEMENT)
    }
    if (unavailable.size > 0) this.onOmitted([...unavailable.keys()])
    return {
      ...base, unavailable, live: true, listingUpdatedAtMs: listing.value.updatedAtMs,
      ...listing.value.warning === undefined ? {} : { listingWarning: listing.value.warning },
    }
  }

  /** New or previously unconfigured ids get a fresh lookup even during the runtime TTL. */
  async forModel(id: string, signal?: AbortSignal): Promise<CatalogSnapshot> {
    const cached = this.served
    if (signal?.aborted) throw new LlmError('clinepass catalog request aborted by caller', 'ABORTED', { cause: signal.reason })
    // Only previously verified configurations may bypass a due/in-flight refresh.
    // Failed attempts never extend this window; explicit discovery still waits.
    if (cached?.models.has(id) && cached.listingUpdatedAtMs !== undefined
      && Date.now() < cached.listingUpdatedAtMs + this.refreshMs + STALE_WHILE_REVALIDATE_MS) {
      void this.snapshot().catch(() => {})
      return cached
    }
    let snapshot = await this.snapshot(false, signal)
    if (!snapshot.models.has(id) && snapshot === cached) snapshot = await this.snapshot(true, signal)
    if (signal?.aborted) throw new LlmError('clinepass catalog request aborted by caller', 'ABORTED', { cause: signal.reason })
    if (snapshot.unavailable.has(id)) {
      throw new LlmError(
        `clinepass model "${id}" is advertised but cannot be configured: ${snapshot.unavailable.get(id)}; refresh the model list to retry`,
        'MODEL_METADATA_UNAVAILABLE',
      )
    }
    if (!snapshot.models.has(id) && !snapshot.live) throw listingError(snapshot)
    return snapshot
  }
}

/**
 * Explicit discovery revalidates the listing and always returns the curated
 * catalog: membership is shipped, so an unreachable gateway must not leave the
 * picker empty. The listing failure is reported through the snapshot instead.
 */
export async function discoverCatalogModels(catalog: ClinePassCatalog): Promise<readonly LlmDiscoveredModel[]> {
  return describeCatalog(await catalog.snapshot(true))
}

function listingError(snapshot: CatalogSnapshot): LlmError {
  const detail = snapshot.listingFailure instanceof LlmError
    ? snapshot.listingFailure.message : 'the live model listing is unreachable'
  return new LlmError(`llm-clinepass: ${detail}; refresh the model list to retry`, 'DISCOVERY_FAILED', { cause: snapshot.listingFailure })
}

function describeConfiguredModels(snapshot: CatalogSnapshot): readonly LlmDiscoveredModel[] {
  return [...snapshot.models.values()].map(model => ({
    id: model.id, name: model.name, contextWindow: model.contextWindow, maxTokens: model.maxTokens,
  }))
}

function describeCatalog(snapshot: CatalogSnapshot): readonly LlmDiscoveredModel[] {
  return [
    ...describeConfiguredModels(snapshot),
    ...[...snapshot.unavailable].map(([id, reason]) => ({ id, name: `${id} (metadata unavailable: ${reason})` })),
  ]
}

/** Settings expose the same retained catalog as requests, with a failed-refresh diagnostic. */
export async function discoverSettingsModels(catalog: ClinePassCatalog): Promise<ClineModelCatalog> {
  const snapshot = await catalog.snapshot(true)
  const listingFailure = snapshot.live ? undefined : listingError(snapshot).message
  return {
    models: sortModels([
      ...describeConfiguredModels(snapshot),
      ...[...snapshot.unavailable.keys()].map(id => ({ id, name: id, configurationMissing: true })),
    ].map(model => {
      const configured = snapshot.models.get(model.id)
      const budget = configured && reasoningBudgetRange(configured)
      return { ...model, ...snapshot.details.get(model.id), ...budget === undefined ? {} : { reasoningBudget: budget } }
    })),
    stale: listingFailure !== undefined,
    ...listingFailure === undefined ? {} : { error: listingFailure },
    sources: {
      listing: {
        ...snapshot.listingUpdatedAtMs === undefined ? {} : { updatedAt: snapshot.listingUpdatedAtMs },
        ...listingFailure === undefined ? {} : { error: listingFailure },
        ...snapshot.listingWarning === undefined ? {} : { warning: snapshot.listingWarning },
      },
      // The curated table ships with the plugin: there is no online
      // configuration source to timestamp or fail.
      metadata: {},
    },
  }
}
