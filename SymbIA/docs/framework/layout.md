# 📐 SymbIA Framework - Sistema de Layout

## 📋 **Visão Geral**

O sistema de layout do SymbIA Framework oferece classes utilitárias para controlar posicionamento, dimensões, overflow, z-index e outros aspectos fundamentais do layout CSS.

## 🎯 **Posicionamento (Position)**

### **Tipos de Position**
```html
<!-- Position normal -->
<div class="static">Posicionamento estático (padrão)</div>

<!-- Position relativo -->
<div class="relative">
  Posicionamento relativo ao local original
  <div class="absolute top-0 right-0">Filho absoluto</div>
</div>

<!-- Position absoluto -->
<div class="absolute top-4 right-4">Posicionado absolutamente</div>

<!-- Position fixo -->
<div class="fixed top-0 left-0">Fixo na viewport</div>

<!-- Position sticky -->
<div class="sticky top-0">Sticky no scroll</div>
```

## 📍 **Coordenadas (Top/Right/Bottom/Left)**

### **Posicionamento Absoluto/Fixo**
```html
<!-- Valores específicos -->
<div class="absolute top-0">Topo 0</div>
<div class="absolute top-1">Topo 0.25rem (4px)</div>
<div class="absolute top-2">Topo 0.5rem (8px)</div>
<div class="absolute top-4">Topo 1rem (16px)</div>
<div class="absolute top-8">Topo 2rem (32px)</div>
<div class="absolute top-16">Topo 4rem (64px)</div>

<!-- Valores automáticos -->
<div class="absolute top-auto">Topo automático</div>

<!-- Valores negativos -->
<div class="absolute -top-1">Topo -0.25rem</div>
<div class="absolute -top-2">Topo -0.5rem</div>

<!-- Percentuais -->
<div class="absolute top-1/2">Topo 50%</div>
<div class="absolute top-1/3">Topo 33.33%</div>
<div class="absolute top-2/3">Topo 66.67%</div>
<div class="absolute top-1/4">Topo 25%</div>
<div class="absolute top-3/4">Topo 75%</div>

<!-- Full positioning -->
<div class="absolute top-full">Abaixo do elemento (100%)</div>
```

### **Coordenadas por Direção**
```html
<!-- Right -->
<div class="absolute right-0">Direita 0</div>
<div class="absolute right-4">Direita 1rem</div>
<div class="absolute right-auto">Direita automática</div>
<div class="absolute -right-2">Direita -0.5rem</div>

<!-- Bottom -->
<div class="absolute bottom-0">Base 0</div>
<div class="absolute bottom-4">Base 1rem</div>
<div class="absolute bottom-auto">Base automática</div>

<!-- Left -->
<div class="absolute left-0">Esquerda 0</div>
<div class="absolute left-4">Esquerda 1rem</div>
<div class="absolute left-auto">Esquerda automática</div>
```

### **Posicionamento Combinado**
```html
<!-- Inset (todas as direções) -->
<div class="absolute inset-0">Top: 0, Right: 0, Bottom: 0, Left: 0</div>
<div class="absolute inset-4">Todas as direções 1rem</div>
<div class="absolute inset-auto">Todas automáticas</div>

<!-- Inset por eixo -->
<div class="absolute inset-x-0">Left: 0, Right: 0</div>
<div class="absolute inset-y-0">Top: 0, Bottom: 0</div>

<!-- Centralização comum -->
<div class="absolute inset-0 flex items-center justify-center">
  Centralizado perfeitamente
</div>
```

## 📏 **Dimensões (Width e Height)**

