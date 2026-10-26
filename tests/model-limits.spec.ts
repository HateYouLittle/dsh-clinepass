import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import FileSettingsProvider from '@deepseek-ai/dsh-settings-file'
import LlmRuntime, { ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ClinePassAdapter } from '../src/adapter.ts'
import { discoverCatalogModels, discoverSettingsModels } from '../src/catalog.ts'
import { PlainConfig } from '../src/config.ts'
import { configOf } from './config-of.ts'
import { closeMockGateways, listingBody, mockGateway, textEvents } from './mock-gateway.ts'

const flash = 'cline-pass/deepseek-v4.1-flash'

afterEach(closeMockGateways)

it.each([
  { configured: undefined, requested: undefined, expected: 65_536 },
  { configured: 131_072, requested: undefined, expected: 131_072 },
  { configured: undefined, requested: 98_304, expected: 98_304 },
  { configured: 32_768, requested: 98_304, expected: 32_768 },
])('aligns the host reservation with the wire allowance ($configured, $requested)', async ({ configured, requested, expected }) => {
  const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
  gateway.pushCompletions({ events: textEvents })
  const config = configOf(gateway.url, { modelLimits: configured === undefined ? {} : { [flash]: { maxTokens: configured } } })
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
  const ctx = new Context()
  await ctx.plugin(LlmRuntime)
  ctx.llm.registerAdapter(['dsh-clinepass'], adapter)
  try {
    const info = await adapter.resolveModel('dsh-clinepass', flash)
    expect(info.defaultMaxTokens).toBe(configured ?? 65_536)
    const prepared = await ctx.llm.prepareCall({ provider: 'dsh-clinepass', model: flash,
      ...requested === undefined ? {} : { maxTokens: requested } })
    expect(prepared.config.maxTokens).toBe(requested ?? info.defaultMaxTokens)
    for await (const chunk of prepared.stream({ provider: 'dsh-clinepass', model: flash, messages: [], ...prepared.config })) void chunk
    expect(gateway.bodies[0]).toMatchObject({ max_completion_tokens: expected })
  } finally { await ctx.fiber.dispose() }
})

it('bounds the DeepSeek V4.1 Flash default by its curated output capacity', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
  gateway.pushCompletions({ events: textEvents })
  const adapter = new ClinePassAdapter({
    config: () => configOf(gateway.url, { modelLimits: { [flash]: { maxTokens: 8_192 } } }),
    resolveApiKey: async () => 'test-key',
  })
  expect((await adapter.resolveModel('dsh-clinepass', flash)).defaultMaxTokens).toBe(8_192)
  for await (const chunk of adapter.stream({ provider: 'dsh-clinepass', model: flash, messages: [] })) void chunk
  expect(gateway.bodies[0]).toMatchObject({ max_completion_tokens: 8_192 })
  // The shipped catalog keeps its own capacity; only this request is bounded.
  expect(await discoverCatalogModels(adapter.catalogOf(configOf(gateway.url))))
    .toContainEqual(expect.objectContaining({ id: flash, maxTokens: 131_072 }))
})

it.each(['cline-pass/deepseek-v4-pro', 'cline-pass/kimi-k3'])(
  'preserves the SDK default and explicit caller allowance for other models: %s', async model => {
  const gateway = await mockGateway({ status: 200, body: listingBody([model]) })
  gateway.pushCompletions({ events: textEvents })
  gateway.pushCompletions({ events: textEvents })
  const adapter = new ClinePassAdapter({ config: () => configOf(gateway.url), resolveApiKey: async () => 'test-key' })
  const ctx = new Context()
  await ctx.plugin(LlmRuntime)
  ctx.llm.registerAdapter(['dsh-clinepass'], adapter)
  try {
    expect(await adapter.resolveModel('dsh-clinepass', model)).not.toHaveProperty('defaultMaxTokens')
    const prepared = await ctx.llm.prepareCall({ provider: 'dsh-clinepass', model })
    expect(prepared.config.maxTokens).toBeUndefined()
    for await (const chunk of prepared.stream({ provider: 'dsh-clinepass', model, messages: [], ...prepared.config })) void chunk
    expect(gateway.bodies[0]).toMatchObject({ max_completion_tokens: 131_072 })
    for await (const chunk of adapter.stream({ provider: 'dsh-clinepass', model, messages: [], maxTokens: 196_608 })) void chunk
    expect(gateway.bodies[1]).toMatchObject({ max_completion_tokens: 196_608 })
  } finally { await ctx.fiber.dispose() }
})

it('preserves an explicit output override for other models', async () => {
  const model = 'cline-pass/deepseek-v4-pro'
  const gateway = await mockGateway({ status: 200, body: listingBody([model]) })
  gateway.pushCompletions({ events: textEvents })
  const adapter = new ClinePassAdapter({ config: () => configOf(gateway.url, {
    modelLimits: { [model]: { maxTokens: 98_304 } },
  }), resolveApiKey: async () => 'test-key' })
  for await (const chunk of adapter.stream({ provider: 'dsh-clinepass', model, messages: [] })) void chunk
  expect(gateway.bodies[0]).toMatchObject({ max_completion_tokens: 98_304 })
})

