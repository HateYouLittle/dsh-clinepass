/** Durable, client-safe intentions. Never put a credential value in this document. */
import { type AccountSettings, type ClineAccount } from './accounts.ts';
export type ClineAccountOperation = {
    id: string;
    kind: 'add';
    account: ClineAccount;
    previousRef: string;
    select: boolean;
} | {
    id: string;
    kind: 'remove';
    account: ClineAccount;
};
export declare function ownsAccountCredential(account: ClineAccount): boolean;
export declare function assertAccountOperations(value: readonly ClineAccountOperation[] | undefined): void;
/** Pending additions remain visible so a lost key write can be repaired or removed. */
export declare function visibleAccountsOf(settings: AccountSettings): readonly ClineAccount[];
/** The same transition completes a foreground operation or a recovered intention. */
export declare function accountOperationPatch(settings: AccountSettings, operation: ClineAccountOperation, dropLegacyRef?: string): ({
    op: "set";
    path: string[];
    value: ClineAccount[];
} | {
    op: "set";
    path: string[];
    value: string;
} | {
    op: "set";
    path: string[];
    value: ClineAccountOperation[];
})[];
