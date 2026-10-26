import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import Gateway from '@deepseek-ai/dsh-api-gateway'
import Registry from '@deepseek-ai/dsh-typert-registry'
import { ClinePassAdapter } from '../src/adapter.ts'
import { ClineModelsService } from '../src/models.ts'
import { registerClineRemotes } from '../src/remotes.ts'
import { isModelEnabled, parseGoModelCatalog, type ClineModelCatalog } from '../src/models-contract.ts'
import type { ClinePassConfig } from '../src/config.ts'
import { configOf } from './config-of.ts'
import { closeMockGateways, CURATED_IDS, listingBody, mockGateway } from './mock-gateway.ts'

afterEach(closeMockGateways)

/** Mount the settings-facing models service over the adapter's catalog. */
async function serviceFor(adapter: ClinePassAdapter, config: ClinePassConfig) {
  const ctx = new Context()
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  await ctx.plugin(ClineModelsService, { catalog: () => adapter.catalogOf(config) })
  return {
    ctx,
    read: async () => await ctx.typertGateway.invoke({
      namespace: 'clinePassModels', method: 'read', args: {},
    }) as ClineModelCatalog,
  }
}

it.each([
  { name: 'HTTP failure', reply: () => new Response(null, { status: 503 }), detail: 'HTTP 503' },
  { name: 'timeout', reply: () => { throw new DOMException('timed out', 'TimeoutError') }, detail: 'timed out' },
  { name: 'invalid JSON', reply: () => new Response('not-json'), detail: 'invalid JSON' },
  { name: 'invalid listing document', reply: () => Response.json({}), detail: 'invalid model listing' },
])('reports a cold-start listing $name through the Host RPC and clears it after recovery', async ({ reply, detail }) => {
  const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
  const config = configOf(gateway.url)
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => undefined })
  const original = globalThis.fetch
  vi.stubGlobal('fetch', async (input: string | URL | Request, init?: RequestInit) =>
    String(input).endsWith('/models') ? reply() : original(input, init))
  const { ctx, read } = await serviceFor(adapter, config)
  try {
    const failed = await read()
    expect(failed.stale).toBe(true)
    expect(failed.error).toContain(detail)
    expect(failed.sources?.listing.error).toContain(detail)
    // The curated table ships with the plugin: an unreachable listing never
    // empties the picker, and there is no online configuration source to fail.
    expect(failed.sources?.metadata).toEqual({})
    expect(failed.models.map(model => model.id)).toContain(CURATED_IDS.flash)
    expect(failed.models.find(model => model.id === CURATED_IDS.flash)?.configurationMissing).not.toBe(true)

    vi.stubGlobal('fetch', original)
    const recovered = await read()
    expect(recovered.stale).toBe(false)
    expect(recovered.error).toBeUndefined()
    expect(recovered.sources).toEqual({
      listing: { updatedAt: expect.any(Number) }, metadata: {},
    })
    expect(recovered.models.map(model => model.id)).toContain(CURATED_IDS.flash)
  } finally {
    await ctx.fiber.dispose()
  }
})

it('round-trips source diagnostics, accepts older responses, and rejects invalid timestamps', () => {
  const old = { models: [], stale: false }
  expect(parseGoModelCatalog(old)).toEqual(old)
  const catalog = { models: [], stale: true, sources: {
    listing: { updatedAt: 1_000, warning: 'one row ignored' }, metadata: {},
  } }
  expect(parseGoModelCatalog(catalog)).toEqual(catalog)
  expect(() => parseGoModelCatalog({ ...catalog, sources: { ...catalog.sources, listing: { warning: 3 } } })).toThrow(/warning/)
  for (const updatedAt of [-1, NaN, Infinity, 'yesterday', 8_640_000_000_000_001]) {
    expect(() => parseGoModelCatalog({ ...catalog, sources: { ...catalog.sources, listing: { updatedAt } } })).toThrow(/timestamp/)
  }
})

