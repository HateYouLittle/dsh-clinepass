import type { Context } from '@deepseek-ai/cordis'
import { randomUUID } from 'node:crypto'
import { RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { attributionHeaders } from '@deepseek-ai/dsh-llm'
import { assertBaseURL } from './config.ts'
import { parseUsageLimitsResponse, type ClineUsage } from './usage-contract.ts'
import { diagnosticURL, fetchJsonResponse, transportFailure } from './json-response.ts'
import type { ClineAccountSwitch } from './accounts.ts'
import { assertProxyURL } from './proxy-url.ts'
import { ProxyTransport } from './proxy.ts'
import { readUsageError, usageHttpFailure } from './usage-error.ts'

const USAGE_MAX_BYTES = 1024 * 1024

/** ClinePass plan-usage endpoint, relative to the configured API base. */
const USAGE_PATH = '/users/me/plan/usage-limits'

interface UsageOptions {
  baseURL: () => string
  proxyURL?: () => string
  transport?: ProxyTransport
  resolveApiKey: (ref?: string) => Promise<string | undefined>
  activeRef?: () => string
  accountRefs?: () => readonly string[]
  lastSwitch?: () => ClineAccountSwitch | undefined
}

/**
 * ClinePass plan usage for the settings UI.
 *
 * Reads `GET {base}/users/me/plan/usage-limits`, whose `data.limits` rows
 * carry the 5-hour rolling, weekly, and monthly windows as `percentUsed` plus
 * a reset timestamp. Account statistics are fetched on the Host; credentials
 * never enter the browser.
 */
export class ClineUsageService extends TypertRemoteService {
  private readonly identities = new Map<string, { baseURL: string; proxyURL: string; key: string; source: string }>()
  private readonly pending = new Map<string, Promise<ClineUsage>>()
  private readonly transport: ProxyTransport

  constructor(ctx: Context, private readonly options: UsageOptions) {
    super(ctx, 'clinePassUsage')
    this.transport = options.transport ?? new ProxyTransport()
    if (!options.transport) ctx.effect(() => () => this.transport.dispose())
  }

  async read(): Promise<ClineUsage> {
    try {
      const usage = await this.readRef(this.options.activeRef?.())
      const lastSwitch = this.options.lastSwitch?.()
      return lastSwitch ? { ...usage, lastSwitch } : usage
    } catch (error) {
      const lastSwitch = this.options.lastSwitch?.()
      if (lastSwitch && error instanceof RemoteError && error.code === 'clinepass/usage-unavailable') {
        throw new RemoteError('clinepass/usage-unavailable', error.message,
          { ...error.details as { retryable: boolean; retainPrevious: boolean; source?: string }, lastSwitch }, { cause: error })
      }
      throw error
    }
  }

  async readAccount(ref: string): Promise<ClineUsage> {
    if (!this.options.accountRefs?.().includes(ref)) {
      throw new RemoteError('gateway/bad-request', 'Unknown ClinePass account', {})
    }
    return this.readRef(ref)
  }

  private async readRef(ref?: string): Promise<ClineUsage> {
    const identityKey = ref ?? ''
    // Retire removed accounts, including their secret-bearing identity records.
    if (this.options.accountRefs) for (const saved of this.identities.keys()) {
      if (saved && !this.options.accountRefs().includes(saved)) this.identities.delete(saved)
    }
    const baseURL = assertBaseURL(this.options.baseURL()).replace(/\/$/, '')
    const proxyURL = assertProxyURL(this.options.proxyURL?.())
    let key: string | undefined
    try {
      key = await this.options.resolveApiKey(ref)
    } catch (error: unknown) {
      this.identities.delete(identityKey)
      const missing = error instanceof Error && 'code' in error && error.code === 'MISSING_CREDENTIAL'
      throw new RemoteError('clinepass/usage-unavailable', missing
        ? 'ClinePass API key is not configured' : 'Could not resolve the ClinePass API key', {
        retryable: !missing, retainPrevious: false,
      }, { cause: error })
    }
    if (!key) {
      this.identities.delete(identityKey)
      throw new RemoteError('clinepass/usage-unavailable', 'ClinePass API key is not configured', {
        retryable: false, retainPrevious: false,
      })
    }
    let identity = this.identities.get(identityKey)
    if (identity?.baseURL !== baseURL || identity.proxyURL !== proxyURL || identity.key !== key) {
      identity = { baseURL, proxyURL, key, source: randomUUID() }
      this.identities.set(identityKey, identity)
    }
    const { source } = identity
    const shared = this.pending.get(source)
    if (shared) return shared
    const pending = this.fetchUsage(baseURL, key, source, proxyURL, this.transport.forProxy(proxyURL))
    this.pending.set(source, pending)
    try { return await pending } finally { this.pending.delete(source) }
  }

  private async fetchUsage(baseURL: string, key: string, source: string, proxyURL: string, fetcher?: typeof globalThis.fetch): Promise<ClineUsage> {
    const url = `${baseURL}${USAGE_PATH}`
    const endpoint = diagnosticURL(url)
    const signal = AbortSignal.timeout(10_000)
    let result: Awaited<ReturnType<typeof fetchJsonResponse>>
    try {
      result = await fetchJsonResponse(url, {
        headers: { ...attributionHeaders(), Authorization: `Bearer ${key}`, Accept: 'application/json' },
        signal,
        redirect: 'error',
      }, USAGE_MAX_BYTES, 'identity', fetcher,
      response => readUsageError(response, { apiKey: key, baseURL, proxyURL, signal }))
    } catch (error: unknown) {
      const invalid = error instanceof SyntaxError || error instanceof RangeError
      const detail = error instanceof SyntaxError ? 'invalid JSON response'
        : error instanceof RangeError ? `response exceeds the ${USAGE_MAX_BYTES} byte limit`
          : transportFailure(error)
      throw new RemoteError('clinepass/usage-unavailable', `Could not read ${endpoint}: ${detail}`, {
        retryable: true, retainPrevious: !invalid, source,
      }, { cause: error })
    }
    const { response, body } = result
    if (!response.ok) {
      const { retryable, hint } = usageHttpFailure(response.status)
      const reason = typeof body === 'string' && body ? ` Upstream: ${body}` : ''
      throw new RemoteError('clinepass/usage-unavailable', `ClinePass usage unavailable (HTTP ${response.status})${hint}${reason}`, {
        retryable, retainPrevious: retryable, source,
      })
    }
    try {
      const usage = parseUsageLimitsResponse(body)
      return { ...usage, source }
    } catch (error: unknown) {
      throw new RemoteError('clinepass/usage-unavailable', 'Invalid ClinePass usage response', {
        retryable: true, retainPrevious: false, source,
      }, { cause: error })
    }
  }
}
