/**
 * One-shot migration tool: turn a copy of the dsh-opencode-go tree into the
 * dsh-clinepass tree by applying the identity rename map to file contents and
 * file names. Provider-specific behaviour is rewritten by hand afterwards; this
 * script only removes the OpenCode identity so the tree still builds.
 *
 * Usage: node tools/rename-port.mjs [--check]
 */
import { readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const CHECK = process.argv.includes('--check')

/** Ordered: longer/more specific patterns first. */
const CONTENT_RULES = [
  ['opencode-go-pi-ai', 'clinepass-pi-ai'],
  ['OPENCODE_GO_MODELS', 'CLINEPASS_MODELS'],
  ['dsh-opencode-go', 'dsh-clinepass'],
  ['llm-opencode-go', 'llm-clinepass'],
  ['DSH OpenCode Go', 'DSH ClinePass'],
  ['OpenCode Go', 'ClinePass'],
  ['opencodeGoUsage', 'clinePassUsage'],
  ['opencodeGo', 'clinePass'],
  ['OPENCODE_GO', 'CLINEPASS'],
  ['OPENCODE_API_KEY', 'CLINE_API_KEY'],
  ['OPENCODE', 'CLINE'],
  ['https://opencode.ai/inference/go/v1', 'https://api.cline.bot/api/v1'],
  ['https://opencode.ai/zen/go/v1', 'https://api.cline.bot/api/v1'],
  ['opencode.ai', 'api.cline.bot'],
  ['opencode-go', 'clinepass'],
  ['OpencodeGo', 'ClinePass'],
  ['OpenCode', 'Cline'],
  ['GO_PLAN_AS_OF', 'CLINEPASS_PLAN_AS_OF'],
  ['GO_PLAN_SOURCE', 'CLINEPASS_PLAN_SOURCE'],
  ['GO_MONTHLY_LIMITS', 'CLINEPASS_MONTHLY_LIMITS'],
  ['goMonthlyLimit', 'clinepassMonthlyLimit'],
  ['GoLimitNote', 'ClinePassLimitNote'],
  ['GoMonthlyLimit', 'ClinePassMonthlyLimit'],
  ['go-plan', 'clinepass-plan'],
  // Remaining `Go`-prefixed type names (GoAccount, GoUsage, GoModel, ...).
  [/\bGo([A-Z])/g, 'Cline$1'],
]

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.md', '.css', '.txt', '.patch',
])

const SKIP_DIRECTORIES = new Set(['node_modules', '.git', 'lib', 'dist'])

/** File names that carry the old identity. */
const FILE_RENAMES = new Map([
  ['src/go-plan.ts', 'src/clinepass-plan.ts'],
  ['tests/go-plan.spec.ts', 'tests/clinepass-plan.spec.ts'],
])

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name)) continue
      yield* walk(join(directory, entry.name))
    } else {
      yield join(directory, entry.name)
    }
  }
}

function applyRules(text) {
  let out = text
  for (const [from, to] of CONTENT_RULES) out = out.replaceAll(from, to)
  return out
}

const changed = []
const renamed = []
for await (const path of walk(ROOT)) {
  const name = relative(ROOT, path).split('\\').join('/')
  if (name.startsWith('tools/')) continue
  const extension = name.slice(name.lastIndexOf('.'))
  if (!TEXT_EXTENSIONS.has(extension)) continue
  const before = await readFile(path, 'utf8')
  const after = applyRules(before)
  if (after !== before) {
    changed.push(name)
    if (!CHECK) await writeFile(path, after)
  }
  const target = FILE_RENAMES.get(name)
  if (target !== undefined) {
    renamed.push(`${name} -> ${target}`)
    if (!CHECK) await rename(path, join(ROOT, target))
  }
}

console.log(`${CHECK ? 'WOULD CHANGE' : 'CHANGED'} ${changed.length} files`)
for (const name of changed) console.log(`  ${name}`)
if (renamed.length > 0) {
  console.log(`${CHECK ? 'WOULD RENAME' : 'RENAMED'} ${renamed.length} files`)
  for (const entry of renamed) console.log(`  ${entry}`)
}
