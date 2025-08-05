import type { Request, Response } from 'express';
import { ChatService, LlmSetConfig, LlmSetService, Message } from '@symbia/core';
import { z } from 'zod';

const sendMessageSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    chatId: z.string().optional(),
    llmSetId: z.string().min(1, 'LLM Set ID is required')
});

const chatParamsSchema = z.object({
    memoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid memory ID format')
});

export interface ChatContextData {
    memoryId: string;
    userMessage: string;
    userId: string;
    isNewChat: boolean;
    chatId: string;
    orderIndex: number;
    messages: Array<Message>;
    llmSetConfig: LlmSetConfig;
}

export interface ChatContextError {
    isError: boolean;
    code: number;
    message: string;
    error?: any;
}

export const chatValidation = {
    isError(result: ChatContextData | ChatContextError): result is ChatContextError {
        return (result as ChatContextError).isError;
    },
    async validate(chatService: ChatService, llmSetService: LlmSetService, req: Request): Promise<ChatContextData | ChatContextError> {
        return validateChat(chatService, llmSetService, req);
    }
};

async function validateChat(chatService: ChatService, llmSetService: LlmSetService, req: Request): Promise<ChatContextData | ChatContextError> {
    try {
        // Validate params request
        const paramsResult = chatParamsSchema.safeParse(req.params);
        if (!paramsResult.success) {
            return {
                isError: true,
                code: 400,
                message: 'Invalid parameters',
                error: paramsResult.error.errors
            };
        }
        const { memoryId } = paramsResult.data;

        // Validate body request
        const bodyResult = sendMessageSchema.safeParse(req.body);
        if (!bodyResult.success) {
            return {
                isError: true,
                code: 400,
                message: 'Invalid request body',
                error: bodyResult.error.errors
            };
        }
        const { content: userMessage, chatId: chatIdParam, llmSetId } = bodyResult.data;

        // Validate the authentication
        const userId = req.user?.id;
        if (!userId) {
            return {
                isError: true,
                code: 401,
                message: 'User not authenticated'
            };
        }

        // Validate the chatId
        let isNewChat: boolean = false;
        let chatId: string;
        let orderIndex: number = 0;
        let messages: Array<Message>;
        if (chatIdParam) {
            const chat = await chatService.getChatById(chatIdParam);
            if (!chat) {
                return {
                    isError: true,
                    code: 404,
                    message: 'Chat não encontrado'
                };
            }
            chatId = chat._id.toString();
            orderIndex = chat.orderIndex;
            messages = await chatService.getMessagesByChat(chatId);
        } else {
            isNewChat = true;
            const newChat = await chatService.createChat(userId, memoryId, 'Novo Chat');
            chatId = newChat._id.toString();
            orderIndex = newChat.orderIndex;
            messages = [];
        }

        // Validate llmSetConfig
        const llmSetConfig = await llmSetService.getLlmSetById(llmSetId);
        if (!llmSetConfig) {
            return {
                isError: true,
                code: 404,
                message: `LLM set '${llmSetId}' not found`
            };
        }

        return {
            memoryId,
            userMessage,
            userId,
            isNewChat,
            chatId,
            orderIndex,
            messages,
            llmSetConfig
        };
    }
    catch (error) {
        return {
            isError: true,
            code: 500,
            message: 'Internal error',
            error
        };
    }
}