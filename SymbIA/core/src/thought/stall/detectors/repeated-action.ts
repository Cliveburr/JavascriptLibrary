import type { StallDetectionResult, StallDetector, IStallDetectorEngine } from '../stall-interfaces';

/**
 * Detects stall when the same action is repeated multiple times
 */
export class RepeatedActionStallDetector implements StallDetector {
    private readonly threshold = 3;

    checkStall(detector: IStallDetectorEngine): StallDetectionResult {
        if (detector.decisionHistory.length < this.threshold) {
            return { isStall: false };
        }

        const lastDecisions = detector.decisionHistory.slice(-this.threshold);
        const allSame = lastDecisions.every(decision => decision === lastDecisions[0]);

        if (allSame) {
            return {
                isStall: true,
                reason: `Same action '${lastDecisions[0]}' repeated ${this.threshold} times`
            };
        }

        return { isStall: false };
    }
}
