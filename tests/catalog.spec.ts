import { brotliCompressSync, deflateSync, gzipSync } from 'node:zlib'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ClinePassCatalog,
  discoverCatalogModels,
  discoverSettingsModels,
  readLiveModelIds,
} from '../src/catalog.ts'
import { curatedModelIds } from '../src/clinepass-models.ts'
import { closeMockGateways, CURATED_IDS, fullLiveListing, listingBody, mockGateway } from './mock-gateway.ts'

/** A namespaced id the gateway advertises that this build ships no configuration for. */
const novelId = 'cline-pass/novel-model'

const responseFormats = [
  { name: 'plain JSON', responseBodyTransform: undefined, responseHeaders: undefined },
  ...[
    { encoding: 'br', compress: brotliCompressSync },
    { encoding: 'gzip', compress: gzipSync },
    { encoding: 'deflate', compress: deflateSync },
  ].map(({ encoding, compress }) => ({
    name: `${encoding} decoded by fetch`,
    responseBodyTransform: (body: Buffer) => compress(body),
    responseHeaders: { 'content-encoding': encoding },
  })),
]

afterEach(async () => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  await closeMockGateways()
})

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(1_000_000)
})

describe('readLiveModelIds', () => {
  it('reports bounded row positions without copying malformed content', () => {
    const warning = vi.fn()
    expect(readLiveModelIds({ data: [{ id: 'a' }, ...Array(12).fill({ secret: 'private-row' })] }, warning)).toEqual(['a'])
    expect(warning.mock.calls[0]?.[0]).toContain('12 of 13')
    expect(warning.mock.calls[0]?.[0]).toContain('rows 2, 3, 4, 5, 6, 7, 8, 9, …')
    expect(warning.mock.calls[0]?.[0]).not.toContain('private-row')
  })
  it('reads ids from the standard data array and skips rows without one', () => {
    expect(readLiveModelIds({ data: [{ id: 'a' }, { id: '' }, { id: 7 }, null, { id: 'b' }] }))
      .toEqual(['a', 'b'])
  })

  it('accepts an honest empty list and refuses anything else', () => {
    expect(readLiveModelIds({ data: [] })).toEqual([])
    expect(() => readLiveModelIds({})).toThrow(/no "data" array/)
    expect(() => readLiveModelIds({ data: {} })).toThrow(/no "data" array/)
  })
})

it('exposes mixed-listing warnings and clears them on a clean refresh', async () => {
  const gateway = await mockGateway({ status: 200, body: { data: [{ id: CURATED_IDS.flash }, null] } })
  const warning = vi.fn()
  const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {}, () => {}, undefined, warning)
  const result = await discoverSettingsModels(catalog)
  expect(result).toMatchObject({ stale: false, sources: { listing: { warning: expect.stringContaining('1 of 2') } } })
  expect(warning).toHaveBeenCalledTimes(1)
  gateway.setModelListing(200, listingBody([CURATED_IDS.flash]))
  expect((await discoverSettingsModels(catalog)).sources?.listing.warning).toBeUndefined()
})