it('keeps thinking budget bounds through the settings RPC codec', () => {
  const catalog = { models: [{ id: 'budget', reasoningBudget: { min: 1024, max: 20000 } }], stale: false }
  expect(parseGoModelCatalog(catalog)).toEqual(catalog)
  expect(parseGoModelCatalog({ ...catalog, models: [{ id: 'budget', reasoningBudget: { min: 1024, max: 512 } }] }))
    .toEqual({ models: [{ id: 'budget' }], stale: false })
})

it('keeps the declared input modalities across the Host RPC result codec', () => {
  const catalog = { models: [{ id: 'm', inputModalities: ['text', 'video'] }], stale: false }
  expect(parseGoModelCatalog(catalog)).toEqual(catalog)
  // An older Host omits the field entirely; the page then reports it as undeclared.
  expect(parseGoModelCatalog({ models: [{ id: 'm' }], stale: false })).toEqual({ models: [{ id: 'm' }], stale: false })
})

it('serves the curated input modalities through the Host RPC the settings page reads', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
  const config = configOf(gateway.url)
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => undefined })
  const { ctx, read } = await serviceFor(adapter, config)
  try {
    const catalog = await read()
    // Declared by the shipped table: GLM-5.3 is text-only, its Flash sibling takes images.
    expect(catalog.models).toContainEqual(expect.objectContaining({ id: 'cline-pass/glm-5.3', inputModalities: ['text'] }))
    expect(catalog.models).toContainEqual(expect.objectContaining({ id: 'cline-pass/glm-5.3-flash', inputModalities: ['text', 'image'] }))
  } finally {
    await ctx.fiber.dispose()
  }
})

it('marks an advertised id this build cannot configure and refuses to resolve it', async () => {
  const id = 'cline-pass/unconfigured-model'
  const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash, id]) })
  const config = configOf(gateway.url, { modelVisibility: { [id]: true } })
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => undefined })
  const { ctx, read } = await serviceFor(adapter, config)
  try {
    const missing = await read()
    expect(missing.stale).toBe(false)
    expect(missing.models).toContainEqual({ id, name: id, configurationMissing: true })
    const row = missing.models.find(model => model.id === id)!
    // A visibility switch cannot enable an id the build has no configuration for.
    expect(isModelEnabled(row, config.modelVisibility)).toBe(false)
    expect((await adapter.listModels('dsh-clinepass')).map(model => model.id)).not.toContain(id)
    await expect(adapter.resolveModel('dsh-clinepass', id)).rejects.toMatchObject({ code: 'MODEL_METADATA_UNAVAILABLE' })

    // A curated id stays selectable in the same snapshot.
    expect(isModelEnabled(missing.models.find(model => model.id === CURATED_IDS.flash)!, config.modelVisibility)).toBe(true)
    await expect(adapter.resolveModel('dsh-clinepass', CURATED_IDS.flash)).resolves.toMatchObject({ id: CURATED_IDS.flash })
  } finally {
    await ctx.fiber.dispose()
  }
})

it('returns retained settings models and the listing timeout diagnostic through the Host RPC', async () => {
  const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
  const config = configOf(gateway.url)
  const adapter = new ClinePassAdapter({ config: () => config, resolveApiKey: async () => undefined })
  const { ctx, read } = await serviceFor(adapter, config)
  try {
    const first = await read()
    expect(first.stale).toBe(false)
    expect(first.models.map(model => model.id)).toContain(CURATED_IDS.flash)
    const original = globalThis.fetch
    vi.stubGlobal('fetch', (input: string | URL | Request, init?: RequestInit) => String(input) === `${gateway.url}/models`
      ? Promise.reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'))
      : original(input, init))

    const stale = await read()
    // The shipped catalog is retained verbatim when the refresh fails.
    expect(stale.models).toEqual(first.models)
    expect(stale.stale).toBe(true)
    expect(stale.error).toContain(`${gateway.url}/models: request timed out or was aborted`)
    expect((await adapter.listModels('dsh-clinepass')).map(model => model.id)).toEqual(stale.models.map(model => model.id))

    vi.stubGlobal('fetch', original)
    const recovered = await read()
    expect(recovered.stale).toBe(false)
    expect(recovered.error).toBeUndefined()
    expect(recovered.models).toEqual(first.models)
  } finally {
    await ctx.fiber.dispose()
  }
})
