import { afterEach, beforeEach, vi } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

let testHome: string

beforeEach(async () => {
  testHome = await mkdtemp(join(tmpdir(), 'clinepass-test-'))
  vi.stubEnv('DSH_HOME', testHome)
})

afterEach(async () => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  await rm(testHome, { recursive: true, force: true })
})
