# SymbIA API

API HTTP construída com Express.js seguindo o padrão de controllers para o projeto SymbIA.

## Arquitetura

- **Express.js** - Framework web
- **TypeScript** - Linguagem de programação
- **Zod + zod-express-middleware** - Validação de schemas
- **tsyringe** - Dependency Injection (DI)
- **@symbia/core** - Lógica de negócios
- **@symbia/interfaces** - DTOs e contratos compartilhados

## Estrutura

```
src/
├── controllers/         # Controllers dos endpoints
│   ├── auth.controller.ts
│   └── memories.controller.ts
├── routes/             # Definição das rotas
│   ├── auth.routes.ts
│   └── memories.routes.ts
├── middleware/         # Middlewares personalizados
│   └── auth.middleware.ts
└── server.ts          # Configuração principal do servidor
```

## Endpoints

### Autenticação

#### POST `/auth/login`
Realiza login do usuário.

**Request:**
```json
{
  "email": "admin@symbia.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "1",
    "email": "admin@symbia.com",
    "defaultMemoryId": "memory-id"
  }
}
```

### Memórias (Requer autenticação)

#### GET `/memories`
Lista as memórias do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "memory-id",
    "userId": "user-id",
    "name": "Memory Name",
    "createdAt": "2025-07-28T21:00:00.000Z",
    "deletedAt": null
  }
]
```

#### POST `/memories`
Cria uma nova memória para o usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "My New Memory"
}
```

**Response:**
```json
{
  "id": "new-memory-id",
  "userId": "user-id",
  "name": "My New Memory",
  "createdAt": "2025-07-28T21:00:00.000Z"
}
```

## Desenvolvimento

### Comandos

```bash
# Instalar dependências
pnpm install

# Desenvolvimento (watch mode)
pnpm dev

# Build
pnpm build

# Testes
pnpm test

# Lint
pnpm lint
```

### Testes

A API possui 100% de cobertura nos endpoints principais:

- **Health Check** - Endpoint de status
- **Autenticação** - Login com validações
- **Memórias** - CRUD com autenticação obrigatória

Todos os testes são executados com Vitest e Supertest.

## Dependências

### Principais
- `express` - Framework web
- `zod` - Validação de schemas
- `zod-express-middleware` - Middleware de validação
- `tsyringe` - Dependency injection
- `reflect-metadata` - Metadados para decorators

### Core & Interfaces
- `@symbia/core` - Serviços de negócio
- `@symbia/interfaces` - DTOs e tipos

### Desenvolvimento
- `typescript` - Compilador TS
- `tsx` - Executor TS para desenvolvimento
- `vitest` - Framework de testes
- `supertest` - Testes HTTP
- `@types/*` - Definições de tipos

## Configuração DI

O sistema utiliza `tsyringe` para dependency injection, com serviços registrados automaticamente:

- `AuthService` - Autenticação e autorização
- `MemoryService` - Gerenciamento de memórias
- Controllers são resolvidos automaticamente via DI

## Middleware de Autenticação

O `authMiddleware` protege endpoints sensíveis:

- Valida token JWT no header `Authorization: Bearer <token>`
- Injeta dados do usuário autenticado em `req.user`
- Retorna 401 para tokens inválidos ou ausentes

## Status

✅ **COMPLETO**: API funcionando com todos os requisitos atendidos:

- Express + zod-express-middleware ✅
- Container DI configurado ✅
- Endpoints implementados ✅
- DTOs das interfaces utilizados ✅
- Testes com 100% cobertura ✅
- Servidor inicia com `pnpm dev` ✅
