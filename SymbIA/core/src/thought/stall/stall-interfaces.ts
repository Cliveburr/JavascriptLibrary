
export interface IStallDetectorEngine {
    decisionHistory: string[];
    actionExecutionTimes: number[];
    totalIterations: number;
    actionStartTime: number;
    lastActionError?: Error;
    signalEndOfActionAndDetectStall(actionName: string): StallDetectionResult;
}

export interface StallDetector {
    checkStall(context: IStallDetectorEngine): StallDetectionResult;
}

export interface StallDetectionResult {
    isStall: boolean;
    reason?: string;
}
