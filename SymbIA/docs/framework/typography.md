# 📝 SymbIA Framework - Sistema de Tipografia

## 📋 **Visão Geral**

O sistema de tipografia do SymbIA Framework oferece classes utilitárias para controlar família de fonte, tamanho, peso, estilo, alinhamento e cores de texto, criando uma hierarquia visual consistente.

## 🔤 **Famílias de Fonte**

### **Font Family Classes**
```html
<!-- Fonte Sans-serif (padrão do sistema) -->
<p class="font-sans">Texto em Segoe UI, Roboto, Arial, sans-serif</p>

<!-- Fonte Serif -->
<p class="font-serif">Texto em fonte serif padrão do sistema</p>

<!-- Fonte Monospace -->
<code class="font-mono">Código em Fira Code, Consolas, Monaco, monospace</code>
```

## 📏 **Tamanhos de Fonte**

### **Escala de Tamanhos**
| Classe | Valor | Pixels | Uso Recomendado |
|--------|-------|--------|-----------------|
| `text-xs` | `0.75rem` | `12px` | Legendas, metadados, timestamps |
| `text-sm` | `0.875rem` | `14px` | Texto secundário, labels |
| `text-base` | `1rem` | `16px` | Texto padrão do corpo |
| `text-lg` | `1.125rem` | `18px` | Texto destacado, subtítulos |
| `text-xl` | `1.25rem` | `20px` | Títulos pequenos |
| `text-2xl` | `1.5rem` | `24px` | Títulos médios |
| `text-3xl` | `1.875rem` | `30px` | Títulos grandes |
| `text-4xl` | `2.25rem` | `36px` | Títulos principais |
| `text-5xl` | `3rem` | `48px` | Títulos de destaque |
| `text-6xl` | `3.75rem` | `60px` | Títulos heroicos |

### **Exemplos de Uso**
```html
<!-- Hierarquia de títulos -->
<h1 class="text-4xl font-bold">Título Principal da Página</h1>
<h2 class="text-3xl font-semibold">Seção Principal</h2>
<h3 class="text-2xl font-medium">Subseção</h3>
<h4 class="text-xl font-medium">Título Menor</h4>
<h5 class="text-lg font-medium">Subtítulo</h5>
<h6 class="text-base font-semibold">Título Pequeno</h6>

<!-- Texto do corpo -->
<p class="text-base">Texto padrão do corpo do documento.</p>
<p class="text-sm text-text-secondary">Texto secundário ou descrição.</p>
<span class="text-xs text-text-muted">Metadata ou timestamp</span>

<!-- Texto de destaque -->
<p class="text-lg">Texto destacado ou lead paragraph</p>
<div class="text-6xl font-bold">Hero Title</div>
```

## ⚖️ **Pesos de Fonte**

### **Font Weight Classes**
```html
<!-- Pesos baseados em variáveis -->
<p class="font-light">Texto leve (300)</p>
<p class="font-normal">Texto normal (400)</p>
<p class="font-medium">Texto médio (500)</p>
<p class="font-semibold">Texto semi-negrito (600)</p>
<p class="font-bold">Texto negrito (700)</p>

<!-- Pesos extremos -->
<p class="font-thin">Texto muito fino (100)</p>
<p class="font-extralight">Texto extra leve (200)</p>
<p class="font-extrabold">Texto extra negrito (800)</p>
<p class="font-black">Texto preto (900)</p>
```

### **Combinações Recomendadas**
```html
<!-- Títulos -->
<h1 class="text-4xl font-bold">Título Principal</h1>
<h2 class="text-3xl font-semibold">Título Secundário</h2>
<h3 class="text-2xl font-medium">Subtítulo</h3>

<!-- Navegação -->
<nav class="text-base font-medium">Link de navegação</nav>

<!-- Botões -->
<button class="text-sm font-semibold">Botão Primário</button>
<button class="text-sm font-normal">Botão Secundário</button>

<!-- Texto do corpo -->
<p class="text-base font-normal">Parágrafo normal</p>
<strong class="font-semibold">Texto enfatizado</strong>
```

## 🎭 **Estilos de Fonte**

```html
<!-- Estilo normal -->
<p class="not-italic">Texto normal</p>

<!-- Estilo itálico -->
<em class="italic">Texto em itálico</em>
<p class="italic">Parágrafo em itálico</p>
```

## 📐 **Alinhamento de Texto**

```html
<!-- Alinhamentos horizontais -->
<p class="text-left">Texto alinhado à esquerda</p>
<p class="text-center">Texto centralizado</p>
<p class="text-right">Texto alinhado à direita</p>
<p class="text-justify">Texto justificado</p>

<!-- Alinhamentos verticais -->
<div class="flex items-center">
  <span class="text-top">Texto alinhado ao topo</span>
  <span class="text-middle">Texto alinhado ao meio</span>
  <span class="text-bottom">Texto alinhado à base</span>
</div>
```

