import type { StallDetector, IStallDetectorEngine, StallDetectionResult } from '../stall-interfaces';

/**
 * Detects stall when too many iterations occur
 */
export class IterationLimitStallDetector implements StallDetector {

    private readonly maxIterations = 20;

    checkStall(detector: IStallDetectorEngine): StallDetectionResult {
        if (detector.totalIterations >= this.maxIterations) {
            return {
                isStall: true,
                reason: `Exceeded maximum iterations (${this.maxIterations})`
            };
        }

        return { isStall: false };
    }
}
