# 👁️ SymbIA Framework - Sistema de Display

## 📋 **Visão Geral**

O sistema de display do SymbIA Framework oferece classes utilitárias para controlar visibilidade, tipos de display, overflow e comportamentos de exibição de elementos.

## 📺 **Display Types**

### **Display Básicos**
```html
<!-- Block elements -->
<div class="block">Elemento em bloco</div>
<div class="inline-block">Elemento inline-block</div>
<div class="inline">Elemento inline</div>

<!-- None -->
<div class="hidden">Elemento escondido (display: none)</div>
```

### **Flexbox Display**
```html
<!-- Flex containers -->
<div class="flex">Container flex</div>
<div class="inline-flex">Container inline-flex</div>
```

### **Grid Display**
```html
<!-- Grid containers -->
<div class="grid">Container grid</div>
<div class="inline-grid">Container inline-grid</div>
```

### **Table Display**
```html
<!-- Table elements -->
<div class="table">Display table</div>
<div class="table-caption">Table caption</div>
<div class="table-cell">Table cell</div>
<div class="table-column">Table column</div>
<div class="table-column-group">Table column group</div>
<div class="table-footer-group">Table footer group</div>
<div class="table-header-group">Table header group</div>
<div class="table-row">Table row</div>
<div class="table-row-group">Table row group</div>
```

### **Flow Display**
```html
<!-- Flow elements -->
<div class="flow-root">Flow root</div>
```

## 👁️ **Visibility**

### **Controle de Visibilidade**
```html
<!-- Visibility property -->
<div class="visible">Elemento visível</div>
<div class="invisible">Elemento invisível (mantém espaço)</div>

<!-- Collapse (para table elements) -->
<tr class="collapse">Linha de tabela colapsada</tr>
```

### **Diferença entre Hidden e Invisible**
```html
<!-- Hidden remove completamente do layout -->
<div class="hidden">Não aparece e não ocupa espaço</div>

<!-- Invisible mantém o espaço mas não é visível -->
<div class="invisible">Não aparece mas ocupa espaço</div>
```

## 📱 **Visibilidade Responsiva**

### **Show/Hide por Breakpoint**
```html
<!-- Visible apenas em mobile -->
<div class="block md:hidden">Visível apenas em telas pequenas</div>

<!-- Hidden em mobile, visible em desktop -->
<div class="hidden md:block">Visível apenas em telas médias+</div>

<!-- Diferentes displays por breakpoint -->
<div class="block md:flex lg:grid">
  Block em mobile, flex em tablet, grid em desktop
</div>

<!-- Padrões comuns -->
<div class="md:hidden">Esconde em tablet+</div>
<div class="hidden md:block">Mostra apenas em tablet+</div>
<div class="hidden lg:block">Mostra apenas em desktop+</div>
<div class="lg:hidden">Esconde em desktop+</div>
```

## 🔄 **Float**

### **Float Properties**
```html
<!-- Float elements -->
<div class="float-right">Float à direita</div>
<div class="float-left">Float à esquerda</div>
<div class="float-none">Sem float</div>
```

### **Clear Float**
```html
<!-- Clear float -->
<div class="clear-left">Clear left</div>
<div class="clear-right">Clear right</div>
<div class="clear-both">Clear both</div>
<div class="clear-none">Sem clear</div>
```

## 📦 **Object Fit (para imagens e vídeos)**

### **Object Fit Properties**
```html
<!-- Como o conteúdo se ajusta ao container -->
<img class="object-contain" src="image.jpg">Contém completamente</img>
<img class="object-cover" src="image.jpg">Cobre todo o container</img>
<img class="object-fill" src="image.jpg">Estica para preencher</img>
<img class="object-none" src="image.jpg">Tamanho original</img>
<img class="object-scale-down" src="image.jpg">Scale down se necessário</img>
```

### **Object Position**
```html
<!-- Posição do objeto dentro do container -->
<img class="object-bottom" src="image.jpg">Alinha à base</img>
<img class="object-center" src="image.jpg">Centraliza</img>
<img class="object-left" src="image.jpg">Alinha à esquerda</img>
<img class="object-left-bottom" src="image.jpg">Esquerda e base</img>
<img class="object-left-top" src="image.jpg">Esquerda e topo</img>
<img class="object-right" src="image.jpg">Alinha à direita</img>
<img class="object-right-bottom" src="image.jpg">Direita e base</img>
<img class="object-right-top" src="image.jpg">Direita e topo</img>
<img class="object-top" src="image.jpg">Alinha ao topo</img>
```

## 🌊 **Overflow (Detalhado)**

### **Overflow Geral**
```html
<!-- Overflow básico -->
<div class="overflow-auto">Scroll automático quando necessário</div>
<div class="overflow-hidden">Conteúdo cortado</div>
<div class="overflow-clip">Conteúdo cortado sem scrollbar</div>
<div class="overflow-visible">Conteúdo sempre visível</div>
<div class="overflow-scroll">Sempre mostra scrollbars</div>
```