## 📏 **Altura de Linha (Line Height)**

```html
<!-- Altura de linha compacta -->
<p class="leading-tight">
  Texto com altura de linha compacta (1.25). 
  Ideal para títulos e elementos onde o espaço é limitado.
</p>

<!-- Altura de linha normal -->
<p class="leading-normal">
  Texto com altura de linha normal (1.5). 
  Ideal para a maioria dos textos do corpo.
</p>

<!-- Altura de linha relaxada -->
<p class="leading-relaxed">
  Texto com altura de linha relaxada (1.75). 
  Ideal para textos longos onde a legibilidade é prioridade.
</p>

<!-- Altura de linha específicas -->
<p class="leading-3">Line height 0.75rem</p>
<p class="leading-4">Line height 1rem</p>
<p class="leading-5">Line height 1.25rem</p>
<p class="leading-6">Line height 1.5rem</p>
<p class="leading-7">Line height 1.75rem</p>
<p class="leading-8">Line height 2rem</p>
<p class="leading-9">Line height 2.25rem</p>
<p class="leading-10">Line height 2.5rem</p>
```

## 🎨 **Cores de Texto**

### **Cores do Sistema**
```html
<!-- Cores principais do texto -->
<p class="text-text-primary">Texto principal (soft white)</p>
<p class="text-text-secondary">Texto secundário (light blue gray)</p>
<p class="text-text-muted">Texto esmaecido (blue gray)</p>
<p class="text-text-accent">Texto de destaque (sky blue)</p>

<!-- Cores de brand -->
<p class="text-primary">Texto na cor primária (blue)</p>
<p class="text-secondary">Texto na cor secundária (indigo)</p>
<p class="text-accent">Texto na cor de destaque (sky blue)</p>

<!-- Cores de status -->
<p class="text-success">Texto de sucesso (green)</p>
<p class="text-warning">Texto de aviso (amber)</p>
<p class="text-error">Texto de erro (red)</p>
<p class="text-info">Texto informativo (blue)</p>

<!-- Cores neutras -->
<p class="text-white">Texto branco</p>
<p class="text-black">Texto preto</p>
<p class="text-gray-50">Texto cinza claro</p>
<p class="text-gray-500">Texto cinza médio</p>
<p class="text-gray-900">Texto cinza escuro</p>
```

## 🔤 **Transformações de Texto**

```html
<!-- Transformações de caso -->
<p class="uppercase">TEXTO EM MAIÚSCULAS</p>
<p class="lowercase">texto em minúsculas</p>
<p class="capitalize">Texto Com Primeira Letra Maiúscula</p>
<p class="normal-case">Texto normal sem transformação</p>
```

## ✂️ **Decorações e Efeitos**

```html
<!-- Decorações de texto -->
<p class="underline">Texto sublinhado</p>
<p class="overline">Texto com linha superior</p>
<p class="line-through">Texto riscado</p>
<p class="no-underline">Texto sem sublinhado</p>

<!-- Quebra de texto -->
<p class="truncate">Texto muito longo que será cortado com ellipsis...</p>
<p class="text-ellipsis overflow-hidden">Texto com ellipsis</p>
<p class="text-clip overflow-hidden">Texto cortado sem ellipsis</p>

<!-- Quebra de palavras -->
<p class="break-normal">Quebra normal de palavras</p>
<p class="break-words">Quebra forçada de palavras longas</p>
<p class="break-all">Quebra em qualquer caractere</p>

<!-- Whitespace -->
<p class="whitespace-normal">Espaços em branco normais</p>
<p class="whitespace-nowrap">Sem quebra de linha</p>
<p class="whitespace-pre">Preserva espaços e quebras</p>
<p class="whitespace-pre-line">Preserva quebras de linha</p>
<p class="whitespace-pre-wrap">Preserva espaços e quebra palavras</p>
```

## 🎯 **Padrões de Uso Recomendados**

### **Hierarquia de Títulos**
```html
<!-- Página completa -->
<article class="space-y-lg">
  <header class="space-y-md">
    <h1 class="text-4xl font-bold text-primary">Título da Página</h1>
    <p class="text-lg text-text-secondary leading-relaxed">
      Subtítulo ou descrição da página
    </p>
  </header>
  
  <section class="space-y-md">
    <h2 class="text-3xl font-semibold text-text-primary">Seção Principal</h2>
    <p class="text-base leading-normal">Conteúdo da seção...</p>
    
    <h3 class="text-2xl font-medium text-text-primary">Subseção</h3>
    <p class="text-base leading-normal">Conteúdo da subseção...</p>
  </section>
</article>
```

