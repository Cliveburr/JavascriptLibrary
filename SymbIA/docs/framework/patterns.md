# 📱 SymbIA Framework - Padrões de UI

## 📋 **Visão Geral**

Este documento apresenta padrões completos de interface usando o SymbIA Framework. São templates prontos para diferentes tipos de telas e funcionalidades que podem ser utilizados como base para desenvolvimento.

## 🏠 **Layouts de Página**

### **🖥️ Dashboard Layout**
```html
<div class="min-h-screen bg-bg-primary text-text-primary">
  <!-- Header -->
  <header class="bg-bg-secondary border-b border-border sticky top-0 z-fixed">
    <div class="flex items-center justify-between px-lg py-md">
      <!-- Logo e título -->
      <div class="flex items-center gap-md">
        <div class="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span class="text-white font-bold text-sm">S</span>
        </div>
        <h1 class="text-xl font-bold">SymbIA Dashboard</h1>
      </div>
      
      <!-- Ações do usuário -->
      <div class="flex items-center gap-md">
        <!-- Notificações -->
        <button class="relative p-sm hover:bg-bg-tertiary rounded">
          <svg class="w-5 h-5" fill="none" stroke="currentColor"><!-- Bell icon --></svg>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
        </button>
        
        <!-- Profile -->
        <div class="flex items-center gap-sm">
          <div class="w-8 h-8 bg-accent rounded-full"></div>
          <span class="text-sm font-medium">João Silva</span>
        </div>
      </div>
    </div>
  </header>
  
  <div class="flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-bg-secondary border-r border-border min-h-screen">
      <nav class="p-md space-y-xs">
        <a class="
          flex items-center gap-md px-md py-sm rounded
          bg-primary/10 text-primary border-l-4 border-primary
        ">
          <svg class="w-5 h-5"><!-- Dashboard icon --></svg>
          Dashboard
        </a>
        <a class="
          flex items-center gap-md px-md py-sm rounded
          text-text-secondary hover:bg-bg-tertiary hover:text-text-primary
          border-l-4 border-transparent hover:border-border
        ">
          <svg class="w-5 h-5"><!-- Projects icon --></svg>
          Projetos
        </a>
        <a class="
          flex items-center gap-md px-md py-sm rounded
          text-text-secondary hover:bg-bg-tertiary hover:text-text-primary
          border-l-4 border-transparent hover:border-border
        ">
          <svg class="w-5 h-5"><!-- Analytics icon --></svg>
          Analytics
        </a>
        <a class="
          flex items-center gap-md px-md py-sm rounded
          text-text-secondary hover:bg-bg-tertiary hover:text-text-primary
          border-l-4 border-transparent hover:border-border
        ">
          <svg class="w-5 h-5"><!-- Settings icon --></svg>
          Configurações
        </a>
      </nav>
    </aside>
    
    <!-- Conteúdo principal -->
    <main class="flex-1 p-lg">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-xs text-sm mb-lg">
        <a class="text-text-accent hover:text-accent-light">Home</a>
        <svg class="w-4 h-4 text-text-muted"><!-- Chevron --></svg>
        <span class="text-text-muted">Dashboard</span>
      </nav>
      
      <!-- Page title -->
      <div class="flex items-center justify-between mb-lg">
        <h2 class="text-3xl font-bold">Dashboard</h2>
        <button class="
          px-lg py-md bg-primary hover:bg-primary-dark
          text-white font-semibold rounded-lg
          transition-all duration-normal ease-in-out
        ">
          Novo Projeto
        </button>
      </div>
      
      <!-- Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-lg">
        <!-- Card de métrica -->
        <div class="bg-bg-secondary border border-border rounded-lg p-lg">
          <div class="flex items-center justify-between mb-md">
            <h3 class="text-sm font-medium text-text-secondary uppercase">Total de Projetos</h3>
            <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-primary"><!-- Icon --></svg>
            </div>
          </div>
          <div class="mb-sm">
            <span class="text-3xl font-bold">24</span>
          </div>
          <div class="flex items-center gap-xs">
            <span class="text-sm text-success">+12%</span>
            <span class="text-sm text-text-muted">este mês</span>
          </div>
        </div>
        <!-- Repetir para outras métricas -->
      </div>
      
      <!-- Conteúdo principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <!-- Gráfico principal -->
        <div class="lg:col-span-2 bg-bg-secondary border border-border rounded-lg p-lg">
          <h3 class="text-lg font-semibold mb-md">Atividade Recente</h3>
          <div class="h-64 bg-bg-tertiary rounded flex items-center justify-center">
            <span class="text-text-muted">Gráfico aqui</span>
          </div>
        </div>
        
        <!-- Sidebar direita -->
        <div class="bg-bg-secondary border border-border rounded-lg p-lg">
          <h3 class="text-lg font-semibold mb-md">Tarefas Pendentes</h3>
          <div class="space-y-sm">
            <div class="flex items-center gap-sm p-sm rounded hover:bg-bg-tertiary">
              <input type="checkbox" class="w-4 h-4 text-primary rounded">
              <span class="text-sm">Revisar documento X</span>
            </div>
            <!-- Mais tarefas -->
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
```

