# 🎨 SymbIA Framework - Sistema de Cores

## 📋 **Visão Geral**

O sistema de cores do SymbIA Framework oferece uma paleta consistente baseada no tema **Blue Twilight**, com classes utilitárias para texto, background, bordas e efeitos especiais.

## 🎭 **Paleta de Cores Principal**

### **Cores de Brand**
| Nome | Hex | RGB | Uso Principal |
|------|-----|-----|---------------|
| **Primary** | `#1e4ba6` | `30, 75, 166` | Elementos principais, CTAs |
| **Primary Light** | `#4a7bc8` | `74, 123, 200` | Hover states, variações |
| **Primary Dark** | `#143697` | `20, 54, 151` | Estados ativos, sombras |
| **Secondary** | `#6366f1` | `99, 102, 241` | Elementos secundários |
| **Accent** | `#0ea5e9` | `14, 165, 233` | Destaques, links, ações |

### **Cores de Background**
| Nome | Hex | RGB | Uso Principal |
|------|-----|-----|---------------|
| **BG Primary** | `#0f1629` | `15, 22, 41` | Fundo principal da aplicação |
| **BG Secondary** | `#1a2642` | `26, 38, 66` | Cards, headers, sidebars |
| **BG Tertiary** | `#243356` | `36, 51, 86` | Elementos ativos, hovers |
| **BG Surface** | `#143697` | `20, 54, 151` | Superfícies de destaque |
| **BG Content** | `#2d4372` | `45, 67, 114` | Área de conteúdo principal, mais clara |

### **Cores de Texto**
| Nome | Hex | RGB | Uso Principal |
|------|-----|-----|---------------|
| **Text Primary** | `#e2e8f0` | `226, 232, 240` | Texto principal |
| **Text Secondary** | `#cbd5e1` | `203, 213, 225` | Texto secundário |
| **Text Muted** | `#94a3b8` | `148, 163, 184` | Texto esmaecido |
| **Text Accent** | `#0ea5e9` | `14, 165, 233` | Texto de destaque |

## 🎨 **Classes de Cores de Texto**

### **Cores do Sistema**
```html
<!-- Cores principais do texto -->
<p class="text-primary">Texto na cor primária</p>
<p class="text-secondary">Texto na cor secundária</p>
<p class="text-accent">Texto na cor de destaque</p>

<!-- Hierarquia de texto -->
<h1 class="text-text-primary">Título principal</h1>
<p class="text-text-secondary">Texto secundário</p>
<span class="text-text-muted">Texto esmaecido</span>
<a class="text-text-accent">Link ou destaque</a>
```

### **Cores de Status**
```html
<!-- Estados funcionais -->
<p class="text-success">Mensagem de sucesso</p>
<p class="text-warning">Mensagem de aviso</p>
<p class="text-error">Mensagem de erro</p>
<p class="text-info">Mensagem informativa</p>
```

### **Variações de Intensidade**
```html
<!-- Variações da cor primária -->
<p class="text-primary-light">Primária clara</p>
<p class="text-primary">Primária padrão</p>
<p class="text-primary-dark">Primária escura</p>

<!-- Variações da cor secundária -->
<p class="text-secondary-light">Secundária clara</p>
<p class="text-secondary">Secundária padrão</p>
<p class="text-secondary-dark">Secundária escura</p>

<!-- Variações da cor de destaque -->
<p class="text-accent-light">Destaque claro</p>
<p class="text-accent">Destaque padrão</p>
<p class="text-accent-dark">Destaque escuro</p>
```

### **Cores Neutras**
```html
<!-- Escala de cinzas -->
<p class="text-white">Texto branco</p>
<p class="text-gray-100">Cinza muito claro</p>
<p class="text-gray-200">Cinza claro</p>
<p class="text-gray-300">Cinza claro médio</p>
<p class="text-gray-400">Cinza médio</p>
<p class="text-gray-500">Cinza</p>
<p class="text-gray-600">Cinza escuro médio</p>
<p class="text-gray-700">Cinza escuro</p>
<p class="text-gray-800">Cinza muito escuro</p>
<p class="text-gray-900">Cinza quase preto</p>
<p class="text-black">Texto preto</p>
```

## 🎨 **Classes de Background**

### **Backgrounds do Sistema**
```html
<!-- Backgrounds principais -->
<div class="bg-bg-primary">Fundo principal da aplicação</div>
<div class="bg-bg-secondary">Fundo de cards e componentes</div>
<div class="bg-bg-tertiary">Fundo de elementos ativos</div>
<div class="bg-bg-surface">Superfície de destaque</div>
<div class="bg-surface-content">Área de conteúdo principal (mais clara)</div>
```

### **Backgrounds de Brand**
```html
<!-- Cores de brand como background -->
<div class="bg-primary">Background primário</div>
<div class="bg-primary-light">Background primário claro</div>
<div class="bg-primary-dark">Background primário escuro</div>

<div class="bg-secondary">Background secundário</div>
<div class="bg-secondary-light">Background secundário claro</div>
<div class="bg-secondary-dark">Background secundário escuro</div>

<div class="bg-accent">Background de destaque</div>
<div class="bg-accent-light">Background de destaque claro</div>
<div class="bg-accent-dark">Background de destaque escuro</div>
```

