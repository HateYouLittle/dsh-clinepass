/**
 * ClinePass plan snapshot: the facts the API does not publish.
 *
 * ClinePass is a flat subscription, so there is no per-model allowance table
 * to mirror: the plan's caps are plan-wide (5-hour rolling, weekly, monthly)
 * and are published at runtime by `GET {base}/users/me/plan`
 * (`data.plan.entitlements.cline_pass.inferenceCapThreshold`, fixed-point
 * 1e-8 USD per window), while the usage contract exposes only the percentages
 * the usage endpoint reports. Model rates also live elsewhere: the curated
 * catalog (`./clinepass-models.ts`) owns one flat `model.cost` per model, and
 * `./analytics-pricing.ts` only turns that rate into an amount.
 *
 * Source: https://docs.cline.bot/getting-started/clinepass
 * (plan price and the three windows). The snapshot is reviewed when the plan
 * changes; {@link CLINEPASS_PLAN_AS_OF} makes a stale snapshot visible.
 *
 * @module dsh-clinepass/clinepass-plan
 */

/** Product name of the subscription these windows belong to. */
export const CLINEPASS_PLAN_NAME = 'ClinePass'

/** Flat subscription price in USD per month, from the plan page. */
export const CLINEPASS_PLAN_PRICE_USD_PER_MONTH = 9.99

/** Human-readable source for this snapshot. */
export const CLINEPASS_PLAN_SOURCE = 'https://docs.cline.bot/getting-started/clinepass'

/** Date the facts below were read from the official plan page. */
export const CLINEPASS_PLAN_AS_OF = '2026-10-26'

/** Why a row has no numeric limit. */
export type ClinePassLimitNote = 'unlimited' | 'limited-time'

/**
 * The shape `./analytics.ts` reads for a model's per-model allowance columns.
 *
 * ClinePass publishes no per-model monthly allowance, so the table below is
 * intentionally empty and {@link clinepassMonthlyLimit} answers `undefined`
 * for every model: the analytics report renders `null` rather than a number
 * nobody published. The `go`/`goPlus` fields are the retired two-plan column
 * names the analytics contract still carries; they are never filled here.
 */
export interface ClinePassMonthlyLimit {
  /** First-tier monthly allowance in USD; always null — no such table exists. */
  readonly go: number | null
  /** Second-tier monthly allowance in USD; always null — no such table exists. */
  readonly goPlus: number | null
  readonly note?: ClinePassLimitNote
}

/**
 * Monthly limits by model id. Empty on purpose: ClinePass has no per-model
 * monthly allowance table, and inventing numbers for one would misreport
 * usage. Kept as a lookup so `./analytics.ts` keeps a stable, honest source.
 */
export const CLINEPASS_MONTHLY_LIMITS: Readonly<Record<string, ClinePassMonthlyLimit>> = {}

/**
 * Read one model's limit snapshot.
 * @param model - catalog model id.
 * @returns the row, or undefined when no per-model allowance is published.
 */
export function clinepassMonthlyLimit(model: string): ClinePassMonthlyLimit | undefined {
  return Object.hasOwn(CLINEPASS_MONTHLY_LIMITS, model) ? CLINEPASS_MONTHLY_LIMITS[model] : undefined
}
