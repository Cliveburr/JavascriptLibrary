# 📏 SymbIA Framework - Sistema de Espaçamento

## 📋 **Visão Geral**

O sistema de espaçamento do SymbIA Framework fornece classes utilitárias para margin, padding, gap e space-between com valores consistentes baseados na escala de design.

## 🎯 **Escala de Valores**

| Classe | Valor | Pixels | Uso Recomendado |
|--------|-------|--------|-----------------|
| `xs` | `0.25rem` | `4px` | Espaçamentos micro (ícones, badges) |
| `sm` | `0.5rem` | `8px` | Espaçamentos pequenos (entre elementos próximos) |
| `md` | `1rem` | `16px` | Espaçamento padrão (conteúdo geral) |
| `lg` | `1.5rem` | `24px` | Espaçamentos grandes (seções, cards) |
| `xl` | `2rem` | `32px` | Espaçamentos muito grandes (layout principal) |
| `2xl` | `3rem` | `48px` | Espaçamentos extra grandes |
| `3xl` | `4rem` | `64px` | Espaçamentos máximos (separação de seções) |

## 📦 **Margin Utilities**

### **Margin em Todas as Direções**
```html
<!-- Margin usando escala -->
<div class="m-xs">Margin 4px</div>
<div class="m-sm">Margin 8px</div>
<div class="m-md">Margin 16px</div>
<div class="m-lg">Margin 24px</div>
<div class="m-xl">Margin 32px</div>
<div class="m-2xl">Margin 48px</div>
<div class="m-3xl">Margin 64px</div>

<!-- Margin especiais -->
<div class="m-0">Sem margin</div>
<div class="m-auto">Margin automático (centralização)</div>
```

### **Margin Por Direção**

#### **Margin Top**
```html
<div class="mt-xs">Margin top 4px</div>
<div class="mt-sm">Margin top 8px</div>
<div class="mt-md">Margin top 16px</div>
<div class="mt-lg">Margin top 24px</div>
<div class="mt-xl">Margin top 32px</div>
<div class="mt-2xl">Margin top 48px</div>
<div class="mt-3xl">Margin top 64px</div>
<div class="mt-0">Margin top 0</div>
<div class="mt-auto">Margin top auto</div>
```

#### **Margin Right**
```html
<div class="mr-xs">Margin right 4px</div>
<div class="mr-sm">Margin right 8px</div>
<div class="mr-md">Margin right 16px</div>
<div class="mr-lg">Margin right 24px</div>
<div class="mr-xl">Margin right 32px</div>
<div class="mr-2xl">Margin right 48px</div>
<div class="mr-3xl">Margin right 64px</div>
<div class="mr-0">Margin right 0</div>
<div class="mr-auto">Margin right auto</div>
```

#### **Margin Bottom**
```html
<div class="mb-xs">Margin bottom 4px</div>
<div class="mb-sm">Margin bottom 8px</div>
<div class="mb-md">Margin bottom 16px</div>
<div class="mb-lg">Margin bottom 24px</div>
<div class="mb-xl">Margin bottom 32px</div>
<div class="mb-2xl">Margin bottom 48px</div>
<div class="mb-3xl">Margin bottom 64px</div>
<div class="mb-0">Margin bottom 0</div>
<div class="mb-auto">Margin bottom auto</div>
```

#### **Margin Left**
```html
<div class="ml-xs">Margin left 4px</div>
<div class="ml-sm">Margin left 8px</div>
<div class="ml-md">Margin left 16px</div>
<div class="ml-lg">Margin left 24px</div>
<div class="ml-xl">Margin left 32px</div>
<div class="ml-2xl">Margin left 48px</div>
<div class="ml-3xl">Margin left 64px</div>
<div class="ml-0">Margin left 0</div>
<div class="ml-auto">Margin left auto</div>
```

