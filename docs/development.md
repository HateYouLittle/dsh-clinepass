# Development and testing

[Back to README](../README.en.md)

This repository is one coherent DSH plugin package: host sources under `src/`, the browser
half under `src/client/`, the shared conversion layer under `src/conversion/`, specs under
`tests/`, build and smoke scripts under `scripts/`, and the committed build output under
`lib/`.

The plugin is an independent client and is not affiliated with or endorsed by Cline.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the locked development dependencies |
| `npm run compile` | Type-check both faces and regenerate the committed artifacts in `lib/` |
| `npm run check:dist` | Rebuild in a temporary directory and compare every artifact with the shipped `lib/` without changing it |
| `npm run typecheck` | `tsc --noEmit` for the host and client projects |
| `npm test` | Rebuild (`pretest`) and run the Vitest suite |
| `npm run test:ci` | Verify the shipped artifacts, then run the suite |
| `npm run verify:installed` | Resolve an installed `dsh-clinepass` from a consumer directory (the current directory by default) and exercise a real Cordis mount against a loopback fake gateway |
| `npm run verify:headless` | Drive the shipped `dsh --profile headless` against a loopback fake gateway; the consumer root is its argument |
| `npm run test:install` | Install prebuilt Git and npm artifacts into fresh npm and pnpm consumers and type-check the public declarations |
| `npm run verify` | `test:ci` plus `test:install` |

All checks use loopback gateways and synthetic fixtures; none needs paid inference or an
installed user profile. `test:install` needs registry access and Git.

## Build before distribution

`lib/` is committed so a Git URL, an npm release, and an npm tarball all ship ready-to-load
code. There are no `prepare`, `prepack`, or dependency-install hooks; `prepublishOnly` runs
`check:dist` for maintainers.

`npm run compile` writes:

- `lib/index.js` — the host bundle: ESM for Node 22, with `@deepseek-ai/*`, `undici`,
  `openai`, and `@anthropic-ai/sdk` left external;
- `lib/client.js` — the browser bundle: a CJS factory registered with the DSH module loader,
  with React and the DSH client packages left to the host module table. CSS modules are
  compiled with lightningcss and injected once per file as a `<style>` element;
- `lib/types/**` — declarations for both faces, with the private SDK types flattened into
  `lib/types/sdk-types.d.ts`;
- `lib/build-info.json` — the external lists and the bundled SDK version;
- `lib/vendor-licenses.txt` — the license text of every package retained in the host bundle.

The private SDK alias `clinepass-pi-ai` (npm alias for `@earendil-works/pi-ai`) is bundled so
consumers never install it. After any source or build change, run `npm run compile` and
commit the regenerated `lib/`; `npm run check:dist` fails on missing, changed, or extra
artifacts, and CI uses `npm run test:ci` so it checks the committed files before running
tests rather than silently replacing them.

## Architecture and ownership

`src/index.ts` is the plugin entry. It registers the `dsh-clinepass` route, model discovery,
the settings section, and the usage, models, analytics, and accounts remotes. It resolves
the credential per request through the credentials seam, falling back to the launch
environment, and registers the route only while the switch is on and a credential resolves —
withdrawing it leaves discovery, settings, and the credential listener mounted so the page
that owns the switch stays reachable.

`src/adapter.ts` owns one route, one catalog, and one task identity per call. It captures the
configuration, model, and catalog snapshot before discovery yields, so a settings write
between two requests never mixes generations inside one call, and it orders the accounts and
applies the fallback policy.

`src/request-executor.ts` executes one captured account attempt: credential resolution, the
image gate and conversion, reasoning intent, SDK streaming, idle and preparation deadlines,
and HTTP diagnostics. It never selects an account and never owns the transport's lifetime.

`src/catalog.ts` and `src/catalog-manager.ts` own discovery. The curated table decides
membership; the gateway's `GET {base}/models` listing is read only as an additive diagnostic,
so neither an empty nor an unreachable listing can change what the picker offers. Refreshes
coalesce, reuse a cached snapshot until its TTL, and serve stale-while-revalidate to
confirmed models; failed refreshes retry sooner. The manager keys one catalog per
`(baseURL, refreshMinutes, proxyURL)`.

`src/clinepass-models.ts` is the shipped table, and `src/model-metadata.ts` adapts it to the
catalog and analytics shapes. `src/request-budget.ts` holds the one model-specific output
rule.

`src/usage.ts` and `src/usage-contract.ts` are the `clinePassUsage` typert remote service and
its strict codec: the Host performs the read and the browser validates the result.

The account modules split the work: `src/accounts.ts` is client-safe metadata and ordering,
`src/account-selection.ts` holds the host's account-state version and notices,
`src/account-policy.ts` decides whether a failed attempt may try another account,
`src/account-operations.ts` and `src/account-commit.ts` own the durable intention and its
revision-guarded write, `src/account-manager.ts` serializes commands with recovery, and
`src/account-service.ts` exposes the remote.

`src/config.ts`, `src/config-contract.ts`, and `src/host-settings.ts` own the schema, the
browser-safe vocabulary both faces share, and the version-specific settings attachment and
validation.

`src/conversion/**` maps the session log to pi-ai context (`context.ts`), restores replay
state (`replay.ts`), maps SDK events to seam chunks (`stream.ts`), and bounds image work
(`image-pool.ts`, `image-offload.ts`).

`src/analytics*.ts` is the dashboard: `analytics.ts` (service, scan loop, caching),
`analytics-scan.ts` (session-log folding), `analytics-fold-cache.ts` (the durable fold
cache), `analytics-pricing.ts` (tokens × shipped rate), and `analytics-contract.ts` (the
wire contract).

