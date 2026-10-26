/**
 * Public Cline API base. ClinePass serves inference, the model listing, the
 * user document and the plan/usage reads from this one OpenAI-compatible base,
 * so there is no protocol-specific sibling address to select.
 */
export declare const DEFAULT_BASE_URL = "https://api.cline.bot/api/v1";
/**
 * Canonicalize a configured base before any request is constructed: drop
 * trailing slashes, and fold the bare host onto the documented `/api/v1` base
 * so a user who pastes `https://api.cline.bot` still reaches the API.
 * @param baseURL - the configured base URL.
 * @returns the canonical base URL.
 */
export declare function migrateGatewayBaseURL(baseURL: string): string;
