# 🧩 SymbIA Framework - Componentes Prontos

## 📋 **Visão Geral**

Este documento apresenta componentes prontos usando as classes utilitárias do SymbIA Framework. Cada componente é construído com as melhores práticas de design e pode ser copiado e customizado conforme necessário.

## 🎛️ **Componentes de Interface**

### **🔘 Botões**

#### **Botões Primários**
```html
<!-- Botão primário padrão -->
<button class="
  px-lg py-md bg-primary hover:bg-primary-dark 
  text-white font-semibold rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-105 hover:shadow-lg
  active:scale-95
  focus:outline-none focus:ring-4 focus:ring-primary/20
">
  Botão Primário
</button>

<!-- Botão primário grande -->
<button class="
  px-xl py-lg bg-primary hover:bg-primary-dark 
  text-white font-semibold rounded-lg text-lg
  transition-all duration-normal ease-in-out
  hover:scale-105 hover:shadow-lg
  active:scale-95
">
  Botão Grande
</button>

<!-- Botão primário pequeno -->
<button class="
  px-md py-sm bg-primary hover:bg-primary-dark 
  text-white font-medium rounded text-sm
  transition-all duration-150 ease-in-out
  hover:scale-105
  active:scale-95
">
  Botão Pequeno
</button>
```

#### **Botões Secundários**
```html
<!-- Botão secundário (outline) -->
<button class="
  px-lg py-md bg-transparent border-2 border-primary
  text-primary hover:bg-primary hover:text-white
  font-semibold rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-105
  active:scale-95
">
  Botão Secundário
</button>

<!-- Botão fantasma -->
<button class="
  px-lg py-md bg-bg-tertiary hover:bg-bg-surface
  text-text-primary border border-border hover:border-primary
  font-semibold rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-105
  active:scale-95
">
  Botão Fantasma
</button>
```

#### **Botões de Status**
```html
<!-- Botão de sucesso -->
<button class="
  px-lg py-md bg-success hover:bg-success/80
  text-white font-semibold rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-105
">
  Confirmar
</button>

<!-- Botão de erro -->
<button class="
  px-lg py-md bg-error hover:bg-error/80
  text-white font-semibold rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-105
">
  Excluir
</button>

<!-- Botão de aviso -->
<button class="
  px-lg py-md bg-warning hover:bg-warning/80
  text-white font-semibold rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-105
">
  Atenção
</button>
```

#### **Botões com Ícones**
```html
<!-- Botão com ícone à esquerda -->
<button class="
  flex items-center gap-sm px-lg py-md 
  bg-primary hover:bg-primary-dark text-white
  font-semibold rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-105
">
  <svg class="w-5 h-5" fill="none" stroke="currentColor">
    <!-- Ícone aqui -->
  </svg>
  Download
</button>

<!-- Botão apenas ícone -->
<button class="
  w-10 h-10 flex items-center justify-center
  bg-primary hover:bg-primary-dark text-white
  rounded-lg
  transition-all duration-normal ease-in-out
  hover:scale-110
">
  <svg class="w-5 h-5" fill="none" stroke="currentColor">
    <!-- Ícone aqui -->
  </svg>
</button>
```

### **📄 Cards**

#### **Card Básico**
```html
<div class="
  bg-bg-secondary border border-border rounded-lg
  p-lg
  transition-all duration-normal ease-in-out
  hover:shadow-lg hover:-translate-y-1
">
  <h3 class="text-xl font-semibold text-text-primary mb-md">
    Título do Card
  </h3>
  <p class="text-text-secondary mb-lg">
    Descrição do card com conteúdo relevante para o usuário.
  </p>
  <div class="flex justify-end gap-sm">
    <button class="px-md py-sm text-text-secondary hover:text-text-primary">
      Cancelar
    </button>
    <button class="px-md py-sm bg-primary text-white rounded hover:bg-primary-dark">
      Confirmar
    </button>
  </div>
</div>
```

