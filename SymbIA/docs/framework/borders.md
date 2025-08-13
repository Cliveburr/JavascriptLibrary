# 🔲 SymbIA Framework - Sistema de Bordas

## 📋 **Visão Geral**

O sistema de bordas do SymbIA Framework oferece classes utilitárias para controlar largura, estilo, cor e raio das bordas de elementos.

## 📏 **Largura de Borda (Border Width)**

### **Bordas em Todas as Direções**
```html
<!-- Larguras de borda -->
<div class="border-0">Sem borda</div>
<div class="border">Borda padrão (1px)</div>
<div class="border-2">Borda 2px</div>
<div class="border-4">Borda 4px</div>
<div class="border-8">Borda 8px</div>
```

### **Bordas Direcionais**
```html
<!-- Borda superior -->
<div class="border-t">Borda superior 1px</div>
<div class="border-t-0">Sem borda superior</div>
<div class="border-t-2">Borda superior 2px</div>
<div class="border-t-4">Borda superior 4px</div>

<!-- Borda direita -->
<div class="border-r">Borda direita 1px</div>
<div class="border-r-0">Sem borda direita</div>
<div class="border-r-2">Borda direita 2px</div>
<div class="border-r-4">Borda direita 4px</div>

<!-- Borda inferior -->
<div class="border-b">Borda inferior 1px</div>
<div class="border-b-0">Sem borda inferior</div>
<div class="border-b-2">Borda inferior 2px</div>
<div class="border-b-4">Borda inferior 4px</div>

<!-- Borda esquerda -->
<div class="border-l">Borda esquerda 1px</div>
<div class="border-l-0">Sem borda esquerda</div>
<div class="border-l-2">Borda esquerda 2px</div>
<div class="border-l-4">Borda esquerda 4px</div>
```

### **Bordas em Eixos**
```html
<!-- Bordas horizontais (esquerda + direita) -->
<div class="border-x">Bordas laterais 1px</div>
<div class="border-x-0">Sem bordas laterais</div>
<div class="border-x-2">Bordas laterais 2px</div>

<!-- Bordas verticais (superior + inferior) -->
<div class="border-y">Bordas verticais 1px</div>
<div class="border-y-0">Sem bordas verticais</div>
<div class="border-y-2">Bordas verticais 2px</div>
```

## 🎨 **Cores de Borda**

### **Cores do Sistema**
```html
<!-- Cores neutras do sistema -->
<div class="border border-border">Borda padrão do sistema</div>
<div class="border border-border-light">Borda clara do sistema</div>
<div class="border border-border-accent">Borda de destaque</div>

<!-- Cores de brand -->
<div class="border border-primary">Borda primária</div>
<div class="border border-primary-light">Borda primária clara</div>
<div class="border border-primary-dark">Borda primária escura</div>

<div class="border border-secondary">Borda secundária</div>
<div class="border border-accent">Borda de destaque</div>
```

### **Cores de Status**
```html
<!-- Estados funcionais -->
<div class="border border-success">Borda de sucesso</div>
<div class="border border-warning">Borda de aviso</div>
<div class="border border-error">Borda de erro</div>
<div class="border border-info">Borda informativa</div>
```

### **Cores Neutras**
```html
<!-- Escala de cinzas -->
<div class="border border-transparent">Borda transparente</div>
<div class="border border-white">Borda branca</div>
<div class="border border-gray-100">Borda cinza muito clara</div>
<div class="border border-gray-200">Borda cinza clara</div>
<div class="border border-gray-300">Borda cinza</div>
<div class="border border-gray-400">Borda cinza média</div>
<div class="border border-gray-500">Borda cinza escura</div>
<div class="border border-gray-600">Borda cinza muito escura</div>
<div class="border border-black">Borda preta</div>
```

### **Bordas com Transparência**
```html
<!-- Bordas semi-transparentes -->
<div class="border border-primary/20">Borda primária 20% opacidade</div>
<div class="border border-success/30">Borda de sucesso 30% opacidade</div>
<div class="border border-error/40">Borda de erro 40% opacidade</div>
<div class="border border-white/50">Borda branca 50% opacidade</div>
```

## 🎭 **Estilos de Borda**

```html
<!-- Estilos de linha -->
<div class="border border-solid">Borda sólida (padrão)</div>
<div class="border border-dashed">Borda tracejada</div>
<div class="border border-dotted">Borda pontilhada</div>
<div class="border border-double">Borda dupla</div>
<div class="border border-none">Sem borda</div>
```

## 🔘 **Border Radius (Cantos Arredondados)**

### **Radius em Todos os Cantos**
```html
<!-- Arredondamento usando escala do sistema -->
<div class="rounded-none">Cantos retos</div>
<div class="rounded-sm">Cantos sutis (4px)</div>
<div class="rounded">Cantos médios (8px)</div>
<div class="rounded-md">Cantos médios (8px)</div>
<div class="rounded-lg">Cantos grandes (12px)</div>
<div class="rounded-xl">Cantos muito grandes (16px)</div>
<div class="rounded-2xl">Cantos extra grandes (24px)</div>
<div class="rounded-3xl">Cantos máximos (32px)</div>
<div class="rounded-full">Cantos circulares</div>
```