`src/proxy.ts` is the per-mount undici proxy transport; it retires replaced pools and
releases every pool on unload.

`src/client/**` is the browser half: the settings page (`Section.tsx`,
`section-controller.ts`, `ModelEditor.tsx`, `AccountsCard.tsx`), the usage pill
(`UsagePill.tsx`), the analytics dashboard (`AnalyticsDialog.tsx`), the theme picker, and
the zh/en dictionaries in `locales.ts`.

## Session identity and wire headers

Each logical dispatch derives its wire identity before discovery and shares it across every
account attempt. A non-empty printable ASCII session id passes through unchanged; any other
id, and an id already inside the reserved namespace, becomes `dsh-cline-task-v1-` followed
by the base64url SHA-256 of its exact UTF-16LE code units. The mapping never trims or
normalizes text, and a call with no session id gets one fresh random value.

That value is sent as `X-Task-ID`, Cline's documented per-call request identity, and the
harness attribution User-Agent (`deepseek-harness/<version>`) is merged in with it. The
versioned mapping is a wire compatibility contract: changing it changes existing
conversations' cache identities, so update the regression vector with it.

## Failure boundaries and resource policy

Error classification lives in `src/gateway-error.ts` and inspects the captured
`error.type`/`error.code` before falling back to the status, because a gateway uses 401 for
model errors, subscription limits, and authentication failures alike. Only
`INVALID_CREDENTIAL` is remembered as a rejected key; quota failures may switch accounts but
never blacklist a credential.

`src/account-policy.ts` allows fallback only for `QUOTA`, `MISSING_CREDENTIAL`, and
`INVALID_CREDENTIAL`, and only while the request has emitted no content, produced no token
usage, and not been cancelled. The adapter remembers a gateway rejection for five minutes
per gateway, and storing a new value for the reference clears it.

Deadlines are layered: a 60-second preparation deadline covers discovery and each attempt's
credential/image preparation, a 30-minute dispatch deadline spans discovery, fallback, and
streaming, and the idle watchdog bounds one outstanding stream read. Every external wait
observes cancellation, and cancelling a catalog waiter never aborts a shared refresh.

Image work is bounded per plugin mount: four preparation permits, a 32-task queue, and a
128 MiB shared lease covering prepared raw bytes plus base64 payloads. Admission failure
reports `IMAGE_RESOURCE_BUSY` and does not switch accounts. The lease is logical: it excludes
decoder memory and SDK copies. Only models whose catalog entry declares the image modality
accept image content, and every other model refuses it before any provider I/O.

`src/request-budget.ts` gives `cline-pass/deepseek-v4.1-flash` a default output allowance of
65,536 tokens, bounded by its resolved output capacity, and reports that default to DSH for
compaction budgeting. Other models keep the SDK default, and an explicit per-model `maxTokens`
override always caps the caller's value.

## Reasoning

`src/reasoning.ts` owns the picker choices and translates a validated selection into the
wire intent. Each curated row carries a `thinkingLevelMap`, so a model exposes only the
levels it supports — including rows whose reasoning cannot be turned off. Token-budget
controls use the SDK's budget override, and extra budgets are configured per model through
`modelLimits[modelId].thinkingBudgets` (at most 16 values).

## Tests

`npm test` runs Vitest over `tests/**/*.spec.ts(x)` with a 15-second timeout and shared
setup. The suite covers, among others:

- the adapter, session identity, request timeouts, model limits, model visibility, and the
  stream contract;
- the catalog, catalog diagnostics, dynamic configuration, and gateway migration;
- usage, usage errors, accounts, account selection/adoption/recovery, and the account
  manager;
- analytics scanning, pricing, the fold cache, the analytics service, and the dashboard and
  settings client components;
- conversion context, replay, the image count and pool, proxy handling, and the Google fetch
  bridge used by the build.

Everything runs against loopback gateways and synthetic sessions; no real user logs or paid
inference are used.

## Deliberate scope decisions

- **One protocol, no switch.** ClinePass serves a single OpenAI-compatible Chat Completions
  protocol, so the per-model protocol override an earlier generation of this plugin carried
  was retired: there is no protocol field in the schema and no protocol control in the
  settings page.
- **The catalog ships; it is not fetched.** Membership, protocol, capability, context, and
  cost live in `src/clinepass-models.ts`. There is no online metadata fetch and no on-disk
  metadata cache to refresh — the only live read is the gateway's additive
  `GET {base}/models` listing diagnostic, which can never change membership.
- **The compatibility matrix and benchmark scripts are gone.** The repository carries no
  compatibility-matrix runner, no per-host fixture packages, and no protocol or latency
  benchmark scripts. Compatibility is covered by the installed-package and headless smoke
  scripts plus the installation checks, all of which run against loopback gateways.

## CI

`.github/workflows/verify.yml` runs two jobs:

- **core** — `npm ci --strict-peer-deps` then `npm run test:ci`, on Ubuntu and Windows with
  Node 22.19.0 and 24;
- **install** — `npm run test:install -- npm` and `-- pnpm` in the same OS/Node matrix, with
  the pnpm store and npm cache on the runner's temporary volume. The runner needs only Node
  built-ins, because the Git fixture supplies committed artifacts and must not need build
  dependencies or install-script approval.

Each job has a 15-minute timeout, and the install job uploads npm timing records as an
artifact for dependency-resolution diagnosis.
