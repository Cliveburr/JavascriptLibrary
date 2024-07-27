
export class LiveReload {

    private rebootClientTimeout: number | undefined;

    public constructor(
        private call: (...args: any[]) => Promise<any>
    ) {
    }

    public start(): Promise<void> {
        return this.call('start');
    }

    private rebootClient(): void {
        console.log('\nRebooting client...\n');

        for (const mod in  window.cache) {
            delete window.cache[mod];
        }

        window.bootClient();
    }

    private flagToRebootClient(): void {
        if (this.rebootClientTimeout) {
            clearTimeout(this.rebootClientTimeout);
        }
        this.rebootClientTimeout = setTimeout(this.rebootClient, 100);
    }

    public reboot(path?: string): void {
        if (path) {
            delete window.contentCache[path];
        }
        this.flagToRebootClient();
    }
}