### **Margin em Eixos**
```html
<!-- Margin horizontal (left + right) -->
<div class="mx-xs">Margin horizontal 4px</div>
<div class="mx-sm">Margin horizontal 8px</div>
<div class="mx-md">Margin horizontal 16px</div>
<div class="mx-lg">Margin horizontal 24px</div>
<div class="mx-xl">Margin horizontal 32px</div>
<div class="mx-0">Margin horizontal 0</div>
<div class="mx-auto">Margin horizontal auto (centralização)</div>

<!-- Margin vertical (top + bottom) -->
<div class="my-xs">Margin vertical 4px</div>
<div class="my-sm">Margin vertical 8px</div>
<div class="my-md">Margin vertical 16px</div>
<div class="my-lg">Margin vertical 24px</div>
<div class="my-xl">Margin vertical 32px</div>
<div class="my-0">Margin vertical 0</div>
<div class="my-auto">Margin vertical auto</div>
```

## 📦 **Padding Utilities**

### **Padding em Todas as Direções**
```html
<div class="p-xs">Padding 4px</div>
<div class="p-sm">Padding 8px</div>
<div class="p-md">Padding 16px</div>
<div class="p-lg">Padding 24px</div>
<div class="p-xl">Padding 32px</div>
<div class="p-2xl">Padding 48px</div>
<div class="p-3xl">Padding 64px</div>
<div class="p-0">Sem padding</div>
```

### **Padding Por Direção**

#### **Padding Top**
```html
<div class="pt-xs">Padding top 4px</div>
<div class="pt-sm">Padding top 8px</div>
<div class="pt-md">Padding top 16px</div>
<div class="pt-lg">Padding top 24px</div>
<div class="pt-xl">Padding top 32px</div>
<div class="pt-2xl">Padding top 48px</div>
<div class="pt-3xl">Padding top 64px</div>
<div class="pt-0">Padding top 0</div>
```

#### **Padding Right, Bottom, Left** (mesma estrutura)
```html
<!-- Padding Right -->
<div class="pr-xs">Padding right 4px</div>
<div class="pr-sm">Padding right 8px</div>
<!-- ... todos os valores ... -->

<!-- Padding Bottom -->
<div class="pb-xs">Padding bottom 4px</div>
<div class="pb-sm">Padding bottom 8px</div>
<!-- ... todos os valores ... -->

<!-- Padding Left -->
<div class="pl-xs">Padding left 4px</div>
<div class="pl-sm">Padding left 8px</div>
<!-- ... todos os valores ... -->
```

### **Padding em Eixos**
```html
<!-- Padding horizontal (left + right) -->
<div class="px-xs">Padding horizontal 4px</div>
<div class="px-sm">Padding horizontal 8px</div>
<div class="px-md">Padding horizontal 16px</div>
<div class="px-lg">Padding horizontal 24px</div>
<div class="px-xl">Padding horizontal 32px</div>
<div class="px-0">Padding horizontal 0</div>

<!-- Padding vertical (top + bottom) -->
<div class="py-xs">Padding vertical 4px</div>
<div class="py-sm">Padding vertical 8px</div>
<div class="py-md">Padding vertical 16px</div>
<div class="py-lg">Padding vertical 24px</div>
<div class="py-xl">Padding vertical 32px</div>
<div class="py-0">Padding vertical 0</div>
```

## 🔄 **Gap Utilities (para Flexbox e Grid)**

```html
<!-- Gap para flex e grid containers -->
<div class="flex gap-xs">Gap 4px entre itens</div>
<div class="flex gap-sm">Gap 8px entre itens</div>
<div class="flex gap-md">Gap 16px entre itens</div>
<div class="flex gap-lg">Gap 24px entre itens</div>
<div class="flex gap-xl">Gap 32px entre itens</div>
<div class="flex gap-2xl">Gap 48px entre itens</div>
<div class="flex gap-3xl">Gap 64px entre itens</div>
<div class="flex gap-0">Sem gap</div>

<!-- Gap por eixo -->
<div class="grid gap-x-md gap-y-lg">Gap horizontal 16px, vertical 24px</div>
<div class="flex flex-col gap-y-sm">Gap vertical 8px</div>
<div class="flex gap-x-lg">Gap horizontal 24px</div>
```

## 📐 **Space Between (para elementos filhos)**

