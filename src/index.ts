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

import type { Context } from '@deepseek-ai/cordis'
import { launchEnvironmentOf } from '@deepseek-ai/dsh-launch-environment'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { LlmError, assertUsableApiKey, resolveImageAttachmentAccess } from '@deepseek-ai/dsh-llm'
import type { AdapterRegistrationHandle, LlmModelDiscoveryRequest } from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-fs'
import type {} from '@deepseek-ai/dsh-settings'
import { ClinePassAdapter } from './adapter.ts'
import {
  DISPLAY_NAME,
  PROVIDER_ID,
  discoverCatalogModels,
} from './catalog.ts'
import { Config, readConfig } from './config.ts'
import type { LiveConfig, ClinePassConfig } from './config.ts'
import { ClineUsageService } from './usage.ts'
import { ClineModelsService } from './models.ts'
import {
  ClineAnalyticsService,
  analyticsPriceBook,
  type AnalyticsPersistence,
  type AnalyticsSessionQuery,
} from './analytics.ts'
import { registerClineRemotes } from './remotes.ts'
import { accountsOf, accountRefOf } from './accounts.ts'
import { ClineAccountSelection, type AccountSettingsWriter } from './account-selection.ts'
import { ClineAccountManager } from './account-manager.ts'
import { ClineAccountsService } from './account-service.ts'
import { ProxyTransport } from './proxy.ts'
import { ClineCatalogManager } from './catalog-manager.ts'
import { SETTINGS_NAMESPACE } from './config-contract.ts'
import { installHostSettings, validateClinePassConfig } from './host-settings.ts'

declare module '@deepseek-ai/cordis' {
  interface Events {
    'loader/volatile-update'(paths: readonly (readonly string[])[]): void
  }
}

export { ClinePassAdapter } from './adapter.ts'
export type { ClinePassAdapterOptions, ClinePassImageAccess, ClineAccountSettlement, ClineCallTrace } from './adapter.ts'
export {
  DEFAULT_BASE_URL,
  DISPLAY_NAME,
  PROVIDER_ID,
  ClinePassCatalog,
  discoverCatalogModels,
  readLiveModelIds,
} from './catalog.ts'
export { Config, PlainConfig, assertBaseURL } from './config.ts'
export { assertProxyURL } from './proxy-url.ts'
export type { ClinePassConfig } from './config.ts'
export type { CatalogDiagnostic } from './catalog.ts'

export const name = 'llm-clinepass'
export const inject = ['llm']

/** Settings namespace this plugin installs and the Web page edits. */
export const NS = SETTINGS_NAMESPACE

/**
 * Register the route, its discovery, the settings section, and their
 * teardown for one mount. Configuration starts as the cordis.yml entry and is
 * replaced by the settings section's resolved value once the settings
 * provider attaches; the adapter re-reads it at every operation.
 */