### **📄 Landing Page**
```html
<div class="min-h-screen bg-bg-primary text-text-primary">
  <!-- Navigation -->
  <nav class="bg-bg-secondary/80 backdrop-blur-sm border-b border-border sticky top-0 z-fixed">
    <div class="max-w-6xl mx-auto px-lg py-md">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-md">
          <div class="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span class="text-white font-bold text-sm">S</span>
          </div>
          <span class="text-xl font-bold">SymbIA</span>
        </div>
        
        <!-- Navigation links -->
        <div class="hidden md:flex gap-lg">
          <a class="text-text-primary hover:text-primary transition-colors">Home</a>
          <a class="text-text-secondary hover:text-primary transition-colors">Sobre</a>
          <a class="text-text-secondary hover:text-primary transition-colors">Recursos</a>
          <a class="text-text-secondary hover:text-primary transition-colors">Contato</a>
        </div>
        
        <!-- CTA -->
        <div class="flex items-center gap-md">
          <button class="px-md py-sm text-text-secondary hover:text-text-primary">
            Login
          </button>
          <button class="
            px-lg py-md bg-primary hover:bg-primary-dark
            text-white font-semibold rounded-lg
            transition-all duration-normal ease-in-out
          ">
            Começar Grátis
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Hero Section -->
  <section class="relative py-3xl">
    <div class="max-w-6xl mx-auto px-lg text-center">
      <h1 class="text-6xl font-bold mb-lg">
        O Futuro da <span class="text-primary">Inteligência</span> Artificial
      </h1>
      <p class="text-xl text-text-secondary mb-xl max-w-3xl mx-auto">
        Transforme sua forma de trabalhar com nossa plataforma de IA avançada. 
        Automatize processos, tome decisões inteligentes e acelere seu crescimento.
      </p>
      <div class="flex flex-col sm:flex-row gap-md justify-center">
        <button class="
          px-xl py-lg bg-primary hover:bg-primary-dark
          text-white font-semibold rounded-lg text-lg
          transition-all duration-normal ease-in-out
          hover:scale-105 hover:shadow-lg
        ">
          Começar Agora
        </button>
        <button class="
          px-xl py-lg bg-transparent border-2 border-primary
          text-primary hover:bg-primary hover:text-white
          font-semibold rounded-lg text-lg
          transition-all duration-normal ease-in-out
        ">
          Ver Demo
        </button>
      </div>
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="py-3xl bg-bg-secondary">
    <div class="max-w-6xl mx-auto px-lg">
      <div class="text-center mb-3xl">
        <h2 class="text-4xl font-bold mb-lg">Recursos Poderosos</h2>
        <p class="text-xl text-text-secondary max-w-2xl mx-auto">
          Descubra como nossa IA pode revolucionar seu trabalho
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
        <!-- Feature card -->
        <div class="text-center">
          <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-lg">
            <svg class="w-8 h-8 text-primary"><!-- Icon --></svg>
          </div>
          <h3 class="text-xl font-semibold mb-md">Automação Inteligente</h3>
          <p class="text-text-secondary">
            Automatize tarefas repetitivas e libere tempo para o que realmente importa.
          </p>
        </div>
        <!-- Repetir para outros recursos -->
      </div>
    </div>
  </section>
</div>
```

