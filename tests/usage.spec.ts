import { registerClineRemotes } from '../src/remotes.ts'
import { createServer } from 'node:http'
import { brotliCompressSync, deflateSync, gzipSync } from 'node:zlib'
import { Context } from '@deepseek-ai/cordis'
import Gateway from '@deepseek-ai/dsh-api-gateway'
import Registry from '@deepseek-ai/dsh-typert-registry'
import { afterEach, expect, it } from 'vitest'
import { ClineUsageService } from '../src/usage.ts'
import { parseClineUsage, parseUsageLimitsResponse } from '../src/usage-contract.ts'

const window = { status: 'ok', percent: 10, resetsAt: '2026-09-21T00:00:00Z' }
const usage = { rolling: { ...window, percent: 0 }, weekly: window, monthly: { ...window, percent: 7 } }
const limit = (type: string, percentUsed: number) => ({ type, percentUsed, resetsAt: window.resetsAt })
/** The real `GET /users/me/plan/usage-limits` envelope; rows stay untyped for malformed fixtures. */
const limits = (rows: unknown[]) => ({ data: { limits: rows } })
const limitsBody = limits([limit('five_hour', 0), limit('weekly', 10), limit('monthly', 7)])
const cleanups: Array<() => Promise<unknown>> = []
afterEach(async () => { for (const close of cleanups.splice(0).reverse()) await close() })

it('queries authenticated account usage through the actual Host RPC gateway and follows credential changes', async () => {
  const requests: Array<{ url?: string; auth?: string; encoding?: string }> = []
  let status = 200
  const server = createServer((req, res) => {
    requests.push({ url: req.url, auth: req.headers.authorization, encoding: req.headers['accept-encoding'] })
    res.writeHead(status, { 'Content-Type': 'application/json' })
    const body = Buffer.from(JSON.stringify(status === 200 ? limitsBody
      : { error: { message: 'Invalid API key', credential: req.headers.authorization } }))
    // Simulate a host that loses Content-Encoding, with an upstream honoring identity.
    res.end(req.headers['accept-encoding'] === 'identity' ? body : brotliCompressSync(body))
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise<void>(resolve => server.close(() => resolve())))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing address')
  const ctx = new Context()
  cleanups.push(() => ctx.fiber.dispose())
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  let key = 'first-key'
  await ctx.plugin(ClineUsageService, {
    baseURL: () => `http://127.0.0.1:${address.port}/v1`, resolveApiKey: async () => key,
  })
  const read = () => ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method: 'read', args: {} })
  const first = await read()
  expect(first).toEqual({ ...usage, source: expect.any(String) })
  key = 'second-key'
  const second = await read()
  expect(second).toEqual({ ...usage, source: expect.any(String) })
  expect(second.source).not.toBe(first.source)
  expect(requests).toEqual([
    { url: '/v1/users/me/plan/usage-limits', auth: 'Bearer first-key', encoding: 'identity' },
    { url: '/v1/users/me/plan/usage-limits', auth: 'Bearer second-key', encoding: 'identity' },
  ])
  status = 401
  await expect(read()).rejects.toThrow('HTTP 401')
})

it('parses a realistic usage-limits payload into the three windows', () => {
  expect(parseUsageLimitsResponse(limitsBody)).toEqual(usage)
  // Extra windows the contract cannot show are ignored, not treated as errors.
  expect(parseUsageLimitsResponse(limits([...limitsBody.data.limits, limit('daily', 55)])).monthly.percent).toBe(7)
  // percentUsed >= 100 is the only rate-limited state; the boundary is exclusive below 100.
  expect(parseUsageLimitsResponse(limits([limit('five_hour', 100), limit('weekly', 99.9), limit('monthly', 0)])))
    .toEqual({
      rolling: { status: 'rate-limited', percent: 100, resetsAt: window.resetsAt },
      weekly: { status: 'ok', percent: 99.9, resetsAt: window.resetsAt },
      monthly: { status: 'ok', percent: 0, resetsAt: window.resetsAt },
    })
})