### **Width (Largura)**
```html
<!-- Larguras fixas -->
<div class="w-0">Largura 0</div>
<div class="w-1">Largura 0.25rem (4px)</div>
<div class="w-2">Largura 0.5rem (8px)</div>
<div class="w-4">Largura 1rem (16px)</div>
<div class="w-8">Largura 2rem (32px)</div>
<div class="w-16">Largura 4rem (64px)</div>
<div class="w-32">Largura 8rem (128px)</div>
<div class="w-64">Largura 16rem (256px)</div>

<!-- Larguras automáticas -->
<div class="w-auto">Largura automática</div>
<div class="w-full">Largura 100%</div>
<div class="w-screen">Largura 100vw</div>
<div class="w-min">Largura mínima do conteúdo</div>
<div class="w-max">Largura máxima do conteúdo</div>
<div class="w-fit">Largura que se ajusta ao conteúdo</div>

<!-- Larguras fracionárias -->
<div class="w-1/2">Largura 50%</div>
<div class="w-1/3">Largura 33.33%</div>
<div class="w-2/3">Largura 66.67%</div>
<div class="w-1/4">Largura 25%</div>
<div class="w-3/4">Largura 75%</div>
<div class="w-1/5">Largura 20%</div>
<div class="w-2/5">Largura 40%</div>
<div class="w-3/5">Largura 60%</div>
<div class="w-4/5">Largura 80%</div>
<div class="w-1/6">Largura 16.67%</div>
<div class="w-5/6">Largura 83.33%</div>
<div class="w-1/12">Largura 8.33%</div>
<div class="w-11/12">Largura 91.67%</div>
```

### **Height (Altura)**
```html
<!-- Alturas fixas -->
<div class="h-0">Altura 0</div>
<div class="h-1">Altura 0.25rem (4px)</div>
<div class="h-4">Altura 1rem (16px)</div>
<div class="h-8">Altura 2rem (32px)</div>
<div class="h-16">Altura 4rem (64px)</div>
<div class="h-32">Altura 8rem (128px)</div>
<div class="h-64">Altura 16rem (256px)</div>

<!-- Alturas automáticas -->
<div class="h-auto">Altura automática</div>
<div class="h-full">Altura 100%</div>
<div class="h-screen">Altura 100vh</div>
<div class="h-min">Altura mínima do conteúdo</div>
<div class="h-max">Altura máxima do conteúdo</div>
<div class="h-fit">Altura que se ajusta ao conteúdo</div>

<!-- Alturas fracionárias -->
<div class="h-1/2">Altura 50%</div>
<div class="h-1/3">Altura 33.33%</div>
<div class="h-2/3">Altura 66.67%</div>
<div class="h-1/4">Altura 25%</div>
<div class="h-3/4">Altura 75%</div>
<div class="h-1/5">Altura 20%</div>
<div class="h-1/6">Altura 16.67%</div>
```

### **Dimensões Mínimas e Máximas**
```html
<!-- Min Width -->
<div class="min-w-0">Largura mínima 0</div>
<div class="min-w-full">Largura mínima 100%</div>
<div class="min-w-min">Largura mínima do conteúdo</div>
<div class="min-w-max">Largura mínima máxima</div>
<div class="min-w-fit">Largura mínima ajustada</div>

<!-- Max Width -->
<div class="max-w-none">Sem largura máxima</div>
<div class="max-w-xs">Largura máxima 20rem</div>
<div class="max-w-sm">Largura máxima 24rem</div>
<div class="max-w-md">Largura máxima 28rem</div>
<div class="max-w-lg">Largura máxima 32rem</div>
<div class="max-w-xl">Largura máxima 36rem</div>
<div class="max-w-2xl">Largura máxima 42rem</div>
<div class="max-w-4xl">Largura máxima 56rem</div>
<div class="max-w-6xl">Largura máxima 72rem</div>
<div class="max-w-full">Largura máxima 100%</div>
<div class="max-w-screen-sm">Largura máxima 640px</div>
<div class="max-w-screen-md">Largura máxima 768px</div>
<div class="max-w-screen-lg">Largura máxima 1024px</div>
<div class="max-w-screen-xl">Largura máxima 1280px</div>

<!-- Min Height -->
<div class="min-h-0">Altura mínima 0</div>
<div class="min-h-full">Altura mínima 100%</div>
<div class="min-h-screen">Altura mínima 100vh</div>
<div class="min-h-min">Altura mínima do conteúdo</div>
<div class="min-h-max">Altura mínima máxima</div>
<div class="min-h-fit">Altura mínima ajustada</div>

<!-- Max Height -->
<div class="max-h-none">Sem altura máxima</div>
<div class="max-h-full">Altura máxima 100%</div>
<div class="max-h-screen">Altura máxima 100vh</div>
<div class="max-h-min">Altura máxima do conteúdo</div>
<div class="max-h-max">Altura máxima máxima</div>
<div class="max-h-fit">Altura máxima ajustada</div>
```

## 🔢 **Z-Index (Profundidade)**