### **📋 Lista/Tabela de Dados**
```html
<div class="min-h-screen bg-bg-primary text-text-primary p-lg">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-lg">
      <div>
        <h1 class="text-3xl font-bold mb-sm">Usuários</h1>
        <p class="text-text-secondary">Gerencie todos os usuários do sistema</p>
      </div>
      <div class="flex items-center gap-md">
        <!-- Search -->
        <div class="relative">
          <input class="
            pl-10 pr-md py-sm w-64
            bg-bg-secondary border border-border rounded-lg
            text-text-primary placeholder-text-muted
            focus:border-primary focus:ring-4 focus:ring-primary/20
          " placeholder="Buscar usuários...">
          <svg class="w-5 h-5 text-text-muted absolute left-3 top-1/2 transform -translate-y-1/2">
            <!-- Search icon -->
          </svg>
        </div>
        
        <!-- Filters -->
        <button class="
          px-md py-sm bg-bg-secondary border border-border rounded-lg
          text-text-primary hover:bg-bg-tertiary
          transition-colors duration-150
        ">
          Filtros
        </button>
        
        <!-- Add button -->
        <button class="
          px-lg py-md bg-primary hover:bg-primary-dark
          text-white font-semibold rounded-lg
          transition-all duration-normal ease-in-out
        ">
          Novo Usuário
        </button>
      </div>
    </div>
    
    <!-- Filters bar -->
    <div class="flex items-center gap-md mb-lg">
      <span class="text-sm text-text-muted">Filtros ativos:</span>
      <span class="
        inline-flex items-center gap-xs px-md py-xs
        bg-primary/20 text-primary rounded-full text-sm
      ">
        Status: Ativo
        <button class="hover:text-primary-dark">×</button>
      </span>
      <button class="text-sm text-text-accent hover:text-accent-light">
        Limpar filtros
      </button>
    </div>
    
    <!-- Table -->
    <div class="bg-bg-secondary border border-border rounded-lg overflow-hidden">
      <!-- Table header -->
      <div class="px-lg py-md border-b border-border bg-bg-tertiary">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-md">
            <input type="checkbox" class="w-4 h-4 text-primary rounded">
            <span class="text-sm font-medium">
              23 usuários selecionados
            </span>
          </div>
          <div class="flex items-center gap-sm">
            <button class="px-md py-sm text-sm text-text-secondary hover:text-text-primary">
              Exportar
            </button>
            <button class="px-md py-sm text-sm text-error hover:text-error/80">
              Excluir Selecionados
            </button>
          </div>
        </div>
      </div>
      
      <!-- Table content -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left px-lg py-md">
                <input type="checkbox" class="w-4 h-4 text-primary rounded">
              </th>
              <th class="text-left px-lg py-md text-text-secondary font-medium">
                Usuário
              </th>
              <th class="text-left px-lg py-md text-text-secondary font-medium">
                Email
              </th>
              <th class="text-left px-lg py-md text-text-secondary font-medium">
                Status
              </th>
              <th class="text-left px-lg py-md text-text-secondary font-medium">
                Último Acesso
              </th>
              <th class="text-left px-lg py-md text-text-secondary font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border hover:bg-bg-tertiary">
              <td class="px-lg py-md">
                <input type="checkbox" class="w-4 h-4 text-primary rounded">
              </td>
              <td class="px-lg py-md">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white font-medium">JS</span>
                  </div>
                  <div>
                    <div class="font-medium text-text-primary">João Silva</div>
                    <div class="text-sm text-text-muted">ID: 12345</div>
                  </div>
                </div>
              </td>
              <td class="px-lg py-md text-text-secondary">
                joao.silva@email.com
              </td>
              <td class="px-lg py-md">
                <span class="
                  inline-flex px-md py-xs
                  bg-success/20 text-success rounded-full text-xs font-medium
                ">
                  Ativo
                </span>
              </td>
              <td class="px-lg py-md text-text-secondary">
                Há 2 horas
              </td>
              <td class="px-lg py-md">
                <div class="flex items-center gap-sm">
                  <button class="text-primary hover:text-primary-light">
                    Editar
                  </button>
                  <button class="text-text-muted hover:text-text-primary">
                    Ver
                  </button>
                  <button class="text-error hover:text-error/80">
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
            <!-- Mais linhas -->
          </tbody>
        </table>
      </div>
      
      <!-- Table footer -->
      <div class="px-lg py-md border-t border-border bg-bg-tertiary">
        <div class="flex items-center justify-between">
          <div class="text-sm text-text-muted">
            Mostrando 1 a 10 de 234 usuários
          </div>
          <!-- Pagination component aqui -->
        </div>
      </div>
    </div>
  </div>
</div>
```