### **Backgrounds de Status**
```html
<!-- Estados funcionais -->
<div class="bg-success">Background de sucesso</div>
<div class="bg-warning">Background de aviso</div>
<div class="bg-error">Background de erro</div>
<div class="bg-info">Background informativo</div>

<!-- Com transparência para alertas -->
<div class="bg-success/10">Background de sucesso 10% opacidade</div>
<div class="bg-warning/20">Background de aviso 20% opacidade</div>
<div class="bg-error/10">Background de erro 10% opacidade</div>
<div class="bg-info/15">Background informativo 15% opacidade</div>
```

### **Backgrounds com Transparência**
```html
<!-- Transparências úteis para overlays -->
<div class="bg-black/50">Overlay escuro 50%</div>
<div class="bg-white/10">Overlay claro 10%</div>
<div class="bg-primary/20">Background primário transparente</div>
<div class="bg-accent/30">Background de destaque transparente</div>
```

## 🔲 **Classes de Bordas**

### **Cores de Borda**
```html
<!-- Bordas do sistema -->
<div class="border border-border">Borda padrão</div>
<div class="border border-border-light">Borda clara</div>
<div class="border border-border-accent">Borda de destaque</div>

<!-- Bordas de brand -->
<div class="border border-primary">Borda primária</div>
<div class="border border-secondary">Borda secundária</div>
<div class="border border-accent">Borda de destaque</div>

<!-- Bordas de status -->
<div class="border border-success">Borda de sucesso</div>
<div class="border border-warning">Borda de aviso</div>
<div class="border border-error">Borda de erro</div>
<div class="border border-info">Borda informativa</div>
```

### **Bordas Direcionais**
```html
<!-- Bordas específicas -->
<div class="border-t border-border">Borda superior</div>
<div class="border-r border-primary">Borda direita primária</div>
<div class="border-b border-accent">Borda inferior de destaque</div>
<div class="border-l border-success">Borda esquerda de sucesso</div>
```

## 🌈 **Gradientes Pré-definidos**

### **Gradientes de Background**
```html
<!-- Gradientes do sistema -->
<div class="bg-gradient-primary">Gradiente primário</div>
<div class="bg-gradient-accent">Gradiente de destaque</div>
<div class="bg-gradient-surface">Gradiente de superfície</div>

<!-- Gradientes personalizados -->
<div class="bg-gradient-to-r from-primary to-accent">
  Gradiente horizontal primário para destaque
</div>
<div class="bg-gradient-to-b from-bg-secondary to-bg-tertiary">
  Gradiente vertical de backgrounds
</div>
<div class="bg-gradient-to-br from-primary via-secondary to-accent">
  Gradiente diagonal com três cores
</div>
```

## 🎯 **Padrões de Uso Recomendados**

### **Card com Cores do Sistema**
```html
<div class="bg-bg-secondary border border-border rounded-lg p-lg">
  <h3 class="text-xl font-semibold text-text-primary mb-sm">
    Título do Card
  </h3>
  <p class="text-text-secondary mb-md">
    Descrição do card usando cor secundária de texto.
  </p>
  <div class="flex gap-sm">
    <button class="bg-primary text-white px-md py-sm rounded">
      Ação Primária
    </button>
    <button class="bg-bg-tertiary text-text-primary border border-border px-md py-sm rounded">
      Ação Secundária
    </button>
  </div>
</div>
```

### **Alert Messages**
```html
<!-- Alert de Sucesso -->
<div class="bg-success/10 border border-success/30 rounded-lg p-md">
  <div class="flex items-center gap-sm">
    <div class="w-5 h-5 bg-success rounded-full"></div>
    <p class="text-success font-medium">Operação realizada com sucesso!</p>
  </div>
</div>

<!-- Alert de Erro -->
<div class="bg-error/10 border border-error/30 rounded-lg p-md">
  <div class="flex items-center gap-sm">
    <div class="w-5 h-5 bg-error rounded-full"></div>
    <p class="text-error font-medium">Erro ao processar solicitação</p>
  </div>
</div>

<!-- Alert de Aviso -->
<div class="bg-warning/10 border border-warning/30 rounded-lg p-md">
  <div class="flex items-center gap-sm">
    <div class="w-5 h-5 bg-warning rounded-full"></div>
    <p class="text-warning font-medium">Atenção: Esta ação não pode ser desfeita</p>
  </div>
</div>
```

### **Navigation com Cores**
```html
<nav class="bg-bg-secondary border-b border-border px-lg py-md">
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-md">
      <div class="w-8 h-8 bg-primary rounded"></div>
      <h1 class="text-xl font-bold text-text-primary">SymbIA</h1>
    </div>
    <div class="flex gap-md">
      <a class="text-text-accent hover:text-accent-light">Dashboard</a>
      <a class="text-text-secondary hover:text-text-accent">Projetos</a>
      <a class="text-text-secondary hover:text-text-accent">Configurações</a>
    </div>
  </div>
</nav>
```

