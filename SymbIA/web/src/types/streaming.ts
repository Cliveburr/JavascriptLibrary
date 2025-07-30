// Tipos para streaming de mensagens do chat
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

export interface StreamingMessage {
    id: string;
    chatId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    contentType: 'text' | 'form' | 'chart' | 'file';
    createdAt: string;
    isStreaming?: boolean;  // Para indicar se a mensagem ainda está sendo recebida
    isError?: boolean;      // Para indicar se houve erro
}

export interface StreamingState {
    isStreaming: boolean;
    currentStreamingMessageId?: string;
    streamingProgress?: MessageProgress;
}
