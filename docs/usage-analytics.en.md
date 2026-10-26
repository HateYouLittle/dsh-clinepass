# Usage analytics notes

[Back to README](../README.en.md) · [简体中文](usage-analytics.md)

This page documents what the `dsh-clinepass` usage dashboard counts, how it prices requests,
and what it deliberately leaves out.

This plugin is an independent client and is not affiliated with or endorsed by Cline.

## Entry points

- the **Usage analytics** row at the bottom of the usage pill's expanded panel;
- the **Usage analytics** card on the settings page: **Dashboard** opens the dashboard and
  **Theme** picks its style.

## Data source

The Host reads DSH's `ctx.sessionQuery`:

- `listSessions()` lists sessions newest-first;
- `readSession(id)` returns the complete event log, including closed sessions;
- only events are scanned. The dashboard never decompresses archived logs itself and never
  makes a session live.

The browser receives aggregate numbers only: no session ids, titles, message content,
working directories, or credentials.

Scanning and aggregation run locally, and pricing needs no remote read: the rates ship with
the plugin, and the report names that source as `clinepass-catalog`. The catalog snapshot
named as the report's price source may itself refresh the gateway's model listing for
diagnostics, but that request carries no conversation content, no account key, and no
analytics data. Normal inference and usage reads still go to the configured gateway; there is
no other telemetry or analytics service.

## What is counted

### Included

- `assistant/message` events on the `dsh-clinepass` route (one settled model request each);
- `compaction/summary` events on the same route (the summarization request);
- the pre-0.1.16 `clinepass` route id, but only for requests that started before
  2026-09-30 UTC. Later `clinepass` records belong to DSH's native route and are excluded.

### Excluded

- DSH's native ClinePass route and every other provider;
- fork-inherited prefixes (sequence numbers strictly below `inheritedEventCount`);
- model calls that never enter the session log;
- calls that cannot be attributed to this plugin's route (the log lacks a routing header or
  a model id) — the footer counts them as unattributed activity, without tokens or cost;
- failed requests with no usage record; they appear only as unsettled attempts.

### Request time and range

A request's start comes from the matching `step/start` event; when that key is absent the
session's most recent `step/start` is used, and the message event time is the fallback only
when a session recorded no start at all. Summaries use their own event time. The range is
half-open `[from, to)`, and days are bucketed in the browser's IANA timezone.

### Tokens

- input, output, cache read, and cache write are tracked separately;
- billed input = input + cache read + cache write;
- usage degrades per field: a present-but-malformed component degrades only itself while the
  valid components still count; a request counts as missing usage only when input and output
  are both missing or malformed, and missing usage is never zero-filled into the estimate;
- cache hit rate = cache read / (input + cache read + cache write), so output tokens never
  enter the denominator; a zero denominator shows 0.0%.

### Estimate

- each shipped row carries one flat rate per component (USD per 1M tokens), and the estimate
  is tokens × rate, accumulated as integer micro-USD;
- all history is estimated at the rates in force when the dashboard is built;
- a model with no usable cost in the shipped table is treated as unpriced: it adds no cost,
  is counted separately, and its cost cell shows an **unpriced** tag. A genuinely free row
  with a published all-zero cost still prices at zero;
- the lead sentence states an amount only when at least one request was priced; otherwise it
  puts `—` where the amount would go, so "cannot be priced" is never rendered as `$0.00`;
- when the price table is unavailable or takes longer than four seconds, the last successful
  table is used; with no usable table at all, every model that appeared is listed as
  unpriced;
- ClinePass publishes no per-model monthly allowance, so the report's per-model allowance
  fields stay `null` / unknown and the dashboard renders no allowance column. The official
  window percentages remain authoritative and are never derived from the estimate.

## Model detail

Each model row shows the display name plus requests, input, output, cache read, cost, and
cost share. The cost cell has three states:

- priced requests render the estimate, even when some requests in the same row are unpriced;
- `pricedRequests === 0` with `unpricedRequests > 0` renders the **unpriced** tag;
- a row whose requests all lack usage renders `—`, meaning the row carries no usable data
  rather than "free".

