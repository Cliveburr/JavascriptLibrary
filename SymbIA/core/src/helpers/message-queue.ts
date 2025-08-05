/**
 * Generic message queue handler that ensures messages are sent in order
 * without blocking the calling function.
 */
export class MessageQueue<T> {
    private queue: T[] = [];
    private isProcessing = false;

    constructor(private messageHandler: (message: T) => Promise<void>) { }

    /**
     * Adds a message to the queue and starts processing if not already running
     */
    add(message: T): void {
        this.queue.push(message);
        this.processQueue();
    }

    /**
     * Processes the queue sequentially, ensuring order is maintained
     */
    private processQueue(): void {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }

        this.isProcessing = true;

        const processNext = (): void => {
            if (this.queue.length === 0) {
                this.isProcessing = false;
                return;
            }

            const message = this.queue.shift()!;
            this.messageHandler(message)
                .finally(() => {
                    processNext();
                });
        };

        processNext();
    }

    /**
     * Returns the current queue length
     */
    get length(): number {
        return this.queue.length;
    }

    /**
     * Returns whether the queue is currently processing
     */
    get processing(): boolean {
        return this.isProcessing;
    }
}
