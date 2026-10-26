/** Browser-safe configuration vocabulary shared by both plugin faces. */
import type { ClineAccount } from './accounts.ts'
import type { ClineAccountOperation } from './account-operations.ts'
import type { UsageDisplayMode } from './usage-display.ts'

export const SETTINGS_NAMESPACE = 'llm-clinepass'
export const PROFILE_ENTRY_ID = 'clinepass'

/**
 * One model's configured capacities. Every field is optional so a deployment
 * can override only the value it needs. Null explicitly selects the catalog
 * value even when a lower profile/settings layer supplies an override.
 */
export interface ClinePassModelLimit {
  /** Context window in tokens, overriding what the catalog advertised. */
  contextWindow?: number | null
  /** Output cap per request, overriding what the catalog advertised. */
  maxTokens?: number | null
  /** Additional selectable thinking budgets, in tokens; null keeps the standard presets. */
  thinkingBudgets?: number[] | null
}

/** Per-model capacities; a null entry selects both original catalog values. */
export type ClinePassModelLimits = Record<string, ClinePassModelLimit | null>

/** Runtime configuration for one plugin mount. */
export interface ClinePassConfig {
  /**
   * Whether this adapter serves its route at all. False withdraws the
   * `dsh-clinepass` route and its models from every picker without unloading the
   * plugin, so the settings page that owns this switch stays reachable to turn
   * it back on. Independent of the credential: a key present while this is
   * false registers nothing.
   */
  enabled: boolean
  /** Usage pill visibility; auto follows this plugin's selected provider. */
  usageDisplay: UsageDisplayMode
  /** Per-model picker switches; absent entries default to enabled unless deprecated. */
  modelVisibility?: Record<string, boolean>
  /** Legacy credential reference, kept in sync with the first/current account. */
  apiKeyEnv: string
  /** The first account is current; subsequent accounts are tried in order. */
  accounts?: ClineAccount[] | null
  accountOperations?: ClineAccountOperation[]
  /** Try other saved accounts on quota/credential rejection before any content is emitted. */
  autoSwitch?: boolean
  /** Discovery/usage base; the official Go gateway selects inference endpoints by protocol. */
  baseURL: string
  /** Optional HTTP(S) or SOCKS5 proxy; blank uses the default network transport. */
  proxyURL: string
  /** Request/picker cache lifetime in minutes; explicit discovery bypasses it. */
  refreshMinutes: number
  /** Largest idle gap between stream events before the request fails. */
  streamIdleTimeoutMs: number
  /** Bound discovery and each attempt's credential/image preparation. */
  requestPreparationTimeoutMs?: number
  /** Whole dispatch deadline, including discovery and account fallback. */
  requestTimeoutMs?: number
  /** Optional retained image occurrence cap per request; omission or null leaves the count unlimited. */
  maxImages?: number | null
  /** Request-level bound on base64-encoded image payload, in bytes. */
  maxRequestImageBytes: number
  /** Total-pixel budget for one request image. */
  requestImagePixelBudget: number
  /** Raw encoded-byte target for one request image before base64 expansion. */
  requestImageMaxBytes: number
  /** Per-model capacity overrides; an absent field inherits the catalog value. */
  modelLimits: ClinePassModelLimits
}

/** Settings snapshots may omit fields inherited from their base layer. */
export type ClinePassSettings = Partial<ClinePassConfig>