#### **Card com Imagem**
```html
<div class="
  bg-bg-secondary border border-border rounded-lg
  overflow-hidden
  transition-all duration-normal ease-in-out
  hover:shadow-lg hover:-translate-y-1
">
  <!-- Imagem -->
  <div class="aspect-video overflow-hidden">
    <img class="
      w-full h-full object-cover
      transition-transform duration-500 ease-out
      hover:scale-110
    " src="card-image.jpg" alt="Card Image">
  </div>
  
  <!-- Conteúdo -->
  <div class="p-lg">
    <h3 class="text-xl font-semibold text-text-primary mb-sm">
      Título do Card
    </h3>
    <p class="text-text-secondary mb-md">
      Descrição do card com informações importantes.
    </p>
    <div class="flex items-center justify-between">
      <span class="text-sm text-text-muted">12 min atrás</span>
      <button class="text-primary hover:text-primary-light">
        Ler mais
      </button>
    </div>
  </div>
</div>
```

#### **Card de Métricas**
```html
<div class="
  bg-bg-secondary border border-border rounded-lg
  p-lg
  transition-all duration-normal ease-in-out
  hover:shadow-lg
">
  <div class="flex items-center justify-between mb-md">
    <h3 class="text-sm font-medium text-text-secondary uppercase tracking-wider">
      Total de Vendas
    </h3>
    <div class="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
      <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor">
        <!-- Ícone -->
      </svg>
    </div>
  </div>
  
  <div class="mb-sm">
    <span class="text-3xl font-bold text-text-primary">R$ 45.231</span>
  </div>
  
  <div class="flex items-center gap-xs">
    <span class="text-sm text-success">+12%</span>
    <span class="text-sm text-text-muted">em relação ao mês anterior</span>
  </div>
</div>
```

### **📝 Formulários**

#### **Input de Texto**
```html
<div class="space-y-sm">
  <label class="block text-sm font-medium text-text-primary">
    Nome Completo
  </label>
  <input class="
    w-full px-md py-sm
    bg-bg-tertiary border border-border rounded-md
    text-text-primary placeholder-text-muted
    transition-all duration-normal ease-in-out
    focus:border-primary focus:ring-4 focus:ring-primary/20
    focus:outline-none
  " type="text" placeholder="Digite seu nome">
  <p class="text-xs text-text-muted">
    Seu nome será usado para identificação
  </p>
</div>
```

#### **Select/Dropdown**
```html
<div class="space-y-sm">
  <label class="block text-sm font-medium text-text-primary">
    Categoria
  </label>
  <select class="
    w-full px-md py-sm
    bg-bg-tertiary border border-border rounded-md
    text-text-primary
    transition-all duration-normal ease-in-out
    focus:border-primary focus:ring-4 focus:ring-primary/20
    focus:outline-none
  ">
    <option>Selecione uma categoria</option>
    <option>Tecnologia</option>
    <option>Design</option>
    <option>Marketing</option>
  </select>
</div>
```

#### **Textarea**
```html
<div class="space-y-sm">
  <label class="block text-sm font-medium text-text-primary">
    Descrição
  </label>
  <textarea class="
    w-full px-md py-sm
    bg-bg-tertiary border border-border rounded-md
    text-text-primary placeholder-text-muted
    transition-all duration-normal ease-in-out
    focus:border-primary focus:ring-4 focus:ring-primary/20
    focus:outline-none
    resize-none
  " rows="4" placeholder="Descreva os detalhes..."></textarea>
</div>
```

#### **Checkbox e Radio**
```html
<!-- Checkbox -->
<div class="flex items-center gap-sm">
  <input class="
    w-4 h-4 text-primary bg-bg-tertiary border-border rounded
    focus:ring-primary focus:ring-2
  " type="checkbox" id="terms">
  <label class="text-sm text-text-primary" for="terms">
    Aceito os termos e condições
  </label>
</div>

<!-- Radio buttons -->
<div class="space-y-sm">
  <label class="text-sm font-medium text-text-primary">Plano</label>
  <div class="flex items-center gap-sm">
    <input class="
      w-4 h-4 text-primary bg-bg-tertiary border-border
      focus:ring-primary focus:ring-2
    " type="radio" id="basic" name="plan" value="basic">
    <label class="text-sm text-text-primary" for="basic">Básico</label>
  </div>
  <div class="flex items-center gap-sm">
    <input class="
      w-4 h-4 text-primary bg-bg-tertiary border-border
      focus:ring-primary focus:ring-2
    " type="radio" id="premium" name="plan" value="premium">
    <label class="text-sm text-text-primary" for="premium">Premium</label>
  </div>
</div>
```

### **🚨 Alertas e Notificações**