it('accepts a window the provider reports without a reset time', () => {
  // Captured live from GET /users/me/plan/usage-limits: once the rolling
  // 5-hour window has gone quiet it reports percentUsed 0 and omits resetsAt
  // entirely. Treating that as malformed rejected the whole reading, so the
  // account card showed "Invalid ClinePass usage response" while the key was
  // perfectly valid.
  const live = {
    data: {
      limits: [
        { type: 'five_hour', percentUsed: 0 },
        { type: 'weekly', percentUsed: 63, resetsAt: '2026-10-31T13:16:46.091253373Z' },
        { type: 'monthly', percentUsed: 49, resetsAt: '2026-11-08T02:57:06.093118312Z' },
      ],
    },
    success: true,
  }
  expect(parseUsageLimitsResponse(live)).toEqual({
    rolling: { status: 'ok', percent: 0 },
    weekly: { status: 'ok', percent: 63, resetsAt: '2026-10-31T13:16:46.091253373Z' },
    monthly: { status: 'ok', percent: 49, resetsAt: '2026-11-08T02:57:06.093118312Z' },
  })
  // The same omission must survive the remote codec that carries the reading to
  // the browser, including an explicit null.
  const decoded = parseUsageLimitsResponse(live)
  expect(parseClineUsage(decoded)).toEqual(decoded)
  expect(parseClineUsage({ ...decoded, rolling: { status: 'ok', percent: 0, resetsAt: undefined } }).rolling)
    .toEqual({ status: 'ok', percent: 0 })
})

it('rejects a malformed or incomplete usage-limits payload instead of zeroing a window', () => {
  const rows = limitsBody.data.limits
  const partial = [limit('weekly', 10), limit('monthly', 7)]
  for (const value of [null, {}, { data: {} }, { data: { limits: {} } }, { data: { limits: [] } },
    { data: { limits: partial } },
    limits([{ ...limit('weekly', 10), type: 'hourly' }, ...partial]),
    limits([limit('five_hour', 0), limit('five_hour', 1), limit('monthly', 7)]),
    limits([limit('five_hour', 0), { ...limit('weekly', 10), percentUsed: NaN }, limit('monthly', 7)]),
    limits([limit('five_hour', 0), { ...limit('weekly', 10), resetsAt: 'not-a-date' }, limit('monthly', 7)]),
    limits([limit('five_hour', 0), { ...limit('weekly', 10), resetsAt: 17 }, limit('monthly', 7)]),
    limits([limit('five_hour', 0), limit('weekly', 10), null])]) {
    expect(() => parseUsageLimitsResponse(value)).toThrow('Invalid ClinePass usage response')
  }
  expect(rows).toHaveLength(3)
})

it('rejects a window percentage outside 0..100 rather than rendering it raw', () => {
  for (const percentUsed of [100.5, 5000, 1e308]) {
    expect(() => parseUsageLimitsResponse(limits([limit('five_hour', 0), limit('weekly', percentUsed), limit('monthly', 7)])))
      .toThrow('Invalid ClinePass usage response')
  }
  expect(parseUsageLimitsResponse(limits([limit('five_hour', 0), limit('weekly', 100), limit('monthly', 7)])).weekly.percent).toBe(100)
})

it('validates the Host snapshot crossing the remote codec', () => {
  expect(parseClineUsage(usage).rolling.percent).toBe(0)
  expect(parseClineUsage({ ...usage, source: 'opaque-identity' })).toEqual({ ...usage, source: 'opaque-identity' })
  for (const value of [null, {}, { ...usage, weekly: {} }, { ...usage, weekly: { ...window, percent: NaN } },
    { ...usage, monthly: { ...window, status: 'limited' } }]) {
    expect(() => parseClineUsage(value)).toThrow('Invalid ClinePass usage response')
  }
  expect(() => parseClineUsage({ ...usage, source: '' })).toThrow('Invalid ClinePass usage source')
  expect(() => parseClineUsage({ ...usage, lastSwitch: { fromRef: 'A', toRef: 'B', reason: 'quota', at: -1 } }))
    .toThrow('Invalid account switch notice')
})