```html
<!-- Space between em flexbox -->
<div class="flex flex-col space-y-xs">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- 4px entre cada item -->
</div>

<div class="flex flex-col space-y-sm">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- 8px entre cada item -->
</div>

<div class="flex flex-col space-y-md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- 16px entre cada item -->
</div>

<!-- Space between horizontal -->
<div class="flex space-x-lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- 24px entre cada item -->
</div>
```

## 🎯 **Padrões de Uso Recomendados**

### **Layout de Card**
```html
<div class="bg-bg-secondary rounded-lg p-lg space-y-md">
  <h3 class="text-xl font-semibold mb-sm">Título do Card</h3>
  <p class="text-text-secondary mb-lg">Conteúdo do card com espaçamento adequado.</p>
  <div class="flex gap-sm">
    <button class="px-md py-sm">Botão 1</button>
    <button class="px-md py-sm">Botão 2</button>
  </div>
</div>
```

### **Layout de Formulário**
```html
<form class="space-y-lg">
  <div class="space-y-sm">
    <label class="block mb-xs">Nome</label>
    <input class="w-full px-md py-sm" type="text">
  </div>
  <div class="space-y-sm">
    <label class="block mb-xs">Email</label>
    <input class="w-full px-md py-sm" type="email">
  </div>
  <div class="pt-lg">
    <button class="px-xl py-md">Enviar</button>
  </div>
</form>
```

### **Layout de Lista**
```html
<ul class="space-y-sm">
  <li class="p-md bg-bg-tertiary rounded">Item 1</li>
  <li class="p-md bg-bg-tertiary rounded">Item 2</li>
  <li class="p-md bg-bg-tertiary rounded">Item 3</li>
</ul>
```

### **Header/Navigation**
```html
<header class="flex justify-between items-center px-lg py-md bg-bg-secondary">
  <div class="flex items-center gap-md">
    <img class="w-8 h-8" src="logo.png" alt="Logo">
    <h1 class="text-xl font-bold">SymbIA</h1>
  </div>
  <nav class="flex gap-lg">
    <a class="px-sm py-xs">Home</a>
    <a class="px-sm py-xs">About</a>
    <a class="px-sm py-xs">Contact</a>
  </nav>
</header>
```

### **Grid Responsivo**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg p-lg">
  <div class="bg-bg-secondary p-md rounded">Card 1</div>
  <div class="bg-bg-secondary p-md rounded">Card 2</div>
  <div class="bg-bg-secondary p-md rounded">Card 3</div>
</div>
```

## ⚡ **Dicas de Performance**

### **Combine Classes Eficientemente**
```html
<!-- ✅ Bom -->
<div class="p-lg space-y-md">

<!-- ❌ Evite -->
<div class="pt-lg pr-lg pb-lg pl-lg mt-md mb-md">
```

### **Use Gap ao invés de Margin em Flexbox/Grid**
```html
<!-- ✅ Bom (mais flexível) -->
<div class="flex gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- ❌ Funciona, mas menos flexível -->
<div class="flex">
  <div class="mr-md">Item 1</div>
  <div>Item 2</div>
</div>
```

## 🎯 **Guia para IAs**

### **Escolha do Espaçamento por Contexto**

| Contexto | Espaçamento Recomendado | Classe |
|----------|-------------------------|--------|
| **Texto corrido** | Entre parágrafos | `space-y-md` |
| **Botões em linha** | Entre botões | `gap-sm` |
| **Cards em grid** | Entre cards | `gap-lg` |
| **Seções da página** | Entre seções | `space-y-xl` |
| **Elementos de form** | Entre campos | `space-y-lg` |
| **Ícones e texto** | Entre ícone e texto | `gap-xs` |
| **Navegação** | Entre links | `gap-md` |
| **Conteúdo de card** | Interno ao card | `p-lg space-y-md` |

### **Hierarquia de Espaçamentos**
1. **xs (4px)**: Micro detalhes, ícones
2. **sm (8px)**: Elementos relacionados próximos
3. **md (16px)**: Espaçamento padrão de conteúdo
4. **lg (24px)**: Separação de componentes
5. **xl (32px)**: Separação de seções
6. **2xl+ (48px+)**: Layout principal

---

**💡 Use sempre as classes do sistema de espaçamento para manter consistência visual e facilitar manutenção.**
