import type { IChatContext, LlmRequestMessage, Message, MessageModalType, MessageReflectionModal } from '../types/index';
import { LlmGateway } from '../llm/LlmGateway';
import type { ActionService } from '../actions/action.service';
import type { ActionHandler } from '../actions/act-defs';
import { parseMarkdown, parseMessageForPrompt, MessageQueue } from '../helpers/index';

enum ReflectionStage {
    Undefined,
    Title,
    Content,
    Action
}

const responseSections = [
    { text: '### Title: ', name: 'title' },
    { text: '### Reflection: ', name: 'content' },
    { text: '### Action: ', name: 'action' }
] as const;

interface ReflectionContext {
    stage: ReflectionStage;
    chatCtx: IChatContext;
    message: Message;
    content: MessageReflectionModal;
    parser: (content: string) => {
        title: string;
        content: string;
        action: string;
    };
    action?: string;
    messageQueue: MessageQueue<MessageModalType>;
}

export class ReflectionService {
    constructor(
        private actionService: ActionService,
        private llmGateway: LlmGateway
    ) { }

    async reflectNextAction(chatCtx: IChatContext): Promise<string> {

        const actions = this.actionService.getActions();
        if (actions.length === 0) {
            throw 'No actions are available';
        }

        const message = await chatCtx.sendPrepareMessage('assistant', 'reflection');
        const content: MessageReflectionModal = {
            title: '',
            content: ''
        };
        message.content = content;

        const ctx: ReflectionContext = {
            stage: ReflectionStage.Undefined,
            chatCtx,
            message,
            content,
            parser: parseMarkdown(responseSections),
            messageQueue: new MessageQueue(chatCtx.sendStreamMessage.bind(chatCtx))
        };

        const messages = this.buildReflectionPrompt(ctx.chatCtx.messages, actions);
        //messages.forEach(m => console.log(`${m.role}: ${m.content}`));

        // Call LLM to get decision using the LLM set configuration
        const response = await this.llmGateway.invokeAsync(
            ctx.chatCtx.llmSetConfig.models.reasoningHeavy,
            messages,
            this.parseStream.bind(this, ctx),
            {
                temperature: 0.2, // Low temperature for consistent decisions
                maxTokens: 50, // Short response expected
            }
        );
        //console.log(response.content);
        //TODO: ir diminuindo a temperatura progressivamente e a precisão

        if (response.usage) {
            message.promptTokens = response.usage.promptTokens;
            message.completionTokens = response.usage.completionTokens;
            message.totalTokens = response.usage.totalTokens;
        }
        await chatCtx.sendCompleteMessage(message);

        return ctx.action || 'Finalize';
    }

    private parseStream(ctx: ReflectionContext, content: string): void {

        const parsed = ctx.parser(content);
        let needSend = false;

        if (parsed.title.length > 0) {
            ctx.content.title += parsed.title;
            needSend = true;
        }
        if (parsed.content.length > 0) {
            ctx.content.content += parsed.content;
            needSend = true;
        }
        if (parsed.action.length > 0) {
            ctx.action += parsed.action;
        }

        if (needSend) {
            ctx.content.title += parsed.title;
            ctx.content.content += parsed.content;

            ctx.messageQueue.add({
                title: parsed.title,
                content: parsed.content
            });
        }
    }

    private buildReflectionPrompt(messages: Message[], actions: ActionHandler[]): Array<LlmRequestMessage> {
        const history = messages
            .map(msg => parseMessageForPrompt(msg));

        const systemPrompt = `You are an AI assistant that must reflect on what the user is saying and decide which actions to take to satisfy the user.

Available Actions

${actions.map(a => `- ${a.name}
  ${a.whenToUse}`).join('\n')}

Obey **exactly** this output format:
### Title: a short sentence (≤ 10 words) about the reflection
### Reflection: a concise sentence (≤ 150 words) explaining why this action is best
### Action: EXACT action name here`;

        return [
            { role: 'system', content: systemPrompt },
            ...history,
        ];
    }
}