## 📝 **Formulários Complexos**

### **🔐 Formulário de Login/Registro**
```html
<div class="min-h-screen flex items-center justify-center bg-bg-primary p-lg">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-xl">
      <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-lg">
        <span class="text-white font-bold text-2xl">S</span>
      </div>
      <h1 class="text-2xl font-bold text-text-primary">Bem-vindo ao SymbIA</h1>
      <p class="text-text-secondary mt-sm">Entre em sua conta para continuar</p>
    </div>
    
    <!-- Form -->
    <div class="bg-bg-secondary border border-border rounded-lg p-lg">
      <form class="space-y-lg">
        <!-- Email -->
        <div class="space-y-sm">
          <label class="block text-sm font-medium text-text-primary">
            Email
          </label>
          <input class="
            w-full px-md py-sm
            bg-bg-tertiary border border-border rounded-md
            text-text-primary placeholder-text-muted
            transition-all duration-normal ease-in-out
            focus:border-primary focus:ring-4 focus:ring-primary/20
            focus:outline-none
          " type="email" placeholder="seu@email.com">
        </div>
        
        <!-- Password -->
        <div class="space-y-sm">
          <label class="block text-sm font-medium text-text-primary">
            Senha
          </label>
          <div class="relative">
            <input class="
              w-full px-md py-sm pr-12
              bg-bg-tertiary border border-border rounded-md
              text-text-primary placeholder-text-muted
              transition-all duration-normal ease-in-out
              focus:border-primary focus:ring-4 focus:ring-primary/20
              focus:outline-none
            " type="password" placeholder="••••••••">
            <button class="
              absolute right-3 top-1/2 transform -translate-y-1/2
              text-text-muted hover:text-text-primary
            ">
              <svg class="w-5 h-5"><!-- Eye icon --></svg>
            </button>
          </div>
        </div>
        
        <!-- Remember me & Forgot password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-sm">
            <input type="checkbox" class="w-4 h-4 text-primary rounded">
            <label class="text-sm text-text-secondary">Lembrar de mim</label>
          </div>
          <a class="text-sm text-text-accent hover:text-accent-light">
            Esqueceu a senha?
          </a>
        </div>
        
        <!-- Submit button -->
        <button class="
          w-full py-md
          bg-primary hover:bg-primary-dark
          text-white font-semibold rounded-lg
          transition-all duration-normal ease-in-out
          hover:scale-105
        ">
          Entrar
        </button>
        
        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-md bg-bg-secondary text-text-muted">ou</span>
          </div>
        </div>
        
        <!-- Social login -->
        <button class="
          w-full flex items-center justify-center gap-md py-md
          bg-bg-tertiary border border-border rounded-lg
          text-text-primary
          transition-all duration-normal ease-in-out
          hover:bg-bg-surface
        ">
          <svg class="w-5 h-5"><!-- Google icon --></svg>
          Continuar com Google
        </button>
      </form>
      
      <!-- Sign up link -->
      <div class="text-center mt-lg">
        <span class="text-text-secondary">Não tem conta? </span>
        <a class="text-text-accent hover:text-accent-light font-medium">
          Criar conta
        </a>
      </div>
    </div>
  </div>
</div>
```