it('reads named accounts through the real RPC contract without switching the active account or exposing keys', async () => {
  const calls: string[] = []
  let status = 200
  const server = createServer((req, res) => {
    calls.push(req.headers.authorization ?? '')
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(limitsBody))
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise<void>(resolve => server.close(() => resolve())))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing address')
  const ctx = new Context()
  cleanups.push(() => ctx.fiber.dispose())
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  const active = 'ACCOUNT_A'
  let backupKey = 'backup-private-key'
  await ctx.plugin(ClineUsageService, {
    baseURL: () => `http://127.0.0.1:${address.port}/v1`, activeRef: () => active,
    accountRefs: () => ['ACCOUNT_A', 'ACCOUNT_B'],
    resolveApiKey: async ref => ref === 'ACCOUNT_B' ? backupKey : 'primary-private-key',
    lastSwitch: () => ({ fromRef: 'ACCOUNT_A', toRef: 'ACCOUNT_B', reason: 'credential', at: 1 }),
  })
  const readAccount = (ref: string) => ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method: 'readAccount', args: { ref } })
  const first = await readAccount('ACCOUNT_A')
  const backup = await readAccount('ACCOUNT_B')
  expect(first.source).not.toBe(backup.source)
  expect((await readAccount('ACCOUNT_A')).source).toBe(first.source)
  backupKey = 'rotated-private-key'
  const rotated = await readAccount('ACCOUNT_B')
  expect(rotated.source).not.toBe(backup.source)
  expect(active).toBe('ACCOUNT_A')
  expect(calls).toEqual(['Bearer primary-private-key', 'Bearer backup-private-key', 'Bearer primary-private-key', 'Bearer rotated-private-key'])
  await expect(readAccount('NOT_A_SAVED_ACCOUNT')).rejects.toMatchObject({ code: 'gateway/bad-request' })
  expect(calls).toHaveLength(4)
  expect(JSON.stringify([first, backup, rotated])).not.toContain('private-key')
  status = 401
  await expect(ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method: 'read', args: {} }))
    .rejects.toMatchObject({ details: { retainPrevious: false,
      lastSwitch: { fromRef: 'ACCOUNT_A', toRef: 'ACCOUNT_B', reason: 'credential', at: 1 } } })
})

async function usageReader(body: Buffer, headers: Record<string, string> = {}) {
  const server = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'application/json', ...headers })
    res.end(body)
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise<void>(resolve => server.close(() => resolve())))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing address')
  const ctx = new Context()
  cleanups.push(() => ctx.fiber.dispose())
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  await ctx.plugin(ClineUsageService, {
    baseURL: () => `http://127.0.0.1:${address.port}/v1`, resolveApiKey: async () => 'fixture-key',
  })
  return () => ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method: 'read', args: {} })
}

it.each([
  { encoding: 'br', compress: brotliCompressSync },
  { encoding: 'gzip', compress: gzipSync },
  { encoding: 'deflate', compress: deflateSync },
])('reads $encoding usage decoded by fetch through Host RPC', async ({ encoding, compress }) => {
  const read = await usageReader(compress(Buffer.from(JSON.stringify(limitsBody))),
    { 'content-encoding': encoding })
  expect(await read()).toEqual({ ...usage, source: expect.any(String) })
})

it.each([false, true])('bounds usage response bytes, compressed=%s', async (compressed) => {
  const body = Buffer.from(JSON.stringify({ ...limitsBody, padding: 'x'.repeat(1024 * 1024) }))
  const read = await usageReader(compressed ? gzipSync(body) : body,
    compressed ? { 'content-encoding': 'gzip' } : {})
  await expect(read()).rejects.toThrow(/exceeds.*byte limit/)
})

it('keeps safe network diagnostics and account identity through Host RPC without retaining another account', async () => {
  let mode: 'ok' | 'reset' | 'reset-once' | 'unauthorized' = 'ok'
  let requests = 0
  const server = createServer((req, res) => {
    requests++
    if (mode === 'reset' || mode === 'reset-once') {
      if (mode === 'reset-once') mode = 'ok'
      req.socket.destroy()
      return
    }
    res.writeHead(mode === 'unauthorized' ? 401 : 200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(mode === 'unauthorized'
      ? { error: { message: 'Account access denied', credential: req.headers.authorization } } : limitsBody))
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise<void>(resolve => server.close(() => resolve())))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing address')
  const ctx = new Context()
  cleanups.push(() => ctx.fiber.dispose())
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  let key: string | undefined = 'private-account-one'
  let credentialError = false
  let baseURL = `http://127.0.0.1:${address.port}/v1`
  await ctx.plugin(ClineUsageService, { baseURL: () => baseURL, resolveApiKey: async () => {
    if (credentialError) throw Object.assign(new Error('private account credential detail'), { code: 'MISSING_CREDENTIAL' })
    return key
  } })
  const read = () => ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method: 'read', args: {} })
  const first = await read()
  expect(first.source).toEqual(expect.any(String))
  expect(await read()).toEqual(first)
  mode = 'reset-once'
  expect(await read()).toEqual(first)
  mode = 'reset'
  const failed = await read().catch((error: unknown) => error)
  expect(failed).toMatchObject({ code: 'clinepass/usage-unavailable',
    message: expect.stringContaining('network error (UND_ERR_SOCKET)'),
    details: { retainPrevious: true, retryable: true, source: first.source } })
  key = 'private-account-two'
  const changed = await read().catch((error: unknown) => error)
  expect(changed).toMatchObject({ details: { source: expect.any(String) } })
  expect((changed as { details: { source: string } }).details.source).not.toBe(first.source)
  mode = 'ok'
  const second = await read()
  baseURL = `http://127.0.0.1:${address.port}/other`
  const other = await read()
  expect(other.source).not.toBe(second.source)
  mode = 'unauthorized'
  const count = requests
  await expect(read()).rejects.toMatchObject({ code: 'clinepass/usage-unavailable',
    message: 'ClinePass usage unavailable (HTTP 401). Check your Cline API key and ClinePass subscription. Upstream: Account access denied',
    details: { retainPrevious: false, retryable: false, source: other.source } })
  expect(requests - count).toBe(1)
  key = undefined
  await expect(read()).rejects.toMatchObject({ details: { retainPrevious: false, retryable: false } })
  expect(requests - count).toBe(1)
  credentialError = true
  await expect(read()).rejects.toMatchObject({ code: 'clinepass/usage-unavailable',
    message: 'ClinePass API key is not configured', details: { retainPrevious: false, retryable: false } })
  expect(JSON.stringify([first, second, other, failed, changed])).not.toMatch(/private-account|private account/)
})

