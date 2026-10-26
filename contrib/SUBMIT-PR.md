# Submitting dsh-clinepass to the Awesome DSH Plugin catalog

Runbook for the catalog pull request. Written on 2026-10-26; ready to run from
**2026-10-27 14:05 (+08)** onwards, which is 24 hours after the repository was
created and therefore past the automatic repo-age check.

## Current facts

| Item | Value |
| --- | --- |
| Repository | https://github.com/HateYouLittle/dsh-clinepass |
| Repository created | 2026-10-26 14:04:53 +08 (2026-10-26T06:04:53Z) |
| Repo-age gate clears | 2026-10-27 14:04:53 +08 |
| npm package | `@crackedopal/dsh-clinepass@0.1.0` (published) |
| Category | `model` |
| Target file | `data/plugins/HateYouLittle__dsh-clinepass.yml` in awesome-dsh-plugin |

## Pre-flight (all must pass before opening the PR)

```powershell
# 1. repo age and topic, both checked by CI
curl.exe -sS -x http://127.0.0.1:7897 -H "Accept: application/vnd.github+json" `
  https://api.github.com/repos/HateYouLittle/dsh-clinepass/topics
# expect {"names":["dsh-plugin"]}

curl.exe -sS -x http://127.0.0.1:7897 -H "Accept: application/vnd.github+json" `
  https://api.github.com/repos/HateYouLittle/dsh-clinepass
# expect created_at 2026-10-26T06:04:53Z and now - created_at >= 24h

# 2. the installable manifest still resolves
node -e "const p=require('./package.json'); console.log(p.name, JSON.stringify(p.dsh.bundle))"
Get-Content cordis.patch.yml
```

If the proxy is off, drop the `-x` flag; GitHub is otherwise unreachable from
this machine.

## Submit

1. Fork `awesome-dsh-plugin/awesome-dsh-plugin` (web UI, or
   `POST /repos/awesome-dsh-plugin/awesome-dsh-plugin/forks`).
2. Add exactly one file, `data/plugins/HateYouLittle__dsh-clinepass.yml`, with the
   content below. Do not edit the generated READMEs and do not touch any other
   entry — CI lists every existing entry a PR modifies.
3. Commit message: `Add HateYouLittle/dsh-clinepass`
4. Open the PR against `main`. Title:
   `Add HateYouLittle/dsh-clinepass (Models & Providers)`
   Body: `contrib/PULL_REQUEST.md` in this repository (it states the positioning
   against the existing `@goodandready/dsh-clinebot` entry, which the duplicate
   review looks at).
5. Watch CI. A failure names exactly what to change; push the fix to the same
   branch, no new PR needed.

## Entry file content

```yaml
url: https://github.com/HateYouLittle/dsh-clinepass
name: HateYouLittle/dsh-clinepass
category: model
description:
  en: 'ClinePass provider for DeepSeek Harness: 15 bundled subscription and free models, a settings page with per-model capacity overrides, subscription usage for the 5-hour, weekly and monthly windows, and multi-account failover to a backup account.'
  zh: 'DeepSeek Harness 的 ClinePass 模型提供方：内置 15 个订阅与免费模型，提供设置页与按模型容量覆盖、5 小时／每周／每月订阅用量，以及多账号与备用账号自动切换。'
```

Every claim above is verified against the source: 15 curated rows (12
`cline-pass/*`, 3 `cline-free/*`) in `src/clinepass-models.ts`; capacity
overrides `contextWindow` / `maxTokens` / `thinkingBudgets` in `src/config.ts`;
the three windows in `src/usage-contract.ts`; `autoSwitch` in `src/config.ts`.

## After the merge

- The site and the `dsh-plugin-catalog` index rebuild automatically within a few
  hours; the plugin then appears in the DSH plugins Discover tab and at
  `https://awesome-dsh-plugin.com/p/HateYouLittle/dsh-clinepass/`.
- npm download counts attach through the package `repository` field, which
  already points at this repository — nothing more to declare.

## If CI fails

| Failure | Fix |
| --- | --- |
| repo age | the PR was opened too early; wait past the gate and push a commit |
| `dsh.bundle` | only `dsh.client` was seen — check the root `package.json`, not a subpackage |
| entry count | more than 3 entries in one PR; split |
| awesome-lint / site build | usually quoting in the description; a `: ` inside an unquoted scalar breaks the parser |
| modified unrelated entries | revert those hunks to the upstream version |

## Optional follow-ups

- `screenshots.json` next to `package.json` (1-8 GitHub-hosted images) for the
  storefront detail view.
- `icon:` in the entry — a GitHub-hosted raster (png/jpg/webp), ~96px square.
- A GitHub Release with a prebuilt tarball is only needed if the repo could not
  be installed from source; this one ships `lib/`, so it is not needed.