```html
<!-- Z-index específicos -->
<div class="z-0">Z-index 0</div>
<div class="z-10">Z-index 10</div>
<div class="z-20">Z-index 20</div>
<div class="z-30">Z-index 30</div>
<div class="z-40">Z-index 40</div>
<div class="z-50">Z-index 50</div>

<!-- Z-index automático -->
<div class="z-auto">Z-index automático</div>

<!-- Z-index do sistema (baseado em variáveis) -->
<div class="z-dropdown">Z-index 1000 (dropdowns)</div>
<div class="z-sticky">Z-index 1020 (sticky elements)</div>
<div class="z-fixed">Z-index 1030 (fixed elements)</div>
<div class="z-modal-backdrop">Z-index 1040 (modal backdrop)</div>
<div class="z-modal">Z-index 1050 (modal content)</div>
<div class="z-popover">Z-index 1060 (popovers)</div>
<div class="z-tooltip">Z-index 1070 (tooltips)</div>
```

## 📱 **Overflow**

### **Overflow em Todas as Direções**
```html
<!-- Overflow básico -->
<div class="overflow-auto">Auto scroll quando necessário</div>
<div class="overflow-hidden">Conteúdo escondido</div>
<div class="overflow-clip">Conteúdo cortado</div>
<div class="overflow-visible">Conteúdo sempre visível</div>
<div class="overflow-scroll">Sempre mostra scrollbars</div>
```

### **Overflow por Eixo**
```html
<!-- Overflow horizontal -->
<div class="overflow-x-auto">Scroll horizontal quando necessário</div>
<div class="overflow-x-hidden">Conteúdo horizontal escondido</div>
<div class="overflow-x-clip">Conteúdo horizontal cortado</div>
<div class="overflow-x-visible">Conteúdo horizontal sempre visível</div>
<div class="overflow-x-scroll">Sempre scroll horizontal</div>

<!-- Overflow vertical -->
<div class="overflow-y-auto">Scroll vertical quando necessário</div>
<div class="overflow-y-hidden">Conteúdo vertical escondido</div>
<div class="overflow-y-clip">Conteúdo vertical cortado</div>
<div class="overflow-y-visible">Conteúdo vertical sempre visível</div>
<div class="overflow-y-scroll">Sempre scroll vertical</div>
```

## 📦 **Box Sizing**

```html
<!-- Box sizing -->
<div class="box-border">Padding e border incluídos na largura/altura</div>
<div class="box-content">Padding e border adicionais à largura/altura</div>
```

## 🎯 **Padrões de Layout Comuns**

### **Layout de Página Completa**
```html
<div class="min-h-screen flex flex-col">
  <!-- Header fixo -->
  <header class="sticky top-0 z-fixed bg-bg-secondary border-b border-border">
    <div class="max-w-6xl mx-auto px-lg py-md">
      <h1 class="text-xl font-bold">SymbIA</h1>
    </div>
  </header>
  
  <!-- Conteúdo principal -->
  <main class="flex-1 max-w-6xl mx-auto w-full px-lg py-lg">
    <!-- Conteúdo aqui -->
  </main>
  
  <!-- Footer -->
  <footer class="bg-bg-secondary border-t border-border">
    <div class="max-w-6xl mx-auto px-lg py-md">
      <p class="text-text-muted text-sm">© 2025 SymbIA</p>
    </div>
  </footer>
</div>
```

### **Sidebar Layout**
```html
<div class="min-h-screen flex">
  <!-- Sidebar fixa -->
  <aside class="w-64 bg-bg-secondary border-r border-border flex-none overflow-y-auto">
    <div class="p-lg">
      <h2 class="font-bold mb-lg">Menu</h2>
      <!-- Navegação aqui -->
    </div>
  </aside>
  
  <!-- Conteúdo principal -->
  <main class="flex-1 overflow-y-auto">
    <div class="max-w-4xl mx-auto p-lg">
      <!-- Conteúdo aqui -->
    </div>
  </main>
</div>
```

### **Modal Overlay**
```html
<!-- Backdrop fixo -->
<div class="fixed inset-0 bg-black/50 z-modal-backdrop flex items-center justify-center p-lg">
  <!-- Modal centralizado -->
  <div class="bg-bg-secondary rounded-lg w-full max-w-md max-h-full overflow-y-auto z-modal">
    <!-- Conteúdo do modal -->
  </div>
</div>
```

