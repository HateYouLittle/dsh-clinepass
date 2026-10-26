import { describe, expect, it } from 'vitest'
import { getSupportedThinkingLevels } from 'clinepass-pi-ai'
import type { Api, Model } from '../src/sdk-types.ts'
import { PlainConfig } from '../src/config.ts'
import {
  reasoningBudgetRange,
  reasoningChoices,
  reasoningIntent,
  reasoningRequest,
  supportsThinkingBudget,
  withGatewayReasoning,
} from '../src/reasoning.ts'
import { CURATED_CLINEPASS_MODELS, curatedClinePassModels } from '../src/clinepass-models.ts'

const baseURL = 'https://api.cline.bot/api/v1'
const shipped = curatedClinePassModels(baseURL)
const model = (id: string): Model<Api> => shipped.get(id)!

describe('curated reasoning controls', () => {
  it('offers exactly the levels the shipped row declares', () => {
    expect(getSupportedThinkingLevels(model('cline-pass/deepseek-v4.1-flash'))).toEqual(['off', 'low', 'high', 'max'])
    expect(getSupportedThinkingLevels(model('cline-pass/mimo-v2.5'))).toEqual(['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'])
    expect(getSupportedThinkingLevels(model('cline-pass/qwen3.8-max'))).toEqual(['off', 'low', 'medium', 'xhigh'])
    expect(getSupportedThinkingLevels(model('cline-pass/muse-spark-1.3-contributor'))).toEqual(['minimal', 'low', 'medium', 'high', 'xhigh'])
    expect(getSupportedThinkingLevels(model('cline-pass/glm-5.3'))).toEqual(['low', 'high', 'max'])
  })

  it('never invents an Off for a row whose reasoning cannot be disabled', () => {
    for (const row of CURATED_CLINEPASS_MODELS) {
      const choices = reasoningChoices(model(row.id)).map(choice => choice.id)
      if (row.thinkingLevelMap.off === null) expect(choices, row.id).not.toContain('off')
      else expect(choices, row.id).toContain('off')
    }
  })

  it('keeps every shipped row reasoning-capable with a positive context and output capacity', () => {
    for (const row of CURATED_CLINEPASS_MODELS) {
      const entry = model(row.id)
      expect(entry.reasoning, row.id).toBe(true)
      expect(entry.contextWindow, row.id).toBeGreaterThan(0)
      expect(entry.maxTokens, row.id).toBeGreaterThan(0)
      expect(entry.api, row.id).toBe('openai-completions')
      expect(entry.baseUrl, row.id).toBe(baseURL)
    }
  })

  it('describes choices with human names and no invented budget entries', () => {
    expect(reasoningChoices(model('cline-pass/kimi-k3'))).toEqual([
      { id: 'off', name: 'Off' }, { id: 'low', name: 'Low' }, { id: 'high', name: 'High' }, { id: 'max', name: 'Max' },
    ])
    expect(reasoningBudgetRange(model('cline-pass/kimi-k3'))).toBeUndefined()
  })

  it('maps a selection to a reasoning intent without clamping', () => {
    const entry = model('cline-pass/kimi-k3')
    expect(reasoningIntent(entry, undefined)).toEqual({ kind: 'default' })
    expect(reasoningIntent(entry, 'off')).toEqual({ kind: 'off' })
    expect(reasoningIntent(entry, 'high')).toEqual({ kind: 'effort', level: 'high' })
  })
})

