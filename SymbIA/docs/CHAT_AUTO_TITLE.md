# Chat Auto-Title Generation - Documentação

## Overview

Foi implementada uma funcionalidade de geração automática de títulos para chats no SymbIA. Quando um usuário inicia uma nova conversa (sem fornecer um `chatId`), o sistema automaticamente:

1. Cria um novo chat com título temporário "Novo Chat"
2. Processa a mensagem do usuário através do ThoughtCycleService
3. Usa um LLM para gerar um título descritivo baseado na primeira mensagem
4. Atualiza o chat com o título gerado

## Como Funciona

### Frontend (Dashboard)
O frontend deve enviar requisições para `/api/memories/{memoryId}/messages` com os seguintes cenários:

#### Chat Novo
```json
{
  "content": "Como posso aprender programação em TypeScript?",
  "llmSetId": "ollama-local"
  // Sem chatId - indica que é um chat novo
}
```

#### Chat Existente
```json
{
  "content": "Continue nossa conversa sobre TypeScript",
  "chatId": "chat-123-456",
  "llmSetId": "ollama-local"
  // Com chatId - indica que é um chat existente
}
```

### Backend (API)
O endpoint `POST /api/memories/{memoryId}/messages` agora:

1. **Se `chatId` não for fornecido**:
   - Cria um novo chat automaticamente
   - Processa a mensagem via ThoughtCycleService
   - Gera título automaticamente usando LLM
   - Salva mensagens do usuário e assistente
   - Retorna resposta com o novo `chatId`

2. **Se `chatId` for fornecido**:
   - Valida se o chat existe
   - Processa a mensagem normalmente
   - Não gera novo título

### Geração de Título

A geração de título usa o seguinte prompt:
```
Você é um assistente que gera títulos curtos e descritivos para conversas. 
Gere um título de máximo 60 caracteres baseado na primeira mensagem do usuário. 
Responda apenas com o título, sem aspas ou formatação extra.

Mensagem do usuário: "{mensagem_do_usuario}"
```

## Exemplos de Uso

### Exemplo 1: Chat Novo
**Request:**
```bash
POST /api/memories/123e4567-e89b-12d3-a456-426614174000/messages
{
  "content": "Como posso configurar um servidor Express.js?",
  "llmSetId": "ollama-local"
}
```

**Response:**
```json
{
  "userMessage": {
    "id": "msg-1738294742635-user",
    "chatId": "chat-new-789",
    "role": "user",
    "content": "Como posso configurar um servidor Express.js?",
    "contentType": "text",
    "createdAt": "2025-07-30T11:45:42.635Z"
  },
  "assistantMessage": {
    "id": "msg-1738294742637-assistant", 
    "chatId": "chat-new-789",
    "role": "assistant",
    "content": "Para configurar um servidor Express.js...",
    "contentType": "text",
    "createdAt": "2025-07-30T11:45:42.637Z"
  }
}
```

**Título gerado automaticamente:** "Configurar servidor Express.js"

### Exemplo 2: Chat Existente
**Request:**
```bash
POST /api/memories/123e4567-e89b-12d3-a456-426614174000/messages
{
  "content": "E sobre middleware de autenticação?",
  "chatId": "chat-new-789",
  "llmSetId": "ollama-local"
}
```

**Response:** (similar ao anterior, mas sem geração de novo título)

## Edição Manual de Títulos

O usuário ainda pode editar o título do chat após a criação automática usando:

```bash
PUT /api/chats/{chatId}/title
{
  "title": "Novo título personalizado"
}
```

## Tratamento de Erros

- Se a geração de título falhar, o chat continua funcionando com o título padrão "Novo Chat"
- Títulos são automaticamente limitados a 60 caracteres
- Aspas são removidas automaticamente dos títulos gerados

## Configuração

A funcionalidade usa o LLM set especificado pelo usuário através do parâmetro obrigatório `llmSetId`. Cada requisição deve incluir um `llmSetId` válido que será usado tanto para processar a mensagem quanto para gerar o título do chat.

## Impacto na Performance

- A geração de título acontece após o processamento da mensagem principal
- Não bloqueia a resposta ao usuário
- Se falhar, não afeta a funcionalidade principal do chat