### **Overflow por Eixo**
```html
<!-- Overflow X (horizontal) -->
<div class="overflow-x-auto">Scroll horizontal automático</div>
<div class="overflow-x-hidden">Conteúdo horizontal cortado</div>
<div class="overflow-x-clip">Conteúdo horizontal cortado sem scroll</div>
<div class="overflow-x-visible">Conteúdo horizontal sempre visível</div>
<div class="overflow-x-scroll">Sempre scroll horizontal</div>

<!-- Overflow Y (vertical) -->
<div class="overflow-y-auto">Scroll vertical automático</div>
<div class="overflow-y-hidden">Conteúdo vertical cortado</div>
<div class="overflow-y-clip">Conteúdo vertical cortado sem scroll</div>
<div class="overflow-y-visible">Conteúdo vertical sempre visível</div>
<div class="overflow-y-scroll">Sempre scroll vertical</div>
```

## 🎯 **Padrões de Uso Comuns**

### **Navigation Responsiva**
```html
<nav class="flex items-center justify-between p-lg">
  <!-- Logo sempre visível -->
  <div class="flex items-center gap-md">
    <img class="w-8 h-8" src="logo.png" alt="Logo">
    <span class="text-xl font-bold">SymbIA</span>
  </div>
  
  <!-- Menu desktop -->
  <div class="hidden md:flex gap-lg">
    <a href="#" class="hover:text-primary">Home</a>
    <a href="#" class="hover:text-primary">About</a>
    <a href="#" class="hover:text-primary">Contact</a>
  </div>
  
  <!-- Menu mobile (botão hambúrguer) -->
  <button class="md:hidden">
    <svg class="w-6 h-6" fill="none" stroke="currentColor">
      <!-- Ícone hambúrguer -->
    </svg>
  </button>
</nav>

<!-- Menu mobile expandido -->
<div class="md:hidden bg-bg-secondary border-t border-border">
  <div class="py-md space-y-sm">
    <a href="#" class="block px-lg py-sm hover:bg-bg-tertiary">Home</a>
    <a href="#" class="block px-lg py-sm hover:bg-bg-tertiary">About</a>
    <a href="#" class="block px-lg py-sm hover:bg-bg-tertiary">Contact</a>
  </div>
</div>
```

### **Card Grid Responsivo**
```html
<div class="container mx-auto p-lg">
  <!-- Grid que se adapta ao tamanho da tela -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
    <div class="bg-bg-secondary rounded-lg overflow-hidden">
      <!-- Imagem com object-cover -->
      <img class="w-full h-48 object-cover" src="card-image.jpg" alt="Card">
      
      <div class="p-lg">
        <h3 class="text-xl font-semibold mb-sm">Título do Card</h3>
        <p class="text-text-secondary">Descrição do card...</p>
      </div>
    </div>
  </div>
</div>
```

### **Sidebar com Overflow**
```html
<div class="min-h-screen flex">
  <!-- Sidebar com scroll -->
  <aside class="w-64 bg-bg-secondary border-r border-border flex-none">
    <div class="h-full flex flex-col">
      <!-- Header fixo -->
      <div class="p-lg border-b border-border">
        <h2 class="font-bold">Menu</h2>
      </div>
      
      <!-- Conteúdo com scroll -->
      <div class="flex-1 overflow-y-auto">
        <nav class="p-md space-y-xs">
          <!-- Muitos itens de menu aqui -->
          <a href="#" class="block px-md py-sm rounded hover:bg-bg-tertiary">Item 1</a>
          <a href="#" class="block px-md py-sm rounded hover:bg-bg-tertiary">Item 2</a>
          <!-- ... mais itens ... -->
        </nav>
      </div>
      
      <!-- Footer fixo -->
      <div class="p-lg border-t border-border">
        <button class="w-full px-md py-sm bg-primary text-white rounded">Logout</button>
      </div>
    </div>
  </aside>
  
  <!-- Conteúdo principal -->
  <main class="flex-1 overflow-y-auto">
    <div class="p-lg">
      <!-- Conteúdo principal aqui -->
    </div>
  </main>
</div>
```

### **Modal com Overflow**
```html
<div class="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-lg">
  <div class="bg-bg-secondary rounded-lg w-full max-w-2xl max-h-full flex flex-col">
    <!-- Header fixo -->
    <div class="px-lg py-md border-b border-border">
      <h2 class="text-xl font-semibold">Título do Modal</h2>
    </div>
    
    <!-- Conteúdo com scroll -->
    <div class="flex-1 overflow-y-auto p-lg">
      <!-- Muito conteúdo aqui que pode precisar de scroll -->
      <p>Conteúdo longo do modal...</p>
    </div>
    
    <!-- Actions fixas -->
    <div class="px-lg py-md border-t border-border bg-bg-tertiary">
      <div class="flex justify-end gap-sm">
        <button class="px-lg py-md text-text-secondary">Cancelar</button>
        <button class="px-lg py-md bg-primary text-white rounded">Confirmar</button>
      </div>
    </div>
  </div>
</div>
```

