import { MongoClient, Db, Collection } from 'mongodb';
import { injectable } from 'tsyringe';
import type { User, Memory, Chat, Message } from '@symbia/interfaces';

@injectable()
export class MongoDBService {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connect(): Promise<void> {
        if (this.client) {
            return;
        }

        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27018/symbia';
        this.client = new MongoClient(uri);

        try {
            await this.client.connect();
            this.db = this.client.db('symbia');
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }

    getDatabase(): Db {
        if (!this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db;
    }

    getUsersCollection(): Collection<User> {
        return this.getDatabase().collection<User>('users');
    }

    getMemoriesCollection(): Collection<Memory> {
        return this.getDatabase().collection<Memory>('memories');
    }

    getChatsCollection(): Collection<Chat> {
        return this.getDatabase().collection<Chat>('chats');
    }

    getMessagesCollection(): Collection<Message> {
        return this.getDatabase().collection<Message>('messages');
    }
}
