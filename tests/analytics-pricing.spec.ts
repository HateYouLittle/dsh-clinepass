import { describe, expect, it } from 'vitest'
import { billedInput, isFreeCost, priceUsage } from '../src/analytics-pricing.ts'
import { curatedModelMetadata } from '../src/model-metadata.ts'

const flash = { input: 0.15, output: 0.6, cacheRead: 0.003, cacheWrite: 0 }
const mondayOffPeak = Date.UTC(2026, 9, 19, 0, 30)
const mondayPeak = Date.UTC(2026, 9, 19, 2, 0)
const oneMillionEach = { input: 1_000_000, output: 1_000_000, cacheRead: 1_000_000, cacheWrite: 0 }

it('prices tokens at catalog rates in micro-USD', () => {
  expect(priceUsage('cline-pass/deepseek-v4.1-flash', oneMillionEach, flash, mondayOffPeak)).toBe(753_000)
  expect(billedInput(oneMillionEach)).toBe(2_000_000)
})

it('never applies a time-of-day multiplier: one flat reference rate per model', () => {
  // ClinePass bills a single rate per model, so the request time cannot change
  // the estimate — DeepSeek's own peak/off-peak tariff is not billed here.
  expect(priceUsage('cline-pass/deepseek-v4.1-flash', oneMillionEach, flash, mondayPeak))
    .toBe(priceUsage('cline-pass/deepseek-v4.1-flash', oneMillionEach, flash, mondayOffPeak))
  expect(priceUsage('cline-pass/deepseek-v4.1-flash', oneMillionEach, flash, Date.UTC(2026, 9, 19, 4, 0))).toBe(753_000)
  expect(priceUsage('cline-pass/deepseek-v4-pro', oneMillionEach, flash, mondayPeak)).toBe(753_000)
  expect(priceUsage('cline-pass/glm-5.3', oneMillionEach, flash, mondayPeak)).toBe(753_000)
})

it('uses the highest matching context tier for the whole request', () => {
  const qwen = {
    input: 0.4, output: 1.6, cacheRead: 0.04, cacheWrite: 0.5,
    tiers: [{ inputTokensAbove: 256_000, input: 1.2, output: 4.8, cacheRead: 0.12, cacheWrite: 1.5 }],
  }
  const usage = { input: 300_000, output: 1_000, cacheRead: 0, cacheWrite: 0 }
  expect(priceUsage('qwen3.7-plus', usage, qwen, mondayOffPeak)).toBe(364_800)
  expect(priceUsage('qwen3.7-plus', { ...usage, input: 256_000 }, qwen, mondayOffPeak))
    .toBe(104_000)
})

it('treats an all-zero cost as free and never charges past it', () => {
  const free = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
  expect(isFreeCost(free)).toBe(true)
  expect(isFreeCost({ ...free, tiers: [{ inputTokensAbove: 1, ...free }] })).toBe(true)
  expect(priceUsage('longcat-2.5-preview-free', oneMillionEach, free, mondayPeak)).toBe(0)
  expect(isFreeCost(flash)).toBe(false)
})

describe('the curated catalog never marks a shipped price unknown', () => {
  const base = 'https://gateway.example/v1'

  it('carries a complete cost block for every shipped row', () => {
    const result = curatedModelMetadata(base)
    expect(result.models.size).toBeGreaterThan(0)
    for (const [id, model] of result.models) {
      // The table ships measured rates; a free row is genuinely 0 rather than
      // unknown, so analytics must be free to price it at 0.
      expect(model.cost, id).toEqual({
        input: expect.any(Number), output: expect.any(Number),
        cacheRead: expect.any(Number), cacheWrite: expect.any(Number),
      })
      expect(result.details.get(id)?.costKnown, id).toBeUndefined()
      expect(result.errors.get(id), id).toBeUndefined()
    }
  })

  it('keeps the free tier priced at zero and the paid tier above it', () => {
    const result = curatedModelMetadata(base)
    expect(isFreeCost(result.models.get('cline-free/deepseek-v4.1-flash')!.cost)).toBe(true)
    expect(isFreeCost(result.models.get('cline-pass/deepseek-v4.1-flash')!.cost)).toBe(false)
  })
})
