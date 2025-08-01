# SymbIA Project Structure

## Architecture Overview

The project follows a clean architecture pattern with three main packages:

/core
    # Core business logic and domain entities
    # Contains all types, interfaces, and services
    # Self-contained with no external package dependencies within the workspace
    /src
        /types          # Domain types and interfaces
        /services       # Business logic services
        /llm           # LLM integration
        /memory        # Memory and vector storage
        /auth          # Authentication services
        /database      # Database integration

/api
    # REST API server built with Express.js
    # References @symbia/core for business logic
    # Contains only API-specific DTOs and controllers
    /src
        /controllers    # HTTP request handlers
        /routes        # API route definitions
        /types         # API-specific DTOs
        /helpers       # API utilities

/web
    # React frontend application
    # Self-contained with its own types to avoid MongoDB dependencies
    # Communicates with API via HTTP requests
    /src
        /components    # React components
        /pages         # Page components
        /types         # Frontend-specific types
        /stores        # State management

## Key Changes from v1

- **Removed /interfaces package**: Types and interfaces are now distributed across projects where they belong
- **Core contains domain types**: All domain entities, LLM types, and business interfaces are in /core/src/types
- **API has its own DTOs**: API-specific request/response types are in /api/src/types
- **Web is self-contained**: Frontend types avoid MongoDB ObjectId dependencies for better separation

## Package Dependencies

```
/core (no internal dependencies)
  ↑
/api (depends on @symbia/core)
  
/web (no internal dependencies, communicates via HTTP)
```

## Type Distribution

### Core Types (/core/src/types/)
- `domain.ts`: User, Memory, Chat, Message, VectorEntry entities
- `llm.ts`: LLM providers, requests, responses, configurations
- `chat-context.ts`: IChatContext interface for thought cycle
- `messages.ts`: MessageType enum and chat message interfaces

### API Types (/api/src/types/)
- `api.ts`: DTOs for HTTP requests and responses (LoginRequest, RegisterResponse, etc.)

### Web Types (/web/src/types/)
- `frontend.ts`: Frontend-specific types without MongoDB dependencies
- `streaming.ts`: Chat streaming and real-time communication types
