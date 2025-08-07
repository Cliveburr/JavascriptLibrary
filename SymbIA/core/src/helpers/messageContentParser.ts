import { LlmRequestMessage, Message, MessageMemoryModal, MessageModalType, MessageReflectionModal } from '../types';

function isText(message: Message, content: MessageModalType): content is string {
    return message.modal == 'text';
}

function isReflection(message: Message, content: MessageModalType): content is MessageReflectionModal {
    return message.modal == 'reflection';
}

function isMemory(message: Message, content: MessageModalType): content is MessageMemoryModal {
    return message.modal == 'memory';
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
            content: `Reflection: ${message.content.content}`
        };
    }
    else if (isMemory(message, message.content)) {
        return {
            role: message.role,
            content: `# Memories

${message.content.memories.map((m => `- Memory:
    .Key words: ${m.keyWords}
    .VectorId: ${m.vectorId}
    .Content: ${m.content}`)).join('\n\n')}`
        };
    }
    else {
        throw `MessageId ${message._id} has invalid modal ${message.modal}!`;
    }
};