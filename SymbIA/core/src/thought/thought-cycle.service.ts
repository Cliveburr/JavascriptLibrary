import type { IChatContext } from '../types/chat-types.js';
import { ReflectionService } from './reflection.service.js';
import { StallDetectorEngine } from './stall/stall-detector.js';
import type { ActionService } from '../actions/action.service.js';

export class ThoughtCycleService {

    constructor(
        private actionService: ActionService,
        private reflectionService: ReflectionService
    ) { }

    async handle(ctx: IChatContext): Promise<void> {
        const stallDetector = new StallDetectorEngine();
        while (true) {

            let actionName = await this.reflectionService.reflectNextAction(ctx);

            //TODO: criar uns 3 o umais tipos de reflexão que vai aumentando o grau da reflexão se não retornar uma action
            if (!actionName) {
                console.warn('Relection return undefined!');
                actionName = 'Reply';
            }

            await this.actionService.executeAction(actionName, ctx);
            if (ctx.finalizeIteration) {
                break;
            }

            const stallCheck = stallDetector.signalEndOfActionAndDetectStall(actionName);
            if (stallCheck.isStall) {
                ctx.sendError(500, stallCheck.reason || 'Stall detected');
                console.warn(`Stall detected: ${stallCheck.reason}`);
                break;
            }

            //TODO: serviço para resumir as mensagens
        }
    }
}