### **Image Gallery**
```html
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
  <div class="aspect-square overflow-hidden rounded-lg">
    <img class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
         src="gallery-1.jpg" alt="Gallery Image 1">
  </div>
  
  <div class="aspect-square overflow-hidden rounded-lg">
    <img class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
         src="gallery-2.jpg" alt="Gallery Image 2">
  </div>
  
  <!-- Mais imagens... -->
</div>
```

### **Horizontal Scroll Container**
```html
<div class="overflow-x-auto">
  <div class="flex gap-md min-w-max pb-md">
    <div class="w-64 bg-bg-secondary rounded-lg p-lg flex-none">
      <h3 class="font-semibold mb-md">Card 1</h3>
      <p class="text-text-secondary">Conteúdo do card...</p>
    </div>
    
    <div class="w-64 bg-bg-secondary rounded-lg p-lg flex-none">
      <h3 class="font-semibold mb-md">Card 2</h3>
      <p class="text-text-secondary">Conteúdo do card...</p>
    </div>
    
    <!-- Mais cards... -->
  </div>
</div>
```

### **Table Responsiva**
```html
<div class="overflow-x-auto">
  <table class="w-full min-w-full">
    <thead class="bg-bg-tertiary">
      <tr>
        <th class="px-md py-sm text-left">Nome</th>
        <th class="px-md py-sm text-left">Email</th>
        <th class="px-md py-sm text-left">Status</th>
        <th class="px-md py-sm text-left">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-border">
        <td class="px-md py-sm">João Silva</td>
        <td class="px-md py-sm">joao@email.com</td>
        <td class="px-md py-sm">
          <span class="inline-block px-sm py-xs bg-success/20 text-success rounded-full text-xs">
            Ativo
          </span>
        </td>
        <td class="px-md py-sm">
          <button class="text-primary hover:text-primary-light">Editar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### **Content Layout com Visibilidade Condicional**
```html
<div class="container mx-auto p-lg">
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-lg">
    <!-- Conteúdo principal -->
    <main class="lg:col-span-3">
      <h1 class="text-3xl font-bold mb-lg">Conteúdo Principal</h1>
      <!-- Conteúdo aqui -->
    </main>
    
    <!-- Sidebar que aparece apenas em desktop -->
    <aside class="hidden lg:block">
      <div class="bg-bg-secondary rounded-lg p-lg">
        <h2 class="text-lg font-semibold mb-md">Sidebar</h2>
        <!-- Conteúdo da sidebar -->
      </div>
    </aside>
  </div>
  
  <!-- Conteúdo da sidebar em mobile (diferente posição) -->
  <div class="lg:hidden mt-lg">
    <div class="bg-bg-secondary rounded-lg p-lg">
      <h2 class="text-lg font-semibold mb-md">Informações Adicionais</h2>
      <!-- Mesmo conteúdo da sidebar, mas organizado para mobile -->
    </div>
  </div>
</div>
```

## 🎯 **Guia para IAs**

### **Padrões de Display por Contexto**

| Contexto | Desktop | Tablet | Mobile | Exemplo |
|----------|---------|--------|--------|---------|
| **Navigation** | `flex` | `flex` | `hidden` + toggle | Menu responsivo |
| **Sidebar** | `block` | `hidden` | `hidden` | Layout dashboard |
| **Cards** | `grid-cols-4` | `grid-cols-2` | `grid-cols-1` | Grid responsivo |
| **Table** | `table` | `overflow-x-auto` | `overflow-x-auto` | Scroll horizontal |
| **Modal** | `max-w-2xl` | `max-w-lg` | `max-w-full` | Tamanho adaptativo |

### **Combinações Eficazes**

```html
<!-- Layout responsivo básico -->
<div class="block md:flex lg:grid">

<!-- Visibilidade condicional -->
<div class="hidden md:block lg:hidden">

<!-- Container com scroll -->
<div class="overflow-y-auto max-h-96">

<!-- Imagem responsiva -->
<img class="w-full h-48 object-cover">

<!-- Grid adaptativo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### **Melhores Práticas**

1. **Use `hidden md:block`** para desktop-only content
2. **Use `overflow-hidden`** para evitar scroll desnecessário
3. **Use `object-cover`** para imagens que devem preencher containers
4. **Use `overflow-x-auto`** para tabelas e scroll horizontal
5. **Use `max-h-*`** com `overflow-y-auto` para áreas de scroll limitadas

---

**💡 O sistema de display é fundamental para criar layouts responsivos e interfaces adaptáveis.**