describe('ClinePassCatalog', () => {
  it('serves the shipped table from the first snapshot, before any listing succeeds', async () => {
    const gateway = await mockGateway({ status: 503, body: {} })
    const fallbacks: { url: string; error: unknown; kept: number }[] = []
    const catalog = new ClinePassCatalog(gateway.url, 60_000, detail => fallbacks.push(detail), () => {})

    const snapshot = await catalog.snapshot()

    expect(snapshot.live).toBe(false)
    // Membership ships with the plugin: an unreachable listing cannot empty the picker.
    expect([...snapshot.models.keys()]).toEqual(curatedModelIds())
    expect(snapshot.metadataLive).toBe(true)
    expect(snapshot.metadataFailure).toBeUndefined()
    expect(snapshot.metadataUpdatedAtMs).toBeUndefined()
    expect(snapshot.unavailable.size).toBe(0)
    expect(fallbacks).toEqual([expect.objectContaining({ url: `${gateway.url}/models`, error: expect.any(Error), kept: curatedModelIds().length })])
  })

  it('caches one resolution for the refresh interval, then refetches', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})

    await catalog.snapshot()
    await catalog.snapshot()
    expect(gateway.modelListings).toBe(1)

    vi.setSystemTime(1_000_000 + 60_000)
    gateway.setModelListing(200, listingBody([CURATED_IDS.kimi, novelId]))
    const refreshed = await catalog.snapshot()
    expect(gateway.modelListings).toBe(2)
    expect(refreshed.unavailable.has(novelId)).toBe(true)
    expect(refreshed.models.has(CURATED_IDS.kimi)).toBe(true)
    expect([...refreshed.models.keys()]).toEqual(curatedModelIds())
  })

  it('shares one in-flight fetch between concurrent snapshots', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody(fullLiveListing()) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})

    const [first, second] = await Promise.all([catalog.snapshot(), catalog.snapshot()])

    expect(first).toBe(second)
    expect(gateway.modelListings).toBe(1)
  })

  it('uses only the listing deadline now that there is no metadata endpoint', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout')
    const gateway = await mockGateway({ status: 200, body: listingBody(fullLiveListing()) })
    await new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {}).snapshot()
    expect(timeout.mock.calls.map(([ms]) => ms)).toEqual([10_000])
  })

  it.each(responseFormats)('reads a $name listing over HTTP', async ({ name: _name, ...format }) => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]), ...format })
    const fallback = vi.fn()
    const catalog = new ClinePassCatalog(gateway.url, 60_000, fallback, () => {})

    const snapshot = await catalog.snapshot()

    expect(snapshot.live).toBe(true)
    expect(snapshot.models.get(CURATED_IDS.flash)).toMatchObject({
      name: 'DeepSeek V4.1 Flash', contextWindow: 921_600, maxTokens: 131_072,
    })
    expect(snapshot.unavailable.size).toBe(0)
    expect(fallback).not.toHaveBeenCalled()
    expect(gateway.modelListings).toBe(1)
  })

  it('recovers a gzip listing when the host loses the encoding header', async () => {
    // Reproduce bytes delivered after the host loses the encoding header.
    const responseBodyTransform = (body: Buffer, request: import('node:http').IncomingMessage) =>
      request.headers['accept-encoding'] === 'gzip' ? gzipSync(body) : body
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]), responseBodyTransform })
    const snapshot = await new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {}).snapshot()
    expect(snapshot.live).toBe(true)
    expect(snapshot.models.has(CURATED_IDS.flash)).toBe(true)
    expect(gateway.headers[0]['accept-encoding']).toBe('identity')
  })

  it.each([false, true])('enforces the listing byte limit over HTTP, compressed=$compressed', async compressed => {
    const maxBytes = 1024 * 1024
    const oversized: Record<string, unknown> = { data: [{ id: CURATED_IDS.flash }], padding: '' }
    oversized.padding = 'x'.repeat(maxBytes + 1 - Buffer.byteLength(JSON.stringify(oversized)))
    expect(Buffer.byteLength(JSON.stringify(oversized))).toBe(maxBytes + 1)
    const gateway = await mockGateway({
      status: 200, body: oversized,
      responseBodyTransform: compressed ? (body: Buffer) => gzipSync(body) : undefined,
      responseHeaders: compressed ? { 'content-encoding': 'gzip' } : undefined,
    })
    const fallback = vi.fn()

    const snapshot = await new ClinePassCatalog(gateway.url, 60_000, fallback, () => {}).snapshot()

    expect(snapshot.live).toBe(false)
    // The oversize reply is a diagnostic; the shipped rows are untouched.
    expect([...snapshot.models.keys()]).toEqual(curatedModelIds())
    expect(fallback).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      url: `${gateway.url}/models`,
      error: expect.objectContaining({ cause: expect.any(RangeError) }),
    }))
    expect(fallback.mock.calls[0][0].error.message).toContain(`${maxBytes} byte limit`)
  })

  it('keeps the last usable snapshot when the listing becomes corrupt', async () => {
    let corrupt = false
    const responseBodyTransform = (body: Buffer): Buffer => corrupt ? Buffer.from('{ invalid JSON') : body
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]), responseBodyTransform })
    const fallback = vi.fn()
    const catalog = new ClinePassCatalog(gateway.url, 60_000, fallback, () => {})
    const first = await catalog.snapshot()
    expect(first.live).toBe(true)

    corrupt = true
    const stale = await catalog.snapshot(true)

    expect(stale.live).toBe(false)
    expect(stale.models).toEqual(first.models)
    expect(stale.details).toEqual(first.details)
    expect(fallback).toHaveBeenCalledTimes(1)
  })

  it('retries failed listings with bounded backoff instead of caching a failure for an hour', async () => {
    const gateway = await mockGateway({ status: 503, body: {} })
    const catalog = new ClinePassCatalog(gateway.url, 3_600_000, () => {}, () => {})
    const start = Date.now()
    expect((await catalog.snapshot()).live).toBe(false)
    vi.setSystemTime(start + 4_999)
    await catalog.snapshot()
    expect(gateway.modelListings).toBe(1)
    vi.setSystemTime(start + 5_000)
    await catalog.snapshot()
    expect(gateway.modelListings).toBe(2)
    gateway.setModelListing(200, listingBody([CURATED_IDS.flash]))
    vi.setSystemTime(start + 14_999)
    expect((await catalog.snapshot()).live).toBe(false)
    vi.setSystemTime(start + 15_000)
    expect((await catalog.snapshot()).live).toBe(true)
    expect(gateway.modelListings).toBe(3)
    // A recovery restores the normal successful cache lifetime.
    vi.setSystemTime(start + 75_000)
    await catalog.snapshot()
    expect(gateway.modelListings).toBe(3)
  })

  it('allows manual refresh during backoff and resets the delay after recovery', async () => {
    const gateway = await mockGateway({ status: 503, body: {} })
    const catalog = new ClinePassCatalog(gateway.url, 3_600_000, () => {}, () => {})
    await catalog.snapshot()
    gateway.setModelListing(200, listingBody([CURATED_IDS.flash]))
    expect((await catalog.snapshot(true)).live).toBe(true)
    gateway.setModelListing(503, {})
    const failed = await catalog.snapshot(true)
    expect(failed.models.has(CURATED_IDS.flash)).toBe(true)
    gateway.setModelListing(200, listingBody([CURATED_IDS.kimi, novelId]))
    vi.setSystemTime(Date.now() + 5_000)
    const recovered = await catalog.snapshot()
    expect(recovered.live).toBe(true)
    expect(recovered.unavailable.has(novelId)).toBe(true)
  })

  it('caps repeated failed refresh backoff at one minute', async () => {
    const gateway = await mockGateway({ status: 503, body: {} })
    const catalog = new ClinePassCatalog(gateway.url, 3_600_000, () => {}, () => {})
    await catalog.snapshot()
    for (const delay of [5_000, 10_000, 20_000, 40_000, 60_000, 60_000]) {
      const calls = gateway.modelListings
      vi.setSystemTime(Date.now() + delay - 1)
      await catalog.snapshot()
      expect(gateway.modelListings).toBe(calls)
      vi.setSystemTime(Date.now() + 1)
      await catalog.snapshot()
      expect(gateway.modelListings).toBe(calls + 1)
    }
  })

  it('serves a shipped model from cache while one background refresh runs', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})
    const first = await catalog.snapshot()
    vi.setSystemTime(Date.now() + 60_000)
    const original = globalThis.fetch
    const listing = Promise.withResolvers<Response>()
    const reads = vi.fn((input: string | URL | Request, init?: RequestInit) =>
      String(input).endsWith('/models') ? listing.promise : original(input, init))
    vi.stubGlobal('fetch', reads)
    gateway.setModelListing(200, listingBody([CURATED_IDS.flash, CURATED_IDS.kimi]))
    const known = catalog.forModel(CURATED_IDS.flash)
    const manual = catalog.snapshot(true)
    const completed = vi.fn()
    void manual.then(completed)
    try {
      const beforeRefresh = await Promise.race([known, new Promise<null>(resolve => setTimeout(() => resolve(null), 100))])
      expect(beforeRefresh).toBe(first)
      expect(completed).not.toHaveBeenCalled()
      expect(reads.mock.calls.filter(([url]) => String(url).endsWith('/models'))).toHaveLength(1)
    } finally {
      listing.resolve(Response.json(listingBody([CURATED_IDS.flash, CURATED_IDS.kimi])))
      await Promise.all([known, manual])
    }
    expect((await catalog.forModel(CURATED_IDS.kimi)).models.has(CURATED_IDS.kimi)).toBe(true)
  })

  it('reports a namespaced advertisement this build cannot configure', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash, novelId]) })
    const omitted: string[][] = []
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, ids => omitted.push([...ids]))

    const snapshot = await catalog.snapshot()

    expect(snapshot.live).toBe(true)
    expect(omitted).toEqual([[novelId]])
    expect(snapshot.unavailable.get(novelId)).toMatch(/curated ClinePass table/)
    expect([...snapshot.models.keys()]).toEqual(curatedModelIds())
    await expect(catalog.forModel(novelId)).rejects.toMatchObject({ code: 'MODEL_METADATA_UNAVAILABLE' })
  })

  it('never lets an empty or unreachable listing change membership', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})
    expect([...(await catalog.snapshot()).models.keys()]).toEqual(curatedModelIds())

    // An honest empty listing is a valid answer that still serves every shipped row.
    gateway.setModelListing(200, listingBody([]))
    const empty = await catalog.snapshot(true)
    expect(empty.live).toBe(true)
    expect([...empty.models.keys()]).toEqual(curatedModelIds())

    gateway.setModelListing(503, {})
    const down = await catalog.snapshot(true)
    expect(down.live).toBe(false)
    expect([...down.models.keys()]).toEqual(curatedModelIds())
  })

  it('ignores advertised ids outside the ClinePass namespaces', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash, 'union-alpha']) })
    const snapshot = await new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {}).snapshot()
    expect(snapshot.models.has('union-alpha')).toBe(false)
    expect(snapshot.unavailable.has('union-alpha')).toBe(false)
    expect(snapshot.models.has(CURATED_IDS.flash)).toBe(true)
  })

  it('retains the shipped catalog when a nonempty listing contains no valid ids', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})
    const good = await catalog.snapshot()
    expect(good.live).toBe(true)
    gateway.setModelListing(200, { data: [{ name: 'schema drift' }, { id: '   ' }, null] })
    const stale = await catalog.snapshot(true)
    expect(stale.live).toBe(false)
    expect([...stale.models.keys()]).toEqual([...good.models.keys()])
    expect((await discoverSettingsModels(catalog)).error).toMatch(/no valid model ids/)
  })

  it('distinguishes an unverifiable cold catalog from a configured model', async () => {
    const gateway = await mockGateway({ status: 503, body: {} })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})
    // A shipped model resolves from the table even while the listing is unreachable.
    expect((await catalog.forModel(CURATED_IDS.flash)).models.has(CURATED_IDS.flash)).toBe(true)
    // An id outside the table cannot be confirmed while the listing is unreachable.
    await expect(catalog.forModel('cline-pass/absent-model')).rejects.toMatchObject({ code: 'DISCOVERY_FAILED' })
    gateway.setModelListing(200, listingBody([]))
    // Once the listing answers, an unconfigured id is simply absent from the snapshot.
    expect((await catalog.forModel('cline-pass/absent-model')).models.has('cline-pass/absent-model')).toBe(false)
  })
})

