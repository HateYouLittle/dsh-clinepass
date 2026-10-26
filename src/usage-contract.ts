import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import type { ClineAccountSwitch } from './accounts.ts'

export interface UsageWindow {
  status: 'ok' | 'rate-limited'
  percent: number
  resetsAt: string
}

export interface ClineUsage {
  /** Opaque Host identity for this endpoint/account; never a credential or its hash. */
  source?: string
  lastSwitch?: ClineAccountSwitch
  rolling: UsageWindow
  weekly: UsageWindow
  monthly: UsageWindow
}

/** The three windows of {@link ClineUsage}, in display order. */
export const USAGE_WINDOWS = ['rolling', 'weekly', 'monthly'] as const

/**
 * ClinePass `type` values mapped onto the three windows of the contract.
 * `GET {base}/users/me/plan/usage-limits` reports `five_hour`, `weekly`, and
 * `monthly`; anything else the endpoint may add later is ignored.
 */
export const USAGE_LIMIT_TYPES: Readonly<Record<string, (typeof USAGE_WINDOWS)[number]>> = {
  five_hour: 'rolling',
  weekly: 'weekly',
  monthly: 'monthly',
}

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
export function usageWindowStatus(percent: number): UsageWindow['status'] {
  return percent >= 100 ? 'rate-limited' : 'ok'
}

export function parseAccountSwitch(value: unknown): ClineAccountSwitch {
  const notice = value as Partial<ClineAccountSwitch> | null
  if (!notice || typeof notice.fromRef !== 'string' || typeof notice.toRef !== 'string'
    || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(notice.fromRef) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(notice.toRef)
    || (notice.reason !== 'quota' && notice.reason !== 'credential')
    || typeof notice.at !== 'number' || !Number.isSafeInteger(notice.at) || notice.at < 0
    || notice.at > 8_640_000_000_000_000) throw new Error('Invalid account switch notice')
  return { fromRef: notice.fromRef, toRef: notice.toRef, reason: notice.reason, at: notice.at }
}

/** Reject missing statistics rather than turning unavailable data into zero. */
function invalidUsage(): never {
  throw new Error('Invalid ClinePass usage response')
}

/** One already-shaped window; shared by the object codec and the API parser. */
function parseWindow(row: unknown): UsageWindow {
  const window = row as Partial<UsageWindow> | null
  if (!window || typeof window !== 'object'
    || (window.status !== 'ok' && window.status !== 'rate-limited')
    || typeof window.percent !== 'number' || !Number.isFinite(window.percent)
    || window.percent < 0 || window.percent > 100
    || typeof window.resetsAt !== 'string' || !Number.isFinite(Date.parse(window.resetsAt))) invalidUsage()
  return { status: window.status, percent: window.percent, resetsAt: window.resetsAt }
}

/**
 * Validate a Host-produced {@link ClineUsage} value. This is the remote
 * codec's parser, so the browser rejects a malformed result instead of
 * rendering a zeroed window.
 * @param value - the value crossing the remote boundary.
 * @returns the validated snapshot.
 */
export function parseClineUsage(value: unknown): ClineUsage {
  if (!value || typeof value !== 'object') invalidUsage()
  const source = value as Record<string, unknown>
  const result = {} as ClineUsage
  if (source.source !== undefined) {
    if (typeof source.source !== 'string' || source.source.length === 0 || source.source.length > 128) {
      throw new Error('Invalid ClinePass usage source')
    }
    result.source = source.source
  }
  if (source.lastSwitch !== undefined) {
    result.lastSwitch = parseAccountSwitch(source.lastSwitch)
  }
  for (const key of USAGE_WINDOWS) result[key] = parseWindow(source[key])
  return result
}

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
 * Each row must carry a finite `percentUsed` in 0..100 and a parseable
 * `resetsAt`; all three windows must be present. A malformed or missing row
 * throws, so the service reports the reading as unavailable instead of
 * presenting a zero. Unknown `type` values are ignored (the endpoint may add
 * windows this contract cannot show), while a duplicated window type is
 * rejected as ambiguous rather than silently resolved.
 *
 * @param body - the decoded JSON body of `GET {base}/users/me/plan/usage-limits`.
 * @returns the three windows, without `source` (the service stamps that).
 */
export function parseUsageLimitsResponse(body: unknown): ClineUsage {
  if (!body || typeof body !== 'object') invalidUsage()
  const data = (body as { data?: unknown }).data
  if (!data || typeof data !== 'object') invalidUsage()
  const limits = (data as { limits?: unknown }).limits
  if (!Array.isArray(limits)) invalidUsage()
  const windows = new Map<(typeof USAGE_WINDOWS)[number], UsageWindow>()
  for (const row of limits) {
    if (!row || typeof row !== 'object') invalidUsage()
    const entry = row as { type?: unknown; percentUsed?: unknown; resetsAt?: unknown }
    const key = typeof entry.type === 'string' ? USAGE_LIMIT_TYPES[entry.type] : undefined
    if (key === undefined) continue
    const percent = entry.percentUsed
    if (typeof percent !== 'number' || !Number.isFinite(percent) || percent < 0 || percent > 100
      || typeof entry.resetsAt !== 'string' || !Number.isFinite(Date.parse(entry.resetsAt))) invalidUsage()
    if (windows.has(key)) invalidUsage()
    windows.set(key, { status: usageWindowStatus(percent), percent, resetsAt: entry.resetsAt })
  }
  const result = {} as ClineUsage
  for (const key of USAGE_WINDOWS) {
    const window = windows.get(key)
    if (window === undefined) invalidUsage()
    result[key] = window
  }
  return result
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'clinepass/usage-unavailable': {
      readonly retryable: boolean
      readonly retainPrevious: boolean
      readonly source?: string
      readonly lastSwitch?: ClineAccountSwitch
    }
  }
  interface TypertRemoteNamespaceMap {
    clinePassUsage: {
      read(): Promise<RemoteResult<ClineUsage>>
      readAccount(ref: string): Promise<RemoteResult<ClineUsage>>
    }
  }
}

// Released DSH uses schema; current source builds use a lazy create() codec.
const usageCodec = {
  mode: 'strict' as const, typeSymbol: 'dsh-clinepass#ClineUsage',
  schema: { parse: parseClineUsage }, create: () => ({ parse: parseClineUsage }),
}
const parseRef = (value: unknown): string => {
  if (typeof value !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new Error('Invalid account reference')
  return value
}
const refCodec = { mode: 'strict' as const, typeSymbol: 'dsh-clinepass#AccountRef',
  schema: { parse: parseRef }, create: () => ({ parse: parseRef }) }

export const usageRemote: TypertRemoteContribution = {
  package: 'dsh-clinepass',
  descriptors: [{
    id: 'dsh-clinepass#clinePassUsage/read',
    service: 'clinePassUsage', namespace: 'clinePassUsage', method: 'read',
    invocation: { kind: 'direct' }, parameters: [],
    result: usageCodec,
  }, {
    id: 'dsh-clinepass#clinePassUsage/readAccount',
    service: 'clinePassUsage', namespace: 'clinePassUsage', method: 'readAccount',
    invocation: { kind: 'direct' }, parameters: [{ name: 'ref', wire: 'ref', source: 'json', codec: refCodec }],
    result: usageCodec,
  }],
}