it.each([undefined, 'high'])('keeps the chat-completions output default with reasoning=%s', async effort => {
  const model = 'cline-pass/minimax-m3'
  const gateway = await mockGateway({ status: 200, body: listingBody([model]) })
  gateway.pushCompletions({ status: 400, body: '{"message":"fixture rejection"}' })
  const adapter = new ClinePassAdapter({ config: () => configOf(gateway.url), resolveApiKey: async () => 'test-key' })
  const prepared = await adapter.prepareCall('dsh-clinepass', model)
  expect(prepared.model).not.toHaveProperty('defaultMaxTokens')
  for await (const chunk of prepared.stream({ provider: 'dsh-clinepass', model, messages: [],
    ...effort === undefined ? {} : { reasoningEffort: ReasoningEffortId(effort) },
  })) void chunk
  expect(gateway.paths.at(-1)).toBe('/chat/completions')
  expect(gateway.bodies[0]).toMatchObject({ max_completion_tokens: 131_072 })
})

it('keeps original catalog references when runtime capacities are overridden', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
  const config = configOf(gateway.url, { modelLimits: { [flash]: { contextWindow: 123456, maxTokens: 5432 } } })
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
  expect((await adapter.resolveModel('dsh-clinepass', flash)).context?.contextWindow).toBe(123456)
  expect(await discoverCatalogModels(adapter.catalogOf(config))).toContainEqual(expect.objectContaining({
    id: flash, contextWindow: 921_600, maxTokens: 131_072,
  }))
})

it.each([undefined, 8192, 512])('caps explicit and default request output (%s)', async (requested) => {
  const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
  gateway.pushCompletions({ events: textEvents })
  const config = configOf(gateway.url, { modelLimits: { [flash]: { maxTokens: 1024 } } })
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
  for await (const chunk of adapter.stream({ provider: 'dsh-clinepass', model: flash, messages: [],
    ...(requested === undefined ? {} : { maxTokens: requested }),
  })) void chunk
  const body = gateway.bodies[0] as Record<string, number>
  expect(body.max_tokens ?? body.max_completion_tokens).toBe(Math.min(requested ?? 1024, 1024))
})

it('keeps the shipped capacities when the listing is unreachable', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
  let config = configOf(gateway.url)
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
  expect((await adapter.resolveModel('dsh-clinepass', flash)).context?.contextWindow).toBe(921_600)
  gateway.setModelListing(503, {})
  config = { ...config, modelLimits: { [flash]: { contextWindow: 123456 } } }
  await expect(adapter.resolveModel('dsh-clinepass', flash)).resolves.toMatchObject({ context: { contextWindow: 123456 } })
  // An explicit refresh must preserve the shipped model too, not just the TTL hit.
  expect((await discoverSettingsModels(adapter.catalogOf(config))).models).toContainEqual(expect.objectContaining({
    id: flash, contextWindow: 921_600,
  }))
  config = { ...config, modelLimits: {} }
  expect((await adapter.resolveModel('dsh-clinepass', flash)).context?.contextWindow).toBe(921_600)
})

it('keeps capacities captured before an in-flight listing fetch across a settings change', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
  let config = configOf(gateway.url, { modelLimits: { [flash]: { contextWindow: 123456 } } })
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
  const priorFetch = globalThis.fetch
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  vi.stubGlobal('fetch', async (input: string | URL | Request, init?: RequestInit) => {
    if (String(input).endsWith('/models')) await gate
    return priorFetch(input, init)
  })
  const pending = adapter.resolveModel('dsh-clinepass', flash)
  // Keep the nested object shared: model reads still need an owned config snapshot.
  config.modelLimits[flash]!.contextWindow = 42
  config = { ...config }
  release()
  expect((await pending).context?.contextWindow).toBe(123456)
  expect((await adapter.resolveModel('dsh-clinepass', flash)).context?.contextWindow).toBe(42)
})

it('can explicitly return inherited profile capacities to the catalog', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'clinepass-inherited-limits-'))
  const ctx = new Context()
  try {
    const path = join(dir, 'settings.yaml')
    await writeFile(path, '')
    await ctx.plugin(FileSettingsProvider, { path, watch: false })
    let current = () => PlainConfig({})
    ctx.settings.installSection(ctx, 'llm-clinepass', PlainConfig, PlainConfig({
      modelLimits: { example: { contextWindow: 123456, maxTokens: 1024 } },
    }), { setSource: source => { current = source }, onChange: () => {} })
    await ctx.settings.mutate('llm-clinepass', [{ op: 'set', path: ['modelLimits'], value: { example: { contextWindow: null } } }])
    expect(current().modelLimits).toEqual({ example: { contextWindow: null, maxTokens: 1024 } })
    await ctx.settings.mutate('llm-clinepass', [{ op: 'set', path: ['modelLimits'], value: { example: null } }])
    expect(current().modelLimits).toEqual({ example: null })
  } finally {
    await ctx.fiber.dispose()
    await rm(dir, { recursive: true, force: true })
  }
})