### **📊 Formulário de Configurações**
```html
<div class="max-w-4xl mx-auto p-lg">
  <!-- Header -->
  <div class="mb-xl">
    <h1 class="text-3xl font-bold text-text-primary mb-sm">Configurações</h1>
    <p class="text-text-secondary">Gerencie suas preferências e configurações da conta</p>
  </div>
  
  <!-- Tabs -->
  <div class="border-b border-border mb-xl">
    <nav class="flex space-x-lg">
      <button class="py-md px-sm border-b-2 border-primary text-primary font-medium">
        Perfil
      </button>
      <button class="py-md px-sm border-b-2 border-transparent text-text-secondary hover:text-text-primary">
        Segurança
      </button>
      <button class="py-md px-sm border-b-2 border-transparent text-text-secondary hover:text-text-primary">
        Notificações
      </button>
      <button class="py-md px-sm border-b-2 border-transparent text-text-secondary hover:text-text-primary">
        Integrações
      </button>
    </nav>
  </div>
  
  <!-- Form content -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
    <!-- Main content -->
    <div class="lg:col-span-2 space-y-xl">
      <!-- Profile section -->
      <div class="bg-bg-secondary border border-border rounded-lg p-lg">
        <h2 class="text-xl font-semibold text-text-primary mb-lg">
          Informações Pessoais
        </h2>
        
        <form class="space-y-lg">
          <!-- Avatar upload -->
          <div class="flex items-center gap-lg">
            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-2xl">JS</span>
            </div>
            <div>
              <button class="
                px-md py-sm bg-bg-tertiary border border-border rounded
                text-text-primary hover:bg-bg-surface
                transition-colors duration-150
              ">
                Alterar Foto
              </button>
              <p class="text-xs text-text-muted mt-xs">
                JPG, PNG até 5MB
              </p>
            </div>
          </div>
          
          <!-- Form fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div class="space-y-sm">
              <label class="block text-sm font-medium text-text-primary">
                Nome
              </label>
              <input class="
                w-full px-md py-sm
                bg-bg-tertiary border border-border rounded-md
                text-text-primary
                focus:border-primary focus:ring-4 focus:ring-primary/20
                focus:outline-none
              " value="João">
            </div>
            
            <div class="space-y-sm">
              <label class="block text-sm font-medium text-text-primary">
                Sobrenome
              </label>
              <input class="
                w-full px-md py-sm
                bg-bg-tertiary border border-border rounded-md
                text-text-primary
                focus:border-primary focus:ring-4 focus:ring-primary/20
                focus:outline-none
              " value="Silva">
            </div>
          </div>
          
          <div class="space-y-sm">
            <label class="block text-sm font-medium text-text-primary">
              Email
            </label>
            <input class="
              w-full px-md py-sm
              bg-bg-tertiary border border-border rounded-md
              text-text-primary
              focus:border-primary focus:ring-4 focus:ring-primary/20
              focus:outline-none
            " value="joao@email.com">
          </div>
          
          <div class="space-y-sm">
            <label class="block text-sm font-medium text-text-primary">
              Bio
            </label>
            <textarea class="
              w-full px-md py-sm
              bg-bg-tertiary border border-border rounded-md
              text-text-primary
              focus:border-primary focus:ring-4 focus:ring-primary/20
              focus:outline-none
              resize-none
            " rows="4" placeholder="Conte um pouco sobre você..."></textarea>
          </div>
        </form>
      </div>
      
      <!-- Preferences section -->
      <div class="bg-bg-secondary border border-border rounded-lg p-lg">
        <h2 class="text-xl font-semibold text-text-primary mb-lg">
          Preferências
        </h2>
        
        <div class="space-y-lg">
          <!-- Theme -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-text-primary">Tema</h3>
              <p class="text-sm text-text-secondary">Escolha o tema da interface</p>
            </div>
            <select class="
              px-md py-sm bg-bg-tertiary border border-border rounded
              text-text-primary focus:border-primary
            ">
              <option>Escuro (atual)</option>
              <option>Claro</option>
              <option>Automático</option>
            </select>
          </div>
          
          <!-- Language -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-text-primary">Idioma</h3>
              <p class="text-sm text-text-secondary">Idioma da interface</p>
            </div>
            <select class="
              px-md py-sm bg-bg-tertiary border border-border rounded
              text-text-primary focus:border-primary
            ">
              <option>Português (BR)</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>
          
          <!-- Toggle switches -->
          <div class="space-y-md">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-text-primary">Email Marketing</h3>
                <p class="text-sm text-text-secondary">Receber emails promocionais</p>
              </div>
              <button class="
                relative inline-flex h-6 w-11 items-center rounded-full
                bg-bg-tertiary transition-colors focus:outline-none
                focus:ring-2 focus:ring-primary/20
              ">
                <span class="
                  inline-block h-4 w-4 rounded-full bg-white
                  transform transition-transform translate-x-1
                "></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sidebar -->
    <div class="space-y-lg">
      <!-- Account status -->
      <div class="bg-bg-secondary border border-border rounded-lg p-lg">
        <h3 class="font-semibold text-text-primary mb-md">Status da Conta</h3>
        <div class="space-y-md">
          <div class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">Plano</span>
            <span class="text-sm font-medium text-text-primary">Pro</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">Status</span>
            <span class="inline-flex px-sm py-xs bg-success/20 text-success rounded-full text-xs">
              Ativo
            </span>
          </div>
          <button class="w-full px-md py-sm bg-primary text-white rounded text-sm">
            Gerenciar Plano
          </button>
        </div>
      </div>
      
      <!-- Quick actions -->
      <div class="bg-bg-secondary border border-border rounded-lg p-lg">
        <h3 class="font-semibold text-text-primary mb-md">Ações Rápidas</h3>
        <div class="space-y-sm">
          <button class="w-full text-left px-md py-sm rounded hover:bg-bg-tertiary text-sm">
            Baixar dados
          </button>
          <button class="w-full text-left px-md py-sm rounded hover:bg-bg-tertiary text-sm">
            Alterar senha
          </button>
          <button class="w-full text-left px-md py-sm rounded hover:bg-bg-tertiary text-sm text-error">
            Excluir conta
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Save actions -->
  <div class="flex justify-end gap-md mt-xl pt-lg border-t border-border">
    <button class="px-lg py-md text-text-secondary hover:text-text-primary">
      Cancelar
    </button>
    <button class="
      px-lg py-md bg-primary hover:bg-primary-dark
      text-white font-semibold rounded-lg
      transition-all duration-normal ease-in-out
    ">
      Salvar Alterações
    </button>
  </div>
</div>
```

