import { ObjectId } from 'mongodb';
import { MongoDBService } from '../database/mongodb.service';
import { ChatEntity } from '../entities';

export class ChatService {
    constructor(
        private mongoService: MongoDBService
    ) { }

    async createChat(userId: string, memoryId: string, title: string): Promise<ChatEntity> {
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

        const orderIndex = memory.totalChatCreated = (memory.totalChatCreated || 0) + 1;

        // Update memory.totalChatCreated in the database
        await memoriesCollection.updateOne(
            { _id: new ObjectId(memoryId) },
            { $set: { totalChatCreated: memory.totalChatCreated, updatedAt: new Date() } }
        );

        const now = new Date();

        const chat: ChatEntity = {
            _id: <any>undefined,
            memoryId: new ObjectId(memoryId),
            title,
            orderIndex,
            createdAt: now,
            updatedAt: now,
            iterations: []
        };

        await chatsCollection.insertOne(chat);
        return chat;
    }

    async getChatsByMemory(memoryId: string): Promise<ChatEntity[]> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        const chats = await chatsCollection
            .find({ memoryId: new ObjectId(memoryId) })
            .sort({ orderIndex: 1 })
            .toArray();

        return chats;
    }

    async getChatById(chatId: string): Promise<ChatEntity | null> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId) });
        return chat || null;
    }

    async updateChatTitle(chatId: string, title: string): Promise<ChatEntity | null> {
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

    async updateChatOrder(chatId: string, newOrderIndex: number): Promise<ChatEntity | null> {
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
        const otherChats = chatsInMemory.filter((c: ChatEntity) => c._id.toString() !== chatId);

        // Inserir o chat na nova posição
        otherChats.splice(newOrderIndex, 0, chat);

        // Atualizar os índices de todos os chats
        const bulkOps = otherChats.map((c: ChatEntity, index: number) => ({
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

        const result = await chatsCollection.deleteOne({ _id: new ObjectId(chatId) });
        return result.deletedCount === 1;
    }

    async replaceChat(chat: ChatEntity): Promise<boolean> {
        await this.mongoService.connect();
        const chatsCollection = this.mongoService.getChatsCollection();

        chat.updatedAt = new Date();

        const result = await chatsCollection.replaceOne({ _id: new ObjectId(chat._id) }, chat);
        return result.modifiedCount === 1;
    }
}
