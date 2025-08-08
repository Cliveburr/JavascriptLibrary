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
    const messageContent = message.content;
    switch (message.modal) {
        case 'text':
            if (isText(message, messageContent)) {
                return {
                    role: message.role,
                    content: messageContent
                };
            }
        case 'reflection':
            if (isReflection(message, messageContent)) {
                return {
                    role: message.role,
                    content: `Reflection: ${messageContent.content}`
                };
            }
        case 'memory':
            if (isMemory(message, messageContent)) {

                return {
                    role: message.role,
                    content: `# MemorySearch Result

Explanation: **${messageContent.explanation}**

Memories found:
${messageContent.memories
                            .filter(m => m.vectorId)
                            .map((m => `- Memory:
    .Key Words: ${m.keyWords}
    .VectorId: ${m.vectorId}
    .Content: ${m.content?.value}`)
                            ).join('\n')}
    
Memories NOT FOUND:
${messageContent.memories
                            .filter(m => !m.vectorId)
                            .map((m => `- Memory:
    .Key Words: ${m.keyWords}`)
                            ).join('\n')}`
                };
            }
    }
    throw `MessageId ${message._id} has invalid modal ${message.modal}!`;
};