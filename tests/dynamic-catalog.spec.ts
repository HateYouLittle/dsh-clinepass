import { afterEach, describe, expect, it, vi } from 'vitest'
import { getBuiltinModels } from 'clinepass-pi-ai/providers/all'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime, { createUserMessage, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import { ClinePassAdapter } from '../src/adapter.ts'
import { configOf } from './config-of.ts'
import { ClinePassCatalog, discoverCatalogModels, discoverSettingsModels } from '../src/catalog.ts'
import { curatedModelIds } from '../src/clinepass-models.ts'
import { closeMockGateways, CURATED_IDS, listingBody, mockGateway, textEvents } from './mock-gateway.ts'

const flash = CURATED_IDS.flash
const unconfigured = 'cline-pass/unconfigured-model'

afterEach(closeMockGateways)

describe('curated model metadata', () => {
  it.each([CURATED_IDS.flash, CURATED_IDS.minimax])('resolves %s through the host with its shipped controls', async (id) => {
    const gateway = await mockGateway({ status: 200, body: listingBody([id]) })
    const config = configOf(gateway.url)
    const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
    const ctx = new Context()
    await ctx.plugin(LlmRuntime)
    ctx.llm.registerAdapter(['dsh-clinepass'], adapter)
    try {
      const models = await ctx.llm.listModels('dsh-clinepass')
      expect(models.map(model => model.id)).toContain(id)
      const resolved = await ctx.llm.resolveModelInfo('dsh-clinepass', id)
      expect(resolved).toMatchObject({ id, provider: 'dsh-clinepass' })
      expect(resolved.reasoning?.efforts.length).toBeGreaterThan(0)
      expect(resolved.reasoning).not.toHaveProperty('defaultEffort')
      expect((await adapter.catalogOf(config).snapshot()).models.get(id)?.reasoning).toBe(true)
    } finally {
      await ctx.fiber.dispose()
    }
  })

  it('keeps an advertisement this build cannot configure from breaking the host catalog', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([flash, unconfigured]) })
    const config = configOf(gateway.url)
    const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
    const ctx = new Context()
    await ctx.plugin(LlmRuntime)
    ctx.llm.registerAdapter(['dsh-clinepass'], adapter)
    try {
      // The browser eagerly resolves every listed model; an unconfigurable
      // advertisement must never be selectable and must never hide the provider.
      const models = await ctx.llm.listModels('dsh-clinepass')
      expect(models.map(model => model.id)).toEqual(curatedModelIds())
      const resolved = await Promise.all(models.map(model => ctx.llm.resolveModelInfo('dsh-clinepass', model.id)))
      expect(resolved.map(model => model.id)).toEqual(curatedModelIds())
      expect(await discoverCatalogModels(adapter.catalogOf(config))).toContainEqual(expect.objectContaining({
        id: unconfigured, name: expect.stringContaining('metadata unavailable'),
      }))
      await expect(ctx.llm.resolveModelInfo('dsh-clinepass', unconfigured))
        .rejects.toMatchObject({ code: 'MODEL_METADATA_UNAVAILABLE' })
    } finally {
      await ctx.fiber.dispose()
    }
  })

  it('preserves the service default when the model offers explicit efforts', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.kimi]) })
    gateway.pushCompletions({ events: textEvents })
    const adapter = new ClinePassAdapter({ config: () => configOf(gateway.url), resolveApiKey: async () => 'test-key' })
    const ctx = new Context()
    await ctx.plugin(LlmRuntime)
    ctx.llm.registerAdapter(['dsh-clinepass'], adapter)
    try {
      const resolved = await ctx.llm.resolveModelInfo('dsh-clinepass', CURATED_IDS.kimi)
      expect(resolved.reasoning?.efforts.map(effort => effort.id)).toEqual(['off', 'low', 'high', 'max'])
      expect(resolved.reasoning).not.toHaveProperty('defaultEffort')
      for await (const _chunk of ctx.llm.stream({
        provider: 'dsh-clinepass', model: CURATED_IDS.kimi,
        messages: [createUserMessage({
          content: [{ type: 'text', text: 'hi' }], source: { kind: 'plugin', plugin: 'test' },
        })],
      })) { /* Validate the request after DSH resolves its default effort. */ }
      // Default leaves every thinking control to the service.
      expect(gateway.bodies[0]).not.toHaveProperty('thinking')
      expect(gateway.bodies[0]).not.toHaveProperty('reasoning_effort')
    } finally {
      await ctx.fiber.dispose()
    }
  })

  it('serves shipped models that have no pi-ai builtin entry', async () => {
    expect(getBuiltinModels('clinepass').some(model => model.id.startsWith('cline-pass/'))).toBe(false)
    const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
    const catalog = new ClinePassCatalog(gateway.url, 3_600_000, () => {}, () => {})
    expect(await discoverCatalogModels(catalog)).toContainEqual({
      id: flash, name: 'DeepSeek V4.1 Flash', contextWindow: 921_600, maxTokens: 131_072,
    })
    expect((await catalog.snapshot()).models.get(flash)).toMatchObject({
      api: 'openai-completions', input: ['text', 'image'], baseUrl: gateway.url,
    })
  })

  it('makes an unconfigurable advertisement visible and resolves it only after the table ships it', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([unconfigured]) })
    const catalog = new ClinePassCatalog(gateway.url, 3_600_000, () => {}, () => {})
    const models = await discoverCatalogModels(catalog)
    expect(models).toContainEqual({ id: unconfigured, name: expect.stringContaining('metadata unavailable') })
    await expect(catalog.forModel(unconfigured)).rejects.toMatchObject({ code: 'MODEL_METADATA_UNAVAILABLE' })
    // A shipped row is always resolvable, whether or not the listing names it.
    expect((await catalog.forModel(flash)).models.has(flash)).toBe(true)
  })

  it('reuses the picker catalog during its TTL and re-reads the shipped table after explicit refreshes', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.kimi]) })
    const config = configOf(gateway.url)
    const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
    expect((await adapter.listModels('dsh-clinepass')).map(model => model.id)).toEqual(curatedModelIds())
    gateway.setModelListing(200, listingBody([unconfigured]))
    expect((await adapter.listModels('dsh-clinepass')).map(model => model.id)).toEqual(curatedModelIds())
    expect(gateway.modelListings).toBe(1)

    const settings = await discoverSettingsModels(adapter.catalogOf(config))
    expect(settings.models.map(model => model.id)).toEqual([...curatedModelIds(), unconfigured])
    expect(settings.models.find(model => model.id === unconfigured)?.configurationMissing).toBe(true)
    expect(gateway.modelListings).toBe(2)
    // The shipped rows survive an honest empty listing.
    gateway.setModelListing(200, listingBody([]))
    expect(await discoverSettingsModels(adapter.catalogOf(config))).toMatchObject({ models: expect.arrayContaining([
      expect.objectContaining({ id: flash }),
    ]), stale: false })
    expect((await adapter.listModels('dsh-clinepass')).map(model => model.id)).toEqual(curatedModelIds())
    expect(gateway.modelListings).toBe(3)
  })

  it('revalidates the picker catalog when the configured refresh interval expires', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.kimi]) })
    const config = configOf(gateway.url, { refreshMinutes: 1 })
    const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => 'test-key' })
    expect((await adapter.listModels('dsh-clinepass')).map(model => model.id)).toEqual(curatedModelIds())
    const first = await adapter.catalogOf(config).snapshot()
    gateway.setModelListing(200, listingBody([unconfigured]))
    const now = vi.spyOn(Date, 'now')
    try {
      now.mockReturnValue(first.fetchedAtMs + 59_999)
      await adapter.listModels('dsh-clinepass')
      expect(gateway.modelListings).toBe(1)
      now.mockReturnValue(first.fetchedAtMs + 60_000)
      await adapter.listModels('dsh-clinepass')
      expect(gateway.modelListings).toBe(2)
      // The refresh only changes the diagnostic, never membership.
      expect((await adapter.catalogOf(config).snapshot()).unavailable.has(unconfigured)).toBe(true)
    } finally {
      now.mockRestore()
    }
  })
})

