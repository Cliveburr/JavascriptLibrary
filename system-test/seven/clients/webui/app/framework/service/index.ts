export * from './store.service';
export * from './notify.service';
export * from './base.service';
export * from './localize.service';
export * from './value-formatter.service';
export * from './loading.service';
export * from './websocket.service';
export * from './session.service';

import { StoreService } from './store.service';
import { NotifyService } from './notify.service';
import { LocalizeService } from './localize.service';
import { ValueFormatterService } from './value-formatter.service';
import { LoadingService } from './loading.service';
import { WebSocketService } from './websocket.service';
import { SessionService } from './session.service';
export const FRAMEWORK_ALL_SERVICE = [
    StoreService,
    NotifyService,
    LocalizeService,
    ValueFormatterService,
    LoadingService,
    WebSocketService,
    SessionService
]