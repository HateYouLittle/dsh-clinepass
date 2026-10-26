/**
 * Dedicated ClinePass adapter plugin. Registers one `dsh-clinepass` route whose
 * catalog is the curated ClinePass model set, and installs the `llm-clinepass`
 * settings section: the Web UI renders it as its own settings page where the
 * API key and every knob are edited, and a change reaches the next request
 * without a restart. The plugin exists because ClinePass needs wire details a
 * generic pi-ai route cannot express: the documented `X-Task-ID` per-request
 * identity, the `cline-pass/<model>` slug space, and a plan/usage surface of
 * its own.
 *
 * DSH 0.1.5/0.1.6 layer the settings document over the composition entry;
 * 0.1.7 edits live configuration fields on the profile entry directly.
 *
 * ```yaml
 * - id: llm-clinepass
 *   name: 'dsh-clinepass'
 *   config:
 *     enabled: true                            # false withdraws the route; the plugin stays mounted
 *     apiKeyEnv: CLINE_API_KEY                 # default
 *     baseURL: https://api.cline.bot/api/v1    # default
 *     refreshMinutes: 60                       # live catalog re-resolution interval
 * ```
 *
 * The credential resolves per request through the credentials seam, falling
 * back to the process environment — the same reference semantics the generic
 * pi-ai adapter uses. The route registers atomically: if another adapter
 * mount already owns `dsh-clinepass`,
 * the refusal is logged with the reason and everything else this plugin does
 * still works.
 *
 * @module dsh-clinepass
 */
import type { Context } from '@deepseek-ai/cordis';
import type { LiveConfig, ClinePassConfig } from './config.ts';
declare module '@deepseek-ai/cordis' {
    interface Events {
        'loader/volatile-update'(paths: readonly (readonly string[])[]): void;
    }
}
export { ClinePassAdapter } from './adapter.ts';
export type { ClinePassAdapterOptions, ClinePassImageAccess, ClineAccountSettlement, ClineCallTrace } from './adapter.ts';
export { DEFAULT_BASE_URL, DISPLAY_NAME, PROVIDER_ID, ClinePassCatalog, discoverCatalogModels, readLiveModelIds, } from './catalog.ts';
export { Config, PlainConfig, assertBaseURL } from './config.ts';
export { assertProxyURL } from './proxy-url.ts';
export type { ClinePassConfig } from './config.ts';
export type { CatalogDiagnostic } from './catalog.ts';
export declare const name = "llm-clinepass";
export declare const inject: string[];
/** Settings namespace this plugin installs and the Web page edits. */
export declare const NS = "llm-clinepass";
/**
 * Register the route, its discovery, the settings section, and their
 * teardown for one mount. Configuration starts as the cordis.yml entry and is
 * replaced by the settings section's resolved value once the settings
 * provider attaches; the adapter re-reads it at every operation.
 */
export declare function apply(ctx: Context, raw?: ClinePassConfig | LiveConfig): void;
