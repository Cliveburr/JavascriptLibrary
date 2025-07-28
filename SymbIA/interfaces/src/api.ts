// API DTOs and request/response types
export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    defaultMemoryId: string;
  };
}

export interface CreateMemoryRequest {
  name: string;
}

export interface UpdateMemoryRequest {
  name: string;
}

export interface CreateChatRequest {
  memoryId: string;
  title?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  contentType?: string;
}

export interface SendMessageResponse {
  message: {
    id: string;
    role: string;
    content: string;
    contentType: string;
    createdAt: Date;
  };
}
