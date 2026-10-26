import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import Schema from '@deepseek-ai/schemastery'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime, { createUserMessage } from '@deepseek-ai/dsh-llm'
import Gateway from '@deepseek-ai/dsh-api-gateway'
import Registry from '@deepseek-ai/dsh-typert-registry'
import FileSettingsProvider from '@deepseek-ai/dsh-settings-file'
import { LocalCredentialProvider } from '@deepseek-ai/dsh-credentials-local'
import { afterEach, expect, it, vi } from 'vitest'
import { apply, NS } from '../src/index.ts'
import { Config, PlainConfig, readConfig } from '../src/config.ts'
import { configOf } from './config-of.ts'
import { closeMockGateways, CURATED_IDS, listingBody, mockGateway, textEvents } from './mock-gateway.ts'

/** The bare host a user pastes; the plugin folds it onto the documented base. */
const bare = 'https://api.cline.bot'
/** The one Cline API base every resource is served from. */
const current = 'https://api.cline.bot/api/v1'
const cleanups: Array<() => Promise<unknown>> = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup()
  await closeMockGateways()
})

it.each(['default config', 'profile entry', 'settings document'])('serves every resource from the one documented Cline base: %s', async source => {
  const dir = await mkdtemp(join(tmpdir(), 'clinepass-migration-'))
  cleanups.push(() => rm(dir, { recursive: true, force: true }))
  const settingsPath = join(dir, 'settings.yaml')
  const credentialsPath = join(dir, '.credentials.yaml')
  await writeFile(settingsPath, source === 'settings document' ? JSON.stringify({ [NS]: { baseURL: bare + '/' } }) : '{}')
  await writeFile(credentialsPath, 'version: 1\nrefs:\n  CLINE_API_KEY: migration-fixture-key\n', { mode: 0o600 })
  const gateway = await mockGateway({ status: 200, body: listingBody([CURATED_IDS.flash]) })
  const networkFetch = globalThis.fetch
  const requests: string[] = []
  vi.stubGlobal('fetch', (input: string | URL | Request, init?: RequestInit) => {
    const request = new Request(input, init)
    requests.push(request.url)
    const url = new URL(request.url)
    // ClinePass has no protocol-specific sibling address and no legacy host.
    expect(url.origin).toBe('https://api.cline.bot')
    expect(url.pathname.startsWith('/api/v1/')).toBe(true)
    return networkFetch(new Request(request.url.replace(current, gateway.url), request))
  })
  const ctx = new Context()
  cleanups.push(() => ctx.fiber.dispose())
  await ctx.plugin(LlmRuntime)
  await ctx.plugin(FileSettingsProvider, { path: settingsPath, watch: false })
  await ctx.plugin(LocalCredentialProvider, { path: credentialsPath, watch: false })
  await ctx.plugin({ name: 'gateway-migration-test', inject: ['llm'], apply: (scope: Context) => {
    apply(scope, source === 'default config' ? PlainConfig({})
      : configOf(source === 'profile entry' ? bare : 'https://configured.example/v1'))
  } })
  const value = () => ctx.settings.describe().find(row => row.ns === NS)!.value
  await expect.poll(() => value().baseURL).toBe(current)
  await expect.poll(() => ctx.llm.listProviders()).toContainEqual({ id: 'dsh-clinepass', name: 'DSH ClinePass' })
  await ctx.plugin(Registry)
  await ctx.plugin(Gateway)
  expect((await ctx.llm.listModels('dsh-clinepass')).map(model => model.id)).toContain(CURATED_IDS.flash)

  gateway.pushCompletions({ events: textEvents })
  const chunks = await Array.fromAsync(ctx.llm.stream({ provider: 'dsh-clinepass', model: CURATED_IDS.flash, maxTokens: 128,
    messages: [createUserMessage({ content: [{ type: 'text', text: 'hello' }], source: { kind: 'plugin', plugin: 'migration-test' } })],
  }))
  expect(chunks).toContainEqual(expect.objectContaining({ type: 'text-delta', text: 'hello' }))
  expect(chunks.find(chunk => chunk.type === 'finish')).toMatchObject({ reason: { kind: 'stop' } })

  const limits = [
    { type: 'five_hour', percentUsed: 0, resetsAt: '2026-10-15T00:00:00Z' },
    { type: 'weekly', percentUsed: 0, resetsAt: '2026-10-15T00:00:00Z' },
    { type: 'monthly', percentUsed: 0, resetsAt: '2026-10-15T00:00:00Z' },
  ]
  gateway.pushCompletions({ body: JSON.stringify({ data: { limits } }) })
  expect(await ctx.typertGateway.invoke({ namespace: 'clinePassUsage', method: 'read', args: {} }))
    .toMatchObject({ rolling: { percent: 0 }, weekly: { percent: 0 }, monthly: { percent: 0 } })
  expect(requests.map(url => new URL(url).pathname)).toEqual([
    '/api/v1/models', '/api/v1/chat/completions', '/api/v1/users/me/plan/usage-limits',
  ])

  // A bare host written back through settings is canonicalized on save.
  await ctx.settings.update(NS, { baseURL: bare + '/' })
  await expect.poll(() => value().baseURL).toBe(current)
  await expect.poll(() => readFile(settingsPath, 'utf8')).toContain(current)
  const custom = 'https://custom.example/v1'
  await ctx.settings.update(NS, { baseURL: custom })
  expect(value().baseURL).toBe(custom)
})

it('keeps settings schemas valid after the Host rebuilds and forwards them to the desktop client', () => {
  // Modern settings first rebuild each volatile field as a plain schema, then
  // serialize the assembled form again for the client. Transform callbacks can
  // survive the first serialization and disappear during the second one.
  const fields = Object.fromEntries(Object.entries(Config.dict!).map(([key, field]) => {
    const plain = Schema(JSON.parse(JSON.stringify(field)))
    delete plain.meta.volatile
    return [key, plain]
  }))
  const schema = Schema(JSON.parse(JSON.stringify(Schema.object(fields))))
  expect(schema({ baseURL: current }).baseURL).toBe(current)
  expect(schema({ baseURL: 'https://custom.example/v1' }).baseURL).toBe('https://custom.example/v1')
  expect(readConfig(Config({ baseURL: bare })).baseURL).toBe(current)
  expect(readConfig(Config({ baseURL: current + '///' })).baseURL).toBe(current)
  // The plain schema keeps what the composition layer supplied; only the live
  // reference path canonicalizes.
  expect(PlainConfig({ baseURL: bare + '/' }).baseURL).toBe(bare + '/')
})
