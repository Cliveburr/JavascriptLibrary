import type { ObjectId } from 'mongodb';

export interface MemoryEntity {
    _id: ObjectId;
    userId: ObjectId;
    name: string;
    vectorDatabase: string;
    totalChatCreated: number;
    createdAt: Date;
    deletedAt?: Date;
}