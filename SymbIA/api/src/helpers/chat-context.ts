import type { Response } from 'express';
import { ObjectId } from 'mongodb';
import { ChatContextError, ChatContextData } from './chat-validation';
import { ChatService } from '@symbia/core';
import { IStreamChatContext } from '@symbia/core/src/thought/stream-chat';

export class ChatContext implements IStreamChatContext {

    get memoryId() { return this.data.memoryId; }
    get chatId() { return this.data.chatId; }
    get userMessage() { return this.data.userMessage; }
    get llmSetConfig() { return this.data.llmSetConfig; }
    finalizeIteration: boolean = false;

    constructor(
        private chatService: ChatService,
        public data: ChatContextData,
        private res: Response
    ) {
    }

    static async sendStaticError(res: Response, data: ChatContextError): Promise<void> {
        this.sendStaticErrorFor(res, data.code, data.message, data.error);
    }

    private static sendStaticErrorFor(res: Response, code: number, message: string, error?: any): void {
        // If not error, means that is user error and not system
        if (error) {
            console.error(message, error); //TODO: maybe log in db, future error handler service
        }
        try {
            res.status(code).json(message);
        } catch { }
    }

    sendError(code: number, message: string, error?: any): void {
        ChatContext.sendStaticErrorFor(this.res, code, message, error);
    }

    async sendCompleted(): Promise<void> {
        await this.sendStream({
            type: ChatStreamType.Completed
        });
        this.res.end();
    }

    async sendStreamTitle(content: string): Promise<void> {
        await this.sendStream({
            type: ChatStreamType.StreamTitle,
            chat: {
                title: content
            }
        });
    }

    async sendPrepareMessage(role: MessageRole, modal: MessageModal): Promise<Message> {
        const message = {
            _id: new ObjectId(),
            chatId: new ObjectId(this.data.chatId),
            role,
            content: '',
            modal,
            createdAt: new Date()
        };
        await this.sendStream({
            type: ChatStreamType.PrepareMessage,
            message: {
                messageId: message._id.toString(),
                role,
                modal
            }
        });
        return message;
    }

    sendStreamMessage(content: MessageModalType): Promise<void> {
        return this.sendStream({
            type: ChatStreamType.StreamMessage,
            message: {
                content
            }
        });
    }

    async sendCompleteMessage(message: Message): Promise<void> {

        const savedMessage = await this.saveMessage(message);

        await this.sendStream({
            type: ChatStreamType.CompleteMessage,
            message: {
                messageId: savedMessage._id.toString()
            }
        });
    }

    private async saveMessage(message: Message): Promise<Message> {
        const savedMessage = await this.chatService.saveMessage(message);
        this.data.messages.push(savedMessage);
        return savedMessage;
    }

    private saveMessageFor(role: MessageRole, content: string, modal: MessageModal): Promise<Message> {
        return this.saveMessage({
            _id: new ObjectId(),
            chatId: new ObjectId(this.data.chatId),
            role,
            content,
            createdAt: new Date(),
            modal
        });
    }

    private sendStream(message: ChatStream): Promise<void> {
        return new Promise((resolve, reject) => {
            this.res.write(JSON.stringify(message) + '\n', 'utf8', (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}