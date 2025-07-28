import { Types } from 'mongoose';

export interface IMemory {
  _id?: Types.ObjectId;
  name: string;
  userId: Types.ObjectId;
  qdrantCollectionName: string;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
