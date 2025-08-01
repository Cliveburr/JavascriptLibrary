# Configuração de Ambiente - SymbIA

## Visão Geral

O sistema SymbIA agora possui um sistema centralizado de configuração que valida todas as variáveis de ambiente necessárias na inicialização da aplicação. Se alguma variável estiver faltando ou inválida, a aplicação não inicia.

## Arquivos Criados/Modificados

### 1. ConfigService (`core/src/config/config.service.ts`)
- **Classe injetável** que centraliza todas as configurações
- **Validação automática** de todas as variáveis de ambiente
- **Sem fallbacks** - todas as variáveis devem estar definidas
- **Tipos seguros** - todas as configurações são tipadas

### 2. Arquivo .env (`api/.env`)
Contém todas as variáveis de ambiente necessárias:

```env
# Server Configuration
PORT=3002

# Database Configuration
MONGODB_URI=mongodb://localhost:27018/symbia

# Authentication Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Vector Database Configuration
QDRANT_URL=http://localhost:6333
# QDRANT_API_KEY=your-qdrant-api-key-if-needed

# LLM Providers Configuration
OLLAMA_BASE_URL=http://localhost:11434
# OPENAI_API_KEY=your-openai-api-key-if-needed
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 3. Serviços Atualizados
Todos os serviços que antes usavam `process.env` diretamente foram atualizados para usar a `ConfigService`:

- **AuthService**: JWT secrets e configurações de expiração
- **MongoDBService**: URI do MongoDB
- **QdrantProvider**: URL e API key do Qdrant
- **OpenAIProvider**: API key e base URL
- **OllamaProvider**: Base URL

### 4. Server.ts Reescrito (`api/src/server.ts`)
- **Carregamento de .env** antes de qualquer importação
- **Validação de configuração** antes de inicializar serviços
- **Importação dinâmica** de rotas após configuração
- **Logs informativos** sobre configurações carregadas

## Validações Implementadas

### Variáveis Obrigatórias
- `PORT` (deve ser um número válido entre 1-65535)
- `MONGODB_URI` (deve ser uma URL válida)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN` (formato de tempo válido: 1h, 30m, 7d)
- `JWT_REFRESH_EXPIRES_IN` (formato de tempo válido)
- `QDRANT_URL` (deve ser uma URL válida)
- `OLLAMA_BASE_URL` (deve ser uma URL válida)
- `OPENAI_BASE_URL` (deve ser uma URL válida)

### Variáveis Opcionais
- `QDRANT_API_KEY` (se não fornecida, usa sem autenticação)
- `OPENAI_API_KEY` (se não fornecida, OpenAI não funcionará)

## Como Usar

### 1. Desenvolvimento
```bash
cd api
# NOTA: Comandos pnpm foram removidos - configure seu gerenciador de pacotes
# Exemplo: npm run dev
```

### 2. Produção
```bash
cd api
# NOTA: Comandos pnpm foram removidos - configure seu gerenciador de pacotes
# Exemplo: npm run build && npm start
```

### 3. Validação Manual
```bash
cd api
node -e "require('dotenv').config(); const { configureContainer, ConfigService } = require('@symbia/core'); const { container } = require('tsyringe'); try { configureContainer(); const config = container.resolve(ConfigService); console.log('✅ Configuration valid!'); } catch(e) { console.error('❌ Configuration error:', e.message); }"
```

## Benefícios

1. **Segurança**: Não há fallbacks para configurações críticas
2. **Transparência**: Todas as configurações são validadas e logadas na inicialização
3. **Manutenibilidade**: Configuração centralizada em uma única classe
4. **Type Safety**: Todas as configurações são tipadas em TypeScript
5. **Fail Fast**: Aplicação não inicia se configuração estiver incorreta

## Estrutura da ConfigService

```typescript
interface AppConfig {
    // Server
    port: number;
    
    // Database
    mongodbUri: string;
    
    // Authentication
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    
    // Vector Database
    qdrantUrl: string;
    qdrantApiKey?: string;
    
    // LLM Providers
    ollamaBaseUrl: string;
    openaiApiKey?: string;
    openaiBaseUrl: string;
}
```

## Métodos Disponíveis

- `config.get()`: Retorna toda a configuração
- `config.getServerConfig()`: Configurações do servidor
- `config.getDatabaseConfig()`: Configurações de banco de dados
- `config.getAuthConfig()`: Configurações de autenticação
- `config.getQdrantConfig()`: Configurações do Qdrant
- `config.getOllamaConfig()`: Configurações do Ollama
- `config.getOpenAIConfig()`: Configurações do OpenAI
