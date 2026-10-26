/**
 * Capability, cost and protocol configuration for the curated ClinePass catalog.
 *
 * Cline publishes no per-model capability document and no online provider
 * record describes the ClinePass ids, so every field comes from the shipped
 * table in `clinepass-models.ts`. This module only adapts that table to the
 * shapes the catalog and analytics consume, and resolves the configured base
 * URL for a protocol.
 */
import type { Api, Model } from './sdk-types.ts';
import { type ClineModel } from './models-contract.ts';
/** Lifecycle and capability data the curated catalog adds to the model records. */
export type ModelDetails = Pick<ClineModel, 'deprecated' | 'releaseDate' | 'inputModalities'> & {
    /**
     * Present only when no usable cost is published, which makes the zeros in
     * `model.cost` indistinguishable from a genuinely free model, so analytics
     * must treat the model as unpriced instead of pricing it at 0. The curated
     * table always carries measured rates (free rows are genuinely 0), so it
     * never sets this flag.
     */
    readonly costKnown?: false;
};
export interface ModelMetadata {
    readonly models: ReadonlyMap<string, Model<Api>>;
    readonly details: ReadonlyMap<string, ModelDetails>;
    readonly errors: ReadonlyMap<string, string>;
}
/**
 * The configured base for one protocol.
 *
 * Cline serves inference, the model listing and the account reads from the one
 * OpenAI-compatible base, so no protocol gets a sibling address. The only
 * rewrite left is the trailing `/v1` fold for anthropic-messages: that SDK
 * appends `/v1/messages` to whatever base it is given, so keeping the `/v1`
 * would produce `/api/v1/v1/messages`.
 *
 * @param api - the wire protocol the model streams with.
 * @param baseURL - the configured Cline base URL.
 * @returns the base URL to hand the SDK for this protocol.
 */
export declare function modelBaseURL(api: Api, baseURL: string): string;
/**
 * Build the catalog's configuration from the shipped table.
 *
 * The returned map is the whole membership base: the gateway listing can only
 * add diagnostics, never models. `errors` stays empty because a curated entry
 * is validated by its type and the test suite rather than at runtime; the map
 * is kept because the catalog and analytics consume its shape.
 *
 * @param baseURL - the configured Cline base URL.
 * @returns model records, per-model details, and per-model configuration errors.
 */
export declare function curatedModelMetadata(baseURL: string): ModelMetadata;
