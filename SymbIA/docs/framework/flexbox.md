# 🔄 SymbIA Framework - Sistema Flexbox

## 📋 **Visão Geral**

O sistema Flexbox do SymbIA Framework oferece classes utilitárias completas para criar layouts flexíveis e responsivos usando CSS Flexbox.

## 📦 **Display Flex**

### **Classes de Display**
```html
<!-- Flex containers -->
<div class="flex">Container flex</div>
<div class="inline-flex">Container inline flex</div>

<!-- Comparação -->
<div class="block">Elemento em bloco normal</div>
<div class="flex">Elemento flex (comporta-se como block mas com poderes flex)</div>
<div class="inline-flex">Elemento inline-flex (comporta-se como inline-block mas com poderes flex)</div>
```

## 🧭 **Direção (Flex Direction)**

### **Direções de Flexbox**
```html
<!-- Direção horizontal (padrão) -->
<div class="flex flex-row">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Direção horizontal reversa -->
<div class="flex flex-row-reverse">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Ordem visual: Item 3, Item 2, Item 1 -->
</div>

<!-- Direção vertical -->
<div class="flex flex-col">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Direção vertical reversa -->
<div class="flex flex-col-reverse">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Ordem visual: Item 3, Item 2, Item 1 (verticalmente) -->
</div>
```

## 🔄 **Wrap (Quebra de Linha)**

### **Controle de Quebra**
```html
<!-- Sem quebra (padrão) -->
<div class="flex flex-nowrap">
  <div>Item muito longo que não quebra</div>
  <div>Outro item muito longo</div>
  <div>Mais um item</div>
</div>

<!-- Com quebra -->
<div class="flex flex-wrap">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Itens quebram para nova linha se necessário -->
</div>

<!-- Com quebra reversa -->
<div class="flex flex-wrap-reverse">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Novas linhas aparecem acima -->
</div>
```

## 📏 **Flex (Crescimento e Encolhimento)**

### **Flex Properties**
```html
<!-- Flex auto - cresce e encolhe conforme necessário -->
<div class="flex">
  <div class="flex-auto">Cresce e encolhe automaticamente</div>
  <div>Conteúdo fixo</div>
</div>

<!-- Flex 1 - ocupa espaço disponível igualmente -->
<div class="flex">
  <div class="flex-1">Ocupa 1 parte</div>
  <div class="flex-1">Ocupa 1 parte</div>
  <div class="flex-1">Ocupa 1 parte</div>
</div>

<!-- Flex none - não cresce nem encolhe -->
<div class="flex">
  <div class="flex-none w-32">Largura fixa 32</div>
  <div class="flex-1">Ocupa resto do espaço</div>
</div>

<!-- Flex initial - usa tamanho inicial -->
<div class="flex">
  <div class="flex-initial">Tamanho baseado no conteúdo</div>
  <div class="flex-1">Ocupa resto</div>
</div>
```

## 📐 **Justify Content (Alinhamento Horizontal)**

### **Alinhamento no Eixo Principal**
```html
<!-- Início (padrão) -->
<div class="flex justify-start">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Centro -->
<div class="flex justify-center">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Final -->
<div class="flex justify-end">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Espaço entre -->
<div class="flex justify-between">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Espaço igual entre itens, nada nas bordas -->
</div>

<!-- Espaço ao redor -->
<div class="flex justify-around">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Espaço igual ao redor de cada item -->
</div>

<!-- Espaço uniformemente distribuído -->
<div class="flex justify-evenly">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Espaço igual entre itens e nas bordas -->
</div>
```

## 📏 **Align Items (Alinhamento Vertical)**

### **Alinhamento no Eixo Transversal**
```html
<!-- Início -->
<div class="flex items-start h-24">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Centro -->
<div class="flex items-center h-24">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Final -->
<div class="flex items-end h-24">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Esticado -->
<div class="flex items-stretch h-24">
  <div>Item 1</div>
  <div>Item 2</div>
  <!-- Itens esticam para ocupar toda altura -->
</div>

<!-- Baseline -->
<div class="flex items-baseline h-24">
  <div class="text-2xl">Item Grande</div>
  <div class="text-sm">Item Pequeno</div>
  <!-- Alinhados pela linha base do texto -->
</div>
```

## 📊 **Align Content (Alinhamento de Linhas)**