## 🎯 **Guia para IAs - Aplicação dos Padrões**

### **Escolha de Layout por Tipo de Aplicação**

| Tipo de App | Layout Recomendado | Características |
|-------------|-------------------|-----------------|
| **Dashboard/Admin** | Dashboard Layout | Sidebar + métricas + tabelas |
| **SaaS/Product** | Landing Page | Hero + features + CTAs |
| **CRUD/Listagem** | Lista de Dados | Filtros + tabela + paginação |
| **Auth** | Formulário Login | Centrado + simples + social login |
| **Configurações** | Formulário Config | Tabs + sidebar + seções |

### **Customização Rápida dos Padrões**

```html
<!-- Mudar cor do tema -->
<div class="bg-accent"> <!-- Ao invés de bg-primary -->

<!-- Ajustar espaçamentos -->
<div class="p-xl"> <!-- Ao invés de p-lg -->

<!-- Mudar grid responsivo -->
<div class="grid-cols-2 lg:grid-cols-4"> <!-- Ao invés de 3 -->

<!-- Personalizar sidebar -->
<aside class="w-80"> <!-- Ao invés de w-64 -->
```

### **Estrutura Padrão para Qualquer Tela**

```html
<div class="min-h-screen bg-bg-primary text-text-primary">
  <!-- Header/Navigation -->
  
  <main class="max-w-7xl mx-auto p-lg">
    <!-- Breadcrumb (se aplicável) -->
    
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-lg">
      <div>
        <h1 class="text-3xl font-bold">Título da Página</h1>
        <p class="text-text-secondary">Descrição da página</p>
      </div>
      <div>
        <!-- Actions (botões, filtros, etc) -->
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="space-y-lg">
      <!-- Conteúdo específico -->
    </div>
  </main>
</div>
```

---

**💡 Estes padrões são otimizados para responsividade, acessibilidade e experiência do usuário, seguindo as melhores práticas do SymbIA Framework.**
