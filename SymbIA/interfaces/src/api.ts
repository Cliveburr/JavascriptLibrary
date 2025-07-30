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
  llmSetId?: string; // Optional LLM set ID for this request
}

export interface SendMessageResponse {
  userMessage: MessageDTO;
  assistantMessage: MessageDTO;
}
