import type { ChatEntity, MemoryEntity, UserEntity } from '../entities';
import type { ConfigService } from '../services';
import { MongoClient, Db, Collection } from 'mongodb';

export class MongoDBService {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    constructor(
        private configService: ConfigService
    ) { }

    async connect(): Promise<void> {
        if (this.client) {
            return;
        }

        const dbConfig = this.configService.getDatabaseConfig();
        this.client = new MongoClient(dbConfig.mongodbUri);

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

    getUsersCollection(): Collection<UserEntity> {
        return this.getDatabase().collection<UserEntity>('users');
    }

    getMemoriesCollection(): Collection<MemoryEntity> {
        return this.getDatabase().collection<MemoryEntity>('memories');
    }

    getChatsCollection(): Collection<ChatEntity> {
        return this.getDatabase().collection<ChatEntity>('chats');
    }

}
