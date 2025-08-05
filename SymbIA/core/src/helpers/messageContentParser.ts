import { LlmRequestMessage, Message, MessageModalType, MessageReflectionModal } from '../types';

function isText(message: Message, content: MessageModalType): content is string {
    return message.modal == 'text';
}

function isReflection(message: Message, content: MessageModalType): content is MessageReflectionModal {
    return message.modal == 'reflection';
}

export function parseMessageForPrompt(message: Message): LlmRequestMessage {
    if (isText(message, message.content)) {
        return {
            role: message.role,
            content: message.content
        };
    }
    else if (isReflection(message, message.content)) {
        return {
            role: message.role,
            content: `Reflection title: ${message.content.title}\n\n${message.content.content}`
        };
    }
    else {
        throw `MessageId ${message._id} has invalid modal ${message.modal}!`;
    }
};