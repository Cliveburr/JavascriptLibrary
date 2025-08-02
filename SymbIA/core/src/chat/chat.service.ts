import { ObjectId } from 'mongodb';
import type { Chat, Message, LlmRequest, LlmSetConfig } from '../types/index.js';
import { MongoDBService } from '../database/mongodb.service.js';
import { LlmGateway } from '../llm/LlmGateway.js';
import { LlmSetService } from '../llm/llm-set.service.js';

export class ChatService {
    constructor(
        private mongoService: MongoDBService,
        private llmGateway: LlmGateway,
        private llmSetService: LlmSetService
    ) { }

    async createChat(userId: string, memoryId: string, title: string): Promise<Chat> {
        await this.mongoService.connect();
        const memoriesCollection = this.mongoService.getMemoriesCollection();
        const chatsCollection = this.mongoService.getChatsCollection();

        const memory = await memoriesCollection.findOne({
            _id: new ObjectId(memoryId),
            userId: new ObjectId(userId)
        });
        if (!memory) {
            throw 'Invalid memoryId'; // User trying to access other memories
        }

        const orderIndex = (await chatsCollection.countDocuments()) + 1;

        const chatId = new ObjectId();
        const now = new Date();

        const chat: Chat = {
            _id: chatId,
            memoryId: new ObjectId(memoryId),
            title,
            orderIndex,
            createdAt: now,
            updatedAt: now
        };

        await chatsCollection.insertOne(chat);
        return chat;
    }

    async getChatsByMemory(memoryId: string): Promise<Chat[]> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        const chats = await chatsCollection
            .find({ memoryId: new ObjectId(memoryId) })
            .sort({ orderIndex: 1 })
            .toArray();

        return chats;
    }

    async getChatById(chatId: string): Promise<Chat | null> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId) });
        return chat || null;
    }

    async updateChatTitle(chatId: string, title: string): Promise<Chat | null> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        const result = await chatsCollection.findOneAndUpdate(
            { _id: new ObjectId(chatId) },
            {
                $set: {
                    title: title.substring(0, 60), // Limitar a 60 caracteres
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        return result || null;
    }

    async updateChatOrder(chatId: string, newOrderIndex: number): Promise<Chat | null> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        // Primeiro, buscar o chat para obter o memoryId
        const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId) });
        if (!chat) return null;

        // Reorganizar os outros chats na mesma memória
        const chatsInMemory = await chatsCollection
            .find({ memoryId: chat.memoryId })
            .sort({ orderIndex: 1 })
            .toArray();

        // Remover o chat da lista atual
        const otherChats = chatsInMemory.filter((c: Chat) => c._id.toString() !== chatId);

        // Inserir o chat na nova posição
        otherChats.splice(newOrderIndex, 0, chat);

        // Atualizar os índices de todos os chats
        const bulkOps = otherChats.map((c: Chat, index: number) => ({
            updateOne: {
                filter: { _id: c._id },
                update: {
                    $set: {
                        orderIndex: index,
                        updatedAt: new Date()
                    }
                }
            }
        }));

        if (bulkOps.length > 0) {
            await chatsCollection.bulkWrite(bulkOps);
        }

        // Retornar o chat atualizado
        return await chatsCollection.findOne({ _id: new ObjectId(chatId) });
    }

    async deleteChat(chatId: string): Promise<boolean> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();
        const messagesCollection = this.mongoService.getMessagesCollection();

        // Deletar mensagens associadas
        await messagesCollection.deleteMany({ chatId: new ObjectId(chatId) });

        // Deletar o chat
        const result = await chatsCollection.deleteOne({ _id: new ObjectId(chatId) });
        return result.deletedCount === 1;
    }

    async saveMessage(message: Message): Promise<Message> {
        await this.mongoService.connect();
        const messagesCollection = this.mongoService.getMessagesCollection();

        await messagesCollection.insertOne(message);
        return message;
    }

    async getMessagesByChat(chatId: string): Promise<Message[]> {
        await this.mongoService.connect();
        const messagesCollection = this.mongoService.getMessagesCollection();

        const messages = await messagesCollection
            .find({ chatId: new ObjectId(chatId) })
            .sort({ createdAt: 1 })
            .toArray();

        return messages;
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        await this.mongoService.connect();
        const messagesCollection = this.mongoService.getMessagesCollection();

        const result = await messagesCollection.deleteOne({ _id: new ObjectId(messageId) });
        return result.deletedCount === 1;
    }

    async generateChatTitle(userMessage: string, llmSetConfig: LlmSetConfig,
        streamCallback: (content: string) => void
    ): Promise<string> {
        const messages: LlmRequest['messages'] = [
            {
                role: 'system',
                content: 'Você é um assistente que gera títulos curtos e descritivos para conversas. Gere um título de máximo 60 caracteres baseado na primeira mensagem do usuário. Responda apenas com o título, sem aspas ou formatação extra.'
            },
            {
                role: 'user',
                content: userMessage
            }
        ];
        const response = await this.llmGateway.invokeAsync(llmSetConfig.models.reasoning, messages, streamCallback);
        return response.content;
    }
}