### **Card com Tipografia**
```html
<div class="bg-bg-secondary rounded-lg p-lg space-y-md">
  <h3 class="text-xl font-semibold text-text-primary">Título do Card</h3>
  <p class="text-sm text-text-secondary leading-relaxed">
    Descrição do card com texto secundário.
  </p>
  <div class="flex gap-sm">
    <span class="text-xs text-text-muted">12 min atrás</span>
    <span class="text-xs text-accent">•</span>
    <span class="text-xs text-text-muted">Por João Silva</span>
  </div>
</div>
```

### **Formulário com Labels**
```html
<form class="space-y-lg">
  <div class="space-y-sm">
    <label class="block text-sm font-medium text-text-primary">
      Nome Completo
    </label>
    <input 
      class="w-full px-md py-sm text-base"
      placeholder="Digite seu nome"
    >
    <p class="text-xs text-text-muted">
      Seu nome será usado para identificação
    </p>
  </div>
</form>
```

### **Lista de Navegação**
```html
<nav class="space-y-xs">
  <a class="block text-base font-medium text-text-primary hover:text-accent">
    Dashboard
  </a>
  <a class="block text-base font-normal text-text-secondary hover:text-accent">
    Projetos
  </a>
  <a class="block text-base font-normal text-text-secondary hover:text-accent">
    Configurações
  </a>
</nav>
```

### **Alertas/Status Messages**
```html
<!-- Sucesso -->
<div class="bg-success/10 border border-success/20 rounded p-md">
  <p class="text-sm font-medium text-success">
    Operação realizada com sucesso!
  </p>
</div>

<!-- Erro -->
<div class="bg-error/10 border border-error/20 rounded p-md">
  <p class="text-sm font-medium text-error">
    Erro ao processar solicitação
  </p>
</div>

<!-- Aviso -->
<div class="bg-warning/10 border border-warning/20 rounded p-md">
  <p class="text-sm font-medium text-warning">
    Atenção: Esta ação não pode ser desfeita
  </p>
</div>
```

### **Código e Dados Técnicos**
```html
<!-- Inline code -->
<p class="text-base">
  Execute o comando <code class="font-mono text-sm bg-bg-tertiary px-xs py-xs rounded">npm install</code> para instalar.
</p>

<!-- Bloco de código -->
<pre class="font-mono text-sm bg-bg-tertiary p-md rounded-lg overflow-x-auto">
<code class="text-text-primary">
function exemplo() {
  return "Hello World";
}
</code>
</pre>
```

## 📱 **Tipografia Responsiva**

```html
<!-- Títulos responsivos -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  Título que cresce com o viewport
</h1>

<!-- Texto responsivo -->
<p class="text-sm md:text-base lg:text-lg leading-normal">
  Texto que se adapta ao tamanho da tela
</p>

<!-- Layout responsivo com tipografia -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
  <div class="space-y-sm">
    <h3 class="text-lg md:text-xl font-semibold">Título do Card</h3>
    <p class="text-sm md:text-base">Descrição do card</p>
  </div>
</div>
```

## 🎯 **Guia para IAs**

### **Escolha de Tamanhos por Contexto**

| Contexto | Tamanho | Peso | Exemplo |
|----------|---------|------|---------|
| **Hero Title** | `text-6xl` | `font-bold` | Títulos de landing page |
| **Page Title** | `text-4xl` | `font-bold` | Título principal da página |
| **Section Title** | `text-3xl` | `font-semibold` | Títulos de seção |
| **Card Title** | `text-xl` | `font-semibold` | Títulos de cards |
| **Body Text** | `text-base` | `font-normal` | Texto padrão |
| **Captions** | `text-sm` | `font-normal` | Legendas e descrições |
| **Metadata** | `text-xs` | `font-normal` | Timestamps, tags |
| **Buttons** | `text-sm` | `font-semibold` | Texto de botões |
| **Labels** | `text-sm` | `font-medium` | Labels de formulário |

### **Hierarquia de Cores**

1. **text-text-primary**: Texto principal, títulos importantes
2. **text-text-secondary**: Texto de apoio, descrições
3. **text-text-muted**: Metadados, timestamps
4. **text-accent**: Links, CTAs, texto de destaque
5. **text-primary**: Elementos de brand
6. **text-success/warning/error**: Status e feedback

### **Combinações Eficazes**

```html
<!-- Combinação para Card Header -->
<div class="text-xl font-semibold text-text-primary">

<!-- Combinação para Texto de Corpo -->
<div class="text-base leading-normal text-text-primary">

<!-- Combinação para Metadata -->
<div class="text-xs text-text-muted">

<!-- Combinação para Links -->
<div class="text-base text-accent hover:text-accent-light">

<!-- Combinação para Botões -->
<div class="text-sm font-semibold text-white">
```

---

**💡 Mantenha sempre a hierarquia visual clara usando tamanhos e pesos apropriados para cada tipo de conteúdo.**
