
export type NotifyType =
    'success' |
    'info' |
    'warning' |
    'danger';

export interface NotifyMessage {
    type: NotifyType,
    content: string,
    timeout?: number
    timeoutsub?: number;
}