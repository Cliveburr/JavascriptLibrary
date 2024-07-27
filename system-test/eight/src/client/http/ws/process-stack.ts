
export class ProcessStack<T> {
    public stack: T[];
    private isProcessing: boolean;

    public constructor(
        private process: (item: T) => boolean,
        private interval: number = 1
    ) {
        this.stack = [];
        this.isProcessing = false;
    }

    public push(item: T): void {
        this.stack.push(item);
        this.checkForStart();
    }

    public checkForStart(): void {
        if (!this.isProcessing && this.stack.length > 0) {
            this.isProcessing = true;
            setTimeout(this.innerProcess.bind(this), this.interval);
        }
    }

    public stop(): void {
        this.isProcessing = false;
    }
    
    private innerProcess(): void {
        if (!this.isProcessing) {
            return;
        }
        const item = this.stack.shift();
        if (item) {
            if (!this.process(item)) {
                this.stack.push(item);
            }
        }
        if (this.stack.length > 0) {
            setTimeout(this.innerProcess.bind(this), this.interval);
        }
        else {
            this.isProcessing = false;
        }
    }
}
