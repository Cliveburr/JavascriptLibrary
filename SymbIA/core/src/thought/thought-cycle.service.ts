import type { ThoughtContext } from './thought-context';
import type { ReflectionService } from './reflection.service';
import type { ActionService } from '../actions';
import { StallDetectorEngine } from './stall/stall-detector';

export class ThoughtCycleService {

    constructor(
        private actionService: ActionService,
        private reflectionService: ReflectionService
    ) { }

    async handle(ctx: ThoughtContext): Promise<void> {
        const stallDetector = new StallDetectorEngine();
        while (true) {

            let actionName = await this.reflectionService.reflectOnNextAction(ctx);
            if (!actionName) {
                ctx.sendError(500, 'Relection return undefined!');
                return;
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

        // se tiver test, agendar test para rodar
    }
}
