# 🔧 SymbIA Framework - Variáveis SASS

## 📋 **Visão Geral**

Este documento lista todas as variáveis SASS disponíveis no SymbIA Framework. Use estas variáveis para manter consistência e permitir fácil customização através do sistema de temas.

## 🎨 **Sistema de Cores**

### **Cores Primárias**
```scss
// Blue Twilight Theme (Ativo)
$color-primary: #1e4ba6;        // Blue Primary
$color-primary-light: #4a7bc8;  // Light Blue  
$color-primary-dark: #143697;   // Original Dark Blue

$color-secondary: #6366f1;      // Indigo
$color-secondary-light: #8b8bff; // Light Indigo
$color-secondary-dark: #4338ca;  // Dark Indigo

$color-accent: #0ea5e9;         // Sky Blue
$color-accent-light: #38bdf8;   // Light Sky
$color-accent-dark: #0284c7;    // Dark Sky
```

### **Cores de Background**
```scss
$color-bg-primary: #0f1629;     // Deep Blue Dark - Fundo principal
$color-bg-secondary: #1a2642;   // Medium Blue Dark - Cards, headers
$color-bg-tertiary: #243356;    // Lighter Blue Dark - Elementos ativos
$color-bg-surface: #143697;     // Surface - Botões, superfícies
```

### **Cores de Texto**
```scss
$color-text-primary: #e2e8f0;   // Soft White - Texto principal
$color-text-secondary: #cbd5e1; // Light Blue Gray - Texto secundário
$color-text-muted: #94a3b8;     // Blue Gray - Texto esmaecido
$color-text-accent: #0ea5e9;    // Sky Blue - Texto de destaque
```

### **Cores de Borda**
```scss
$color-border: #334155;         // Blue Gray Border - Bordas padrão
$color-border-light: #475569;   // Lighter Blue Border - Bordas suaves
$color-border-accent: #1e4ba6;  // Primary Border - Bordas de destaque
```

### **Cores de Status**
```scss
$color-success: #22c55e;        // Green - Sucesso
$color-warning: #f59e0b;        // Amber - Aviso
$color-error: #ef4444;          // Red - Erro
$color-info: #1e4ba6;           // Blue Primary - Informação
```

## 📝 **Sistema de Tipografia**

### **Famílias de Fonte**
```scss
$font-family-primary: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
$font-family-mono: 'Fira Code', 'Consolas', 'Monaco', monospace;
```

### **Tamanhos de Fonte**
```scss
$font-size-xs: 0.75rem;    // 12px - Texto muito pequeno
$font-size-sm: 0.875rem;   // 14px - Texto pequeno
$font-size-base: 1rem;     // 16px - Texto padrão
$font-size-lg: 1.125rem;   // 18px - Texto grande
$font-size-xl: 1.25rem;    // 20px - Título pequeno
$font-size-2xl: 1.5rem;    // 24px - Título médio
$font-size-3xl: 1.875rem;  // 30px - Título grande
$font-size-4xl: 2.25rem;   // 36px - Título muito grande
```

### **Pesos de Fonte**
```scss
$font-weight-light: 300;       // Texto leve
$font-weight-normal: 400;      // Texto normal
$font-weight-medium: 500;      // Texto médio
$font-weight-semibold: 600;    // Texto semi-negrito
$font-weight-bold: 700;        // Texto negrito
```

### **Altura de Linha**
```scss
$line-height-tight: 1.25;      // Altura compacta
$line-height-normal: 1.5;      // Altura normal
$line-height-relaxed: 1.75;    // Altura relaxada
```

## 📏 **Sistema de Espaçamento**

### **Valores de Spacing**
```scss
$spacing-xs: 0.25rem;   // 4px - Espaçamento muito pequeno
$spacing-sm: 0.5rem;    // 8px - Espaçamento pequeno
$spacing-md: 1rem;      // 16px - Espaçamento médio
$spacing-lg: 1.5rem;    // 24px - Espaçamento grande
$spacing-xl: 2rem;      // 32px - Espaçamento muito grande
$spacing-2xl: 3rem;     // 48px - Espaçamento extra grande
$spacing-3xl: 4rem;     // 64px - Espaçamento máximo
```

## 🔲 **Sistema de Border Radius**

```scss
$border-radius-sm: 0.25rem;    // 4px - Cantos sutis
$border-radius-md: 0.5rem;     // 8px - Cantos médios
$border-radius-lg: 0.75rem;    // 12px - Cantos grandes
$border-radius-xl: 1rem;       // 16px - Cantos muito grandes
$border-radius-full: 9999px;   // Full circle - Circular
```

## ✨ **Sistema de Sombras**

```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);      // Sombra sutil
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.25);     // Sombra média
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2);    // Sombra grande
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);   // Sombra extra grande
```

## 🌟 **Sistema de Glow**

```scss
$glow-primary: 0 0 20px rgba($color-primary, 0.4);   // Brilho primário
$glow-accent: 0 0 20px rgba($color-accent, 0.4);     // Brilho de destaque
$glow-success: 0 0 20px rgba($color-success, 0.4);   // Brilho de sucesso
$glow-error: 0 0 20px rgba($color-error, 0.4);       // Brilho de erro
```

