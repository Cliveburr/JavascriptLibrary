import type {
    ChatUserMessage,
    ChatCompletedMessage,
    ChatStartTitleMessage,
    ChatChunkTitleMessage,
    ChatThinkingMessage,
    ChatStartTextMessage,
    ChatChunkTextMessage,
    ChatEndTextMessage
} from './messages';

export type MessageFormat = ChatUserMessage | ChatCompletedMessage | ChatStartTitleMessage | ChatChunkTitleMessage
    | ChatThinkingMessage | ChatStartTextMessage | ChatChunkTextMessage | ChatEndTextMessage;
