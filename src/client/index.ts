/**
 * ClinePass settings plugin, browser half. Registers the "ClinePass"
 * settings page over the `llm-clinepass` namespace: the API key (stored
 * write-only through the credentials domain), the gateway's current model
 * listing, and the adapter knobs behind the page's advanced disclosure. The
 * Host settings and credential contracts stay behind their existing wire APIs.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the shell's SlotMap merge (the 'settings.section' entry).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { SettingsScope } from './settings.ts'
// Type-only: pulls the slot registry Context merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ctx.remote merge (the forwarded credentials event key)
// into this program.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import { ClinePassSection } from './Section.tsx'
import type { ClinePassSectionInjected } from './Section.tsx'
import { ClinePassSectionController, type ClinePassSettings } from './section-controller.ts'
import { en, zh } from './locales.ts'
import type { ClineUsage } from '../usage-contract.ts'
import type { AnalyticsQuery, AnalyticsReport } from '../analytics-contract.ts'
import { clineRemote } from '../remote-contract.ts'
import { registerUsagePill } from './usage.ts'
import { accountCommands, mountSettingsScopes } from './host-compat.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The ClinePass settings page copy. */
    'settings.clinepass': keyof typeof en
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'settings.clinepass'

export type { ClinePassSectionProps } from './Section.tsx'
export type { ClinePassSectionState, ClinePassSettings } from './section-controller.ts'
export { CLINEPASS_NS } from './section-controller.ts'
export type { ClinePassKey } from './locales.ts'

/**
 * Required services (cordis fiber inject). The target slot is declared by
 * ui-settings' apply, whose activation order relative to this one is NOT
 * constrained; registration depends on each slot through `slots.inject()`.
 * `remote.llm` is the discovery namespace the page reads the model listing
 * through.
 */
export const inject = ['slots', 'locale', 'remote', 'remote.credentials', 'remote.llm']

/**
 * Register the section once the `settings.section` declaration is on the
 * ledger, and keep the credential badge fresh on Host-reported key changes
 * written from any surface.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'llm-clinepass: copy dictionaries')
  const modelsReady = ctx.remote.$mount(clineRemote)
  ctx.effect(async () => await modelsReady)
  mountSettingsScopes(ctx, (child, scope) => mountSettings(child, scope, modelsReady))
}

function mountSettings(ctx: ClientContext, scope: SettingsScope<ClinePassSettings>, modelsReady: Promise<unknown>): void {
  const executeAccountCommand = accountCommands(ctx)
  registerUsagePill(ctx, scope, async ref => (await executeAccountCommand({ kind: 'select', ref })) === 'applied')
  // The rows read the plugin's own usage namespace, and a context may only reach
  // a remote namespace it injected. It gets an injection of its own — the way the
  // pill declares it — because the two settings injections above must name
  // exactly the services their host generation provides: a host carrying both
  // service sets would otherwise mount this page twice.
  let readAccount: ((ref: string) => Promise<ClineUsage>) | undefined
  ctx.inject(['remote.clinePassUsage'], ready => {
    readAccount = async ref => {
      const result = await (ready as ClientContext).remote.clinePassUsage.readAccount(ref)
      if (!result.ok) throw result.error
      return result.value
    }
  })
  // Both settings generations share the same cancellable Host endpoint.
  let readAnalytics: ((query: AnalyticsQuery, signal?: AbortSignal) => Promise<AnalyticsReport>) | undefined
  ctx.inject(['remote.clinePassAnalytics'], ready => {
    readAnalytics = async (query, signal) => {
      const result = await (ready as ClientContext).remote.clinePassAnalytics.read(query, signal)
      if (!result.ok) throw result.error
      return result.value
    }
  })
  const controller = new ClinePassSectionController(scope, ctx, async () => {
    await modelsReady
    return ctx.remote.clinePassModels.read()
  }, async ref => {
    await modelsReady
    // A session without the usage namespace cannot read a quota; say so instead
    // of reaching for a context that never injected it.
    if (readAccount === undefined) throw new Error('ClinePass account usage is unavailable in this session')
    return readAccount(ref)
  }, executeAccountCommand, async (query, signal) => {
    if (readAnalytics === undefined) throw Object.assign(new Error('ClinePass analytics is unavailable in this session'), {
      code: 'clinepass/analytics-unavailable', details: { reason: 'no-session-query', retryable: false },
    })
    return readAnalytics(query, signal)
  })
  ctx.effect(() => () => controller.dispose())
  const t = ctx.locale.bind(NS) as ClinePassSectionInjected['t']
  const injected = (): ClinePassSectionInjected => ({ ...controller.inject(), t, getLocale: () => ctx.locale.getLocale().active })

  ctx.effect(() => {
    const refresh = (ref: string): void => { controller.refreshCredential(ref) }
    const dispose = ctx.remote.$on('credentials/reference-updated', refresh)
    /* v8 ignore next -- fiber teardown never runs in unit tests */
    return () => { dispose() }
  }, 'llm-clinepass: pushed credential invalidations')

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'clinepass',
    order: 20,
    label: () => t('nav'),
    inject: injected,
  }, ClinePassSection))
}