### **Radius por Canto Específico**
```html
<!-- Cantos individuais -->
<div class="rounded-tl-lg">Canto superior esquerdo grande</div>
<div class="rounded-tr-lg">Canto superior direito grande</div>
<div class="rounded-br-lg">Canto inferior direito grande</div>
<div class="rounded-bl-lg">Canto inferior esquerdo grande</div>

<!-- Usando valores da escala -->
<div class="rounded-tl-sm">Superior esquerdo sutil</div>
<div class="rounded-tr-md">Superior direito médio</div>
<div class="rounded-br-xl">Inferior direito muito grande</div>
<div class="rounded-bl-full">Inferior esquerdo circular</div>
```

### **Radius por Lado**
```html
<!-- Lados superiores -->
<div class="rounded-t-none">Sem arredondamento superior</div>
<div class="rounded-t-sm">Arredondamento superior sutil</div>
<div class="rounded-t-md">Arredondamento superior médio</div>
<div class="rounded-t-lg">Arredondamento superior grande</div>
<div class="rounded-t-xl">Arredondamento superior muito grande</div>
<div class="rounded-t-2xl">Arredondamento superior extra grande</div>
<div class="rounded-t-3xl">Arredondamento superior máximo</div>
<div class="rounded-t-full">Arredondamento superior circular</div>

<!-- Lados direitos -->
<div class="rounded-r-lg">Arredondamento direito grande</div>

<!-- Lados inferiores -->
<div class="rounded-b-lg">Arredondamento inferior grande</div>

<!-- Lados esquerdos -->
<div class="rounded-l-lg">Arredondamento esquerdo grande</div>
```

## 🎯 **Padrões de Uso Recomendados**

### **Card Básico**
```html
<div class="bg-bg-secondary border border-border rounded-lg p-lg">
  <h3 class="text-xl font-semibold mb-md">Título do Card</h3>
  <p class="text-text-secondary">Conteúdo do card com bordas arredondadas.</p>
</div>
```

### **Card com Destaque**
```html
<div class="bg-bg-secondary border-2 border-primary rounded-xl p-lg">
  <h3 class="text-xl font-semibold text-primary mb-md">Card Destacado</h3>
  <p class="text-text-secondary">Card com borda primária dupla.</p>
</div>
```

### **Input de Formulário**
```html
<!-- Input normal -->
<input class="w-full px-md py-sm border border-border rounded-md bg-bg-tertiary text-text-primary focus:border-primary">

<!-- Input com erro -->
<input class="w-full px-md py-sm border-2 border-error rounded-md bg-bg-tertiary text-text-primary">

<!-- Input com sucesso -->
<input class="w-full px-md py-sm border-2 border-success rounded-md bg-bg-tertiary text-text-primary">
```

### **Botões com Bordas**
```html
<div class="flex gap-md">
  <!-- Botão primário sólido -->
  <button class="px-lg py-md bg-primary border border-primary rounded-lg text-white font-semibold">
    Primário
  </button>
  
  <!-- Botão secundário com borda -->
  <button class="px-lg py-md bg-transparent border-2 border-primary rounded-lg text-primary font-semibold hover:bg-primary hover:text-white">
    Secundário
  </button>
  
  <!-- Botão de outline -->
  <button class="px-lg py-md bg-transparent border border-border rounded-lg text-text-primary font-semibold hover:border-primary hover:text-primary">
    Outline
  </button>
</div>
```

### **Alerts com Bordas**
```html
<!-- Alert de sucesso -->
<div class="bg-success/10 border-l-4 border-success rounded-r-md p-md">
  <div class="flex items-center">
    <div class="text-success font-semibold">Sucesso!</div>
  </div>
  <p class="text-success mt-sm">Operação realizada com sucesso.</p>
</div>

<!-- Alert de erro -->
<div class="bg-error/10 border border-error rounded-lg p-md">
  <div class="flex items-center">
    <div class="text-error font-semibold">Erro!</div>
  </div>
  <p class="text-error mt-sm">Ocorreu um erro ao processar a solicitação.</p>
</div>

<!-- Alert de aviso -->
<div class="bg-warning/10 border-2 border-warning/50 rounded-lg p-md">
  <div class="flex items-center">
    <div class="text-warning font-semibold">Atenção!</div>
  </div>
  <p class="text-warning mt-sm">Esta ação não pode ser desfeita.</p>
</div>
```

### **Navigation com Bordas**
```html
<nav class="bg-bg-secondary border-b border-border">
  <div class="flex justify-between items-center px-lg py-md">
    <h1 class="text-xl font-bold">SymbIA</h1>
    <div class="flex gap-md">
      <a class="px-md py-sm border-b-2 border-transparent hover:border-primary text-text-primary">
        Home
      </a>
      <a class="px-md py-sm border-b-2 border-primary text-primary">
        Dashboard
      </a>
      <a class="px-md py-sm border-b-2 border-transparent hover:border-primary text-text-secondary">
        Settings
      </a>
    </div>
  </div>
</nav>
```

