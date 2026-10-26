/**
 * Request pricing for the usage dashboard: the ClinePass catalog rates and
 * their context tiers.
 *
 * The rates themselves come from the curated catalog
 * (`./clinepass-models.ts`), never from a remote metadata service; this module
 * only turns a rate plus a request's token counts into an amount. Rates are
 * USD per one million tokens, so tokens multiplied by a rate are already
 * micro-USD. Components are rounded before summing, and nothing else scales
 * the total: ClinePass bills one flat reference rate per model.
 *
 * @module dsh-clinepass/analytics-pricing
 */

/** The four billable rates, in USD per one million tokens. */
export interface CostRates {
  readonly input: number
  readonly output: number
  readonly cacheRead: number
  readonly cacheWrite: number
}

/** One context-length tier; the highest matching threshold prices the attempt. */
export interface CostTier extends CostRates {
  readonly inputTokensAbove: number
}

/** Structural face of the catalog's ModelCost. */
export interface ModelCostLike extends CostRates {
  readonly tiers?: readonly CostTier[]
}

/** The token components one request reported. */
export interface UsageCounts {
  readonly input: number
  readonly output: number
  readonly cacheRead: number
  readonly cacheWrite: number
}

/**
 * Billed input tokens: reported input plus cache reads and writes.
 * @param usage - one request's token components.
 * @returns the total the tier threshold is compared against.
 */
export function billedInput(usage: UsageCounts): number {
  return usage.input + usage.cacheRead + usage.cacheWrite
}

/**
 * Whether every rate of a model is zero (a free row).
 * @param cost - the model's catalog cost.
 * @returns true when no component could ever charge.
 */
export function isFreeCost(cost: ModelCostLike): boolean {
  const free = (rates: CostRates): boolean =>
    rates.input === 0 && rates.output === 0 && rates.cacheRead === 0 && rates.cacheWrite === 0
  return free(cost) && (cost.tiers === undefined || cost.tiers.every(free))
}

function tierOf(cost: ModelCostLike, billed: number): CostRates {
  let chosen: CostRates = cost
  let threshold = -1
  for (const tier of cost.tiers ?? []) {
    if (billed > tier.inputTokensAbove && tier.inputTokensAbove >= threshold) {
      chosen = tier
      threshold = tier.inputTokensAbove
    }
  }
  return chosen
}

/**
 * Price one settled request as `tokens x catalog rate`.
 *
 * The estimate is a straight product: ClinePass bills one flat reference rate
 * per model, so neither the model id nor the request time changes it.
 * @param model - the model id that served the request; accepted for the
 *   analytics call site, unused by the estimate.
 * @param usage - its token components.
 * @param cost - the catalog cost for that model.
 * @param at - request start time; accepted for the analytics call site,
 *   unused by the estimate.
 * @returns the estimated cost in integer micro-USD.
 */
export function priceUsage(model: string, usage: UsageCounts, cost: ModelCostLike, at: number): number {
  void model
  void at
  const rates = tierOf(cost, billedInput(usage))
  return Math.round(usage.input * rates.input)
    + Math.round(usage.output * rates.output)
    + Math.round(usage.cacheRead * rates.cacheRead)
    + Math.round(usage.cacheWrite * rates.cacheWrite)
}
