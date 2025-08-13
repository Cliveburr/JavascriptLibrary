# ✨ SymbIA Framework - Sistema de Efeitos

## 📋 **Visão Geral**

O sistema de efeitos do SymbIA Framework oferece classes utilitárias para sombras, opacidade, transformações, transições e outros efeitos visuais que melhoram a experiência do usuário.

## 🌫️ **Box Shadow (Sombras)**

### **Sombras Básicas**
```html
<!-- Sem sombra -->
<div class="shadow-none">Sem sombra</div>

<!-- Sombras por intensidade -->
<div class="shadow-sm">Sombra sutil</div>
<div class="shadow">Sombra padrão</div>
<div class="shadow-md">Sombra média</div>
<div class="shadow-lg">Sombra grande</div>
<div class="shadow-xl">Sombra muito grande</div>
<div class="shadow-2xl">Sombra extra grande</div>

<!-- Sombra interna -->
<div class="shadow-inner">Sombra interna</div>
```

### **Sombras do Sistema (Baseadas em Variáveis)**
```html
<!-- Sombras usando variáveis SASS -->
<div class="shadow-system-sm">Sombra sutil do sistema</div>
<div class="shadow-system-md">Sombra média do sistema</div>
<div class="shadow-system-lg">Sombra grande do sistema</div>
<div class="shadow-system-xl">Sombra extra grande do sistema</div>
```

### **Glow Effects**
```html
<!-- Brilhos coloridos baseados no tema -->
<div class="glow-primary">Brilho primário</div>
<div class="glow-accent">Brilho de destaque</div>
<div class="glow-success">Brilho de sucesso</div>
<div class="glow-error">Brilho de erro</div>
```

## 👁️ **Opacity (Opacidade)**

### **Valores de Opacidade**
```html
<!-- Opacidades específicas -->
<div class="opacity-0">Totalmente transparente</div>
<div class="opacity-5">5% opaco</div>
<div class="opacity-10">10% opaco</div>
<div class="opacity-20">20% opaco</div>
<div class="opacity-25">25% opaco</div>
<div class="opacity-30">30% opaco</div>
<div class="opacity-40">40% opaco</div>
<div class="opacity-50">50% opaco</div>
<div class="opacity-60">60% opaco</div>
<div class="opacity-70">70% opaco</div>
<div class="opacity-75">75% opaco</div>
<div class="opacity-80">80% opaco</div>
<div class="opacity-90">90% opaco</div>
<div class="opacity-95">95% opaco</div>
<div class="opacity-100">Totalmente opaco</div>
```

## 🔄 **Transform (Transformações)**

### **Scale (Escala)**
```html
<!-- Escala uniforme -->
<div class="scale-0">Escala 0 (invisível)</div>
<div class="scale-50">Escala 50%</div>
<div class="scale-75">Escala 75%</div>
<div class="scale-90">Escala 90%</div>
<div class="scale-95">Escala 95%</div>
<div class="scale-100">Escala 100% (normal)</div>
<div class="scale-105">Escala 105%</div>
<div class="scale-110">Escala 110%</div>
<div class="scale-125">Escala 125%</div>
<div class="scale-150">Escala 150%</div>

<!-- Escala por eixo -->
<div class="scale-x-50">Escala horizontal 50%</div>
<div class="scale-y-50">Escala vertical 50%</div>
```

### **Rotate (Rotação)**
```html
<!-- Rotações específicas -->
<div class="rotate-0">Sem rotação</div>
<div class="rotate-1">Rotação 1° (0.017453rad)</div>
<div class="rotate-2">Rotação 2°</div>
<div class="rotate-3">Rotação 3°</div>
<div class="rotate-6">Rotação 6°</div>
<div class="rotate-12">Rotação 12°</div>
<div class="rotate-45">Rotação 45°</div>
<div class="rotate-90">Rotação 90°</div>
<div class="rotate-180">Rotação 180°</div>

<!-- Rotações negativas -->
<div class="-rotate-1">Rotação -1°</div>
<div class="-rotate-45">Rotação -45°</div>
<div class="-rotate-90">Rotação -90°</div>
```