### **Sidebar com Divisores**
```html
<aside class="w-64 bg-bg-secondary border-r border-border">
  <div class="p-lg border-b border-border">
    <h2 class="font-bold">Menu Principal</h2>
  </div>
  
  <nav class="p-md">
    <div class="space-y-xs">
      <a class="block px-md py-sm rounded border-l-4 border-primary bg-primary/10 text-primary">
        Dashboard
      </a>
      <a class="block px-md py-sm rounded border-l-4 border-transparent hover:border-border hover:bg-bg-tertiary text-text-secondary">
        Projetos
      </a>
      <a class="block px-md py-sm rounded border-l-4 border-transparent hover:border-border hover:bg-bg-tertiary text-text-secondary">
        Configurações
      </a>
    </div>
  </nav>
</aside>
```

### **Table com Bordas**
```html
<div class="overflow-hidden border border-border rounded-lg">
  <table class="w-full">
    <thead class="bg-bg-tertiary border-b border-border">
      <tr>
        <th class="px-md py-sm text-left border-r border-border">Nome</th>
        <th class="px-md py-sm text-left border-r border-border">Email</th>
        <th class="px-md py-sm text-left">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-border hover:bg-bg-tertiary">
        <td class="px-md py-sm border-r border-border">João Silva</td>
        <td class="px-md py-sm border-r border-border">joao@email.com</td>
        <td class="px-md py-sm">
          <button class="text-primary hover:text-primary-light">Editar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### **Modal com Bordas**
```html
<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div class="bg-bg-secondary border border-border rounded-xl w-full max-w-md mx-lg overflow-hidden">
    <!-- Header -->
    <div class="px-lg py-md border-b border-border">
      <h2 class="text-xl font-semibold">Confirmar Ação</h2>
    </div>
    
    <!-- Content -->
    <div class="p-lg">
      <p class="text-text-secondary">Tem certeza que deseja continuar?</p>
    </div>
    
    <!-- Actions -->
    <div class="px-lg py-md border-t border-border bg-bg-tertiary flex justify-end gap-sm">
      <button class="px-lg py-md border border-border rounded text-text-secondary hover:bg-bg-secondary">
        Cancelar
      </button>
      <button class="px-lg py-md bg-error border border-error rounded text-white hover:bg-error/80">
        Confirmar
      </button>
    </div>
  </div>
</div>
```

## 📱 **Bordas Responsivas**

### **Border Width Responsivo**
```html
<!-- Borda que varia com o tamanho da tela -->
<div class="border md:border-2 lg:border-4">
  Borda responsiva
</div>
```

### **Border Radius Responsivo**
```html
<!-- Arredondamento que varia com o tamanho da tela -->
<div class="rounded-md md:rounded-lg lg:rounded-xl">
  Cantos responsivos
</div>
```

## 🎯 **Guia para IAs**

### **Escolha de Bordas por Contexto**

| Contexto | Border Width | Border Color | Border Radius | Exemplo |
|----------|--------------|--------------|---------------|---------|
| **Card** | `border` | `border-border` | `rounded-lg` | Cards básicos |
| **Input** | `border` | `border-border` | `rounded-md` | Campos de formulário |
| **Button** | `border` | `border-primary` | `rounded-lg` | Botões outline |
| **Alert** | `border-l-4` | `border-success` | `rounded-r-md` | Alertas laterais |
| **Modal** | `border` | `border-border` | `rounded-xl` | Modais |
| **Table** | `border` | `border-border` | `rounded-lg` | Tabelas |
| **Navigation** | `border-b` | `border-border` | - | Headers/nav |

### **Hierarquia de Bordas**

1. **Sem borda**: Elementos integrados ao background
2. **Border sutil**: `border border-border` - Separação leve
3. **Border média**: `border-2 border-primary` - Destaque moderado
4. **Border forte**: `border-4 border-primary` - Grande destaque
5. **Border lateral**: `border-l-4` - Indicadores de status

### **Combinações Eficazes**

```html
<!-- Card padrão -->
<div class="bg-bg-secondary border border-border rounded-lg">

<!-- Card destacado -->
<div class="bg-bg-secondary border-2 border-primary rounded-xl">

<!-- Input normal -->
<input class="border border-border rounded-md">

<!-- Input com foco -->
<input class="border-2 border-primary rounded-md">

<!-- Alert -->
<div class="bg-success/10 border-l-4 border-success rounded-r-md">
```

### **Dicas de Design**

1. **Use `border-border`** para bordas neutras padrão
2. **Use cores de status** para feedback visual
3. **Combine `border-radius`** apropriado ao contexto
4. **Use bordas direcionais** para indicadores
5. **Aplique transparência** em overlays e estados

---

**💡 As bordas são fundamentais para definir hierarquia visual e organizar informações na interface.**