### **Para Flex Containers com Múltiplas Linhas**
```html
<!-- Centro -->
<div class="flex flex-wrap content-center h-48">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Início -->
<div class="flex flex-wrap content-start h-48">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Final -->
<div class="flex flex-wrap content-end h-48">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Espaço entre -->
<div class="flex flex-wrap content-between h-48">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Espaço ao redor -->
<div class="flex flex-wrap content-around h-48">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

## 🎯 **Align Self (Alinhamento Individual)**

### **Alinhamento de Itens Específicos**
```html
<div class="flex items-center h-24">
  <div class="self-start">Alinha ao início</div>
  <div class="self-center">Alinha ao centro</div>
  <div class="self-end">Alinha ao final</div>
  <div class="self-stretch">Estica</div>
  <div class="self-auto">Automático (herda do container)</div>
</div>
```

## 🔢 **Order (Ordem de Exibição)**

### **Reordenação Visual**
```html
<div class="flex">
  <div class="order-3">Primeiro no HTML, terceiro visual</div>
  <div class="order-1">Segundo no HTML, primeiro visual</div>
  <div class="order-2">Terceiro no HTML, segundo visual</div>
</div>

<!-- Order com valores negativos e específicos -->
<div class="flex">
  <div class="order-last">Último</div>
  <div class="order-first">Primeiro</div>
  <div class="order-none">Ordem normal</div>
</div>
```

## 🎯 **Padrões de Layout Comuns**

### **Header com Logo e Navegação**
```html
<header class="flex justify-between items-center p-lg bg-bg-secondary">
  <!-- Logo à esquerda -->
  <div class="flex items-center gap-md">
    <img class="w-8 h-8" src="logo.png" alt="Logo">
    <h1 class="text-xl font-bold">SymbIA</h1>
  </div>
  
  <!-- Navegação à direita -->
  <nav class="flex gap-lg">
    <a class="text-text-accent hover:text-accent-light">Home</a>
    <a class="text-text-secondary hover:text-text-accent">About</a>
    <a class="text-text-secondary hover:text-text-accent">Contact</a>
  </nav>
</header>
```

### **Card com Header e Actions**
```html
<div class="bg-bg-secondary rounded-lg overflow-hidden">
  <!-- Header do card -->
  <div class="flex justify-between items-center p-lg border-b border-border">
    <h3 class="text-xl font-semibold">Título do Card</h3>
    <button class="text-text-muted hover:text-text-primary">⋯</button>
  </div>
  
  <!-- Conteúdo -->
  <div class="p-lg">
    <p class="text-text-secondary mb-lg">Conteúdo do card...</p>
  </div>
  
  <!-- Actions -->
  <div class="flex justify-end gap-sm p-lg bg-bg-tertiary">
    <button class="px-md py-sm text-text-secondary">Cancelar</button>
    <button class="px-md py-sm bg-primary text-white rounded">Confirmar</button>
  </div>
</div>
```

### **Layout de Formulário**
```html
<form class="space-y-lg">
  <!-- Campo com label e input lado a lado -->
  <div class="flex items-center gap-md">
    <label class="w-24 text-sm font-medium flex-none">Nome:</label>
    <input class="flex-1 px-md py-sm border border-border rounded">
  </div>
  
  <!-- Campo com label acima -->
  <div class="flex flex-col gap-sm">
    <label class="text-sm font-medium">Descrição:</label>
    <textarea class="px-md py-sm border border-border rounded" rows="3"></textarea>
  </div>
  
  <!-- Botões alinhados à direita -->
  <div class="flex justify-end gap-sm">
    <button class="px-lg py-md text-text-secondary">Cancelar</button>
    <button class="px-lg py-md bg-primary text-white rounded">Salvar</button>
  </div>
</form>
```

### **Lista com Ícones e Actions**
```html
<div class="space-y-sm">
  <div class="flex items-center gap-md p-md bg-bg-secondary rounded">
    <!-- Ícone -->
    <div class="w-10 h-10 bg-primary rounded flex-none flex items-center justify-center">
      📄
    </div>
    
    <!-- Conteúdo principal -->
    <div class="flex-1">
      <h4 class="font-semibold">Nome do Arquivo</h4>
      <p class="text-sm text-text-muted">Modificado há 2 horas</p>
    </div>
    
    <!-- Actions -->
    <div class="flex gap-xs">
      <button class="p-sm hover:bg-bg-tertiary rounded">✏️</button>
      <button class="p-sm hover:bg-bg-tertiary rounded">🗑️</button>
    </div>
  </div>
