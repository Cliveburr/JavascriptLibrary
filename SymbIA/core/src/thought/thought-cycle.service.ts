import type { IStreamChatContext } from './stream-chat';
import { ReflectionService } from './reflection.service';
import { StallDetectorEngine } from './stall/stall-detector';
import type { ActionService } from '../actions';
import { LlmSetConfig, LlmSetModel } from '../llm';

export class ThoughtCycleService {

    constructor(
        private actionService: ActionService,
        private reflectionService: ReflectionService
    ) { }

    async handle(ctx: IStreamChatContext): Promise<void> {
        const stallDetector = new StallDetectorEngine();
        let progressivelLevel = 0;
        while (true) {

            const llmSetModel = this.progressiveModel(progressivelLevel++, ctx.llmSetConfig);
            let actionName = llmSetModel ?
                await this.reflectionService.reflectOnNextAction(ctx, llmSetModel)
                : undefined;

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

            progressivelLevel = 0;
        }
    }

    private progressiveModel(level: number, llmSetConfig: LlmSetConfig): LlmSetModel | undefined {
        switch (level) {
            case 0:
                return {
                    model: llmSetConfig.models.reasoning.model,
                    provider: llmSetConfig.models.reasoning.provider,
                    temperature: 0.2
                };
        }
    }
}