describe('reasoning at the SDK boundary', () => {
  it('strips every policy field for Default while keeping the rest of the payload', () => {
    const source = {
      model: 'future', thinking: { type: 'disabled' }, reasoning_effort: 'none',
      reasoning: { effort: 'none', summary: 'auto' }, output_config: { effort: 'high', format: { type: 'json_schema' } },
      chat_template_kwargs: { enable_thinking: false, preserve_thinking: true },
      config: { thinkingConfig: { includeThoughts: true }, temperature: 1 }, tools: [{ name: 'probe' }],
    }
    const original = structuredClone(source)
    expect(reasoningRequest({ kind: 'default' }).onPayload(source)).toEqual({
      model: 'future', reasoning: { summary: 'auto' }, output_config: { format: { type: 'json_schema' } },
      chat_template_kwargs: { preserve_thinking: true }, config: { temperature: 1 }, tools: [{ name: 'probe' }],
    })
    // The caller's payload is never mutated.
    expect(source).toEqual(original)
  })

  it('leaves an explicit effort and Off payload to the SDK', () => {
    const effort = { reasoning_effort: 'low', thinking: { type: 'enabled' } }
    expect(reasoningRequest({ kind: 'effort', level: 'low' }).onPayload(effort)).toBe(effort)
    const off = { reasoning_effort: 'none' }
    expect(reasoningRequest({ kind: 'off' }).onPayload(off)).toBe(off)
    expect(reasoningRequest({ kind: 'effort', level: 'low' }).reasoning).toBe('low')
    expect(reasoningRequest({ kind: 'off' }).reasoning).toBeUndefined()
  })

  it('requires a token budget to leave real answer room', () => {
    const request = reasoningRequest({ kind: 'budget', tokens: 3000, min: 1500 })
    expect(request.reasoning).toBe('high')
    expect(request.thinkingBudgets).toEqual({ high: 3000 })
    expect(request.onPayload({ thinking: { type: 'enabled', budget_tokens: 2000 }, max_tokens: 3500 }))
      .toMatchObject({ thinking: { budget_tokens: 2000 } })
    expect(() => request.onPayload({ thinking: { budget_tokens: 1024 }, max_tokens: 5000 })).toThrow(/at least 1500/)
    expect(() => request.onPayload({ thinking: { budget_tokens: 1500 }, max_tokens: 1500 })).toThrow(/at least 1500/)
  })

  it('derives the budget range from the model capacity and validates configured presets', () => {
    const anthropic: Model<Api> = {
      ...model('cline-pass/deepseek-v4.1-flash'), id: 'budget-model', api: 'anthropic-messages',
      reasoningControl: 'budget', reasoningBudget: { min: 1500, max: 10_000 }, maxTokens: 5_000,
    }
    expect(reasoningBudgetRange(anthropic)).toEqual({ min: 1500, max: 3_976 })
    expect(reasoningChoices(anthropic).map(choice => choice.name)).toEqual(['Off', '2,048 tokens'])
    for (const tokens of [1, 1024, 3977, 6000, 1.5, NaN]) {
      expect(() => reasoningChoices({ ...anthropic, reasoningBudgetPresets: [tokens] })).toThrow(/between 1500 and 3976/)
    }
    for (const tokens of [0, -1, 1.5, NaN]) {
      expect(() => PlainConfig({ modelLimits: { budget: { thinkingBudgets: [tokens] } } })).toThrow()
    }
  })

  it('adds the native budget control only to an Anthropic entry that supports one', () => {
    const budgeted = withGatewayReasoning({ ...model('cline-pass/deepseek-v4.1-flash'), id: 'a', api: 'anthropic-messages' })
    expect(budgeted).toMatchObject({ reasoningControl: 'budget', reasoningBudget: { min: 1024, max: Number.MAX_SAFE_INTEGER } })
    expect(supportsThinkingBudget('anthropic-messages', {})).toBe(true)
    expect(supportsThinkingBudget('anthropic-messages', { forceAdaptiveThinking: true })).toBe(false)
    // ClinePass ships one protocol; an openai-completions entry keeps its own map.
    const chat = withGatewayReasoning(model('cline-pass/deepseek-v4.1-flash'))
    expect(chat.reasoningControl).toBeUndefined()
    expect(supportsThinkingBudget('openai-completions', {})).toBe(false)
  })
})