describe('new models use the declared protocol', () => {
  it('separates service Default from explicit Off and Low', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
    const adapter = new ClinePassAdapter({ config: () => configOf(`${gateway.url}/v1`), resolveApiKey: async () => 'test-key' })
    const ctx = new Context()
    await ctx.plugin(LlmRuntime)
    ctx.llm.registerAdapter(['dsh-clinepass'], adapter)
    try {
      const info = await ctx.llm.resolveModelInfo('dsh-clinepass', flash)
      expect(info.reasoning).not.toHaveProperty('defaultEffort')
      for (const effort of [undefined, 'off', 'low'] as const) {
        gateway.pushCompletions({ events: textEvents })
        const chunks = []
        for await (const chunk of ctx.llm.stream({ provider: 'dsh-clinepass', model: flash,
          ...effort === undefined ? {} : { reasoningEffort: ReasoningEffortId(effort) },
          messages: [createUserMessage({ content: [{ type: 'text', text: 'hi' }], source: { kind: 'plugin', plugin: 'test' } })],
        })) chunks.push(chunk)
        expect(chunks.find(chunk => chunk.type === 'finish')).toMatchObject({ reason: { kind: 'stop' } })
        const body = gateway.bodies.at(-1) as Record<string, unknown>
        if (effort === undefined) {
          for (const key of ['thinking', 'reasoning', 'reasoning_effort', 'output_config']) expect(body).not.toHaveProperty(key)
        } else {
          expect(body.reasoning_effort).toBe(effort === 'off' ? 'none' : effort)
        }
      }
    } finally { await ctx.fiber.dispose() }
  })

  it.each([undefined, 1024])('streams a shipped model via the single chat-completions endpoint with output cap %s', async (cap) => {
    const gateway = await mockGateway({ status: 200, body: listingBody([flash]) })
    gateway.pushCompletions({ events: textEvents })
    const adapter = new ClinePassAdapter({ config: () => configOf(`${gateway.url}/v1`, {
      modelLimits: cap === undefined ? {} : { [flash]: { maxTokens: cap } },
    }), resolveApiKey: async () => 'test-key' })
    const chunks = []
    for await (const chunk of adapter.stream({
      provider: 'dsh-clinepass', model: flash, sessionId: 'new-model-session' as never,
      system: 'SYSTEM_PROMPT_SENTINEL',
      tools: [{ name: 'probe_tool', description: 'Probe tool', parameters: {
        type: 'object', properties: { query: { type: 'string' } }, required: ['query'],
      } }],
      ...(cap === undefined ? {} : { maxTokens: 8192 }),
      messages: [createUserMessage({ content: [{ type: 'text', text: 'hello' }], source: { kind: 'plugin', plugin: 'test' } })],
    })) chunks.push(chunk)
    // ClinePass serves one protocol: the configured base, no sibling endpoint.
    expect(gateway.paths.map(value => new URL(value, gateway.url).pathname)).toEqual(['/v1/models', '/v1/chat/completions'])
    const body = gateway.bodies[0] as Record<string, unknown>
    expect(body).toMatchObject({ model: flash })
    // A successful text stream alone cannot detect pi-ai silently dropping
    // legacy Context fields. Inspect the actual wire prompt and declarations.
    expect(JSON.stringify(body).match(/SYSTEM_PROMPT_SENTINEL/g)).toHaveLength(1)
    expect(body).toMatchObject({
      messages: expect.arrayContaining([expect.objectContaining({ role: 'system',
        content: expect.arrayContaining([expect.objectContaining({ type: 'text', text: 'SYSTEM_PROMPT_SENTINEL' })]),
      })]),
      tools: [expect.objectContaining({ type: 'function', function: expect.objectContaining({ name: 'probe_tool',
        parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
      }) })],
    })
    if (cap !== undefined) expect(body.max_completion_tokens ?? body.max_tokens).toBe(cap)
    expect(gateway.headers[1]?.['x-task-id']).toBe('new-model-session')
    expect(chunks).toContainEqual(expect.objectContaining({ type: 'text-delta', text: 'hello' }))
    expect(chunks.find(chunk => chunk.type === 'finish')).toMatchObject({ reason: { kind: 'stop' } })
  })
})