#### **Alert de Sucesso**
```html
<div class="
  bg-success/10 border border-success/30 rounded-lg p-md
  transition-all duration-normal ease-in-out
">
  <div class="flex items-start gap-md">
    <div class="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-none mt-xs">
      <svg class="w-3 h-3 text-white" fill="currentColor">
        <!-- Check icon -->
      </svg>
    </div>
    <div class="flex-1">
      <h4 class="font-semibold text-success mb-xs">Sucesso!</h4>
      <p class="text-success text-sm">Operação realizada com sucesso.</p>
    </div>
    <button class="text-success/70 hover:text-success">
      <svg class="w-4 h-4" fill="none" stroke="currentColor">
        <!-- X icon -->
      </svg>
    </button>
  </div>
</div>
```

#### **Alert de Erro**
```html
<div class="
  bg-error/10 border border-error/30 rounded-lg p-md
  transition-all duration-normal ease-in-out
">
  <div class="flex items-start gap-md">
    <div class="w-5 h-5 bg-error rounded-full flex items-center justify-center flex-none mt-xs">
      <svg class="w-3 h-3 text-white" fill="currentColor">
        <!-- Error icon -->
      </svg>
    </div>
    <div class="flex-1">
      <h4 class="font-semibold text-error mb-xs">Erro!</h4>
      <p class="text-error text-sm">Ocorreu um erro ao processar a solicitação.</p>
    </div>
    <button class="text-error/70 hover:text-error">
      <svg class="w-4 h-4" fill="none" stroke="currentColor">
        <!-- X icon -->
      </svg>
    </button>
  </div>
</div>
```

#### **Toast Notification**
```html
<div class="
  fixed top-4 right-4 z-tooltip
  bg-bg-secondary border border-border rounded-lg shadow-lg
  p-md max-w-sm
  transition-all duration-normal ease-out
  transform translate-x-full animate-slide-in-right
">
  <div class="flex items-start gap-md">
    <div class="w-8 h-8 bg-info rounded-full flex items-center justify-center flex-none">
      <svg class="w-4 h-4 text-white" fill="currentColor">
        <!-- Info icon -->
      </svg>
    </div>
    <div class="flex-1">
      <h4 class="font-semibold text-text-primary mb-xs">Nova mensagem</h4>
      <p class="text-text-secondary text-sm">Você tem uma nova mensagem de João Silva.</p>
    </div>
    <button class="text-text-muted hover:text-text-primary">
      <svg class="w-4 h-4" fill="none" stroke="currentColor">
        <!-- X icon -->
      </svg>
    </button>
  </div>
</div>
```

### **🗂️ Navegação**

#### **Breadcrumb**
```html
<nav class="flex items-center space-x-xs text-sm">
  <a class="text-text-accent hover:text-accent-light" href="#">Home</a>
  <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor">
    <!-- Chevron right icon -->
  </svg>
  <a class="text-text-accent hover:text-accent-light" href="#">Projetos</a>
  <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor">
    <!-- Chevron right icon -->
  </svg>
  <span class="text-text-muted">Projeto Atual</span>
</nav>
```

#### **Tabs**
```html
<div class="border-b border-border">
  <nav class="flex space-x-lg">
    <button class="
      py-md px-sm border-b-2 border-primary text-primary
      font-medium text-sm
      transition-colors duration-150 ease-in-out
    ">
      Visão Geral
    </button>
    <button class="
      py-md px-sm border-b-2 border-transparent text-text-secondary
      font-medium text-sm
      transition-colors duration-150 ease-in-out
      hover:text-text-primary hover:border-border-light
    ">
      Detalhes
    </button>
    <button class="
      py-md px-sm border-b-2 border-transparent text-text-secondary
      font-medium text-sm
      transition-colors duration-150 ease-in-out
      hover:text-text-primary hover:border-border-light
    ">
      Configurações
    </button>
  </nav>
</div>
```