</div>
```

### **Sidebar Layout**
```html
<div class="min-h-screen flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-bg-secondary border-r border-border flex-none">
    <div class="p-lg">
      <h2 class="font-bold mb-lg">Menu</h2>
      <nav class="space-y-sm">
        <a class="block p-sm hover:bg-bg-tertiary rounded">Dashboard</a>
        <a class="block p-sm hover:bg-bg-tertiary rounded">Projetos</a>
        <a class="block p-sm hover:bg-bg-tertiary rounded">Configurações</a>
      </nav>
    </div>
  </aside>
  
  <!-- Conteúdo principal -->
  <main class="flex-1 p-lg">
    <h1 class="text-3xl font-bold mb-lg">Conteúdo Principal</h1>
    <!-- Conteúdo aqui -->
  </main>
</div>
```

### **Grid de Cards Responsivo**
```html
<div class="flex flex-wrap gap-lg">
  <div class="flex-1 min-w-80 bg-bg-secondary rounded-lg p-lg">
    <h3 class="text-xl font-semibold mb-md">Card 1</h3>
    <p class="text-text-secondary">Conteúdo do card...</p>
  </div>
  
  <div class="flex-1 min-w-80 bg-bg-secondary rounded-lg p-lg">
    <h3 class="text-xl font-semibold mb-md">Card 2</h3>
    <p class="text-text-secondary">Conteúdo do card...</p>
  </div>
  
  <div class="flex-1 min-w-80 bg-bg-secondary rounded-lg p-lg">
    <h3 class="text-xl font-semibold mb-md">Card 3</h3>
    <p class="text-text-secondary">Conteúdo do card...</p>
  </div>
</div>
```

### **Modal Dialog**
```html
<!-- Overlay -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <!-- Modal -->
  <div class="bg-bg-secondary rounded-lg w-full max-w-md mx-lg">
    <!-- Header -->
    <div class="flex justify-between items-center p-lg border-b border-border">
      <h2 class="text-xl font-semibold">Confirmar Ação</h2>
      <button class="text-text-muted hover:text-text-primary">✕</button>
    </div>
    
    <!-- Content -->
    <div class="p-lg">
      <p class="text-text-secondary">Tem certeza que deseja continuar?</p>
    </div>
    
    <!-- Actions -->
    <div class="flex justify-end gap-sm p-lg bg-bg-tertiary">
      <button class="px-lg py-md text-text-secondary">Cancelar</button>
      <button class="px-lg py-md bg-error text-white rounded">Confirmar</button>
    </div>
  </div>
</div>
```

## 📱 **Flexbox Responsivo**

### **Direção Responsiva**
```html
<!-- Vertical em mobile, horizontal em desktop -->
<div class="flex flex-col md:flex-row gap-lg">
  <div class="flex-1">Conteúdo 1</div>
  <div class="flex-1">Conteúdo 2</div>
</div>

<!-- Wrap responsivo -->
<div class="flex flex-nowrap md:flex-wrap gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### **Alinhamento Responsivo**
```html
<!-- Centro em mobile, space-between em desktop -->
<div class="flex flex-col items-center md:flex-row md:justify-between gap-md">
  <h1 class="text-2xl font-bold">Título</h1>
  <button class="px-lg py-md bg-primary text-white rounded">Ação</button>
</div>
```

## 🎯 **Guia para IAs**

### **Padrões Recomendados por Contexto**

| Contexto | Classes Base | Exemplo |
|----------|--------------|---------|
| **Header** | `flex justify-between items-center` | Navigation com logo e menu |
| **Card Actions** | `flex justify-end gap-sm` | Botões de ação no rodapé |
| **Form Fields** | `flex flex-col gap-sm` | Label acima do input |
| **Icon + Text** | `flex items-center gap-xs` | Ícone ao lado do texto |
| **Sidebar** | `min-h-screen flex` | Layout com sidebar |
| **Modal** | `fixed inset-0 flex items-center justify-center` | Centralização de modal |

### **Combinações Úteis**

```html
<!-- Centralização perfeita -->
<div class="flex items-center justify-center h-screen">

<!-- Botões de ação -->
<div class="flex justify-end gap-sm">

<!-- Lista com ícones -->
<div class="flex items-center gap-md">

<!-- Layout responsivo -->
<div class="flex flex-col md:flex-row gap-lg">

<!-- Espaço entre elementos -->
<div class="flex justify-between items-center">
```

### **Dicas de Performance**

1. **Use `flex-none`** para elementos de largura fixa
2. **Use `flex-1`** para elementos que devem crescer
3. **Prefira `gap`** ao invés de margins para espaçamento
4. **Use `items-center`** para alinhamento vertical comum
5. **Combine com grid** para layouts mais complexos

---

**💡 O Flexbox é ideal para layouts unidimensionais (linha ou coluna). Para layouts bidimensionais, considere usar CSS Grid.**
