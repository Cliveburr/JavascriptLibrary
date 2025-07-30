import { injectable, inject } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import type { Chat, Message } from '@symbia/interfaces';
import { MongoDBService } from '../database/mongodb.service.js';

@injectable()
export class ChatService {
    constructor(
        @inject(MongoDBService) private mongoService: MongoDBService
    ) { }

    async createChat(memoryId: string, title: string = 'Novo Chat'): Promise<Chat> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        // Buscar o maior orderIndex para essa memória
        const lastChat = await chatsCollection
            .findOne(
                { memoryId },
                { sort: { orderIndex: -1 } }
            );

        const nextOrderIndex = lastChat ? lastChat.orderIndex + 1 : 0;

        const chatId = uuidv4();
        const now = new Date();

        const chat: Chat = {
            id: chatId,
            memoryId,
            title,
            orderIndex: nextOrderIndex,
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
            .find({ memoryId })
            .sort({ orderIndex: 1 })
            .toArray();

        return chats;
    }

    async getChatById(chatId: string): Promise<Chat | null> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        const chat = await chatsCollection.findOne({ id: chatId });
        return chat || null;
    }

    async updateChatTitle(chatId: string, title: string): Promise<Chat | null> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        const result = await chatsCollection.findOneAndUpdate(
            { id: chatId },
            {
                $set: {
                    title: title.substring(0, 60), // Limitar a 60 caracteres
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        return result.value || null;
    }

    async updateChatOrder(chatId: string, newOrderIndex: number): Promise<Chat | null> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        // Primeiro, buscar o chat para obter o memoryId
        const chat = await chatsCollection.findOne({ id: chatId });
        if (!chat) return null;

        // Reorganizar os outros chats na mesma memória
        const chatsInMemory = await chatsCollection
            .find({ memoryId: chat.memoryId })
            .sort({ orderIndex: 1 })
            .toArray();

        // Remover o chat da lista atual
        const otherChats = chatsInMemory.filter((c: Chat) => c.id !== chatId);

        // Inserir o chat na nova posição
        otherChats.splice(newOrderIndex, 0, chat);

        // Atualizar os índices de todos os chats
        const bulkOps = otherChats.map((c: Chat, index: number) => ({
            updateOne: {
                filter: { id: c.id },
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
        return await chatsCollection.findOne({ id: chatId });
    }

    async deleteChat(chatId: string): Promise<boolean> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();
        const messagesCollection = this.mongoService.getMessagesCollection();

        // Deletar mensagens associadas
        await messagesCollection.deleteMany({ chatId });

        // Deletar o chat
        const result = await chatsCollection.deleteOne({ id: chatId });
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
            .find({ chatId })
            .sort({ createdAt: 1 })
            .toArray();

        return messages;
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        await this.mongoService.connect();
        const messagesCollection = this.mongoService.getMessagesCollection();

        const result = await messagesCollection.deleteOne({ id: messageId });
        return result.deletedCount === 1;
    }
}
