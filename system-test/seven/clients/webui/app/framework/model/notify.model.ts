

export enum NotifyType {
    AlertSuccess,
    AlertInfo,
    AlertWarning,
    AlertDanger
}

export class NotifyMessage {

    public constructor(
        public type: NotifyType,
        public htmlText: string | null,
        public timeout?: number
    ) {
    }

    public get getTimeout(): number {
        return this.timeout ?? 0;
    }

    public get typeText(): string {
        switch (this.type) {
            case NotifyType.AlertInfo: return 'info';
            case NotifyType.AlertWarning: return 'warning';
            case NotifyType.AlertDanger: return 'danger';
            default: return 'success';
        }
    }
}