### **Formulário com Cores de Estado**
```html
<form class="space-y-lg">
  <!-- Campo Normal -->
  <div class="space-y-sm">
    <label class="block text-sm font-medium text-text-primary">Nome</label>
    <input class="w-full px-md py-sm bg-bg-tertiary border border-border rounded text-text-primary">
  </div>
  
  <!-- Campo com Erro -->
  <div class="space-y-sm">
    <label class="block text-sm font-medium text-text-primary">Email</label>
    <input class="w-full px-md py-sm bg-bg-tertiary border border-error rounded text-text-primary">
    <p class="text-xs text-error">Email inválido</p>
  </div>
  
  <!-- Campo com Sucesso -->
  <div class="space-y-sm">
    <label class="block text-sm font-medium text-text-primary">Telefone</label>
    <input class="w-full px-md py-sm bg-bg-tertiary border border-success rounded text-text-primary">
    <p class="text-xs text-success">Formato correto</p>
  </div>
</form>
```

### **Buttons com Variações de Cor**
```html
<div class="flex gap-sm">
  <!-- Botão Primário -->
  <button class="bg-primary hover:bg-primary-dark text-white px-lg py-md rounded font-semibold">
    Ação Principal
  </button>
  
  <!-- Botão Secundário -->
  <button class="bg-bg-tertiary hover:bg-bg-surface text-text-primary border border-border px-lg py-md rounded font-semibold">
    Ação Secundária
  </button>
  
  <!-- Botão de Destaque -->
  <button class="bg-accent hover:bg-accent-dark text-white px-lg py-md rounded font-semibold">
    Call to Action
  </button>
  
  <!-- Botão de Perigo -->
  <button class="bg-error hover:bg-error/80 text-white px-lg py-md rounded font-semibold">
    Excluir
  </button>
</div>
```

### **Status Indicators**
```html
<div class="flex gap-md items-center">
  <!-- Status Badges -->
  <span class="bg-success/20 text-success px-sm py-xs rounded-full text-xs font-medium">
    Ativo
  </span>
  <span class="bg-warning/20 text-warning px-sm py-xs rounded-full text-xs font-medium">
    Pendente
  </span>
  <span class="bg-error/20 text-error px-sm py-xs rounded-full text-xs font-medium">
    Inativo
  </span>
  <span class="bg-info/20 text-info px-sm py-xs rounded-full text-xs font-medium">
    Em Análise
  </span>
</div>
```

## 🌓 **Dark Theme Integration**

### **Usando CSS Custom Properties**
```html
<!-- O framework usa CSS custom properties para fácil tema switching -->
<div class="bg-[var(--bg-primary)] text-[var(--text-primary)]">
  Conteúdo que se adapta automaticamente ao tema
</div>

<!-- Classes que respeitam o sistema de temas -->
<div class="bg-bg-primary text-text-primary">
  Sempre usa as cores corretas do tema ativo
</div>
```

## 🎯 **Guia para IAs**

### **Hierarquia de Cores por Contexto**

| Contexto | Background | Texto | Borda | Exemplo |
|----------|------------|-------|-------|---------|
| **Page Background** | `bg-bg-primary` | `text-text-primary` | - | Layout principal |
| **Card/Component** | `bg-bg-secondary` | `text-text-primary` | `border-border` | Cards, modais |
| **Active Element** | `bg-bg-tertiary` | `text-text-primary` | `border-border-light` | Hover states |
| **Primary Action** | `bg-primary` | `text-white` | `border-primary` | Botões principais |
| **Secondary Action** | `bg-bg-tertiary` | `text-text-primary` | `border-border` | Botões secundários |
| **Success State** | `bg-success/10` | `text-success` | `border-success` | Alerts de sucesso |
| **Error State** | `bg-error/10` | `text-error` | `border-error` | Alerts de erro |

### **Combinações Eficazes**

```html
<!-- Para elementos principais -->
<div class="bg-bg-secondary text-text-primary border border-border">

<!-- Para elementos de destaque -->
<div class="bg-primary text-white">

<!-- Para elementos de status -->
<div class="bg-success/10 text-success border border-success/30">

<!-- Para elementos interativos -->
<div class="bg-bg-tertiary hover:bg-bg-surface text-text-primary">
```

### **Regras de Acessibilidade**

1. **Contraste de texto**: Sempre use `text-text-primary` para texto principal
2. **Backgrounds escuros**: Use `text-white` ou `text-text-primary`
3. **Backgrounds claros**: Use `text-gray-900` ou `text-black`
4. **Estados de hover**: Mantenha contraste adequado
5. **Status colors**: Use transparência para backgrounds, cor sólida para texto

---

**💡 Sempre teste as combinações de cores para garantir acessibilidade e legibilidade adequadas.**
