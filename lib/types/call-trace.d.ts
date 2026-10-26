import type { ImagePoolObservation } from './conversion/image-pool.ts';
type Outcome = 'completed' | 'failed' | 'aborted' | 'consumer-stopped';
type Stages = Partial<Record<'discovery' | 'credential' | 'images' | 'stream', number>>;
export interface ClineAttemptTrace {
    attempt: number;
    elapsedMs: number;
    stages: Stages;
    outcome: Outcome;
    code?: string;
    httpStatus?: number;
    requestId?: string;
    /** First text, reasoning or tool argument delta, measured from attempt start. */
    firstOutputMs?: number;
    imagePool?: {
        queueWaitMs: number;
        maxActive: number;
        maxQueued: number;
        maxRetainedBytes: number;
        rejected: boolean;
    };
}
/** Safe per-call diagnostics: no transcript, credential, URL or raw session id. */
export interface ClineCallTrace {
    callId: string;
    model: string;
    elapsedMs: number;
    stages: Stages;
    attempts: number;
    attemptDetails: readonly ClineAttemptTrace[];
    outcome: Outcome;
    code?: string;
}
export declare class CallTrace {
    private readonly model;
    private readonly observer?;
    private readonly started;
    readonly callId: `${string}-${string}-${string}-${string}-${string}`;
    readonly stages: ClineCallTrace['stages'];
    attempts: number;
    outcome: ClineCallTrace['outcome'];
    code: string | undefined;
    private readonly details;
    private current;
    private finished;
    constructor(model: string, observer?: ((trace: ClineCallTrace) => void) | undefined);
    startAttempt(): void;
    response(status: number, requestId?: string): void;
    firstOutput(): void;
    imagePool: (value: ImagePoolObservation) => void;
    endAttempt(outcome?: Outcome, code?: string): void;
    measure<T>(stage: keyof ClineCallTrace['stages'], work: () => Promise<T>): Promise<T>;
    finish(): void;
}
export {};