### **Translate (Translação)**
```html
<!-- Translação horizontal -->
<div class="translate-x-0">Sem translação horizontal</div>
<div class="translate-x-1">Translação horizontal 0.25rem</div>
<div class="translate-x-2">Translação horizontal 0.5rem</div>
<div class="translate-x-4">Translação horizontal 1rem</div>
<div class="translate-x-8">Translação horizontal 2rem</div>
<div class="translate-x-1/2">Translação horizontal 50%</div>
<div class="translate-x-full">Translação horizontal 100%</div>

<!-- Translação vertical -->
<div class="translate-y-0">Sem translação vertical</div>
<div class="translate-y-1">Translação vertical 0.25rem</div>
<div class="translate-y-2">Translação vertical 0.5rem</div>
<div class="translate-y-4">Translação vertical 1rem</div>
<div class="translate-y-8">Translação vertical 2rem</div>
<div class="translate-y-1/2">Translação vertical 50%</div>
<div class="translate-y-full">Translação vertical 100%</div>

<!-- Translações negativas -->
<div class="-translate-x-1">Translação horizontal -0.25rem</div>
<div class="-translate-y-1">Translação vertical -0.25rem</div>
```

### **Skew (Inclinação)**
```html
<!-- Inclinação horizontal -->
<div class="skew-x-0">Sem inclinação horizontal</div>
<div class="skew-x-1">Inclinação horizontal 1°</div>
<div class="skew-x-2">Inclinação horizontal 2°</div>
<div class="skew-x-3">Inclinação horizontal 3°</div>
<div class="skew-x-6">Inclinação horizontal 6°</div>
<div class="skew-x-12">Inclinação horizontal 12°</div>

<!-- Inclinação vertical -->
<div class="skew-y-0">Sem inclinação vertical</div>
<div class="skew-y-1">Inclinação vertical 1°</div>
<div class="skew-y-2">Inclinação vertical 2°</div>
<div class="skew-y-3">Inclinação vertical 3°</div>
<div class="skew-y-6">Inclinação vertical 6°</div>
<div class="skew-y-12">Inclinação vertical 12°</div>

<!-- Inclinações negativas -->
<div class="-skew-x-1">Inclinação horizontal -1°</div>
<div class="-skew-y-1">Inclinação vertical -1°</div>
```

### **Transform Origin (Ponto de Origem)**
```html
<!-- Origens de transformação -->
<div class="origin-center">Origem no centro</div>
<div class="origin-top">Origem no topo</div>
<div class="origin-top-right">Origem no topo direito</div>
<div class="origin-right">Origem na direita</div>
<div class="origin-bottom-right">Origem na base direita</div>
<div class="origin-bottom">Origem na base</div>
<div class="origin-bottom-left">Origem na base esquerda</div>
<div class="origin-left">Origem na esquerda</div>
<div class="origin-top-left">Origem no topo esquerdo</div>
```

## ⏱️ **Transition (Transições)**

### **Propriedades de Transição**
```html
<!-- Transições específicas -->
<div class="transition-none">Sem transição</div>
<div class="transition-all">Transição em todas as propriedades</div>
<div class="transition-colors">Transição apenas cores</div>
<div class="transition-opacity">Transição apenas opacidade</div>
<div class="transition-shadow">Transição apenas sombra</div>
<div class="transition-transform">Transição apenas transformações</div>
```

### **Duração de Transição**
```html
<!-- Durações baseadas no sistema -->
<div class="duration-fast">Duração rápida (0.15s)</div>
<div class="duration-normal">Duração normal (0.3s)</div>
<div class="duration-slow">Duração lenta (0.5s)</div>

<!-- Durações específicas -->
<div class="duration-75">Duração 75ms</div>
<div class="duration-100">Duração 100ms</div>
<div class="duration-150">Duração 150ms</div>
<div class="duration-200">Duração 200ms</div>
<div class="duration-300">Duração 300ms</div>
<div class="duration-500">Duração 500ms</div>
<div class="duration-700">Duração 700ms</div>
<div class="duration-1000">Duração 1000ms</div>
```

### **Timing Functions (Curvas de Animação)**
```html
<!-- Timing functions -->
<div class="ease-linear">Linear</div>
<div class="ease-in">Ease in</div>
<div class="ease-out">Ease out</div>
<div class="ease-in-out">Ease in-out</div>
```

