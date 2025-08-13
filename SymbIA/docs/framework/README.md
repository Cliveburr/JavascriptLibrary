# 🎨 SymbIA CSS Framework - Documentação Completa

## 📁 **Estrutura da Documentação**

Esta documentação abrangente do **SymbIA CSS Framework** está organizada nos seguintes arquivos:

### 📋 **Índice de Documentação**

| Arquivo | Descrição | Conteúdo |
|---------|-----------|----------|
| [**variables.md**](./variables.md) | 🔧 **Variáveis SASS** | Todas as variáveis disponíveis, cores, tipografia, espaçamentos |
| [**spacing.md**](./spacing.md) | 📏 **Sistema de Espaçamento** | Margins, paddings, gaps, space-between |
| [**typography.md**](./typography.md) | 📝 **Sistema de Tipografia** | Fontes, tamanhos, pesos, alinhamentos, cores de texto |
| [**colors.md**](./colors.md) | 🎨 **Sistema de Cores** | Paleta completa, backgrounds, textos, bordas |
| [**layout.md**](./layout.md) | 📐 **Sistema de Layout** | Position, dimensões, grid, flexbox |
| [**flexbox.md**](./flexbox.md) | 🔄 **Sistema Flexbox** | Display flex, direções, alinhamentos, wrapping |
| [**borders.md**](./borders.md) | 🔲 **Sistema de Bordas** | Widths, styles, radius, cores |
| [**effects.md**](./effects.md) | ✨ **Sistema de Efeitos** | Shadows, opacity, transforms, transitions |
| [**display.md**](./display.md) | 👁️ **Sistema de Display** | Visibility, overflow, display types |
| [**components.md**](./components.md) | 🧩 **Componentes Prontos** | Padrões e exemplos de componentes |
| [**patterns.md**](./patterns.md) | 📱 **Padrões de UI** | Templates comuns para criação de telas |

## 🎯 **Objetivo da Documentação**

Esta documentação foi criada especificamente para auxiliar **IAs e desenvolvedores** na criação de interfaces consistentes e modernas usando o framework SymbIA. Cada arquivo contém:

✅ **Classes CSS disponíveis** com exemplos de uso  
✅ **Valores correspondentes** em pixels e rem  
✅ **Exemplos práticos** de implementação  
✅ **Padrões recomendados** para diferentes cenários  
✅ **Combinações eficazes** de classes  

## 🚀 **Como Usar Esta Documentação**

### **Para IAs:**
1. **Consulte** o arquivo relevante ao tipo de estilo necessário
2. **Use** as classes exatas documentadas
3. **Combine** classes conforme os padrões mostrados
4. **Aplique** os exemplos de componentes prontos

### **Para Desenvolvedores:**
1. **Navegue** pelos arquivos por categoria
2. **Copy/paste** os exemplos de código
3. **Customize** usando as variáveis SASS
4. **Estenda** o framework seguindo os padrões

## 🎨 **Filosofia do Framework**

O **SymbIA CSS Framework** segue os princípios:

🔹 **Utility-First**: Classes utilitárias para máxima flexibilidade  
🔹 **Consistent**: Sistema consistente de valores e nomenclatura  
🔹 **Themeable**: Sistema de temas facilmente intercambiáveis  
🔹 **Performant**: CSS otimizado e minimalista  
🔹 **Modern**: Suporte completo a CSS Grid e Flexbox  

## 📊 **Estatísticas do Framework**

| Categoria | Classes | Arquivo |
|-----------|---------|---------|
| **Spacing** | ~130 classes | `_spacing.scss` |
| **Typography** | ~100 classes | `_typography.scss` |
| **Colors** | ~90 classes | `_colors.scss` |
| **Layout** | ~250 classes | `_layout.scss` |
| **Flexbox** | ~60 classes | `_flex.scss` |
| **Borders** | ~120 classes | `_border.scss` |
| **Effects** | ~100 classes | `_effects.scss` |
| **Display** | ~40 classes | `_display.scss` |
| **TOTAL** | **~890 classes** | - |

## 🎯 **Quick Start**

### **Estrutura Básica de uma Tela**
```html
<!-- Container Principal -->
<div class="min-h-screen bg-bg-primary text-text-primary">
  
  <!-- Header -->
  <header class="flex justify-between items-center p-lg bg-bg-secondary border-b border-border">
    <h1 class="text-2xl font-bold text-primary">SymbIA</h1>
  </header>
  
  <!-- Main Content -->
  <main class="container mx-auto p-lg space-y-lg">
    <!-- Content here -->
  </main>
  
  <!-- Footer -->
  <footer class="mt-auto p-lg bg-bg-secondary border-t border-border">
    <!-- Footer content -->
  </footer>
  
</div>
```

## 🔗 **Links Úteis**

- 📁 **Código Fonte**: `web/src/styles/framework/`
- 🎨 **Style Debug**: `http://localhost:3001/style-debug`
- 🔧 **Variáveis**: `web/src/styles/_variables.scss`
- 🎭 **Temas**: `web/src/styles/_theme-*.scss`

---

**💡 Para detalhes específicos, consulte os arquivos individuais na pasta `docs/framework/`**