#### **Pagination**
```html
<div class="flex items-center justify-between">
  <div class="text-sm text-text-muted">
    Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de <span class="font-medium">97</span> resultados
  </div>
  
  <nav class="flex items-center gap-xs">
    <button class="
      px-md py-sm border border-border rounded
      text-text-secondary bg-bg-tertiary
      hover:bg-bg-surface hover:text-text-primary
      transition-all duration-150 ease-in-out
      disabled:opacity-50 disabled:cursor-not-allowed
    " disabled>
      Anterior
    </button>
    
    <button class="
      px-md py-sm border border-primary rounded
      text-white bg-primary
    ">
      1
    </button>
    
    <button class="
      px-md py-sm border border-border rounded
      text-text-primary bg-bg-tertiary
      hover:bg-bg-surface
      transition-all duration-150 ease-in-out
    ">
      2
    </button>
    
    <button class="
      px-md py-sm border border-border rounded
      text-text-primary bg-bg-tertiary
      hover:bg-bg-surface
      transition-all duration-150 ease-in-out
    ">
      3
    </button>
    
    <span class="px-md py-sm text-text-muted">...</span>
    
    <button class="
      px-md py-sm border border-border rounded
      text-text-primary bg-bg-tertiary
      hover:bg-bg-surface hover:text-text-primary
      transition-all duration-150 ease-in-out
    ">
      Próximo
    </button>
  </nav>
</div>
```

### **📊 Tabelas**

#### **Tabela Básica**
```html
<div class="overflow-x-auto">
  <table class="w-full">
    <thead class="bg-bg-tertiary border-b border-border">
      <tr>
        <th class="px-md py-sm text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
          Nome
        </th>
        <th class="px-md py-sm text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
          Email
        </th>
        <th class="px-md py-sm text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
          Status
        </th>
        <th class="px-md py-sm text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
          Ações
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border">
      <tr class="hover:bg-bg-tertiary transition-colors duration-150 ease-in-out">
        <td class="px-md py-sm whitespace-nowrap">
          <div class="flex items-center gap-md">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">JS</span>
            </div>
            <span class="text-text-primary font-medium">João Silva</span>
          </div>
        </td>
        <td class="px-md py-sm whitespace-nowrap text-text-secondary">
          joao@email.com
        </td>
        <td class="px-md py-sm whitespace-nowrap">
          <span class="inline-flex px-sm py-xs bg-success/20 text-success rounded-full text-xs font-medium">
            Ativo
          </span>
        </td>
        <td class="px-md py-sm whitespace-nowrap">
          <div class="flex items-center gap-sm">
            <button class="text-primary hover:text-primary-light">Editar</button>
            <button class="text-error hover:text-error/80">Excluir</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### **🪟 Modais**

#### **Modal Básico**
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/50 z-modal-backdrop flex items-center justify-center p-lg">
  <!-- Modal -->
  <div class="
    bg-bg-secondary rounded-xl w-full max-w-md
    transition-all duration-normal ease-out
    transform scale-95 animate-scale-in
  ">
    <!-- Header -->
    <div class="flex items-center justify-between p-lg border-b border-border">
      <h2 class="text-xl font-semibold text-text-primary">
        Confirmar Ação
      </h2>
      <button class="
        text-text-muted hover:text-text-primary
        transition-colors duration-150 ease-in-out
      ">
        <svg class="w-5 h-5" fill="none" stroke="currentColor">
          <!-- X icon -->
        </svg>
      </button>
    </div>
    
    <!-- Content -->
    <div class="p-lg">
      <p class="text-text-secondary">
        Tem certeza que deseja continuar com esta ação? Esta operação não pode ser desfeita.
      </p>
    </div>
    
    <!-- Actions -->
    <div class="flex justify-end gap-sm p-lg border-t border-border bg-bg-tertiary">
      <button class="
        px-lg py-md text-text-secondary
        transition-colors duration-150 ease-in-out
        hover:text-text-primary
      ">
        Cancelar
      </button>
      <button class="
        px-lg py-md bg-error text-white rounded
        transition-all duration-150 ease-in-out
        hover:bg-error/80
      ">
        Confirmar
      </button>
    </div>
  </div>
</div>
```

## 🎯 **Guia para IAs - Uso dos Componentes**

### **Escolha de Componentes por Contexto**

| Necessidade | Componente | Variação |
|-------------|------------|----------|
| **Ação Principal** | Botão Primário | Grande para CTAs importantes |
| **Ação Secundária** | Botão Outline | Médio para ações complementares |
| **Exibir Informação** | Card Básico | Com imagem se relevante |
| **Entrada de Dados** | Form Input | Com validação visual |
| **Feedback ao Usuário** | Alert/Toast | Tipo baseado no resultado |
| **Navegação** | Tabs/Breadcrumb | Baseado na hierarquia |
| **Dados Tabulares** | Tabela | Com hover para interatividade |
| **Confirmação** | Modal | Com ações claras |

