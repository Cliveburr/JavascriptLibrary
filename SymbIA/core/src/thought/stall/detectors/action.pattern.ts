import type { IStallDetectorEngine, StallDetectionResult, StallDetector } from '../stall-interfaces';

/**
 * Detects stall based on action execution patterns
 */
export class ActionPatternStallDetector implements StallDetector {
    readonly name = 'ActionPattern';
    readonly enabled = true;

    private readonly minCycleLength = 2;
    private readonly maxCycleLength = 5;

    checkStall(detector: IStallDetectorEngine): StallDetectionResult {
        if (detector.decisionHistory.length < this.minCycleLength * 2) {
            return { isStall: false };
        }

        // Check for cyclical patterns
        for (let cycleLength = this.minCycleLength; cycleLength <= this.maxCycleLength; cycleLength++) {
            if (this.detectCycle(detector.decisionHistory, cycleLength)) {
                return {
                    isStall: true,
                    reason: `Detected cyclical pattern of length ${cycleLength} in actions`
                };
            }
        }

        return { isStall: false };
    }

    private detectCycle(history: string[], cycleLength: number): boolean {
        if (history.length < cycleLength * 2) {
            return false;
        }

        const recentActions = history.slice(-cycleLength * 2);
        const firstHalf = recentActions.slice(0, cycleLength);
        const secondHalf = recentActions.slice(cycleLength);

        return firstHalf.every((action, index) => action === secondHalf[index]);
    }
}