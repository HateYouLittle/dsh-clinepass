import type { Api, Model, ModelThinkingLevel, ThinkingBudgets } from './sdk-types.ts';
import type { ThinkingBudgetRange } from './models-contract.ts';
/** Expose budgets only when the SDK knows where to serialize a numeric limit. */
export declare function supportsThinkingBudget(api: Api, compat: Model<Api>['compat']): boolean;
export declare function reasoningBudgetRange(model: Model<Api>): ThinkingBudgetRange | undefined;
/**
 * Fill the one reasoning control a catalog entry cannot carry itself.
 *
 * Cline's endpoint is OpenAI-compatible, and every curated entry ships its own
 * verified `thinkingLevelMap`, so the picker reads the shipped controls
 * directly. An Anthropic-messages entry (reachable only through a future
 * protocol override) still needs the native budget control the SDK represents
 * as a token budget rather than an effort.
 */
export declare function withGatewayReasoning(model: Model<Api>): Model<Api>;
export declare function reasoningChoices(model: Model<Api>): readonly {
    id: string;
    name: string;
}[];
export type ReasoningIntent = {
    kind: 'default';
} | {
    kind: 'off';
} | {
    kind: 'on';
} | {
    kind: 'effort';
    level: Exclude<ModelThinkingLevel, 'off'>;
} | {
    kind: 'budget';
    tokens: number;
    min: number;
};
/** Called after validation against the model's choices. */
export declare function reasoningIntent(model: Model<Api>, level: string | undefined): ReasoningIntent;
/**
 * The SDK serializes explicit choices. Default must leave all thinking controls
 * to the service; a switch's On must not acquire an invented effort spelling.
 */
export declare function reasoningRequest(intent: ReasoningIntent): {
    reasoning?: Exclude<ModelThinkingLevel, 'off'>;
    thinkingBudgets?: ThinkingBudgets;
    onPayload: (payload: unknown) => unknown;
};
