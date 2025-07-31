import type { ChatUserMessage, ChatCompletedMessage, ChatFirstTitleMessage, ChatChunkTitleMessage, ChatThikingMessage } from './messages';

export type MessageFormat = ChatUserMessage | ChatCompletedMessage | ChatFirstTitleMessage | ChatChunkTitleMessage
    | ChatThikingMessage;
