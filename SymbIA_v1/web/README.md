# SymbIA Web Frontend

Frontend React para o sistema SymbIA - Sistema Inteligente de Análise Simbólica.

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework JavaScript para interfaces de usuário
- **React Router DOM** - Roteamento para aplicações React
- **Vite** - Build tool e servidor de desenvolvimento
- **Bulma CSS** - Framework CSS para estilização moderna
- **Font Awesome** - Ícones vetoriais
- **Axios** - Cliente HTTP para requisições à API

## 📁 Estrutura do Projeto

```
web/
├── public/          # Arquivos estáticos
├── src/
│   ├── components/  # Componentes reutilizáveis
│   ├── context/     # Contextos do React (estado global)
│   ├── pages/       # Páginas da aplicação
│   │   ├── public/  # Páginas públicas (Home, Login, Register)
│   │   └── private/ # Páginas protegidas (Dashboard)
│   ├── router/      # Configuração de rotas
│   ├── services/    # Serviços e configuração da API
│   ├── App.jsx      # Componente principal
│   └── main.jsx     # Ponto de entrada da aplicação
├── .env             # Variáveis de ambiente
├── package.json     # Dependências e scripts
└── vite.config.js   # Configuração do Vite
```

## 🛠️ Instalação e Uso

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em modo de desenvolvimento
```bash
npm run dev
```

### 3. Build para produção
```bash
npm run build
```

### 4. Preview do build de produção
```bash
npm run preview
```

## 🌟 Funcionalidades

### ✅ Implementadas
- **Sistema de Autenticação**: Login e registro de usuários
- **Roteamento**: Navegação entre páginas com proteção de rotas
- **Interface Responsiva**: Design moderno usando Bulma CSS
- **Gerenciamento de Estado**: Context API para estado global
- **Configuração de API**: Axios com interceptadores e configuração base

### 🔄 Páginas Disponíveis
- **Home** (`/`) - Página inicial com apresentação do sistema
- **Login** (`/login`) - Autenticação de usuários
- **Registro** (`/register`) - Cadastro de novos usuários
- **Dashboard** (`/dashboard`) - Painel principal com ferramentas:
  - Planejador de Execução
  - Decompositor de Mensagens
  - Executor de Pipeline
  - Testador de Ciclo de Pensamento

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3002
VITE_APP_NAME=SymbIA
VITE_APP_VERSION=1.0.0
```

### Proxy para API
O Vite está configurado para fazer proxy das requisições `/api` para `http://localhost:3002`.

## 🎨 Design System

O projeto utiliza **Bulma CSS** para uma interface moderna e responsiva:

- **Cores**: Paleta baseada em azul primário
- **Typography**: Fonte padrão do Bulma
- **Componentes**: Cards, formulários, botões e navegação
- **Responsividade**: Design mobile-first

## 🔐 Autenticação

O sistema de autenticação está configurado com:

- **Context API** para gerenciamento de estado de usuário
- **LocalStorage** para persistência de tokens
- **Rotas Protegidas** usando o componente `ProtectedRoute`
- **Interceptadores Axios** para adicionar tokens automaticamente

## 🚀 Próximos Passos

- [ ] Integração completa com a API backend
- [ ] Implementação de testes unitários
- [ ] Adição de loading states e feedback visual
- [ ] Implementação de notificações toast
- [ ] Modo escuro/claro
- [ ] Internacionalização (i18n)

## 📝 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
