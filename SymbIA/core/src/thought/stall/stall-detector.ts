import { ActionPatternStallDetector } from './detectors/action.pattern';
import { IterationLimitStallDetector } from './detectors/iteration-limit';
import { RepeatedActionStallDetector } from './detectors/repeated-action';
import { TakingTooLongDetector } from './detectors/taking-too-long';
import type { StallDetectionResult, IStallDetectorEngine, StallDetector } from './stall-interfaces';

/**
 * Registry and management for stall detectors
 */
export class StallDetectorEngine implements IStallDetectorEngine {
    private detectors: StallDetector[] = [
        new RepeatedActionStallDetector(),
        new TakingTooLongDetector(),
        new IterationLimitStallDetector(),
        new ActionPatternStallDetector()
    ];

    public totalIterations = 0;
    public decisionHistory: string[] = [];
    public actionExecutionTimes: number[] = [];
    public actionStartTime = Date.now();
    public actionEndTime = Date.now();

    signalEndOfActionAndDetectStall(actionName: string): StallDetectionResult {
        this.totalIterations++;

        this.actionEndTime = Date.now();
        const executionTime = this.actionEndTime - this.actionStartTime;
        this.actionExecutionTimes.push(executionTime);

        this.decisionHistory.push(actionName);
        // Mantém apenas as últimas 20 decisões para eficiência
        if (this.decisionHistory.length > 20) {
            this.decisionHistory = this.decisionHistory.slice(-20);
        }

        for (const detector of this.detectors) {
            const result = detector.checkStall(this);

            // Return immediately if stall is detected
            if (result.isStall) {
                return result;
            }
        }

        this.actionStartTime = this.actionEndTime;

        return { isStall: false };
    }
}
