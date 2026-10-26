import { setTimeout as delay } from 'node:timers/promises'
import { afterEach, expect, it, vi } from 'vitest'
import { ClinePassCatalog, type CatalogDiagnostic } from '../src/catalog.ts'
import { curatedModelIds } from '../src/clinepass-models.ts'
import { CURATED_IDS, listingBody } from './mock-gateway.ts'

const baseURL = 'https://fixture.invalid/v1'
const listing = () => Response.json(listingBody([CURATED_IDS.flash]))
const createCatalog = (fetcher: typeof fetch, observer: (event: CatalogDiagnostic) => void, url = baseURL) =>
  new ClinePassCatalog(url, 60_000, () => {}, () => {}, () => {}, fetcher, undefined, observer)

afterEach(() => { vi.restoreAllMocks() })

it('shows the active network stage before it finishes and never leaks the response body', async () => {
  const headers = Promise.withResolvers<Response>()
  const requested = Promise.withResolvers<void>()
  const reading = Promise.withResolvers<void>()
  const events: CatalogDiagnostic[] = []
  const body = Buffer.from(JSON.stringify({
    data: [{ id: CURATED_IDS.flash, description: 'private-listing-description' }],
  }))
  const fetcher: typeof fetch = async () => {
    requested.resolve()
    return headers.promise
  }
  const pending = createCatalog(fetcher, event => events.push(event)).snapshot()
  await requested.promise
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing.headers', phase: 'start', attempt: 1 }))
  expect(events.some(event => event.stage === 'listing.headers' && event.phase === 'success')).toBe(false)
  await delay(25)
  let stream!: ReadableStreamDefaultController<Uint8Array>
  headers.resolve(new Response(new ReadableStream<Uint8Array>({
    start(controller) { stream = controller; controller.enqueue(body.subarray(0, 8)) },
    pull() { reading.resolve() },
  }, { highWaterMark: 0 })))
  await reading.promise
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing.body', phase: 'start' }))
  expect(events.some(event => event.stage === 'listing.body' && event.phase === 'success')).toBe(false)
  await delay(25)
  stream.enqueue(body.subarray(8))
  stream.close()
  const result = await pending
  expect(result.live).toBe(true)
  expect(result.models.has(CURATED_IDS.flash)).toBe(true)
  expect(new Set(events.map(event => event.catalogId)).size).toBe(1)
  // The curated table has no cache to restore and no second endpoint to fetch.
  for (const stage of ['refresh', 'listing', 'listing.headers', 'listing.body', 'listing.parse', 'build']) {
    expect(events.filter(event => event.stage === stage).map(event => event.phase)).toEqual(['start', 'success'])
  }
  expect(events.some(event => event.stage.startsWith('metadata'))).toBe(false)
  expect(events.find(event => event.stage === 'listing.headers' && event.phase === 'success')?.elapsedMs).toBeGreaterThanOrEqual(20)
  expect(events.find(event => event.stage === 'listing.body' && event.phase === 'success')).toMatchObject({ bytes: body.length, elapsedMs: expect.any(Number) })
  expect(JSON.stringify(events)).not.toContain('private-listing-description')
})

it('records body timeout failures without waiting for cancellation or starting parsing', async () => {
  const timeout = AbortSignal.timeout.bind(AbortSignal)
  vi.spyOn(AbortSignal, 'timeout').mockImplementation(ms => timeout(ms === 10_000 ? 50 : ms))
  const cancel = vi.fn(() => new Promise<void>(() => {}))
  const fetcher: typeof fetch = async () => new Response(new ReadableStream({
    start(stream) { stream.enqueue(new TextEncoder().encode('{"partial":')) }, cancel,
  }))
  const events: CatalogDiagnostic[] = []
  const snapshot = await createCatalog(fetcher, event => events.push(event)).snapshot()
  expect(snapshot.live).toBe(false)
  expect((snapshot.listingFailure as Error).message).toContain('request timed out or was aborted')
  expect(cancel).toHaveBeenCalledOnce()
  expect(events.filter(event => event.stage === 'listing.body').map(event => event.phase)).toEqual(['start', 'failure'])
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing', phase: 'failure' }))
  expect(events.some(event => event.stage === 'listing.parse')).toBe(false)
  expect(events).toContainEqual(expect.objectContaining({ stage: 'refresh', phase: 'success' }))
})

it('numbers later refreshes and keeps one catalog identity', async () => {
  const events: CatalogDiagnostic[] = []
  const fetcher: typeof fetch = async () => listing()
  const catalog = createCatalog(fetcher, event => events.push(event))
  await catalog.snapshot()
  await catalog.snapshot(true)
  await catalog.snapshot(true)
  expect(events.filter(event => event.stage === 'refresh' && event.phase === 'start').map(event => event.refresh)).toEqual([1, 2, 3])
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing.headers', phase: 'success', status: 200 }))
  expect(new Set(events.map(event => event.catalogId)).size).toBe(1)
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing.headers', phase: 'success', status: 200, url: `${baseURL}/models` }))
})

it('correlates concurrent catalogs and retries while redacting endpoint credentials and query strings', async () => {
  const events: CatalogDiagnostic[] = []
  let attempts = 0
  const fetcher: typeof fetch = async () => {
    if (++attempts === 1) throw Object.assign(new Error('private-transport-message'), { code: 'ECONNRESET' })
    return listing()
  }
  const observe = (event: CatalogDiagnostic) => events.push(event)
  const url = 'https://private-user:private-password@fixture.invalid/v1'
  const catalogs = [createCatalog(fetcher, observe, url), createCatalog(fetcher, observe)]
  const results = await Promise.all(catalogs.map(catalog => catalog.snapshot()))
  expect(results.every(result => result.live)).toBe(true)
  expect(results.every(result => [...result.models.keys()].length === curatedModelIds().length)).toBe(true)
  expect(new Set(events.map(event => event.catalogId)).size).toBe(2)
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing.headers', phase: 'failure', attempt: 1 }))
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing.retry-delay', phase: 'success', attempt: 1 }))
  expect(events).toContainEqual(expect.objectContaining({ stage: 'listing.headers', phase: 'success', attempt: 2, status: 200 }))
  expect(JSON.stringify(events)).not.toMatch(/private-/)
})

it('keeps observer exceptions from affecting catalog results', async () => {
  const fetcher: typeof fetch = async () => listing()
  const catalog = createCatalog(fetcher, () => { throw new Error('observer failed') })
  expect((await catalog.snapshot()).models.has(CURATED_IDS.flash)).toBe(true)
  const forced = await catalog.snapshot(true)
  expect(forced.live).toBe(true)
  expect(forced.metadataLive).toBe(true)
  expect(forced.metadataFailure).toBeUndefined()
})
