import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { type ClinePassCatalog } from './catalog.ts';
import type { ClineModelCatalog } from './models-contract.ts';
/** Uses the same gateway snapshot as the adapter, including models hidden from pickers. */
export declare class ClineModelsService extends TypertRemoteService {
    private readonly options;
    constructor(ctx: Context, options: {
        catalog: () => ClinePassCatalog;
        onRefresh?: () => void;
    });
    read(): Promise<ClineModelCatalog>;
}
