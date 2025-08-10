import { ObjectId } from 'mongodb';

export interface VectorEntity {
    _id: ObjectId;
    memoryId: ObjectId;
    embedding: number[];
    payload: {
        type: string;
        tags: string[];
        timestamp: Date;
    };
}