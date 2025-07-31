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
