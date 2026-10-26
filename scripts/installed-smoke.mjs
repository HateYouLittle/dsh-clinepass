/**
 * Exercise a tarball installed in a separate consumer through Cordis's real package resolver.
 *
 * Usage: npm run verify:installed -- <consumer-root>
 * The consumer must be a directory where `dsh-clinepass` (and the DSH packages it
 * loads through) are installed; `npm run test:install` builds one and leaves it
 * in the system temp directory. Running it without a consumer root cannot work,
 * because a package cannot resolve itself as an installed dependency.
 */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { createServer } from 'node:http'
import { once } from 'node:events'

if (process.argv[2] === undefined) {
  throw new Error('Usage: npm run verify:installed -- <consumer-root> (a directory where dsh-clinepass is installed)')
}
const consumer = resolve(process.argv[2])
const require = createRequire(resolve(consumer, 'package.json'))
const entry = require.resolve('dsh-clinepass')
const fromPlugin = createRequire(entry)
const load = id => import(pathToFileURL(fromPlugin.resolve(id)).href)
const { Context } = await load('@deepseek-ai/cordis')
const { default: Loader } = await import(pathToFileURL(require.resolve('@deepseek-ai/cordis-plugin-loader')).href)
const { createUserMessage } = await load('@deepseek-ai/dsh-llm')
const requests = []
const server = createServer((request, response) => {
  request.resume()
  request.on('end', () => {
    requests.push({ path: request.url, headers: request.headers })
    if (request.url === '/models') {
      response.writeHead(200, { 'content-type': 'application/json' })
      response.end(JSON.stringify({ data: [{ id: 'cline-pass/deepseek-v4.1-flash' }] }))
    } else {
      response.writeHead(200, { 'content-type': 'text/event-stream' })
      for (const event of [
        { choices: [{ delta: { role: 'assistant', content: 'standalone-ok' }, index: 0, finish_reason: null }] },
        { choices: [{ delta: {}, index: 0, finish_reason: 'stop' }], usage: { prompt_tokens: 3, completion_tokens: 1 } },
      ]) response.write(`data: ${JSON.stringify(event)}\n\n`)
      response.end('data: [DONE]\n\n')
    }
  })
})
const ctx = new Context()
const previous = process.env.CLINEPASS_INSTALL_TEST_KEY
process.env.CLINEPASS_INSTALL_TEST_KEY = 'fixture-key'
try {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  ctx.baseUrl = pathToFileURL(resolve(consumer, 'package.json')).href
  await ctx.plugin(Loader)
  await ctx.loader.create({ name: '@deepseek-ai/dsh-llm' })
  const adapterId = await ctx.loader.create({
    name: 'dsh-clinepass',
    config: { apiKeyEnv: 'CLINEPASS_INSTALL_TEST_KEY', baseURL: `http://127.0.0.1:${server.address().port}`, streamIdleTimeoutMs: 5000 },
  })
  await ctx.loader.await()
  const adapterEntry = ctx.loader.resolve(adapterId)
  assert.ok(adapterEntry.fiber, 'the installed adapter must mount')
  assert.ok((await ctx.llm.listProviders()).some(provider => provider.id === 'dsh-clinepass'))
  const models = await ctx.llm.listModels('dsh-clinepass')
  assert.ok(models.some(model => model.id === 'cline-pass/deepseek-v4.1-flash'))
  for (const sessionId of ['standalone-session-a', 'standalone-session-a', 'standalone-session-b']) {
    const chunks = []
    for await (const chunk of ctx.llm.stream({ provider: 'dsh-clinepass', model: 'cline-pass/deepseek-v4.1-flash', messages: [createUserMessage({ content: [{ type: 'text', text: 'hello' }], source: { kind: 'plugin', plugin: 'installed-smoke' } })], sessionId })) chunks.push(chunk)
    assert.ok(chunks.some(chunk => chunk.type === 'text-delta' && chunk.text === 'standalone-ok'), JSON.stringify(chunks))
  }
  const completions = requests.filter(request => request.path === '/chat/completions')
  assert.deepEqual(completions.map(request => request.headers['x-task-id']), ['standalone-session-a', 'standalone-session-a', 'standalone-session-b'])
  assert.ok(completions.every(request => request.headers['user-agent'].startsWith('deepseek-harness/')))
  assert.ok(completions.every(request => request.headers.authorization === 'Bearer fixture-key'))
  await adapterEntry.fiber.dispose()
  assert.ok(!(await ctx.llm.listProviders()).some(provider => provider.id === 'dsh-clinepass'))
  console.log('PASS: installed package resolution, catalog, streamed text, session headers, attribution, authorization, unload')
} finally {
  await ctx.fiber.dispose()
  if (previous === undefined) delete process.env.CLINEPASS_INSTALL_TEST_KEY
  else process.env.CLINEPASS_INSTALL_TEST_KEY = previous
  server.closeAllConnections()
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
}
