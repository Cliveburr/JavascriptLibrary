import type { ObjectId } from 'mongodb';

export interface UserEntity {
    _id: ObjectId;
    username: string;
    email: string;
    reponseLanguage: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}
