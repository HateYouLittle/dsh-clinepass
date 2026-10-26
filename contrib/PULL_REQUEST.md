# Pull request text for the Awesome DSH Plugin catalog

Copy the body below into the PR that adds
`data/plugins/HateYouLittle__dsh-clinepass.yml`.

---

**Add `HateYouLittle/dsh-clinepass`** (Models & Providers)

`dsh-clinepass` is a ClinePass provider for DeepSeek Harness. One YAML entry, no
other files touched.

What it ships:

- A model provider registered as **DSH ClinePass** with 15 bundles of models
  (`cline-pass/*` subscription models and `cline-free/*` free-tier models),
  including per-model context window, max output, reasoning levels and measured
  reference prices. The catalog ships with the plugin because Cline's own
  `GET /models` listing only covers its general router catalog and never carries
  the `cline-pass/*` subscription ids.
- A settings page with model search/visibility switches, per-model capacity
  overrides, and grouped advanced settings.
- Subscription usage for the three ClinePass windows (5-hour rolling, weekly,
  monthly), read from `GET /users/me/plan/usage-limits`, surfaced as a composer
  pill and in the settings page.
- Multi-account support (up to 20 keys) with an optional backup-account failover
  that only switches before any output is emitted.

Distinct from the existing `@goodandready/dsh-clinebot` entry: that plugin is a
companion around ClinePass (quota dashboard, in-UI key saving, a `/cline`
command); this one is a provider-side adapter with its own bundled model catalog,
per-model capacity overrides and account failover, derived from
`dsh-opencode-go`'s adapter architecture.

Install either way:

```sh
dsh plugin --profile web add @crackedopal/dsh-clinepass   # npm, prebuilt
dsh plugin --profile web add github:HateYouLittle/dsh-clinepass
```

Verification performed on the submitted revision:

- `npm run typecheck` (host + client TypeScript), `npm run compile`
- `npm run check:dist` — all 76 shipped build artifacts match the source
- `npx vitest run` — 849 tests across 48 files
- a live request against `api.cline.bot` through the mounted plugin (provider
  registration, catalog listing, streamed reply, usage windows)
- `npm run test:install -- npm` — installs the packed repo from a git URL into a
  clean consumer, loads the ESM bundle and type-checks the public types