export function apply(ctx: Context, raw?: ClinePassConfig | LiveConfig): void {
  const config = raw && typeof raw.enabled === 'object' ? raw as LiveConfig : Config(raw)
  const entry = readConfig(config)
  // Self-contained misconfiguration fails at load; a bad stored value instead
  // refuses the write through the section's validate hook.
  validateClinePassConfig(entry)
  let current: () => ClinePassConfig = () => readConfig(config)

  const resolveApiKey = async (config: ClinePassConfig = current()): Promise<string | undefined> => {
    // Compare through accountRefOf so a stray empty string keeps the default
    // reference's semantics instead of matching nothing.
    const ref = accountRefOf(config)
    if (!accountsOf(config).some(account => account.apiKeyEnv === ref)) {
      throw new LlmError('ClinePass has no selected account', 'MISSING_CREDENTIAL')
    }
    const credentials = ctx.get('credentials')
    const hit = credentials !== undefined
      ? (await credentials.resolve(credentialRef(ref)))?.value
      // Without the seam the environment is the whole credential plane.
      : launchEnvironmentOf(ctx).get(ref)?.value
    if (hit !== undefined && hit.length > 0) return assertUsableApiKey(hit, name, ref)
    throw new LlmError(
      `llm-clinepass: no credential; the profile resolves ${ref}, which is not set — store ${ref} through the`
      + ' credentials service or export it',
      'MISSING_CREDENTIAL',
    )
  }
  registerClineRemotes(ctx)
  const selection = new ClineAccountSelection(() => current(), ctx.logger)
  const accountManager = new ClineAccountManager(ctx.logger)
  ctx.plugin(ClineAccountsService, { manager: accountManager })
  ctx.inject(['settings', 'credentials'], ready => {
    ready.effect(() => accountManager.connect(ready.settings as unknown as AccountSettingsWriter, ready.credentials))
  })
  const transport = new ProxyTransport()
  ctx.effect(() => () => transport.dispose())
  ctx.plugin(ClineUsageService, {
    baseURL: () => current().baseURL,
    proxyURL: () => current().proxyURL,
    transport,
    resolveApiKey: (ref?: string) => resolveApiKey({ ...current(), apiKeyEnv: ref ?? current().apiKeyEnv }),
    activeRef: () => accountRefOf(current()),
    accountRefs: () => accountsOf(current()).map(account => account.apiKeyEnv),
    lastSwitch: () => selection.lastSwitch(),
  })
  const logger = {
    fallback: ({ url, error }: { url: string; error: unknown; kept: number }): void => {
      ctx.logger.warn(`llm-clinepass: could not refresh ${url}; using last-known model data (${String(error)})`)
    },
    omitted: (ids: readonly string[]): void => {
      ctx.logger.warn(`llm-clinepass: gateway models this build cannot configure: ${ids.join(', ')}`)
    },
  }
  let registration: AdapterRegistrationHandle | undefined
  const catalogs = new ClineCatalogManager({
    transport, onFallback: logger.fallback, onOmitted: logger.omitted,
    onWarning: warning => { ctx.logger.warn(`llm-clinepass: ${warning}`) },
    onDiagnostic: event => { ctx.logger.info(`llm-clinepass: catalog ${JSON.stringify(event)}`) },
    onRefresh: () => { registration?.replace([PROVIDER_ID]) },
  })
  const adapter = new ClinePassAdapter({
    transport,
    catalog: config => catalogs.forConfig(config),
    debugDirectory: () => launchEnvironmentOf(ctx).get('DSH_CLINEPASS_DEBUG_DIR')?.value,
    config: () => current(),
    resolveApiKey,
    onCallTrace: trace => { ctx.logger.debug(`llm-clinepass call: ${JSON.stringify(trace)}`) },
    accountGeneration: () => selection.capture(),
    onAccountSettled: event => { selection.settle(event) },
    imageAccess: {
      resolveAttachments: () => ctx.get('attachments'),
      resolveImageAccess: (attachments, ref) => resolveImageAttachmentAccess(
        attachments,
        hostPath => ctx.get('fs')?.processPathFromHostPath(hostPath),
        ref,
      ),
    },
    onReplayDegrade: (reason) => {
      ctx.logger.warn(`llm-clinepass: unusable replay state on assistant history; sending provider-neutral content (${reason})`)
    },
  })
  ctx.plugin(ClineModelsService, {
    catalog: () => catalogs.forConfig(current()),
    onRefresh: () => { registration?.replace([PROVIDER_ID]) },
  })
  const sessionQueryOf = (): AnalyticsSessionQuery | undefined =>
    (ctx as unknown as { get(name: string): unknown }).get('sessionQuery') as AnalyticsSessionQuery | undefined
  // The durable session index is optional: a Host without it leaves the
  // analytics service on the in-process cache and re-reads after a restart.
  const sessionPersistenceOf = (): AnalyticsPersistence | undefined =>
    (ctx as unknown as { get(name: string): unknown }).get('sessionPersistence') as AnalyticsPersistence | undefined
  ctx.plugin(ClineAnalyticsService, {
    query: sessionQueryOf,
    persistence: sessionPersistenceOf,
    // Review P14 (core half): the price book omits cost for models whose
    // upstream cost block is missing or malformed (ModelDetails.costKnown ===
    // false), so their requests are reported unpriced instead of silently
    // priced at 0; a published block with legal components stays priced even
    // when all of its rates are zero.
    pricing: async () => analyticsPriceBook(await catalogs.forConfig(current()).snapshot()),
  })
  const pickerVisibilityOf = (): string => JSON.stringify(current().modelVisibility ?? {})
  let pickerVisibility = pickerVisibilityOf()
  /**
   * Register the route while the switch is on and its credential resolves, and
   * drop it when either says no. A route with no key would otherwise sit in
   * every model picker and read as a usable provider to first-run onboarding —
   * the dormancy llm-pi-ai keeps by resolving zero routes until configured.
   * Without the credentials seam the environment answers synchronously, so
   * registration is too.
   *
   * Nothing else is torn down with the route: model discovery, the settings
   * section, and the credentials listener all stay mounted, so the page that
   * owns the switch stays reachable to turn it back on.
   */
  const applyRoute = (configured: boolean): void => {
    if (configured && current().enabled && registration === undefined) {
      try {
        registration = ctx.llm.registerAdapter([PROVIDER_ID], adapter)
        ctx.logger.info(`llm-clinepass: route "${PROVIDER_ID}" registered as ${DISPLAY_NAME}`)
      } catch (error: unknown) {
        // A duplicate mount may already own our namespaced route. The refusal names the route;
        // discovery still registers below, and everything else about the
        // mount keeps working.
        ctx.logger.error(`llm-clinepass: not registering the "${PROVIDER_ID}" route (${String(error)})`)
      }
    } else if ((!configured || !current().enabled) && registration !== undefined) {
      registration()
      registration = undefined
      if (!current().enabled) {
        ctx.logger.info('llm-clinepass: disabled by configuration; the route and its models are withdrawn')
      }
    }
  }
  let routeCheck = 0
  let selectedRef = accountRefOf(current())
  const syncRoute = (): void => {
    accountManager.trigger()
    const check = ++routeCheck
    const config = current()
    selection.capture()
    const visibility = pickerVisibilityOf()
    if (pickerVisibility !== visibility) {
      pickerVisibility = visibility
      // Replacing the owned route notifies every session picker without a restart.
      registration?.replace([PROVIDER_ID])
    }
    const credentials = ctx.get('credentials')
    const selected = accountRefOf(config)
    // A stored selection outranks the gateway's last rejection of it: choosing an
    // account back must try it again rather than skip it for the whole window.
    if (selected !== selectedRef) {
      selectedRef = selected
      adapter.forgetRejectedKey(selected)
    }
    const refs = accountsOf(config).filter(account => config.autoSwitch || account.apiKeyEnv === selected)
      .map(account => account.apiKeyEnv)
    if (credentials === undefined) {
      applyRoute(refs.some(ref => Boolean(launchEnvironmentOf(ctx).get(ref)?.value)))
      return
    }
    void Promise.all(refs.map(ref => credentials.describe(credentialRef(ref))))
      .then((infos) => { if (check === routeCheck) applyRoute(infos.some(info => info.configured)) })
      .catch((error: unknown) => {
        ctx.logger.error(`llm-clinepass: credential describe failed; keeping the previous route state (${String(error)})`)
      })
  }
  syncRoute()
  let undiscover: () => void = () => {}
  try {
    undiscover = ctx.llm.registerModelDiscovery(name, async (request: LlmModelDiscoveryRequest) => {
      if (request.provider !== PROVIDER_ID
        && !(request.baseURL ?? '').includes('api.cline.bot')) {
        throw new LlmError(
          'llm-clinepass discovers only Cline zen/go endpoints; enter this provider\'s models by hand',
          'DISCOVERY_UNSUPPORTED',
        )
      }
      return discoverCatalogModels(catalogs.forConfig(current()))
    })
  } catch (error: unknown) {
    // A duplicate mount may already own our discovery registration — the same
    // refusal the route registration above absorbs. The surviving mount keeps
    // serving discovery, and everything else this mount does keeps working.
    ctx.logger.error(`llm-clinepass: not registering model discovery for "${name}" (${String(error)})`)
  }
  ctx.effect(() => () => {
    /* v8 ignore start -- plugin unload never runs in tests: no Context disposal API is exercised */
    registration?.()
    registration = undefined
    undiscover()
    /* v8 ignore stop */
  })
  installHostSettings(ctx, entry, {
    connect: settings => selection.connect(settings),
    setSource: source => { current = source },
    onChange: syncRoute, recover: () => accountManager.trigger(),
  })
  // The event is absent on older Loaders; registering it is harmless there.
  ctx.on('loader/volatile-update', syncRoute)
  // A key stored or removed anywhere — the settings page's write-only control
  // included — flips the route's presence; the event names the reference.
  ctx.inject(['credentials'], (credentialsCtx) => {
    credentialsCtx.on('credentials/reference-updated', (ref) => {
      accountManager.trigger()
      // A stored change to a reference outranks the gateway's last rejection
      // of it, so the very next request re-checks the new key.
      adapter.forgetRejectedKey(ref)
      if (accountsOf(current()).some(account => account.apiKeyEnv === ref)) { selection.credentialChanged(); syncRoute() }
    })
    // The seam becomes visible only once its provider is active, which can be
    // after this plugin applied: the boot-time call above then found no seam
    // and fell back to the environment. Sync again here so a credential
    // already stored in the seam registers the route at boot instead of
    // waiting for its next write.
    syncRoute()
  })
}