### **Delay de Transição**
```html
<!-- Delays de transição -->
<div class="delay-75">Delay 75ms</div>
<div class="delay-100">Delay 100ms</div>
<div class="delay-150">Delay 150ms</div>
<div class="delay-200">Delay 200ms</div>
<div class="delay-300">Delay 300ms</div>
<div class="delay-500">Delay 500ms</div>
<div class="delay-700">Delay 700ms</div>
<div class="delay-1000">Delay 1000ms</div>
```

## 🎨 **Filter Effects**

### **Blur (Desfoque)**
```html
<!-- Valores de blur -->
<div class="blur-none">Sem desfoque</div>
<div class="blur-sm">Desfoque sutil</div>
<div class="blur">Desfoque padrão</div>
<div class="blur-md">Desfoque médio</div>
<div class="blur-lg">Desfoque grande</div>
<div class="blur-xl">Desfoque muito grande</div>
<div class="blur-2xl">Desfoque extra grande</div>
<div class="blur-3xl">Desfoque máximo</div>
```

### **Backdrop Blur (Desfoque de Fundo)**
```html
<!-- Backdrop blur para overlays -->
<div class="backdrop-blur-none">Sem desfoque de fundo</div>
<div class="backdrop-blur-sm">Desfoque de fundo sutil</div>
<div class="backdrop-blur">Desfoque de fundo padrão</div>
<div class="backdrop-blur-md">Desfoque de fundo médio</div>
<div class="backdrop-blur-lg">Desfoque de fundo grande</div>
<div class="backdrop-blur-xl">Desfoque de fundo muito grande</div>
```

## 🎯 **Padrões de Uso Recomendados**

### **Hover Effects em Botões**
```html
<!-- Botão com efeitos de hover -->
<button class="
  px-lg py-md bg-primary text-white rounded-lg
  transition-all duration-normal ease-in-out
  hover:bg-primary-dark hover:scale-105 hover:shadow-lg
  active:scale-95
  focus:outline-none focus:ring-4 focus:ring-primary/20
">
  Botão Interativo
</button>
```

### **Card com Hover Effect**
```html
<div class="
  bg-bg-secondary border border-border rounded-lg p-lg
  transition-all duration-normal ease-in-out
  hover:shadow-xl hover:-translate-y-1 hover:border-primary/50
  cursor-pointer
">
  <h3 class="text-xl font-semibold mb-md">Card Interativo</h3>
  <p class="text-text-secondary">Card que responde ao hover com animações suaves.</p>
</div>
```

### **Loading States**
```html
<!-- Spinner de loading -->
<div class="
  w-8 h-8 border-4 border-border border-t-primary rounded-full
  animate-spin
"></div>

<!-- Skeleton loading -->
<div class="space-y-md">
  <div class="h-4 bg-bg-tertiary rounded animate-pulse"></div>
  <div class="h-4 bg-bg-tertiary rounded animate-pulse w-3/4"></div>
  <div class="h-4 bg-bg-tertiary rounded animate-pulse w-1/2"></div>
</div>

<!-- Pulsing element -->
<div class="
  w-12 h-12 bg-primary rounded-full
  animate-pulse opacity-75
"></div>
```

### **Modal com Animação**
```html
<!-- Backdrop com fade-in -->
<div class="
  fixed inset-0 bg-black/50 z-modal-backdrop
  transition-opacity duration-normal ease-out
  opacity-0 animate-fade-in
">
  <!-- Modal com slide-up -->
  <div class="
    flex items-center justify-center min-h-full p-lg
    transition-transform duration-normal ease-out
    transform translate-y-4 animate-slide-up
  ">
    <div class="
      bg-bg-secondary rounded-xl w-full max-w-md
      transition-all duration-normal ease-out
      transform scale-95 animate-scale-in
    ">
      <!-- Conteúdo do modal -->
    </div>
  </div>
</div>
```

### **Notification Toast**
```html
<div class="
  fixed top-4 right-4 z-tooltip
  bg-success text-white px-lg py-md rounded-lg shadow-lg
  transition-all duration-normal ease-out
  transform translate-x-full animate-slide-in-right
">
  <div class="flex items-center gap-sm">
    <span>✓</span>
    <span>Operação realizada com sucesso!</span>
  </div>
</div>
```

