import type { StallDetector, StallDetectionResult, IStallDetectorEngine } from '../stall-interfaces';

/**
 * Detects stall when execution takes too long
 */
export class TakingTooLongDetector implements StallDetector {

    private readonly maxDurationMs = 5 * 60 * 1000; // 5 minutes

    checkStall(detector: IStallDetectorEngine): StallDetectionResult {
        const elapsedMs = detector.actionExecutionTimes[detector.actionExecutionTimes.length - 1] || 0;

        if (elapsedMs > this.maxDurationMs) {
            return {
                isStall: true,
                reason: `Thought cycle exceeded maximum duration of ${this.maxDurationMs}ms`
            };
        }

        return { isStall: false };
    }
}