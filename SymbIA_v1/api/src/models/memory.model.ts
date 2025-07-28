import { Schema, model } from 'mongoose';
import { IMemory } from '../interfaces/memory.interface';

const memorySchema = new Schema<IMemory>({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  qdrantCollectionName: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Memory = model<IMemory>('Memory', memorySchema);