describe('discoverCatalogModels', () => {
  it('answers the curated catalog with its shipped capacities', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody(fullLiveListing()) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})

    const models = await discoverCatalogModels(catalog)

    const flash = models.find(model => model.id === CURATED_IDS.flash)
    expect(flash?.name).toBe('DeepSeek V4.1 Flash')
    expect(flash?.contextWindow).toBe(921_600)
    expect(flash?.maxTokens).toBe(131_072)
    expect(models.map(model => model.id)).toEqual(curatedModelIds())
  })

  it('never rejects for an unreachable listing and reports it in the settings catalog', async () => {
    const gateway = await mockGateway({ status: 503, body: { error: 'private upstream response' } })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})

    const discovered = await discoverCatalogModels(catalog)
    expect(discovered.map(model => model.id)).toEqual(curatedModelIds())

    const settings = await discoverSettingsModels(catalog)
    expect(settings.models.map(model => model.id)).toEqual(curatedModelIds())
    expect(settings.stale).toBe(true)
    expect(settings.error).toContain(`${gateway.url}/models`)
    expect(settings.error).toContain('HTTP 503')
    expect(settings.error).not.toContain('private upstream response')
    expect(settings.sources).toEqual({ listing: { error: settings.error }, metadata: {} })
  })

  it('keeps settings and runtime on the shipped rows after a listing timeout', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})
    const first = await discoverSettingsModels(catalog)
    expect(first.stale).toBe(false)
    const original = globalThis.fetch
    vi.stubGlobal('fetch', (input: string | URL | Request, init?: RequestInit) => String(input) === `${gateway.url}/models`
      ? Promise.reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'))
      : original(input, init))

    const stale = await discoverSettingsModels(catalog)
    expect(stale.models).toEqual(first.models)
    expect(stale.stale).toBe(true)
    expect(stale.error).toContain(`${gateway.url}/models: request timed out or was aborted`)
    expect([...(await catalog.snapshot()).models.keys()]).toEqual(first.models.map(model => model.id))

    vi.stubGlobal('fetch', original)
    const recovered = await discoverSettingsModels(catalog)
    expect(recovered.stale).toBe(false)
    expect(recovered.error).toBeUndefined()
    expect(recovered.sources).toEqual({ listing: { updatedAt: expect.any(Number) }, metadata: {} })
  })

  it.each([
    { body: '{"private-token": broken}', message: /invalid JSON/i },
    { body: '{}', message: /data.*array/i },
  ])('distinguishes invalid JSON from invalid listing structure: $body', async ({ body, message }) => {
    const gateway = await mockGateway({ status: 200, body: {}, responseBodyTransform: () => Buffer.from(body) })
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})
    const failed = await discoverSettingsModels(catalog)
    // The failure is a diagnostic: the shipped rows are still served.
    expect(failed).toMatchObject({ stale: true, models: expect.arrayContaining([expect.objectContaining({ id: CURATED_IDS.flash })]) })
    expect(failed.error).toContain(`${gateway.url}/models`)
    expect(failed.error).toMatch(message)
    expect(failed.error).not.toContain('private-token')
  })

  it('reports a connection error code and clears it after recovery', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody(fullLiveListing()) })
    const original = globalThis.fetch
    vi.stubGlobal('fetch', (input: string | URL | Request, init?: RequestInit) => String(input) === `${gateway.url}/models`
      ? Promise.reject(new TypeError('fetch failed', { cause: Object.assign(new Error('private transport detail'), { code: 'ECONNREFUSED' }) }))
      : original(input, init))
    const catalog = new ClinePassCatalog(gateway.url, 60_000, () => {}, () => {})
    const failed = await discoverSettingsModels(catalog)
    expect(failed.error).toContain('ECONNREFUSED')
    expect(failed.error).toContain(`${gateway.url}/models`)
    expect(failed.error).not.toContain('private transport detail')
    vi.stubGlobal('fetch', original)
    await expect(discoverSettingsModels(catalog)).resolves.toEqual({
      models: expect.arrayContaining([expect.objectContaining({ id: CURATED_IDS.flash })]), stale: false,
      sources: { listing: { updatedAt: Date.now() }, metadata: {} },
    })
  })

  it('recovers a transient connection reset before committing a failed gateway refresh', async () => {
    const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
    const original = globalThis.fetch
    let listingReads = 0
    vi.stubGlobal('fetch', (input: string | URL | Request, init?: RequestInit) => {
      if (String(input) === `${gateway.url}/models` && ++listingReads === 1) {
        return Promise.reject(new TypeError('fetch failed', {
          cause: Object.assign(new Error('private transport detail'), { code: 'ECONNRESET' }),
        }))
      }
      return original(input, init)
    })
    const fallback = vi.fn()
    const catalog = new ClinePassCatalog(gateway.url, 60_000, fallback, () => {})
    expect(await discoverSettingsModels(catalog)).toMatchObject({
      models: expect.arrayContaining([expect.objectContaining({ id: CURATED_IDS.flash })]), stale: false,
    })
    expect(listingReads).toBe(2)
    expect(fallback).not.toHaveBeenCalledWith(expect.objectContaining({ url: `${gateway.url}/models` }))
  })
})
