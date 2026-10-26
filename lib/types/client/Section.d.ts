/**
 * The ClinePass settings page: provider activation, accounts and credentials,
 * available models and capacities, then advanced tuning. Account operations
 * apply immediately; tuning fields use the page's save/discard actions.
 */
import type { InjectFace } from '@deepseek-ai/dsh-client-ui-slots';
import type { ClinePassSectionFace } from './section-controller.ts';
import type { en } from './locales.ts';
export type { ClinePassSectionState } from './section-controller.ts';
/** Section copy lookup, including the optional `{name}` template params. */
type SectionTranslate = (key: keyof typeof en, params?: Record<string, unknown>) => string;
/** Injected dependencies of {@link ClinePassSection} (slot `inject`). */
export interface ClinePassSectionInjected extends ClinePassSectionFace {
    /** Section copy. */
    t: SectionTranslate;
    /** Read at render time because the Host caches injected values across locale changes. */
    getLocale?: () => string;
}
/** Props delivered by the slot outlet: the inject face spread flat. */
export type ClinePassSectionProps = Partial<InjectFace<ClinePassSectionInjected>>;
/**
 * Render the ClinePass settings page.
 * @param props - locale copy, the page snapshot, and its form actions.
 * @returns the section.
 */
export declare function ClinePassSection(props: ClinePassSectionProps): import("react").JSX.Element | null;
