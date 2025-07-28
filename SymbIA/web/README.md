# SymbIA Web Frontend

Frontend React para a plataforma SymbIA v2 - Multi-memory AI agent platform.

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **SCSS** - Estilização com tema futurista
- **React Router** - Roteamento (ready para implementação)

## 📁 Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface básicos
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── Header.tsx      # Cabeçalho da aplicação
│   └── index.ts
├── layouts/            # Layouts de página
│   ├── MainLayout.tsx
│   └── index.ts
├── pages/              # Páginas da aplicação
│   ├── HomePage.tsx
│   └── index.ts
├── hooks/              # Custom hooks
│   ├── useTheme.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── styles/             # Sistema de tema SCSS
│   ├── _variables.scss # Variáveis do tema futurista
│   └── globals.scss    # Estilos globais
├── App.tsx             # Componente raiz
└── main.tsx            # Entry point
```

## 🎨 Sistema de Tema

O frontend utiliza um sistema de tema futurista dark com:

### Cores Principais
- **Primary**: Cyan (#00ffff) - Cor principal com efeitos de glow
- **Secondary**: Coral Red (#ff6b6b) - Cor secundária
- **Accent**: Electric Yellow (#ffd93d) - Cor de destaque
- **Background**: Deep Black (#0a0a0a) com gradientes sutis

### Componentes de UI
- **Button**: 5 variantes (primary, secondary, accent, outline, ghost)
- **Card**: 4 variantes (default, elevated, outlined, glass)
- Todos com efeitos hover, glow e animações

### Recursos de Acessibilidade
- Focus states bem definidos
- Contraste adequado
- Suporte a navegação por teclado
- Scroll customizado

## 🚀 Comandos

```bash
# Desenvolvimento (porta 3001)
pnpm --filter web dev

# Build para produção
pnpm --filter web build

# Preview do build
pnpm --filter web preview

# Testes
pnpm --filter web test

# Lint
pnpm --filter web lint
```

## 🌟 Características

### Design System
- Variáveis SCSS organizadas
- Componentes atômicos reutilizáveis
- Animações e efeitos futuristas
- Responsividade mobile-first

### Performance
- Vite para desenvolvimento rápido
- Code splitting automático
- Hot Module Replacement (HMR)
- Build otimizado para produção

### Developer Experience
- TypeScript para type safety
- ESLint configurado
- Arquitetura modular clara
- Hooks customizados para lógica compartilhada

## 📱 Páginas Implementadas

### HomePage
- Hero section com animações de rede neural
- Seção de features com cards glassmorphism
- Call-to-action destacado
- Totalmente responsiva

## 🔧 Próximos Passos

1. **Roteamento**: Implementar React Router
2. **Estado Global**: Adicionar Zustand ou Context API
3. **Autenticação**: Páginas de login/registro
4. **Dashboard**: Interface principal do usuário
5. **Chat Interface**: Interface de conversação com AI
6. **Gerenciamento de Memórias**: CRUD de memórias

## 🎯 Aceite

✅ **CONCLUÍDO**: `pnpm --filter web dev` abre hello world estilizado na porta 3001 com:
- Tema SCSS futurista completo
- Arquitetura pages/layout/components/hooks
- Componentes UI reutilizáveis
- Layout responsivo
- Animações e efeitos visuais