## 🔄 **Sistema de Transições**

```scss
$transition-fast: 0.15s ease-in-out;      // Transição rápida
$transition-normal: 0.3s ease-in-out;     // Transição normal
$transition-slow: 0.5s ease-in-out;       // Transição lenta
```

## 📱 **Breakpoints Responsivos**

```scss
$breakpoint-sm: 640px;    // Small - Mobile landscape
$breakpoint-md: 768px;    // Medium - Tablet
$breakpoint-lg: 1024px;   // Large - Desktop small
$breakpoint-xl: 1280px;   // Extra Large - Desktop
$breakpoint-2xl: 1536px;  // 2X Large - Desktop large
```

## 📊 **Z-Index Scale**

```scss
$z-index-dropdown: 1000;      // Dropdowns
$z-index-sticky: 1020;        // Sticky elements
$z-index-fixed: 1030;         // Fixed elements
$z-index-modal-backdrop: 1040; // Modal backdrop
$z-index-modal: 1050;         // Modal content
$z-index-popover: 1060;       // Popovers
$z-index-tooltip: 1070;       // Tooltips
```

## 🧩 **Variáveis de Componentes**

### **Forms & Inputs**
```scss
$input-bg: rgba(255, 255, 255, 0.08);              // Background do input
$input-border: rgba(255, 255, 255, 0.2);           // Borda do input
$input-focus-bg: rgba(255, 255, 255, 0.12);        // Background do input em foco
$input-padding-x: 1rem;                            // Padding horizontal
$input-padding-y: 0.875rem;                        // Padding vertical
$input-placeholder-color: rgba(#cbd5e1, 0.7);      // Cor do placeholder
$input-focus-shadow: 0 0 0 3px rgba(#1e4ba6, 0.15); // Sombra do focus
$input-error-shadow: 0 0 0 3px rgba(#ef4444, 0.15); // Sombra de erro
$textarea-min-height: 120px;                       // Altura mínima textarea
$checkbox-size: 16px;                              // Tamanho do checkbox
```

### **Buttons**
```scss
$btn-height-sm: 32px;                    // Altura botão pequeno
$btn-height-md: 40px;                    // Altura botão médio
$btn-height-lg: 48px;                    // Altura botão grande
$btn-disabled-opacity: 0.6;              // Opacidade botão desabilitado
$btn-hover-transform: translateY(-2px);  // Transform no hover
```

### **Modal**
```scss
$modal-max-width: 400px;              // Largura máxima do modal
$modal-padding: 20px;                 // Padding geral
$modal-header-padding: 20px 20px 0 20px; // Padding do header
$modal-content-padding: 20px;         // Padding do conteúdo
$modal-actions-padding: 0 20px 20px 20px; // Padding das ações
$modal-actions-gap: 12px;             // Gap entre botões
$modal-overlay-blur: 4px;             // Blur do backdrop
```

### **Card**
```scss
$card-padding: $spacing-lg;           // Padding do card
$card-border-width: 1px;              // Largura da borda
```

### **Table**
```scss
$table-cell-padding: $spacing-sm $spacing-md; // Padding da célula
$table-header-font-weight: $font-weight-semibold; // Peso da fonte do header
$table-border-width: 1px;                     // Largura da borda
```

### **Header & Navigation**
```scss
$header-height: 64px;                 // Altura do header
$header-padding: 0 $spacing-lg;       // Padding do header
$sidebar-width: 280px;                // Largura do sidebar
$sidebar-width-collapsed: 64px;       // Largura do sidebar colapsado
```

### **Notifications**
```scss
$notification-padding: $spacing-md;           // Padding da notificação
$notification-border-radius: $border-radius-md; // Border radius
$notification-max-width: 400px;              // Largura máxima
```

## 🎭 **Sistema de Gradientes**

```scss
// Gradientes pré-definidos
$gradient-primary: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
$gradient-accent: linear-gradient(135deg, $color-accent 0%, $color-accent-dark 100%);
$gradient-surface: linear-gradient(135deg, $color-bg-secondary 0%, $color-bg-tertiary 100%);
```

## 📋 **Como Usar as Variáveis**

### **Em arquivos SASS:**
```scss
@use 'variables' as *;

.meu-componente {
  background-color: $color-primary;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
  box-shadow: $shadow-md;
}
```

### **Criando variações:**
```scss
.botao-custom {
  background: $gradient-primary;
  color: $color-text-primary;
  padding: $spacing-sm $spacing-lg;
  transition: $transition-normal;
  
  &:hover {
    box-shadow: $glow-primary;
    transform: $btn-hover-transform;
  }
}
```

## 🎯 **Dicas para IAs**

1. **Sempre use as variáveis** ao invés de valores hardcoded
2. **Mantenha a consistência** do tema usando as cores definidas
3. **Use o sistema de spacing** para manter proporções harmônicas
4. **Aplique os gradientes** pré-definidos para elementos de destaque
5. **Respeite a hierarquia tipográfica** usando os tamanhos corretos

---

**💡 Esta documentação é atualizada automaticamente quando as variáveis são modificadas no código.**
