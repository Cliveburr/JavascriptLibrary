// API DTOs and request/response types

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    defaultMemoryId: string;
  };
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    defaultMemoryId: string;
  };
}

// Memory DTOs
export interface MemoryDTO {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  deletedAt?: string;
}

export interface CreateMemoryRequest {
  name: string;
}

export interface UpdateMemoryRequest {
  name: string;
}

// Chat DTOs
export interface ChatDTO {
  id: string;
  memoryId: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateChatRequest {
  memoryId: string;
  title?: string;
}

// Message DTOs
export interface MessageDTO {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  contentType: 'text' | 'form' | 'chart' | 'file';
  toolCall?: object;
  createdAt: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  contentType?: 'text' | 'form' | 'chart' | 'file';
  llmSetId: string; // Required LLM set ID for this request
}

export interface SendMessageResponse {
  userMessage: MessageDTO;
  assistantMessage: MessageDTO;
}

// Stream Message Progress Enums and Types
export enum MessageProgressModal {
  Info = 0,               // Um texto de informação para indicar os passos da iteração
  Text = 1,               // Um texto fixo para ficar visualmente isolado
  TextStream = 2,         // Mensagem para ir compondo um texto
  Error = 3,              // Quando um error acontecer
  UpdateTitle = 4         // Mensagem para atualizar o titulo do chat
}

export interface MessageProgress {
  modal: MessageProgressModal;
  data?: any;    // aqui realmente precisa ser any para depois conforme o modal ser prototipada para o tipo correto
}

export type StreamProgressCallback = (progress: MessageProgress) => Promise<void> | void;
