// Domain entities
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  defaultMemoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Memory {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  deletedAt?: Date;
}

export interface Chat {
  id: string;
  memoryId: string;
  title: string;
  createdAt: Date;
}

export type MessageRole = 'user' | 'assistant' | 'system';
export type ContentType = 'text' | 'form' | 'chart' | 'file';

export interface Message {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  contentType: ContentType;
  toolCall?: object;
  createdAt: Date;
}

export interface VectorEntry {
  id: string;
  memoryId: string;
  embedding: number[];
  payload: {
    type: string;
    tags: string[];
    timestamp: Date;
  };
}