it.each([
  { status: 403, body: { error: { type: 'PermissionError', message: 'ClinePass subscription is inactive', apiKey: 'private-usage-key' } },
    reason: 'ClinePass subscription is inactive', temporary: false },
  { status: 401, body: { error: { data: { message: 'Invalid API key: private-usage-key' } } },
    reason: 'Invalid API key: [REDACTED]', temporary: false },
  { status: 429, body: { error: 'Rate limit reached', token: 'unrelated-private-token' },
    reason: 'Rate limit reached', temporary: true },
  { status: 503, body: { message: 'Gateway temporarily unavailable', headers: { authorization: 'private-usage-key' } },
    reason: 'Gateway temporarily unavailable', temporary: true },
])('preserves a safe upstream reason for HTTP $status through both usage RPCs without retrying', async ({ status, body, reason, temporary }) => {
  let requests = 0
  const server = createServer((_req, res) => {
    requests++
    res.writeHead(status, { 'content-type': 'application/json' })
    res.end(JSON.stringify(body))
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise<void>(resolve => server.close(() => resolve())))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing address')
  const ctx = new Context()
  cleanups.push(() => ctx.fiber.dispose())
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  await ctx.plugin(ClineUsageService, {
    baseURL: () => `http://127.0.0.1:${address.port}/v1`, resolveApiKey: async () => 'private-usage-key',
    activeRef: () => 'ACCOUNT_A', accountRefs: () => ['ACCOUNT_A'],
  })
  for (const method of ['read', 'readAccount']) {
    const error = await ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method,
      args: method === 'read' ? {} : { ref: 'ACCOUNT_A' } }).catch((error: unknown) => error)
    expect(error).toMatchObject({ code: 'clinepass/usage-unavailable',
      message: expect.stringContaining(`Upstream: ${reason}`),
      details: { retryable: temporary, retainPrevious: temporary, source: expect.any(String) } })
    const serialized = JSON.stringify({ ...error as object, message: (error as Error).message })
    expect(serialized).toContain(`HTTP ${status}`)
    expect(serialized.includes('Check your Cline API key and ClinePass subscription.')).toBe(status === 401 || status === 403)
    expect(serialized).not.toMatch(/private-usage-key|unrelated-private-token|credential|authorization/)
  }
  expect(requests).toBe(2)
})

it('keeps HTTP 403 and its guidance when the upstream provides no usable reason', async () => {
  const server = createServer((_req, res) => { res.writeHead(403); res.end('{"error":broken}') })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise<void>(resolve => server.close(() => resolve())))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('missing address')
  const ctx = new Context()
  cleanups.push(() => ctx.fiber.dispose())
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  registerClineRemotes(ctx)
  await ctx.plugin(ClineUsageService, {
    baseURL: () => `http://127.0.0.1:${address.port}/v1`, resolveApiKey: async () => 'private-usage-key',
  })
  await expect(ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method: 'read', args: {} }))
    .rejects.toMatchObject({ message: 'ClinePass usage unavailable (HTTP 403). Check your Cline API key and ClinePass subscription.',
      details: { retryable: false, retainPrevious: false } })
})