The share cell renders `—` whenever there is no amount, and the composition note's "also
free or unpriced" line lists only genuinely unpriced models.

The dashboard's **Quota** section shows the official window percentages — name, percentage,
bar, reset time, and the near-limit marker. It is read when the dashboard opens and again on
refresh; the pill itself polls the same figures every minute while it is visible.

## Themes and the pill

- Four styles: **Silent Black**, **Graphite** (default), **Sea Salt**, and **Warm Sand**.
  Each has a dark and a light variant that follows DSH's colour scheme.
- The only switch is the **Theme** row inside the settings page's Usage analytics card. The
  choice is stored in the browser, not in the settings document.
- The pill and the dashboard render whatever style is selected; the settings page keeps
  DSH's own appearance.
- With more than one account the pill shows the current account's name next to its readings;
  with a single account it shows only the readings.

## Scan limits and performance

- by default at most **500 sessions**, **500,000 events**, **200,000 folded facts**, and
  **12 seconds**, read with up to eight concurrent session reads (falling back to serial for
  a Host that cannot read concurrently);
- exceeding a limit marks the report incomplete with its cause (session slice, event budget,
  or time budget); the footer also reports how many sessions were left unread, without
  implying the range was fully covered;
- **Scan more history** doubles the session cap up to 2,000; the choice is stored in the
  browser and survives reopening the panel;
- a closed session's fold is cached in memory and reused LRU-style, checked against its
  durable log revision on every scan: a session resumed and closed between dashboard opens
  is re-read when its revision changes. Without a revision, in-memory reuse is limited to
  five seconds. Live folds also have a five-second reuse window and are re-read on closing;
  eviction happens only at the end of a scan, and a report is always built from the results
  actually read in that run;
- folds are also persisted to `~/.dsh/cache/dsh-clinepass/analytics-folds.v1.json`
  (honouring `DSH_HOME`): the file is versioned, capped at 32 MiB, written to a temporary
  file and renamed into place, and entries not re-verified for 30 days are dropped on the
  next write. Live sessions are never written, a cancelled scan writes nothing, and a Host
  without the durable session index falls back to the in-memory cache. The cache holds
  session ids, model names, token counts and timestamps only — no titles, message text,
  working directories or credentials;
- the price table is built in parallel with the scan and waits at most four seconds;
- the footer splits the list, scan, and pricing timings;
- within one open the window end is frozen at open time, so re-entering the same range
  renders its previous report immediately and revalidates it; **Refresh** forces a new scan;
- closing the dialog aborts the running scan; there is no background polling.

## Contract compatibility rules

The dashboard's query and report are validated on both sides by the strict codecs in
`src/analytics-contract.ts`. Two rules are repository policy:

- **New fields travel as optional numbers or strings.** The report validator passes unknown
  keys through and the query validator drops unknown fields, so adding an optional numeric
  or string field is safe when both ends ship together;
- **Never add a value to an enum.** `coverage.truncation` and a model row's `limitNote` are
  whitelist-validated, and an older client rejects the **whole report** on an unknown value.
  Do not extend those enums without shipping the change on both ends.

## Known limitations

- session request headers carry no account identity, so history cannot be split per account;
  the dashboard totals every saved account;
- a request that fails or is cancelled before usage may still be billed by the gateway but
  adds no cost;
- summaries count as requests, so the request total includes them;
- device or gateway clock skew can move a request across a day boundary;
- the shipped rates are reference data and can drift from actual billing; the official
  percentages remain authoritative.

## Verification

The `analytics-scan`, `analytics-pricing`, `analytics`, and `analytics-fold-cache` specs plus
the client specs cover provider filtering, fork cutoffs, per-field usage degradation,
request-time fallbacks, the cache reuse window, truncation and budget stops, the concurrency
pool, unpriced models, price-table fallback, cancellation, segmented timings, and both entry
points. All use synthetic sessions and a fake query service; no real user logs are read.
