# ClinePass advanced guide

[Back to README](../README.en.md) · [简体中文](advanced.md)

Everything here is optional: the settings page covers normal use. This page documents
headless and patch-file configuration, the one wire protocol the plugin speaks, network
proxies, error diagnosis, and exactly what the advanced reset clears.

This plugin is an independent client and is not affiliated with or endorsed by Cline.

## Headless mode

Install the plugin into the headless profile:

```sh
dsh plugin --profile headless add /path/to/dsh-clinepass
```

That profile has no settings page, so select the provider in a patch file
(`examples/headless.patch.yml` ships the same content):

```yaml
- id: agent-default-model
  config:
    provider: dsh-clinepass
    model: cline-pass/deepseek-v4.1-flash
```

`model` must be one of the ids shipped in the plugin's catalog — `cline-pass/*` for the
subscription rows or `cline-free/*` for the free tier; the [README](../README.en.md#models)
lists all fifteen. A model this build does not ship cannot be configured.

Supply the key through the environment, then run a task:

```sh
read -s CLINE_API_KEY
export CLINE_API_KEY
dsh --profile headless --patch ./headless.patch.yml "Hello"
```

PowerShell:

```powershell
$env:CLINE_API_KEY = "your-key"
dsh --profile headless --patch .\headless.patch.yml "Hello"
```

The key resolves through the DSH credential service first and falls back to the launch
environment; with no stored credential the environment is the whole credential plane.
Extra accounts are declared in the patch file and resolve their own references the same
way.

## Manual configuration

A patch file can carry the plugin's configuration entry, identified as `clinepass`. It can
be combined with the default-model entry above:

```yaml
- id: clinepass
  config:
    enabled: true
    apiKeyEnv: CLINE_API_KEY
    accounts:
      - id: primary
        name: Primary
        apiKeyEnv: CLINE_API_KEY
      - id: backup
        name: Backup
        apiKeyEnv: DSH_CLINEPASS_ACCOUNT_BACKUP
    autoSwitch: true
    proxyURL: http://127.0.0.1:7890
    refreshMinutes: 60
    modelVisibility:
      cline-pass/qwen3.7-max: false
    modelLimits:
      cline-pass/deepseek-v4.1-flash:
        maxTokens: 8192
      cline-pass/qwen3.7-plus:
        thinkingBudgets: [4096, 6000]
    maxImages: 30
```

Store each referenced key through the DSH credential service or export it. The first
`accounts` entry is the current account and the remaining entries are the fallback order;
the legacy `apiKeyEnv` reference must name the first entry. Manual and automatic switches
move the target account first while preserving every other account's relative order.

| Option | Purpose |
| --- | --- |
| `enabled` | Default `true`. `false` withdraws the `dsh-clinepass` route and its models from every picker without unloading the plugin, so the settings page stays reachable |
| `usageDisplay` | Usage pill mode: `auto`, `always`, or `off`; default `auto` |
| `apiKeyEnv` | Credential reference of the current account; default `CLINE_API_KEY`, and always a bare environment-variable name |
| `accounts` | Up to 20 `{id, name, apiKeyEnv}` entries; the first is current, the rest are the fallback order |
| `autoSwitch` | Default `false`; try the other accounts on quota or credential failure before any output |
| `baseURL` | Gateway base; default `https://api.cline.bot/api/v1`. A bare `https://api.cline.bot` folds onto the `/api/v1` base. `http`/`https` only, with no query or fragment |
| `proxyURL` | Blank by default; `http://`, `https://`, or `socks5://` with a host and optional port, and no path, query, or fragment |
| `refreshMinutes` | Catalog cache lifetime, 1–10080; default `60`. Opening the settings page or pressing refresh re-checks immediately |
| `streamIdleTimeoutMs` | Longest silence between stream events before the request fails; default `300000` |
| `requestPreparationTimeoutMs` | Deadline for discovery and each attempt's credential/image preparation; default `60000`. File-only: the settings page has no control for it |
| `requestTimeoutMs` | Whole dispatch deadline, including discovery, account fallback, and streaming; default `1800000`. File-only |
| `maxImages` | Retained image occurrences in one request; unset by default, which inherits the base configuration and caps nothing only when the base sets no cap. Above the cap the oldest images become text placeholders |
| `maxRequestImageBytes` | Cap on the accumulated base64 image payload of one request; default `20971520` (20 MiB) |
| `requestImagePixelBudget` | Total pixel budget of one converted image; default `4194304` (2048×2048) |
| `requestImageMaxBytes` | Encoded-byte target of one image before base64 expansion; default `1048576` (1 MiB) |
| `modelVisibility` | Per-model picker switches by model id; an absent id is enabled unless the catalog marks it deprecated |
| `modelLimits` | Per-model `contextWindow`, `maxTokens`, and extra `thinkingBudgets`; `null` selects the catalog value |

The settings document also carries `accountOperations`, the plugin's own recovery state for
an interrupted account addition or removal. It is hidden from the page and managed by the
plugin; do not hand-edit it.

## The wire protocol

ClinePass serves one OpenAI-compatible protocol, so the plugin has no protocol switch:

- Inference is `POST {base}/chat/completions`, streamed as SSE, with reasoning in
  `delta.reasoning`.
- `GET {base}/models` is read only as a diagnostic: Cline's listing advertises the general
  router catalog and never the `cline-pass/*` ids, so it can neither add nor remove models.
- Every request carries the harness attribution User-Agent (`deepseek-harness/<version>`)
  and `Authorization: Bearer <key>`.
- Every logical call carries `X-Task-ID`, derived from the request's session id. A printable
  ASCII id is sent as it is; any other id, and an id already inside the reserved namespace,
  becomes `dsh-cline-task-v1-` followed by a base64url SHA-256 of the id. A call with no
  session id gets one fresh random value, shared by every account attempt of that call.
- The `developer` role is never sent, and cache markers use the Anthropic-style
  `{type:"ephemeral"}` form. A `ttl` field is never sent either: Cline answers HTTP 500 for
  it.

The default gateway lists models at `https://api.cline.bot/api/v1/models`; a custom gateway
uses its configured prefix unchanged.

## Network proxy

Open **Settings → ClinePass → Advanced settings → Connection → Proxy address**, enter a URL,
and save:

```text
http://127.0.0.1:7890
socks5://127.0.0.1:1080
```

HTTP, HTTPS, and SOCKS5 are supported, and the address may carry a username and password.
The proxy applies to later conversations, catalog refreshes, and usage reads. Connections
originate from the machine running DSH, so on a remote deployment `127.0.0.1` means that
server, not your laptop.

## Image handling

Only models whose catalog entry declares the image modality accept image attachments; every
other model refuses image content before any provider I/O. The image controls bound one
request: the count cap replaces the oldest images with text placeholders, and the three byte
and pixel limits bound the payload that leaves the machine. Raising a cap does not restore
images an earlier request already replaced.

## Export error diagnostics

To capture HTTP failure evidence for a failed request, set a directory before starting DSH:

```sh
export DSH_CLINEPASS_DEBUG_DIR=/tmp/dsh-clinepass-debug
dsh web
```

Windows PowerShell:

```powershell
$env:DSH_CLINEPASS_DEBUG_DIR = "$env:TEMP\dsh-clinepass-debug"
dsh web
```

Reproduce the failure. When a file was written, the error message names it; the file is
`http-error-<uuid>.json`, written `0600` inside a `0700` directory, and contains:

- the time, provider, model, call id, and attempt number;
- a request summary: method, origin and path (never a query or fragment), a session hash,
  the User-Agent, the body byte count, message and tool counts, the output allowance, and
  the reasoning effort or thinking type;
- the response status, a fixed set of diagnostic headers, and a bounded body preview.

The API key and any proxy credentials are redacted, including credentials an upstream echoes
back; prompts, message content, and unknown headers are never recorded. Unset the variable
and restart DSH to stop writing files.

## Error semantics

Usage reads classify their HTTP status:

| Status | Meaning | Retryable |
| --- | --- | --- |
| 401 / 403 | The key or the ClinePass entitlement was rejected | No |
| 429 | ClinePass is rate limiting the window; it clears on its own | Yes |
| 408 / 5xx | Upstream fault | Yes |

A failed usage read keeps the previous reading only when the failure is retryable and the
same account and endpoint produced it, and labels it **Last data**. **Retry now** and the
account card's **Refresh usage** both re-read.

Request failures are classified from the status and the error body:

| Code | Meaning |
| --- | --- |
| `QUOTA` | The window's allowance is exhausted |
| `MISSING_CREDENTIAL` / `INVALID_CREDENTIAL` | No usable key, or the gateway rejected it |
| `RATE_LIMIT` | Throttled |
| `UNKNOWN_MODEL` | The gateway does not serve that model |
| `CONTEXT_WINDOW_EXCEEDED` | The request overflowed the context window |
| `INVALID_REQUEST` | Another 400/413/422 rejection |
| `TIMEOUT` / `SERVER` | 408/504, or a 5xx |

Automatic fallback moves to the next account only for `QUOTA`, `MISSING_CREDENTIAL`, and
`INVALID_CREDENTIAL`, and only while the request has emitted no content, produced no token
usage, and not been cancelled. A key the gateway rejects is remembered for five minutes per
gateway and skipped for that window; storing a new value for the reference clears that
memory immediately, so the next request re-checks it.

## Account operations and saving

Keys are stored through the DSH credential service and are never echoed back to the page.

If adding or removing an account is interrupted — the page closes, or the connection drops —
the host finishes the intention at startup or after the next settings or credential update.
An addition whose key was never stored stays visible so you can replace its key or remove it,
and a current-account choice made in the meantime is preserved.

**Reset all to defaults** in the advanced card resets only that card's own fields: usage
display, gateway URL, proxy, catalog refresh, stream idle timeout, and the three image
limits. It does not remove accounts or keys, and it does not clear model visibility switches
or per-model capacity overrides.
