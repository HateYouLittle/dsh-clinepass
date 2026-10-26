import { ClinePassCatalog, type CatalogDiagnostic } from './catalog.ts';
import type { ClinePassConfig } from './config-contract.ts';
import type { ProxyTransport } from './proxy.ts';
/** One mount owns discovery; inference, settings and pickers share its snapshots. */
export declare class ClineCatalogManager {
    private readonly options;
    private current;
    constructor(options: {
        transport: ProxyTransport;
        onFallback?: (detail: {
            url: string;
            error: unknown;
            kept: number;
        }) => void;
        onOmitted?: (ids: readonly string[]) => void;
        onRefresh?: () => void;
        onWarning?: (warning: string) => void;
        onDiagnostic?: (event: CatalogDiagnostic) => void;
    });
    forConfig(config: ClinePassConfig): ClinePassCatalog;
}
