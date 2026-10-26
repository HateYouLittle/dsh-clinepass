# dsh-clinepass

[中文](README.md)

**ClinePass subscription models, usage, and multi-account management** for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

This plugin is derived from [dsh-opencode-go](https://github.com/Duskriver/dsh-opencode-go).
The model catalog, the usage reads, and the request identity were rewritten for ClinePass;
the settings surface and the account machinery reuse the same implementation.

- **Usage at a glance** — a usage pill next to the composer expands into the 5-hour, weekly,
  and monthly used percentages with their reset times.
- **Several accounts in one place** — key status, drag-to-reorder, in-session switching, and
  optional automatic failover to a backup account.
- **A model list that ships with the plugin** — Cline publishes no per-model capability
  document, so membership, protocol, context, and prices are bundled instead of fetched.

Chinese and English, following the DSH interface language.

## Models

The plugin registers its own provider, **DSH ClinePass**, with Cline's `cline-pass/<model>` ids.

| Model | Model ID | Input | Context / max output |
| --- | --- | --- | --- |
| GLM-5.3 | `cline-pass/glm-5.3` | text | 921,600 / 131,072 |
| GLM-5.3 Flash | `cline-pass/glm-5.3-flash` | text, image | 921,600 / 131,072 |
| Kimi K3 | `cline-pass/kimi-k3` | text, image | 921,600 / 131,072 |
| DeepSeek V4 Pro | `cline-pass/deepseek-v4-pro` | text | 921,600 / 131,072 |
| DeepSeek V4.1 Flash | `cline-pass/deepseek-v4.1-flash` | text, image | 921,600 / 131,072 |
| MiMo-V2.5 | `cline-pass/mimo-v2.5` | text, image | 921,600 / 131,072 |
| MiMo-V2.5-Pro | `cline-pass/mimo-v2.5-pro` | text | 921,600 / 131,072 |
| MiniMax M3 | `cline-pass/minimax-m3` | text, image | 921,600 / 131,072 |
| Muse Spark 1.3 Contributor | `cline-pass/muse-spark-1.3-contributor` | text, image | 921,600 / 131,072 |
| Qwen3.8 Max | `cline-pass/qwen3.8-max` | text, image | 921,600 / 131,072 |
| Qwen3.7 Max | `cline-pass/qwen3.7-max` | text | 921,600 / 131,072 |
| Qwen3.7 Plus | `cline-pass/qwen3.7-plus` | text, image | 921,600 / 131,072 |
| MiMo-V2.6-Flash (free) | `cline-free/mimo-v2.6-flash` | text, image | 921,600 / 131,072 |
| DeepSeek V4.1 Flash (free) | `cline-free/deepseek-v4.1-flash` | text, image | 921,600 / 131,072 |
| Muse Spark 1.3 Contributor (free) | `cline-free/muse-spark-1.3-contributor` | text, image | 921,600 / 131,072 |

`cline-pass/*` rows are subscription models and `cline-free/*` rows are Cline's free tier;
they share one API key and one base URL, so both are offered. Free rows carry " (free)" in
their label so they cannot be confused with the paid row that shares their name.

Prices are measured billing rates ($/1M tokens) used for settings-page and analytics
estimates. They **do not** drive the ClinePass quota: the official percentages do.

## Subscription usage

Click the usage pill next to the composer to expand the current account's subscription usage.
The bar shows the **used percentage**, turning amber near the cap and red when exhausted, and
each window shows its reset time.

Usage comes from Cline's subscription endpoint `GET /users/me/plan/usage-limits`, which returns
the used percentage and reset time for the `five_hour`, `weekly`, and `monthly` windows.

The panel refreshes every minute while visible, pauses in a background tab, and refreshes on
return. A failed read says so, keeps the last reading when it can label it as such, and offers
**Retry now**. The account card in settings also has **Refresh usage**.

**Settings → ClinePass → Advanced → Usage display** selects when the pill appears:

| Mode | Behaviour |
| --- | --- |
| Auto (default) | shown while a **DSH ClinePass** model is selected |
| Always | also shown while another provider's model is selected |
| Off | hides the pill and stops its polling |

## Multiple accounts

**Settings → ClinePass → Accounts** manages accounts:

- Add, rename, replace the key of, or remove an account; up to 20 accounts.
- Each row shows key status, the 5-hour percentage, and the reset countdown; expand for the
  full usage and account actions.
- Drag the handle to reorder: the first row is the current account, and the order is also the
  failover order.
- **Switch** in the session usage panel moves that account to the front for this profile while
  preserving every other account's relative order.

With **Use a backup account automatically** enabled, the plugin tries the other accounts in
order when the current one is out of quota or its key is rejected, before any output is
emitted. The account that starts producing output becomes current and the panel shows the
switch. Once a request has emitted content, produced token usage, or been cancelled, the
plugin never retries it on another account.

Keys are stored through the DSH credential service and are never echoed back to the page.

## Install and quick start

Requires DSH `0.1.5-rc.1` or newer; verified on `0.2.1-rc.3`.

### Install

Choose this repository's directory in **Plugins → Add plugin**, or install the directory
directly:

```sh
dsh plugin --profile desktop add /path/to/dsh-clinepass
```

The `plugin_manager` tool's `install_bundle` also accepts this repository's absolute path.

Then click **Enable now** and start or restart `dsh web` (quit the desktop app completely and
reopen it).

### First run

1. Create an API key at
   [app.cline.bot → Settings → API Keys](https://app.cline.bot/settings/api-keys).
2. Open **Settings → ClinePass**, paste the key, and save — or add it under **Accounts**.
3. Pick a model under **DSH ClinePass** in the session model selector.
4. Start a conversation and watch the usage pill; expand it to switch accounts.

The plugin serves its own provider. Selecting a model that DSH itself provides does not use
this plugin's account switching; "Always" usage display still shows this plugin's accounts.

## Models and settings

### Pick a model and adjust parameters

Search **Available models** by name or id, and filter by **customised** or **deprecated**.

- The per-model switch controls whether it appears in the session picker; changes apply at once.
- A selected model shows the context window, maximum output, and input modalities shipped with
  the plugin; capacity overrides apply once saved, and an empty field keeps the default.
- Models that support thinking expose a switch, an effort level, or a token budget; budget-style
  models also accept custom budgets.

`cline-pass/deepseek-v4.1-flash` uses a default output budget of **64k (65,536 tokens)** per
request, reduced to the model's own maximum when that is smaller, and reports that default to
DSH for compaction timing. The rule applies to this model only; other models keep the SDK
default. Set **Max output** in the model capacity overrides when a longer answer is needed.

Streaming, thinking, tool calls, and image input depend on the model. Only models whose catalog
entry declares the image modality accept image attachments; every other model refuses image
content before any provider I/O.

### Advanced settings

Advanced settings are grouped into **Usage**, **Connection**, **Cache and timeouts**, and
**Images**. Hover a question mark for an explanation, and use **Restore all defaults** to clear
that card's overrides before saving again; the current account selection is preserved.

HTTP, HTTPS, and SOCKS5 proxies are supported and apply to later conversations and usage reads.
The proxy runs on the machine hosting DSH, so `127.0.0.1` in a remote deployment means the
server itself.

ClinePass serves one OpenAI-compatible Chat Completions protocol, so this plugin offers no
protocol switch.

## Updates and troubleshooting

Restart `dsh web` and reload the page after an update; quit and reopen the desktop app.

**No usage shown?** "Auto" mode only shows it while a **DSH ClinePass** model is selected.
Check that the plugin is enabled, that a key is configured, and which usage-display mode is
set; choose "Always" to keep it visible under another provider.

**Rejected key or exhausted quota?** A 401/403 from the usage API means the key was rejected
and a 429 means rate limiting; the account card names the failure and offers a retry. With
several accounts and automatic failover enabled, the plugin tries the next account before any
output.

**A model is missing?** The catalog ships with the plugin. Cline's `GET /models` listing only
covers the general router catalog and never carries the `cline-pass/*` subscription ids. If
that listing advertises a `cline-pass/*` or `cline-free/*` id this build does not ship, the
settings page marks it as missing configuration — upgrade the plugin.

**Long conversations keep returning 400?** Check the output budget and context window in the
error, then run `/compact` or lower that model's **Max output** and retry. A clear context
overflow is handed to DSH's own recovery.

**An old session cannot find the model after an upgrade?** Configure it by hand with
`provider: dsh-clinepass`.

Uninstall:

```sh
dsh plugin --profile desktop remove dsh-clinepass
```

## More documentation

- [Advanced guide: manual configuration, proxies, and error diagnosis](docs/advanced.en.md)
- [Usage analytics](docs/usage-analytics.en.md)
- [Development and testing](docs/development.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [MIT license](LICENSE)

This plugin is an independent client and is not affiliated with or endorsed by Cline.
