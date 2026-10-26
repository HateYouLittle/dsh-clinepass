import { registerClineRemotes } from '../src/remotes.ts'
import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import Gateway from '@deepseek-ai/dsh-api-gateway'
import Registry from '@deepseek-ai/dsh-typert-registry'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { ClinePassAdapter } from '../src/adapter.ts'
import { ClineModelsService } from '../src/models.ts'
import { PlainConfig } from '../src/config.ts'
import { discoverSettingsModels } from '../src/catalog.ts'
import { isModelEnabled, isNewModel, sortModels, type ClineModelCatalog } from '../src/models-contract.ts'
import { closeMockGateways, CURATED_IDS, listingBody, mockGateway, textEvents } from './mock-gateway.ts'
import { configOf } from './config-of.ts'

afterEach(closeMockGateways)

it('uses independent model switches while keeping settings and existing requests available', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.kimi, CURATED_IDS.minimax]) })
  // Old fields can survive a profile update but no longer impose another visibility gate.
  const config = Object.assign(configOf(`${gateway.url}/v1`), { showDeprecatedModels: true, visibleModelIds: [] })
  expect(PlainConfig({}).modelVisibility).toEqual({})
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
  const ctx = new Context()
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  await ctx.plugin(ClineModelsService, { catalog: () => adapter.catalogOf(config) })
  try {
    const read = async () => await ctx.typertGateway.invoke({ namespace: 'clinePassModels', method: 'read', args: {} }) as ClineModelCatalog
    expect(await read()).toMatchObject({ stale: false, models: expect.arrayContaining([
      expect.objectContaining({ id: CURATED_IDS.kimi, deprecated: false }),
      expect.objectContaining({ id: CURATED_IDS.minimax, deprecated: false }),
    ]) })
    // No shipped row is deprecated, so every curated model is selectable by default.
    expect((await adapter.listModels('dsh-clinepass')).map(m => m.id)).toContain(CURATED_IDS.kimi)
    config.modelVisibility = { [CURATED_IDS.minimax]: false }
    expect((await adapter.listModels('dsh-clinepass')).map(m => m.id)).not.toContain(CURATED_IDS.minimax)
    config.modelVisibility = { [CURATED_IDS.kimi]: false, [CURATED_IDS.minimax]: false }
    const visible = (await adapter.listModels('dsh-clinepass')).map(m => m.id)
    expect(visible).not.toContain(CURATED_IDS.kimi)
    expect(visible).not.toContain(CURATED_IDS.minimax)
    // The complete settings list stays available for changing the selection.
    expect((await read()).models.map(m => m.id)).toContain(CURATED_IDS.kimi)
    // Hiding affects pickers; existing conversations can keep using the served model.
    gateway.pushCompletions({ events: textEvents })
    const chunks = []
    for await (const chunk of adapter.stream({ provider: 'dsh-clinepass', model: CURATED_IDS.kimi,
      messages: [createUserMessage({ content: [{ type: 'text', text: 'hello' }], source: { kind: 'plugin', plugin: 'test' } })] })) chunks.push(chunk)
    expect(chunks.length).toBeGreaterThan(0)
    // An unreachable listing cannot hide a shipped model either.
    config.modelVisibility = {}
    gateway.setModelListing(503, {})
    expect((await adapter.listModels('dsh-clinepass')).map(m => m.id)).toContain(CURATED_IDS.kimi)
    gateway.setModelListing(200, listingBody([CURATED_IDS.kimi]))
    expect((await read()).models.map(m => m.id)).toContain(CURATED_IDS.kimi)
    expect((await adapter.listModels('dsh-clinepass')).map(m => m.id)).toContain(CURATED_IDS.kimi)
  } finally { await ctx.fiber.dispose() }
})

it('keeps explicit overrides for shipped models and ignores switches for unknown ids', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.kimi]) })
  const config = configOf(gateway.url, { modelVisibility: {
    [CURATED_IDS.kimi]: false, [CURATED_IDS.minimax]: true, 'cline-pass/absent-model': true,
  } })
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
  const visible = async () => (await adapter.listModels('dsh-clinepass')).map(m => m.id)
  expect(await visible()).not.toContain(CURATED_IDS.kimi)
  expect(await visible()).toContain(CURATED_IDS.minimax)
  expect(await visible()).not.toContain('cline-pass/absent-model')
  // A refresh and a listing outage both leave the switch in force.
  await discoverSettingsModels(adapter.catalogOf(config))
  expect(await visible()).not.toContain(CURATED_IDS.kimi)
  gateway.setModelListing(503, {})
  expect(await visible()).not.toContain(CURATED_IDS.kimi)
  config.modelVisibility = {}
  expect(await visible()).toContain(CURATED_IDS.kimi)
})

it('uses only own boolean overrides and rejects non-boolean configuration', () => {
  expect(isModelEnabled({ id: 'normal' })).toBe(true)
  expect(isModelEnabled({ id: 'old', deprecated: true })).toBe(false)
  expect(isModelEnabled({ id: 'toString', deprecated: true }, {})).toBe(false)
  expect(isModelEnabled({ id: 'old', deprecated: true }, Object.create({ old: true }) as Record<string, boolean>)).toBe(false)
  expect(isModelEnabled({ id: '__proto__', deprecated: true }, JSON.parse('{"__proto__":true}') as Record<string, boolean>)).toBe(true)
  expect(() => PlainConfig({ modelVisibility: { normal: 'yes' } } as never)).toThrow()
})

it('uses actual release dates for the seven-day badge and sorts deprecated models last', () => {
  const now = Date.parse('2026-09-22T12:00:00Z')
  expect(isNewModel({ id: 'a', releaseDate: '2026-09-16' }, now)).toBe(true)
  for (const releaseDate of ['2026-09-15', '2026-09-23', '2026-02-30', undefined]) {
    expect(isNewModel({ id: 'a', releaseDate }, now)).toBe(false)
  }
  expect(sortModels([
    { id: 'old', deprecated: true, releaseDate: '2026-09-22' },
    { id: 'normal' }, { id: 'new', releaseDate: '2026-09-22' },
  ], now).map(m => m.id)).toEqual(['new', 'normal', 'old'])
})
