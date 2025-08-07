import type { IChatContext, LlmRequestMessage, Message, MessageReflectionModal } from '../types/index';
import { LlmGateway } from '../llm/LlmGateway';
import type { ActionService } from '../actions/action.service';
import type { ActionHandler } from '../actions/act-defs';
import { parseXml, parseMessageForPrompt, MessageQueue } from '../helpers/index';

enum ReflectionStage {
    Undefined,
    Title,
    Content,
    Action
}

interface ReflectionContext {
    stage: ReflectionStage;
    chatCtx: IChatContext;
    message: Message;
    content: MessageReflectionModal;
    parser: (content: string) => void,
    messageQueue: MessageQueue<MessageReflectionModal>;
}

export class ReflectionService {
    constructor(
        private actionService: ActionService,
        private llmGateway: LlmGateway
    ) { }

    async reflectNextAction(chatCtx: IChatContext): Promise<string> {
        console.log('Reflecting...');

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

        let action = '';

        const ctx: ReflectionContext = {
            stage: ReflectionStage.Undefined,
            chatCtx,
            message,
            content,
            //parser: parseMarkdown(responseSections),
            parser: parseXml([
                {
                    tag: 'title', callback: (content) => {
                        ctx.content.title += content;
                        ctx.messageQueue.add({
                            title: content,
                            content: ''
                        });
                    }
                },
                {
                    tag: 'reflection', callback: (content) => {
                        ctx.content.content += content;
                        ctx.messageQueue.add({
                            title: '',
                            content: content
                        });
                    }
                },
                {
                    tag: 'action', callback: (content) => {
                        action += content;
                    }
                }
            ]),
            messageQueue: new MessageQueue<MessageReflectionModal>(chatCtx.sendStreamMessage.bind(chatCtx))
        };

        const messages = this.buildReflectionPrompt(ctx.chatCtx.messages, actions);
        //messages.forEach(m => console.log(`${m.role}: ${m.content}`));

        // Call LLM to get decision using the LLM set configuration
        const response = await this.llmGateway.invokeAsync(
            ctx.chatCtx.llmSetConfig.models.reasoningHeavy,
            messages,
            //this.parseStream.bind(this, ctx),
            ctx.parser,
            {
                temperature: 0.2, // Low temperature for consistent decisions
                maxTokens: 200, // Short response expected
            }
        );
        //console.log(response.content);
        //TODO: criar uns 3 o umais tipos de reflexão que vai aumentando o grau da reflexão se não retornar uma action

        if (response.usage) {
            message.promptTokens = response.usage.promptTokens;
            message.completionTokens = response.usage.completionTokens;
        }
        await chatCtx.sendCompleteMessage(message);

        console.log('End of Reflection!');
        //return ctx.action || 'Finalize';
        return action;
    }

    // private parseStream(ctx: ReflectionContext, content: string): void {

    //     ctx.parser(content);

    // }

    private buildReflectionPrompt(messages: Message[], actions: ActionHandler[]): Array<LlmRequestMessage> {
        const history = messages
            .map(msg => parseMessageForPrompt(msg));

        const systemPrompt = `You are an AI assistant that reflects on the user's message and selects exactly one action to satisfy the user's request.

Available Actions

${actions.map(a => `- ${a.name}
  ${a.whenToUse}`).join('\n')}

CRUCIAL RULES

1. You MUST output exactly three XML-like tags in this exact order:
   <title>...</title>
   <reflection>...</reflection>
   <action>...</action>

2. Do NOT output anything outside these three tags.

3. Title: Short, ≤ 10 words, summarizes your reflection.

4. Reflection: Concise reasoning, ≤ 150 words, why this action is the best choice.

5. Action: Must be exactly one of listed above.

6. Never add explanations, markdown, or other commentary outside the required tags.`;

        // Obey **exactly** this output format:
        // ##Title: a short sentence (≤ 10 words) about the reflection
        // ##Reflection: a concise sentence (≤ 150 words) explaining why this action is best
        // ##Action: EXACT action name here`;

        // <title>a short sentence (≤ 10 words) about the reflection</title>
        // <reflection>a concise sentence (≤ 150 words) explaining why this action is best</reflection>
        // <action>EXACT action name here</action>`;

        return [
            { role: 'system', content: systemPrompt },
            ...history,
        ];
    }
}