### **Dropdown com Animação**
```html
<div class="relative">
  <button class="
    px-md py-sm bg-bg-secondary border border-border rounded
    transition-all duration-150 ease-in-out
    hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20
  ">
    Menu
  </button>
  
  <!-- Dropdown menu -->
  <div class="
    absolute top-full left-0 mt-1 w-48 z-dropdown
    bg-bg-secondary border border-border rounded-lg shadow-lg
    transition-all duration-200 ease-out
    transform origin-top-left scale-95 opacity-0
    group-hover:scale-100 group-hover:opacity-100
  ">
    <a class="
      block px-md py-sm text-text-primary
      transition-colors duration-150 ease-in-out
      hover:bg-bg-tertiary hover:text-accent
    ">
      Item 1
    </a>
  </div>
</div>
```

### **Progress Indicators**
```html
<!-- Progress bar animada -->
<div class="w-full bg-bg-tertiary rounded-full h-2">
  <div class="
    bg-primary h-2 rounded-full
    transition-all duration-500 ease-out
    w-0 animate-progress
  "></div>
</div>

<!-- Circular progress -->
<div class="
  w-16 h-16 border-4 border-bg-tertiary border-t-primary rounded-full
  transition-transform duration-1000 ease-linear
  animate-spin
"></div>
```

### **Image Gallery com Hover**
```html
<div class="grid grid-cols-2 md:grid-cols-3 gap-md">
  <div class="
    relative overflow-hidden rounded-lg
    transition-transform duration-normal ease-out
    hover:scale-105
  ">
    <img class="
      w-full h-48 object-cover
      transition-transform duration-500 ease-out
      hover:scale-110
    " src="image.jpg" alt="Gallery Image">
    
    <!-- Overlay -->
    <div class="
      absolute inset-0 bg-black/40
      transition-opacity duration-normal ease-out
      opacity-0 hover:opacity-100
      flex items-center justify-center
    ">
      <button class="
        px-md py-sm bg-white text-black rounded
        transition-transform duration-150 ease-out
        transform scale-75 hover:scale-100
      ">
        Ver Mais
      </button>
    </div>
  </div>
</div>
```

## 🎭 **Animações Personalizadas**

### **Definindo Keyframes Customizadas**
```scss
// Em arquivos SASS personalizados
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
```

### **Classes de Animação Úteis**
```html
<!-- Fade effects -->
<div class="animate-fade-in">Fade in</div>
<div class="animate-fade-out">Fade out</div>

<!-- Slide effects -->
<div class="animate-slide-in-left">Slide from left</div>
<div class="animate-slide-in-right">Slide from right</div>
<div class="animate-slide-in-up">Slide from bottom</div>
<div class="animate-slide-in-down">Slide from top</div>

<!-- Scale effects -->
<div class="animate-scale-in">Scale in</div>
<div class="animate-scale-out">Scale out</div>

<!-- Attention grabbers -->
<div class="animate-bounce">Bounce</div>
<div class="animate-pulse">Pulse</div>
<div class="animate-ping">Ping</div>
```

## 🎯 **Guia para IAs**

### **Escolha de Efeitos por Contexto**

| Contexto | Efeito | Duração | Exemplo |
|----------|--------|---------|---------|
| **Button Hover** | `hover:scale-105` | `duration-150` | Feedback instantâneo |
| **Card Hover** | `hover:shadow-lg` | `duration-normal` | Elevação sutil |
| **Modal** | `backdrop-blur-sm` | `duration-300` | Foco no conteúdo |
| **Loading** | `animate-spin` | - | Feedback de processo |
| **Toast** | `animate-slide-in-right` | `duration-normal` | Notificação |
| **Image** | `hover:scale-110` | `duration-500` | Zoom suave |

### **Combinações Eficazes**

```html
<!-- Hover interativo completo -->
<div class="transition-all duration-normal hover:scale-105 hover:shadow-lg">

<!-- Modal com backdrop blur -->
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm">

<!-- Loading state -->
<div class="animate-pulse bg-bg-tertiary rounded">

<!-- Botão com feedback -->
<button class="transition-transform active:scale-95 hover:scale-105">
```

### **Melhores Práticas**

1. **Use `transition-all`** para efeitos gerais
2. **Use `duration-normal`** como padrão
3. **Use `ease-in-out`** para movimentos naturais
4. **Combine `scale` e `shadow`** para elevação
5. **Use `backdrop-blur`** em overlays

---

**💡 Os efeitos devem ser sutis e melhorar a experiência, não distrair o usuário.**
