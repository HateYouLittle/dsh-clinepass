/**
 * ClinePass settings plugin, browser half. Registers the "ClinePass"
 * settings page over the `llm-clinepass` namespace: the API key (stored
 * write-only through the credentials domain), the gateway's current model
 * listing, and the adapter knobs behind the page's advanced disclosure. The
 * Host settings and credential contracts stay behind their existing wire APIs.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { en } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The ClinePass settings page copy. */
        'settings.clinepass': keyof typeof en;
    }
}
export type { ClinePassSectionProps } from './Section.tsx';
export type { ClinePassSectionState, ClinePassSettings } from './section-controller.ts';
export { CLINEPASS_NS } from './section-controller.ts';
export type { ClinePassKey } from './locales.ts';
/**
 * Required services (cordis fiber inject). The target slot is declared by
 * ui-settings' apply, whose activation order relative to this one is NOT
 * constrained; registration depends on each slot through `slots.inject()`.
 * `remote.llm` is the discovery namespace the page reads the model listing
 * through.
 */
export declare const inject: string[];
/**
 * Register the section once the `settings.section` declaration is on the
 * ledger, and keep the credential badge fresh on Host-reported key changes
 * written from any surface.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
