import { ChatStreamMessage, MessageModalType, MessageReflectionModal } from '../types';

export const contentCast = {

    isText(message: ChatStreamMessage, content: MessageModalType): content is string {
        return message.modal == 'text';
    },

    isReflection(message: ChatStreamMessage, content: MessageModalType): content is MessageReflectionModal {
        return message.modal == 'reflection';
    }

};