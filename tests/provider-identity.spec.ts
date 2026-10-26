import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime, { createMessage, createUserMessage, LlmAdapter, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { apply } from '../src/index.ts'
import { configOf } from './config-of.ts'
import { closeMockGateways, listingBody, mockGateway, textEvents } from './mock-gateway.ts'

const route = 'dsh-clinepass'

class HostAdapter extends LlmAdapter {
  override providerInfo(provider: string) { return { id: provider, name: 'Host pi-ai' } }
  override async listModels(provider: string) { return [{ provider, id: 'host-model', name: 'Host model' }] }
  override async resolveModel(provider: string, id: string) { return { provider, id, name: 'Host model' } }
  override async *stream(_options: GenerateOptions): AsyncIterable<StreamChunk> {
    yield { type: 'text-delta', index: 0, text: 'host answer' }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}

const user = () => createUserMessage({ content: [{ type: 'text', text: 'hello' }], source: { kind: 'plugin', plugin: 'test' } })
async function drain(ctx: Context, options: GenerateOptions): Promise<StreamChunk[]> {
  const chunks: StreamChunk[] = []
  for await (const chunk of ctx.llm.stream(options)) chunks.push(chunk)
  return chunks
}

afterEach(async () => {
  vi.unstubAllEnvs()
  await closeMockGateways()
})

it.each(['before', 'after'])('coexists with the host clinepass route when mounted %s it', async order => {
  vi.stubEnv('CLINE_API_KEY', 'test-key')
  const gateway = await mockGateway({ status: 200, body: listingBody(['cline-pass/deepseek-v4.1-flash']) })
  gateway.pushCompletions({ events: textEvents })
  const ctx = new Context()
  await ctx.plugin(LlmRuntime)
  try {
    if (order === 'after') ctx.llm.registerAdapter(['clinepass'], new HostAdapter())
    apply(ctx, configOf(gateway.url))
    if (order === 'before') ctx.llm.registerAdapter(['clinepass'], new HostAdapter())
    expect(ctx.llm.listProviders()).toEqual(expect.arrayContaining([
      { id: 'clinepass', name: 'Host pi-ai' }, { id: route, name: 'DSH ClinePass' },
    ]))
    expect(await ctx.llm.listModels('clinepass')).toEqual([{ provider: 'clinepass', id: 'host-model', name: 'Host model' }])
    expect(await ctx.llm.resolveModelInfo(route, 'cline-pass/deepseek-v4.1-flash')).toMatchObject({ provider: route })
    const host = await drain(ctx, { provider: 'clinepass', model: 'host-model', messages: [user()] })
    expect(host).toContainEqual({ type: 'text-delta', index: 0, text: 'host answer' })
    const plugin = await drain(ctx, { provider: route, model: 'cline-pass/deepseek-v4.1-flash', messages: [user()], sessionId: 'isolated-route' as never })
    expect(plugin).toContainEqual({ type: 'text-delta', index: 0, text: 'hello' })
    expect(gateway.headers.at(-1)?.['x-task-id']).toBe('isolated-route')
  } finally {
    await ctx.fiber.dispose()
  }
})

it('preserves Cline reasoning replay across the DSH route and SDK provider identities', async () => {
  vi.stubEnv('CLINE_API_KEY', 'test-key')
  const gateway = await mockGateway({ status: 200, body: listingBody(['cline-pass/glm-5.3']) })
  gateway.pushCompletions({ events: [
    '{"choices":[{"delta":{"role":"assistant","reasoning":"think"},"index":0,"finish_reason":null}]}',
    '{"choices":[{"delta":{"content":"answer"},"index":0,"finish_reason":null}]}',
    '{"choices":[{"delta":{},"index":0,"finish_reason":"stop"}],"usage":{"prompt_tokens":3,"completion_tokens":1}}', '[DONE]',
  ] })
  gateway.pushCompletions({ events: textEvents })
  gateway.pushCompletions({ events: textEvents })
  const ctx = new Context()
  await ctx.plugin(LlmRuntime)
  try {
    apply(ctx, configOf(gateway.url))
    const request = { provider: route, model: 'cline-pass/glm-5.3', messages: [user()] }
    const chunks = await drain(ctx, request)
    const finish = chunks.find(chunk => chunk.type === 'finish')
    expect(finish?.replayState).toMatchObject({
      response: { provider: route, sdkProvider: 'clinepass' },
      blocks: expect.arrayContaining([{ type: 'reasoning', thinkingSignature: 'reasoning' }]),
    })
    const assistant = createMessage({ role: 'assistant',
      content: chunks.filter(chunk => chunk.type === 'block-end').map(chunk => chunk.block),
      source: { kind: 'model', provider: route, model: request.model, replayState: finish?.replayState },
    })
    const restored = JSON.parse(JSON.stringify(assistant))
    await drain(ctx, { ...request, messages: [...request.messages, restored, user()] })
    const body = gateway.bodies[1] as { messages: { role: string; reasoning?: string; content?: string }[] }
    // pi-ai only renames the reasoning field to `reasoning_content` for one
    // legacy provider id; ClinePass keeps the field it read.
    expect(body.messages.find(message => message.role === 'assistant')).toMatchObject({ reasoning: 'think', content: 'answer' })

    // Switching an old session to the new route still carries its durable text.
    restored.source.provider = 'clinepass'
    restored.source.replayState.response.provider = 'clinepass'
    delete restored.source.replayState.response.sdkProvider
    await drain(ctx, { ...request, messages: [...request.messages, restored, user()] })
    const migrated = gateway.bodies[2] as { messages: { role: string; content?: string }[] }
    expect(migrated.messages.find(message => message.role === 'assistant')?.content).toContain('answer')
  } finally {
    await ctx.fiber.dispose()
  }
})

it('keeps a JSON-restored continuation on its own model and drops reasoning for another model', async () => {
  vi.stubEnv('CLINE_API_KEY', 'test-key')
  const modelId = 'cline-pass/minimax-m3'
  const gateway = await mockGateway({ status: 200, body: listingBody([modelId, 'cline-pass/kimi-k3']) })
  const events = [
    '{"choices":[{"delta":{"role":"assistant","reasoning":"durable thought"},"index":0,"finish_reason":null}]}',
    '{"choices":[{"delta":{"content":"answer"},"index":0,"finish_reason":null}]}',
    '{"choices":[{"delta":{},"index":0,"finish_reason":"stop"}],"usage":{"prompt_tokens":3,"completion_tokens":1}}', '[DONE]',
  ]
  for (let i = 0; i < 3; i++) gateway.pushCompletions({ events })
  const ctx = new Context()
  await ctx.plugin(LlmRuntime)
  try {
    apply(ctx, configOf(gateway.url))
    const request = { provider: route, model: modelId, messages: [user()], reasoningEffort: ReasoningEffortId('high') }
    const chunks = await drain(ctx, request)
    const finish = chunks.find(chunk => chunk.type === 'finish')
    expect(finish).toMatchObject({ reason: { kind: 'stop' }, replayState: { response: {
      model: request.model, provider: route, sdkProvider: 'clinepass',
    } } })
    const restored = JSON.parse(JSON.stringify(createMessage({ role: 'assistant',
      content: chunks.filter(chunk => chunk.type === 'block-end').map(chunk => chunk.block),
      source: { kind: 'model', provider: route, model: request.model, replayState: finish?.replayState },
    })))
    const messages = [...request.messages, restored, user()]
    await drain(ctx, { ...request, messages })
    const assistant = (gateway.bodies[1] as { messages: { role: string; reasoning?: string; content?: string }[] })
      .messages.find(message => message.role === 'assistant')
    expect(assistant).toMatchObject({ reasoning: 'durable thought', content: 'answer' })

    // A real model switch drops the reasoning replay and keeps the durable text.
    await drain(ctx, { provider: route, model: 'cline-pass/kimi-k3', messages })
    const switched = (gateway.bodies[2] as { messages: { role: string; reasoning?: string; content?: string }[] })
      .messages.find(message => message.role === 'assistant')
    expect(switched?.reasoning).toBeUndefined()
    expect(switched?.content).toContain('answer')
  } finally {
    await ctx.fiber.dispose()
  }
})
