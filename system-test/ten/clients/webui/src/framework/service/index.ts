export * from './base.service';
export * from './session.service';
export * from './notify.service';
export * from './business.provider';
export * from './store.service';
export * from './websocket/websocket.service';
export * from './loading.service';
export * from './modal.service';

import { SessionService } from './session.service';
import { NotifyService } from './notify.service';
import { StoreService } from './store.service';
import { WebSocketService } from './websocket/websocket.service';
import { LoadingService } from './loading.service';
import { ModalService } from './modal.service';
export const FRAMEWORK_ALL_SERVICE = [
    SessionService,
    NotifyService,
    StoreService,
    WebSocketService,
    LoadingService,
    ModalService
];