### **Customização Rápida**

```html
<!-- Mudança de cor do botão -->
<button class="bg-accent hover:bg-accent-dark"> <!-- Ao invés de primary -->

<!-- Mudança de tamanho do card -->
<div class="p-xl"> <!-- Ao invés de p-lg -->

<!-- Mudança de status do alert -->
<div class="bg-warning/10 border-warning/30"> <!-- Ao invés de success -->
```

### **Combinações Eficazes**

- **Form + Alert**: Input com validação visual
- **Card + Button**: Call-to-action claro
- **Table + Pagination**: Navegação de dados
- **Modal + Form**: Entrada de dados contextual
- **Toast + Button**: Feedback de ações

## 📋 **Dropdown Component**

### **Dropdown Básico**
```html
<!-- Estrutura HTML básica do dropdown -->
<div class="dropdown">
  <button class="dropdown__trigger" type="button">
    <span class="dropdown__trigger-text">Select Option</span>
    <span class="dropdown__icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    </span>
  </button>
  
  <div class="dropdown__content dropdown__content--open">
    <div class="dropdown__menu">
      <button class="dropdown__item" type="button">
        <span class="dropdown__item-icon">👤</span>
        <span class="dropdown__item-text">Profile</span>
      </button>
      <button class="dropdown__item" type="button">
        <span class="dropdown__item-icon">⚙️</span>
        <span class="dropdown__item-text">Settings</span>
      </button>
      <div class="dropdown__divider"></div>
      <button class="dropdown__item" type="button">
        <span class="dropdown__item-icon">🚪</span>
        <span class="dropdown__item-text">Logout</span>
      </button>
    </div>
  </div>
</div>
```

### **Variações de Tamanho**
```html
<!-- Dropdown pequeno -->
<div class="dropdown dropdown--sm">
  <button class="dropdown__trigger">Small Dropdown</button>
  <!-- content -->
</div>

<!-- Dropdown médio (padrão) -->
<div class="dropdown dropdown--md">
  <button class="dropdown__trigger">Medium Dropdown</button>
  <!-- content -->
</div>

<!-- Dropdown grande -->
<div class="dropdown dropdown--lg">
  <button class="dropdown__trigger">Large Dropdown</button>
  <!-- content -->
</div>
```

### **Variações de Cor**
```html
<!-- Dropdown padrão -->
<div class="dropdown">
  <button class="dropdown__trigger">Default</button>
</div>

<!-- Dropdown primário -->
<div class="dropdown dropdown--primary">
  <button class="dropdown__trigger">Primary</button>
</div>

<!-- Dropdown secundário -->
<div class="dropdown dropdown--secondary">
  <button class="dropdown__trigger">Secondary</button>
</div>

<!-- Dropdown accent -->
<div class="dropdown dropdown--accent">
  <button class="dropdown__trigger">Accent</button>
</div>

<!-- Dropdown outline -->
<div class="dropdown dropdown--outline">
  <button class="dropdown__trigger">Outline</button>
</div>
```

### **Variações de Border Radius**
```html
<!-- Border radius pequeno -->
<div class="dropdown dropdown--rounded-sm">
  <button class="dropdown__trigger">Small Radius</button>
</div>

<!-- Border radius médio (padrão) -->
<div class="dropdown dropdown--rounded-md">
  <button class="dropdown__trigger">Medium Radius</button>
</div>

<!-- Border radius grande -->
<div class="dropdown dropdown--rounded-lg">
  <button class="dropdown__trigger">Large Radius</button>
</div>

<!-- Border radius extra grande -->
<div class="dropdown dropdown--rounded-xl">
  <button class="dropdown__trigger">XL Radius</button>
</div>

<!-- Border radius completo -->
<div class="dropdown dropdown--rounded-full">
  <button class="dropdown__trigger">Full Radius</button>
</div>
```

