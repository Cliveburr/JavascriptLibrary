
Style:
    - Futuristas
    - Cores neutras
    - Paddings e Margins curtissimos priorizando o maximo de informação na tela
    - Fonte menor que o padrão

Comportamento geral:
    - Ao abrir, lembrar qual a ultima memories e chat usados e selecionar eles
    - Ao selecionar uma memorie carregar os chats relacionado a memories
    - Ao selecionar uma memorie carregar o conteudo do chat

Tela divida em 2 partes verticalmente
    # Parte da esquerda
        - No topo o logo do projeto em /assets/logo.png com href para "/"
        - Abaixo o portrait do usuario seguido do username, em formato de dropdown
            - Dropdown butons
                Configuração do perfil
                ---
                Logout
        - Abaixo as memories do usuário, um botão de add, e em lista cada memories em formato de button que ao ser clicado seleciona a memories e carrega abaixo os chats relacionados a essa memories, e botão discreto para remover
        - Abaixo todos os chats relacionados a memorie selecionada, ao clicar carregar o conteudo do chat
    # Parte da direita
        - No topo do canto esquerdo, um box seletor em modo flutuante do lado esquerdo superior para selecionar o set de modelos llm a ser usado
        - Abaixo o conteudo do chat carregado, exibindo os diversos modais possiveis, texto-mensagem, texto-info, texto-erro, formularios, graficos, links variados e outros..
        - Abaixo o campo de texto para o usuário interagir com o chat, com o botão enviar dinamico, mudando para "pause" e "stop" quando estiver rodando

** CONSIDERANDOS DA IA PARA TODA IMPLEMENTAÇÃO DO PROPOSTO**

### 📊 **Análise do Estado Atual**
O projeto já possui uma base sólida:
- ✅ Sistema de autenticação funcional com persistência
- ✅ Gerenciamento de memórias com store Zustand
- ✅ Chat básico implementado
- ✅ API REST completa no backend
- ✅ Componentes UI base já criados

### 🔧 **Considerandos e Sugestões**
1. **Persistência de Estado**: Expandir auth store para lembrar última memória/chat
2. **Chat Store**: Modificar para suportar múltiplos chats por memória
3. **Seletor de Modelo LLM**: Criar novo store para gerenciar configurações
4. **Componentes**: Refatorar sidebar e área de chat para nova estrutura
5. **API**: Expandir endpoints para chats por memória e modelos LLM
6. **Estilos**: Implementar design futurista com padding/margin mínimos

### 🚀 **Implementação Completa**

**Fase 1**: Stores e Estado ✅
- ✅ Expandir AuthStore com persistência de seleção
- ✅ Modificar ChatStore para múltiplos chats por memória  
- ✅ Criar LLMStore para seleção de modelos
- ✅ Implementar persistência localStorage

**Fase 2**: API Extensions ✅ (Integração Completa!)
- ✅ MongoDB iniciado e conectado
- ✅ Usuário de teste criado (teste@exemplo.com / 123456)
- ✅ Endpoints de memórias integrados com MongoDB
- ✅ Endpoints de chats integrados com MongoDB
- ✅ Autenticação JWT funcionando
- ✅ Login automático para desenvolvimento

**Fase 3**: Componentes UI ✅
- ✅ Refatorar MemorySidebar com logo, user dropdown, memories e chats
- ✅ Criar UserProfileDropdown componente
- ✅ Implementar LLMSelector flutuante
- ✅ Atualizar ChatArea com novo layout
- ✅ ChatInput dinâmico (send/pause/stop)

**Fase 4**: Estilos e Layout ✅
- ✅ Grid layout 2 colunas (280px sidebar + flexível)
- ✅ Tema futurista com cores neutras
- ✅ Padding/margin mínimos
- ✅ Fonte reduzida
- ✅ Componentes responsivos

**Fase 5**: Funcionalidades ✅
- ✅ Auto-seleção última memória/chat ao abrir
- ✅ Carregamento dinâmico de chats por memória
- ✅ Navegação fluida entre contextos
- ✅ Estados de loading/error

### 🎯 **Resultado Final**

**IMPLEMENTAÇÃO COMPLETA! ✅**

O dashboard foi totalmente implementado seguindo as especificações:

#### **Layout Implementado:**
- **Grid 2 colunas**: Sidebar 280px + Chat área flexível
- **Parte Esquerda**: Logo, User Dropdown, Memórias, Chats
- **Parte Direita**: LLM Selector flutuante, Chat Window, Chat Input dinâmico

#### **Componentes Criados:**
1. **UserProfileDropdown** - Avatar, username, menu (perfil/logout)
2. **LLMSelector** - Seletor flutuante de modelos LLM
3. **MemorySidebar** - Refatorado com todas as seções
4. **ChatArea** - Layout atualizado
5. **ChatInput** - Botão dinâmico (send/pause/stop)

#### **Stores Implementados:**
1. **AuthStore** - Expandido com persistência de seleção
2. **ChatStore** - Suporte a múltiplos chats por memória
3. **LLMStore** - Gerenciamento de modelos LLM

#### **Funcionalidades:**
- ✅ Persistência da última memória/chat selecionado
- ✅ Carregamento automático de chats por memória
- ✅ Seleção dinâmica de modelos LLM
- ✅ Interface responsiva
- ✅ Design futurista com padding/margin mínimos
- ✅ Fonte menor que padrão
- ✅ Estados de loading/error

#### **Para Executar:**
```bash
# 1. Iniciar MongoDB
docker-compose up -d mongodb

# 2. Iniciar API (porta 3002)
pnpm --filter @symbia/api dev

# 3. Iniciar Frontend (porta 3001)
pnpm --filter @symbia/web dev
```

**Credenciais de Teste:**
- Email: teste@exemplo.com
- Senha: 123456
- Login automático ativado para desenvolvimento

**Acesse**: http://localhost:3001

O dashboard está funcionando completamente com MongoDB e autenticação real!