### **Card Container Responsivo**
```html
<div class="max-w-6xl mx-auto px-lg py-lg">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
    <div class="bg-bg-secondary rounded-lg p-lg min-h-48">
      <!-- Card content -->
    </div>
  </div>
</div>
```

### **Hero Section**
```html
<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Background image/video -->
  <div class="absolute inset-0 z-0">
    <img class="w-full h-full object-cover" src="hero-bg.jpg" alt="Background">
  </div>
  
  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/40 z-10"></div>
  
  <!-- Content -->
  <div class="relative z-20 text-center max-w-4xl mx-auto px-lg">
    <h1 class="text-6xl font-bold text-white mb-lg">Hero Title</h1>
    <p class="text-xl text-white/80 mb-xl">Hero description</p>
    <button class="px-xl py-lg bg-primary text-white rounded-lg">Get Started</button>
  </div>
</section>
```

### **Sticky Navigation**
```html
<nav class="sticky top-0 z-fixed bg-bg-secondary/80 backdrop-blur-sm border-b border-border">
  <div class="max-w-6xl mx-auto px-lg py-md">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-bold">Logo</h1>
      <div class="flex gap-lg">
        <a href="#" class="hover:text-primary">Home</a>
        <a href="#" class="hover:text-primary">About</a>
        <a href="#" class="hover:text-primary">Contact</a>
      </div>
    </div>
  </div>
</nav>
```

### **Dashboard Grid**
```html
<div class="min-h-screen p-lg">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-lg">
      <h1 class="text-3xl font-bold">Dashboard</h1>
    </div>
    
    <!-- Grid de métricas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-lg">
      <div class="bg-bg-secondary rounded-lg p-lg">
        <h3 class="text-lg font-semibold">Métrica 1</h3>
      </div>
      <!-- Mais cards de métricas -->
    </div>
    
    <!-- Grid de conteúdo principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <!-- Coluna principal -->
      <div class="lg:col-span-2 bg-bg-secondary rounded-lg p-lg min-h-96">
        <h2 class="text-xl font-semibold mb-md">Conteúdo Principal</h2>
      </div>
      
      <!-- Sidebar direita -->
      <div class="bg-bg-secondary rounded-lg p-lg">
        <h3 class="text-lg font-semibold mb-md">Sidebar</h3>
      </div>
    </div>
  </div>
</div>
```

## 📱 **Layout Responsivo**

### **Breakpoints do Sistema**
```html
<!-- Largura responsiva -->
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsivo por breakpoint
</div>

<!-- Altura responsiva -->
<div class="h-64 md:h-80 lg:h-96">
  Altura que cresce com o viewport
</div>

<!-- Container responsivo -->
<div class="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
  Container que se adapta
</div>
```

## 🎯 **Guia para IAs**

### **Padrões por Contexto**

| Contexto | Position | Dimensions | Z-Index | Exemplo |
|----------|----------|------------|---------|---------|
| **Page Layout** | `relative` | `min-h-screen` | - | Layout principal |
| **Modal** | `fixed inset-0` | `max-w-md` | `z-modal` | Modais |
| **Sidebar** | `relative` | `w-64` | - | Navigation |
| **Dropdown** | `absolute` | `min-w-48` | `z-dropdown` | Menus |
| **Tooltip** | `absolute` | `max-w-xs` | `z-tooltip` | Dicas |
| **Card** | `relative` | `max-w-sm` | - | Componentes |

### **Combinações Eficazes**

```html
<!-- Layout centrado -->
<div class="min-h-screen flex items-center justify-center">

<!-- Container responsivo -->
<div class="max-w-6xl mx-auto px-lg">

<!-- Card responsivo -->
<div class="w-full max-w-md mx-auto">

<!-- Overlay modal -->
<div class="fixed inset-0 z-modal flex items-center justify-center">

<!-- Sidebar fixa -->
<div class="w-64 min-h-screen flex-none">
```

### **Dicas de Performance**

1. **Use `max-w-*`** para containers responsivos
2. **Use `min-h-screen`** para layouts de página completa
3. **Use `overflow-hidden`** para prevenir scroll desnecessário
4. **Use z-index do sistema** para manter hierarquia
5. **Use `flex-none`** para sidebars fixas

---

**💡 O sistema de layout é a base para criar interfaces bem estruturadas e responsivas.**