### **Estados do Dropdown**
```html
<!-- Estado aberto -->
<div class="dropdown">
  <button class="dropdown__trigger dropdown__trigger--open">
    Open State
    <span class="dropdown__icon dropdown__icon--open">↑</span>
  </button>
  <div class="dropdown__content dropdown__content--open">
    <!-- menu content -->
  </div>
</div>

<!-- Estado desabilitado -->
<div class="dropdown">
  <button class="dropdown__trigger dropdown__trigger--disabled" disabled>
    Disabled State
  </button>
</div>

<!-- Item selecionado -->
<button class="dropdown__item dropdown__item--selected">
  <span class="dropdown__item-text">Selected Item</span>
</button>

<!-- Item desabilitado -->
<button class="dropdown__item dropdown__item--disabled" disabled>
  <span class="dropdown__item-text">Disabled Item</span>
</button>
```

### **Posicionamento**
```html
<!-- Dropdown posicionado abaixo (padrão) -->
<div class="dropdown">
  <button class="dropdown__trigger">Bottom Position</button>
  <div class="dropdown__content"><!-- content --></div>
</div>

<!-- Dropdown posicionado acima -->
<div class="dropdown">
  <button class="dropdown__trigger">Top Position</button>
  <div class="dropdown__content dropdown__content--above"><!-- content --></div>
</div>
```

### **Full Width**
```html
<!-- Dropdown ocupando toda a largura -->
<div class="dropdown dropdown--full-width">
  <button class="dropdown__trigger">Full Width Dropdown</button>
  <div class="dropdown__content"><!-- content --></div>
</div>
```

### **Classes CSS Disponíveis**

#### **Container Principal**
- `.dropdown` - Container base
- `.dropdown--sm` - Tamanho pequeno
- `.dropdown--lg` - Tamanho grande
- `.dropdown--primary` - Estilo primário
- `.dropdown--secondary` - Estilo secundário
- `.dropdown--accent` - Estilo accent
- `.dropdown--outline` - Estilo outline
- `.dropdown--rounded-sm` - Border radius pequeno
- `.dropdown--rounded-lg` - Border radius grande
- `.dropdown--rounded-xl` - Border radius extra grande
- `.dropdown--rounded-full` - Border radius completo
- `.dropdown--full-width` - Largura completa

#### **Trigger (Botão)**
- `.dropdown__trigger` - Botão principal
- `.dropdown__trigger--open` - Estado aberto
- `.dropdown__trigger--disabled` - Estado desabilitado

#### **Conteúdo**
- `.dropdown__content` - Container do conteúdo
- `.dropdown__content--open` - Estado aberto (visível)
- `.dropdown__content--above` - Posicionado acima

#### **Menu e Items**
- `.dropdown__menu` - Container dos itens do menu
- `.dropdown__item` - Item individual do menu
- `.dropdown__item--selected` - Item selecionado
- `.dropdown__item--disabled` - Item desabilitado
- `.dropdown__item-icon` - Ícone do item
- `.dropdown__item-text` - Texto do item
- `.dropdown__divider` - Divisória entre itens

#### **Ícones**
- `.dropdown__icon` - Ícone do trigger (seta)
- `.dropdown__icon--open` - Ícone quando aberto (rotacionado)

### **Exemplo Completo**
```html
<div class="dropdown dropdown--primary dropdown--lg dropdown--rounded-lg">
  <button class="dropdown__trigger" type="button">
    <span class="dropdown__trigger-text">User Menu</span>
    <span class="dropdown__icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    </span>
  </button>
  
  <div class="dropdown__content">
    <div class="dropdown__menu">
      <button class="dropdown__item" type="button">
        <span class="dropdown__item-icon">
          <svg width="16" height="16" fill="currentColor">
            <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM8 9a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5z"/>
          </svg>
        </span>
        <span class="dropdown__item-text">Profile</span>
      </button>
      
      <button class="dropdown__item" type="button">
        <span class="dropdown__item-icon">
          <svg width="16" height="16" fill="currentColor">
            <path d="M8 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
          </svg>
        </span>
        <span class="dropdown__item-text">Settings</span>
      </button>
      
      <div class="dropdown__divider"></div>
      
      <button class="dropdown__item" type="button">
        <span class="dropdown__item-icon">
          <svg width="16" height="16" fill="currentColor">
            <path d="M6 3.5a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5z"/>
          </svg>
        </span>
        <span class="dropdown__item-text">Logout</span>
      </button>
    </div>
  </div>
</div>
```

---

**💡 Todos os componentes são responsivos e seguem as melhores práticas de acessibilidade do framework.**
