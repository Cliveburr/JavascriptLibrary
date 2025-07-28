# 📚 Tutorial Completo do Bulma CSS Framework

> **Framework CSS moderno baseado em Flexbox**  
> *Documentação completa para uso em todas as telas do projeto*

## 🚀 Introdução

Bulma é um framework CSS modular baseado em Flexbox que oferece componentes prontos, sistema de grid flexível e helpers utilitários. Este guia abrange **TODOS** os recursos do Bulma v1 para uso futuro no projeto.

---

## 📐 Layout Fundamentais

### Container e Estrutura Base
```html
<!-- Container centralizado e responsivo -->
<div class="container">
  <section class="section">
    <!-- Conteúdo principal -->
  </section>
</div>

<!-- Container com padding customizado -->
<div class="container is-max-desktop">
  <div class="section">
    <!-- Conteúdo limitado ao desktop -->
  </div>
</div>
```

### Hero (Seção de Destaque)
```html
<!-- Hero básico -->
<section class="hero is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">Título Principal</h1>
      <h2 class="subtitle">Subtítulo explicativo</h2>
    </div>
  </div>
</section>

<!-- Hero com altura completa -->
<section class="hero is-fullheight is-dark">
  <div class="hero-head">
    <!-- Navbar -->
  </div>
  <div class="hero-body">
    <!-- Conteúdo central -->
  </div>
  <div class="hero-foot">
    <!-- Footer -->
  </div>
</section>
```

---

## 🎯 Sistema de Colunas (Flexbox)

### Colunas Básicas
```html
<!-- Colunas automáticas (largura igual) -->
<div class="columns">
  <div class="column">Coluna 1</div>
  <div class="column">Coluna 2</div>
  <div class="column">Coluna 3</div>
  <div class="column">Coluna 4</div>
</div>

<!-- Colunas com tamanhos específicos -->
<div class="columns">
  <div class="column is-8">Conteúdo principal (8/12)</div>
  <div class="column is-4">Sidebar (4/12)</div>
</div>
```

### Colunas Responsivas
```html
<!-- Diferentes tamanhos por dispositivo -->
<div class="columns">
  <div class="column is-12-mobile is-6-tablet is-4-desktop">
    <!-- Mobile: 100%, Tablet: 50%, Desktop: 33% -->
  </div>
  <div class="column is-12-mobile is-6-tablet is-8-desktop">
    <!-- Mobile: 100%, Tablet: 50%, Desktop: 67% -->
  </div>
</div>

<!-- Opções de colunas -->
<div class="columns is-centered is-vcentered is-mobile">
  <div class="column is-narrow">Conteúdo ajustado</div>
</div>
```

### Tamanhos de Colunas
```html
<!-- Frações disponíveis -->
<div class="columns">
  <div class="column is-1">1/12</div>    <!-- 8.33% -->
  <div class="column is-2">2/12</div>    <!-- 16.66% -->
  <div class="column is-3">3/12</div>    <!-- 25% -->
  <div class="column is-4">4/12</div>    <!-- 33.33% -->
  <div class="column is-5">5/12</div>    <!-- 41.66% -->
  <div class="column is-6">6/12</div>    <!-- 50% -->
  <div class="column is-7">7/12</div>    <!-- 58.33% -->
  <div class="column is-8">8/12</div>    <!-- 66.66% -->
  <div class="column is-9">9/12</div>    <!-- 75% -->
  <div class="column is-10">10/12</div>  <!-- 83.33% -->
  <div class="column is-11">11/12</div>  <!-- 91.66% -->
  <div class="column is-12">12/12</div>  <!-- 100% -->
</div>

<!-- Tamanhos com frações -->
<div class="columns">
  <div class="column is-half">50%</div>
  <div class="column is-one-third">33%</div>
  <div class="column is-one-quarter">25%</div>
  <div class="column is-one-fifth">20%</div>
</div>
```

---

## 🎨 Grid System (CSS Grid)

### Smart Grid (Novo no v1)
```html
<!-- Grid inteligente com colunas flexíveis -->
<div class="grid">
  <div class="cell">Item 1</div>
  <div class="cell">Item 2</div>
  <div class="cell">Item 3</div>
  <!-- Ajusta automaticamente o número de colunas -->
</div>

<!-- Grid com largura mínima customizada -->
<div class="grid is-col-min-8">
  <!-- Colunas com no mínimo 12rem de largura -->
  <div class="cell">Conteúdo</div>
</div>

<!-- Grid com gaps customizados -->
<div class="grid is-gap-4 is-col-min-12">
  <div class="cell">Gap de 2rem</div>
</div>
```

### Fixed Grid
```html
<!-- Grid fixo com número específico de colunas -->
<div class="fixed-grid has-4-cols">
  <div class="grid">
    <div class="cell">1</div>
    <div class="cell">2</div>
    <div class="cell">3</div>
    <div class="cell">4</div>
  </div>
</div>

<!-- Grid responsivo -->
<div class="fixed-grid has-2-cols-mobile has-4-cols-tablet has-6-cols-desktop">
  <div class="grid">
    <!-- Células se ajustam automaticamente -->
  </div>
</div>
```

---

## 🔤 Tipografia Completa

### Títulos e Subtítulos
```html
<!-- Títulos (title) -->
<h1 class="title is-1">3rem - Muito Grande</h1>
<h2 class="title is-2">2.5rem - Grande</h2>
<h3 class="title is-3">2rem - Médio Grande</h3>
<h4 class="title is-4">1.5rem - Médio</h4>
<h5 class="title is-5">1.25rem - Padrão</h5>
<h6 class="title is-6">1rem - Pequeno</h6>

<!-- Subtítulos -->
<p class="subtitle is-1">Subtítulo 1</p>
<p class="subtitle is-2">Subtítulo 2</p>
<p class="subtitle is-3">Subtítulo 3</p>
```

### Tamanhos de Texto
```html
<!-- Tamanhos disponíveis -->
<p class="is-size-1">3rem</p>
<p class="is-size-2">2.5rem</p>
<p class="is-size-3">2rem</p>
<p class="is-size-4">1.5rem</p>
<p class="is-size-5">1.25rem</p>
<p class="is-size-6">1rem</p>
<p class="is-size-7">0.75rem</p>

<!-- Tamanhos responsivos -->
<p class="is-size-1-desktop is-size-3-tablet is-size-5-mobile">
  Texto que muda conforme o dispositivo
</p>
```

### Pesos e Estilos
```html
<!-- Pesos de fonte -->
<span class="has-text-weight-light">Leve (300)</span>
<span class="has-text-weight-normal">Normal (400)</span>
<span class="has-text-weight-medium">Médio (500)</span>
<span class="has-text-weight-semibold">Semi-negrito (600)</span>
<span class="has-text-weight-bold">Negrito (700)</span>
<span class="has-text-weight-extrabold">Extra-negrito (800)</span>

<!-- Transformações -->
<p class="is-capitalized">primeira letra maiúscula</p>
<p class="is-lowercase">tudo minúsculo</p>
<p class="is-uppercase">TUDO MAIÚSCULO</p>
<p class="is-italic">Itálico</p>
<p class="is-underlined">Sublinhado</p>
```

### Alinhamento de Texto
```html
<!-- Alinhamentos básicos -->
<p class="has-text-left">Alinhado à esquerda</p>
<p class="has-text-centered">Centralizado</p>
<p class="has-text-right">Alinhado à direita</p>
<p class="has-text-justified">Justificado</p>

<!-- Alinhamentos responsivos -->
<p class="has-text-centered-mobile has-text-left-tablet">
  Centralizado no mobile, esquerda no tablet+
</p>
```

---

## 🎨 Sistema de Cores

### Cores Principais
```html
<!-- Cores de texto -->
<p class="has-text-primary">Azul primário</p>
<p class="has-text-link">Azul de link</p>
<p class="has-text-info">Azul informativo</p>
<p class="has-text-success">Verde de sucesso</p>
<p class="has-text-warning">Amarelo de aviso</p>
<p class="has-text-danger">Vermelho de erro</p>

<!-- Cores de fundo -->
<div class="has-background-primary">Fundo azul</div>
<div class="has-background-light">Fundo claro</div>
<div class="has-background-dark">Fundo escuro</div>
<div class="has-background-white">Fundo branco</div>
<div class="has-background-black">Fundo preto</div>

<!-- Variações claras e escuras -->
<div class="has-background-primary-light">Azul claro</div>
<div class="has-background-primary-dark">Azul escuro</div>
```

### Paleta de Cores (Novo no v1)
```html
<!-- Usando paletas de cores -->
<p class="has-text-primary-05">5% da cor primária</p>
<p class="has-text-primary-10">10% da cor primária</p>
<p class="has-text-primary-15">15% da cor primária</p>
<!-- ... até primary-100 -->

<!-- Backgrounds com paleta -->
<div class="has-background-success-90">90% verde</div>
<div class="has-background-danger-85">85% vermelho</div>
```

---

## 📝 Elementos Essenciais

### Botões Completos
```html
<!-- Botões básicos -->
<button class="button">Padrão</button>
<button class="button is-primary">Primário</button>
<button class="button is-link">Link</button>
<button class="button is-info">Info</button>
<button class="button is-success">Sucesso</button>
<button class="button is-warning">Aviso</button>
<button class="button is-danger">Perigo</button>

<!-- Tamanhos -->
<button class="button is-small">Pequeno</button>
<button class="button">Normal</button>
<button class="button is-medium">Médio</button>
<button class="button is-large">Grande</button>

<!-- Estados -->
<button class="button is-loading">Carregando</button>
<button class="button" disabled>Desabilitado</button>
<button class="button is-static">Estático</button>

<!-- Estilos -->
<button class="button is-outlined">Contornado</button>
<button class="button is-inverted">Invertido</button>
<button class="button is-rounded">Arredondado</button>
<button class="button is-fullwidth">Largura total</button>

<!-- Grupo de botões -->
<div class="buttons">
  <button class="button is-success">Salvar</button>
  <button class="button">Cancelar</button>
  <button class="button is-danger">Excluir</button>
</div>

<!-- Botões conectados -->
<div class="buttons has-addons">
  <button class="button">Esquerda</button>
  <button class="button is-selected">Centro</button>
  <button class="button">Direita</button>
</div>
```

### Outros Elementos
```html
<!-- Box (container com sombra) -->
<div class="box">
  <p>Conteúdo em uma caixa com sombra</p>
</div>

<!-- Notification -->
<div class="notification is-primary">
  <button class="delete"></button>
  <strong>Atenção!</strong> Esta é uma notificação importante.
</div>

<!-- Progress Bar -->
<progress class="progress is-primary" value="15" max="100">15%</progress>
<progress class="progress is-large is-success" value="75" max="100">75%</progress>

<!-- Tags -->
<span class="tag">Tag padrão</span>
<span class="tag is-primary">Tag primária</span>
<span class="tag is-large">Tag grande</span>
<span class="tag is-delete">×</span>

<!-- Grupo de tags -->
<div class="tags">
  <span class="tag is-primary">JavaScript</span>
  <span class="tag is-info">React</span>
  <span class="tag is-success">Node.js</span>
</div>

<!-- Delete button -->
<button class="delete"></button>
<button class="delete is-small"></button>
<button class="delete is-medium"></button>
<button class="delete is-large"></button>
```

---

## 🧩 Componentes Avançados

### Card Completo
```html
<div class="card">
  <!-- Header opcional -->
  <header class="card-header">
    <p class="card-header-title">Título do Card</p>
    <button class="card-header-icon">
      <span class="icon">
        <i class="fas fa-angle-down"></i>
      </span>
    </button>
  </header>
  
  <!-- Imagem opcional -->
  <div class="card-image">
    <figure class="image is-4by3">
      <img src="image.jpg" alt="Descrição">
    </figure>
  </div>
  
  <!-- Conteúdo -->
  <div class="card-content">
    <div class="content">
      <p>Conteúdo do card com texto e outros elementos.</p>
      <br>
      <time datetime="2023-1-1">Jan 1, 2023</time>
    </div>
  </div>
  
  <!-- Footer opcional -->
  <footer class="card-footer">
    <a href="#" class="card-footer-item">Salvar</a>
    <a href="#" class="card-footer-item">Editar</a>
    <a href="#" class="card-footer-item">Excluir</a>
  </footer>
</div>
```

### Modal
```html
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Título do Modal</p>
      <button class="delete"></button>
    </header>
    <section class="modal-card-body">
      <!-- Conteúdo do modal -->
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success">Salvar</button>
      <button class="button">Cancelar</button>
    </footer>
  </div>
</div>
```

### Navbar Responsiva
```html
<nav class="navbar is-primary">
  <div class="navbar-brand">
    <a class="navbar-item">
      <img src="logo.png" width="112" height="28">
    </a>
    
    <a class="navbar-burger" data-target="navbarMenu">
      <span></span>
      <span></span>
      <span></span>
    </a>
  </div>
  
  <div id="navbarMenu" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item">Home</a>
      <a class="navbar-item">Sobre</a>
      
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">Mais</a>
        <div class="navbar-dropdown">
          <a class="navbar-item">Contato</a>
          <a class="navbar-item">Ajuda</a>
        </div>
      </div>
    </div>
    
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Cadastrar</strong>
          </a>
          <a class="button is-light">Entrar</a>
        </div>
      </div>
    </div>
  </div>
</nav>
```

### Tabs
```html
<div class="tabs">
  <ul>
    <li class="is-active"><a>Fotos</a></li>
    <li><a>Música</a></li>
    <li><a>Vídeos</a></li>
    <li><a>Documentos</a></li>
  </ul>
</div>

<!-- Tabs com estilos -->
<div class="tabs is-boxed is-large">
  <ul>
    <li class="is-active">
      <a>
        <span class="icon"><i class="fas fa-image"></i></span>
        <span>Fotos</span>
      </a>
    </li>
    <li>
      <a>
        <span class="icon"><i class="fas fa-music"></i></span>
        <span>Música</span>
      </a>
    </li>
  </ul>
</div>
```

### Message
```html
<article class="message is-info">
  <div class="message-header">
    <p>Informação</p>
    <button class="delete"></button>
  </div>
  <div class="message-body">
    Esta é uma mensagem informativa com <strong>conteúdo importante</strong>.
  </div>
</article>

<!-- Message apenas com body -->
<article class="message is-warning">
  <div class="message-body">
    Aviso simples sem header.
  </div>
</article>
```

---

## 📝 Formulários Completos

### Estrutura Básica
```html
<!-- Field é o container principal -->
<div class="field">
  <label class="label">Nome</label>
  <div class="control">
    <input class="input" type="text" placeholder="Digite seu nome">
  </div>
</div>

<!-- Field com ícone -->
<div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="email" placeholder="Email">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
    <span class="icon is-small is-right">
      <i class="fas fa-check"></i>
    </span>
  </div>
</div>

<!-- Field com help text -->
<div class="field">
  <label class="label">Username</label>
  <div class="control">
    <input class="input" type="text" placeholder="Username">
  </div>
  <p class="help">Este username está disponível</p>
</div>
```

### Inputs e Variações
```html
<!-- Input básico -->
<input class="input" type="text" placeholder="Texto normal">

<!-- Tamanhos -->
<input class="input is-small" type="text" placeholder="Pequeno">
<input class="input" type="text" placeholder="Normal">
<input class="input is-medium" type="text" placeholder="Médio">
<input class="input is-large" type="text" placeholder="Grande">

<!-- Estados -->
<input class="input is-primary" type="text" placeholder="Primário">
<input class="input is-success" type="text" placeholder="Sucesso">
<input class="input is-warning" type="text" placeholder="Aviso">
<input class="input is-danger" type="text" placeholder="Erro">

<!-- Estados de interação -->
<input class="input is-hovered" type="text" placeholder="Hover">
<input class="input is-focused" type="text" placeholder="Focus">
<input class="input is-loading" type="text" placeholder="Carregando">
<input class="input" type="text" placeholder="Desabilitado" disabled>
<input class="input" type="text" placeholder="Readonly" readonly>
```

### Textarea
```html
<div class="field">
  <label class="label">Mensagem</label>
  <div class="control">
    <textarea class="textarea" placeholder="Digite sua mensagem"></textarea>
  </div>
</div>

<!-- Textarea com linhas fixas -->
<textarea class="textarea has-fixed-size" rows="4" placeholder="4 linhas fixas"></textarea>
```

### Select
```html
<!-- Select simples -->
<div class="field">
  <label class="label">País</label>
  <div class="control">
    <div class="select">
      <select>
        <option>Selecione um país</option>
        <option>Brasil</option>
        <option>Argentina</option>
        <option>Chile</option>
      </select>
    </div>
  </div>
</div>

<!-- Select múltiplo -->
<div class="select is-multiple">
  <select multiple size="4">
    <option>Opção 1</option>
    <option>Opção 2</option>
    <option>Opção 3</option>
    <option>Opção 4</option>
  </select>
</div>

<!-- Select com ícone -->
<div class="control has-icons-left">
  <div class="select">
    <select>
      <option>País</option>
    </select>
  </div>
  <span class="icon is-small is-left">
    <i class="fas fa-globe"></i>
  </span>
</div>
```

### Checkbox e Radio
```html
<!-- Checkbox -->
<div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox">
      Aceito os termos e condições
    </label>
  </div>
</div>

<div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" disabled>
      Checkbox desabilitado
    </label>
  </div>
</div>

<!-- Radio -->
<div class="field">
  <div class="control">
    <label class="radio">
      <input type="radio" name="question">
      Sim
    </label>
    <label class="radio">
      <input type="radio" name="question">
      Não
    </label>
  </div>
</div>
```

### File Upload
```html
<!-- File upload básico -->
<div class="file">
  <label class="file-label">
    <input class="file-input" type="file" name="resume">
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label">
        Escolher arquivo...
      </span>
    </span>
  </label>
</div>

<!-- File upload com nome do arquivo -->
<div class="file has-name">
  <label class="file-label">
    <input class="file-input" type="file" name="resume">
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label">
        Escolher arquivo...
      </span>
    </span>
    <span class="file-name">
      arquivo-selecionado.pdf
    </span>
  </label>
</div>
```

### Agrupamento de Campos
```html
<!-- Campos agrupados horizontalmente -->
<div class="field is-grouped">
  <div class="control">
    <button class="button is-link">Salvar</button>
  </div>
  <div class="control">
    <button class="button">Cancelar</button>
  </div>
</div>

<!-- Campos conectados (addons) -->
<div class="field has-addons">
  <div class="control">
    <a class="button is-static">
      https://
    </a>
  </div>
  <div class="control is-expanded">
    <input class="input" type="text" placeholder="site.com">
  </div>
  <div class="control">
    <a class="button is-info">
      Verificar
    </a>
  </div>
</div>

<!-- Campo expandido -->
<div class="field is-grouped">
  <div class="control is-expanded">
    <input class="input" type="text" placeholder="Nome completo">
  </div>
  <div class="control">
    <button class="button is-primary">Pesquisar</button>
  </div>
</div>
```

---

## 📏 Spacing Helpers (Sistema de Espaçamento)

### Margin e Padding
```html
<!-- Estrutura: {propriedade}{direção}-{valor} -->

<!-- Margin (m) -->
<div class="m-0">Sem margin</div>
<div class="m-1">Margin 0.25rem (todos os lados)</div>
<div class="m-2">Margin 0.5rem</div>
<div class="m-3">Margin 0.75rem</div>
<div class="m-4">Margin 1rem</div>
<div class="m-5">Margin 1.5rem</div>
<div class="m-6">Margin 3rem</div>

<!-- Padding (p) -->
<div class="p-4">Padding 1rem (todos os lados)</div>

<!-- Direções específicas -->
<div class="mt-4">Margin-top 1rem</div>      <!-- t = top -->
<div class="mr-2">Margin-right 0.5rem</div>  <!-- r = right -->
<div class="mb-3">Margin-bottom 0.75rem</div> <!-- b = bottom -->
<div class="ml-1">Margin-left 0.25rem</div>   <!-- l = left -->

<!-- Direções combinadas -->
<div class="mx-4">Margin horizontal (left + right) 1rem</div>
<div class="my-2">Margin vertical (top + bottom) 0.5rem</div>
<div class="px-3">Padding horizontal 0.75rem</div>
<div class="py-5">Padding vertical 1.5rem</div>

<!-- Margin automático para centralizar -->
<div class="mx-auto">Centralizado horizontalmente</div>
```

### Tabela Completa de Valores
```html
<!-- Valores disponíveis: 0, 1, 2, 3, 4, 5, 6, auto -->
<!-- 
*-0  = 0rem
*-1  = 0.25rem
*-2  = 0.5rem
*-3  = 0.75rem
*-4  = 1rem
*-5  = 1.5rem
*-6  = 3rem
*-auto = auto (apenas para margin)
-->

<!-- Exemplos práticos -->
<div class="box m-4">Box com margin 1rem</div>
<div class="card p-5">Card com padding 1.5rem</div>
<div class="section py-6">Section com padding vertical 3rem</div>
```

---

## 🎯 Flexbox Helpers

### Display Flex
```html
<!-- Transformar em flexbox -->
<div class="is-flex">Container flexbox</div>
<div class="is-inline-flex">Inline flexbox</div>

<!-- Direção -->
<div class="is-flex is-flex-direction-row">Linha (padrão)</div>
<div class="is-flex is-flex-direction-column">Coluna</div>
<div class="is-flex is-flex-direction-row-reverse">Linha reversa</div>
<div class="is-flex is-flex-direction-column-reverse">Coluna reversa</div>

<!-- Wrap -->
<div class="is-flex is-flex-wrap-nowrap">Sem quebra (padrão)</div>
<div class="is-flex is-flex-wrap-wrap">Com quebra</div>
<div class="is-flex is-flex-wrap-wrap-reverse">Quebra reversa</div>
```

### Alinhamento
```html
<!-- Justify Content (eixo principal) -->
<div class="is-flex is-justify-content-flex-start">Início</div>
<div class="is-flex is-justify-content-center">Centro</div>
<div class="is-flex is-justify-content-flex-end">Fim</div>
<div class="is-flex is-justify-content-space-between">Espaço entre</div>
<div class="is-flex is-justify-content-space-around">Espaço ao redor</div>
<div class="is-flex is-justify-content-space-evenly">Espaço uniforme</div>

<!-- Align Items (eixo cruzado) -->
<div class="is-flex is-align-items-stretch">Esticar (padrão)</div>
<div class="is-flex is-align-items-flex-start">Início</div>
<div class="is-flex is-align-items-center">Centro</div>
<div class="is-flex is-align-items-flex-end">Fim</div>
<div class="is-flex is-align-items-baseline">Linha base</div>

<!-- Combinações úteis -->
<div class="is-flex is-justify-content-center is-align-items-center">
  <!-- Centralizado horizontal e verticalmente -->
</div>

<div class="is-flex is-justify-content-space-between is-align-items-center">
  <!-- Espaçado entre com alinhamento vertical central -->
</div>
```

### Flex Grow e Shrink
```html
<!-- Flex Grow (crescimento) -->
<div class="is-flex">
  <div class="is-flex-grow-0">Não cresce</div>
  <div class="is-flex-grow-1">Cresce 1x</div>
  <div class="is-flex-grow-2">Cresce 2x</div>
  <div class="is-flex-grow-5">Cresce 5x</div>
</div>

<!-- Flex Shrink (encolhimento) -->
<div class="is-flex">
  <div class="is-flex-shrink-0">Não encolhe</div>
  <div class="is-flex-shrink-1">Encolhe 1x</div>
  <div class="is-flex-shrink-3">Encolhe 3x</div>
</div>
```

---

## 📱 Responsividade e Visibilidade

### Breakpoints do Bulma
```html
<!-- 
mobile: até 768px
tablet: 769px até 1023px
desktop: 1024px até 1215px
widescreen: 1216px até 1407px
fullhd: 1408px+
-->

<!-- Visibilidade por dispositivo -->
<div class="is-hidden-mobile">Oculto no mobile</div>
<div class="is-hidden-tablet-only">Oculto apenas no tablet</div>
<div class="is-hidden-desktop">Oculto no desktop+</div>
<div class="is-hidden-widescreen">Oculto no widescreen+</div>
<div class="is-hidden-fullhd">Oculto no fullhd</div>

<!-- Visível apenas em dispositivos específicos -->
<div class="is-block-mobile is-hidden-tablet">Apenas mobile</div>
<div class="is-hidden-mobile is-block-tablet-only is-hidden-desktop">Apenas tablet</div>
<div class="is-hidden-touch is-block-desktop">Apenas desktop+</div>

<!-- Modificadores responsivos para colunas -->
<div class="columns">
  <div class="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
    <!-- 100% mobile, 50% tablet, 33% desktop, 25% widescreen -->
  </div>
</div>
```

### Classes de Display Responsivas
```html
<!-- Display básico -->
<div class="is-block">Block</div>
<div class="is-flex">Flex</div>
<div class="is-inline">Inline</div>
<div class="is-inline-block">Inline-block</div>
<div class="is-inline-flex">Inline-flex</div>
<div class="is-hidden">Oculto</div>

<!-- Display responsivo -->
<div class="is-block-mobile is-flex-tablet">
  Block no mobile, flex no tablet+
</div>
```

---

## 🛠 Utilitários Diversos

### Outros Helpers Úteis
```html
<!-- Position -->
<div class="is-relative">Position relative</div>
<div class="is-sticky">Position sticky</div>

<!-- Cursor -->
<div class="is-clickable">Cursor pointer</div>
<div class="is-unselectable">Não selecionável</div>

<!-- Overflow -->
<div class="is-clipped">Overflow hidden</div>

<!-- Border radius -->
<div class="is-radiusless">Sem border-radius</div>

<!-- Shadows -->
<div class="has-shadow">Com sombra</div>

<!-- Clear float -->
<div class="is-clearfix">Clearfix</div>

<!-- Overlay -->
<div class="is-overlay">Overlay absoluto</div>

<!-- Skeleton (loading states) -->
<div class="skeleton-lines">
  <div></div>
  <div></div>
  <div></div>
</div>

<div class="skeleton-block" style="height: 200px;"></div>
```

### Tabelas
```html
<table class="table">
  <thead>
    <tr>
      <th>Nome</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>João Silva</td>
      <td>joao@email.com</td>
      <td><span class="tag is-success">Ativo</span></td>
    </tr>
  </tbody>
</table>

<!-- Modificadores de tabela -->
<table class="table is-bordered">Bordas</table>
<table class="table is-striped">Listras</table>
<table class="table is-narrow">Compacta</table>
<table class="table is-hoverable">Hover</table>
<table class="table is-fullwidth">Largura total</table>

<!-- Combinados -->
<table class="table is-striped is-hoverable is-fullwidth">
  <!-- Tabela com listras, hover e largura total -->
</table>
```

---

## 🎨 Dark Mode e Temas

### Dark Mode (Novo no v1)
```html
<!-- Ativar dark mode automaticamente -->
<html data-theme="dark">

<!-- Ou usar classes específicas -->
<div class="has-background-dark has-text-light">
  Fundo escuro com texto claro
</div>

<!-- Cores que se adaptam ao tema -->
<div class="has-background-scheme-main">
  Fundo que muda com o tema
</div>
```

### CSS Variables Customizadas
```css
/* Customizar cores globalmente */
:root {
  --bulma-primary-h: 171deg;
  --bulma-primary-s: 100%;
  --bulma-primary-l: 41%;
  
  --bulma-family-primary: 'Inter', sans-serif;
  --bulma-size-1: 4rem;
}
```

---

## 📋 Cheat Sheet Rápido

### Estrutura Típica de Página
```html
<!DOCTYPE html>
<html data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Minha App</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css">
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar is-primary">
    <!-- Conteúdo da navbar -->
  </nav>
  
  <!-- Hero section -->
  <section class="hero is-medium is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Título Principal</h1>
        <h2 class="subtitle">Subtítulo</h2>
      </div>
    </div>
  </section>
  
  <!-- Conteúdo principal -->
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-8">
          <!-- Conteúdo principal -->
        </div>
        <div class="column is-4">
          <!-- Sidebar -->
        </div>
      </div>
    </div>
  </section>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <!-- Conteúdo do footer -->
    </div>
  </footer>
</body>
</html>
```

### Classes Mais Usadas
```html
<!-- Layout -->
.container
.section
.columns / .column
.grid / .cell

<!-- Elementos -->
.button
.input
.box
.card
.notification

<!-- Helpers -->
.is-flex
.has-text-centered
.is-primary
.m-4 / .p-4
.is-hidden-mobile

<!-- Tamanhos -->
.is-small / .is-medium / .is-large
.is-size-1 até .is-size-7

<!-- Estados -->
.is-active
.is-loading
.is-disabled
```

---

## 🚀 Dicas de Performance e Boas Práticas

### 1. **Modularity** - Importe apenas o necessário
```scss
// Em vez de importar tudo
@import "bulma/bulma";

// Importe apenas os módulos necessários
@import "bulma/sass/utilities/_all";
@import "bulma/sass/base/_all";
@import "bulma/sass/elements/button";
@import "bulma/sass/components/card";
@import "bulma/sass/layout/section";
```

### 2. **Customização com CSS Variables**
```css
/* Prefira CSS variables para mudanças dinâmicas */
.meu-botao {
  --bulma-button-background-color: #ff6b6b;
  --bulma-button-border-color: #ff5252;
}
```

### 3. **Responsividade First**
```html
<!-- Sempre pense mobile-first -->
<div class="column is-12-mobile is-6-tablet is-4-desktop">
  Conteúdo responsivo
</div>
```

### 4. **Semantic HTML**
```html
<!-- Prefira elementos semânticos -->
<main class="section">
  <article class="box">
    <header class="title">Título</header>
    <section class="content">Conteúdo</section>
  </article>
</main>
```

---

## 🎯 Resumo para Uso no Projeto

### **Vantagens do Bulma:**
- ✅ **0 JavaScript** - Apenas CSS puro
- ✅ **Flexbox nativo** - Layout moderno e flexível  
- ✅ **Mobile-first** - Responsivo por padrão
- ✅ **Modular** - Importe apenas o necessário
- ✅ **CSS Variables** - Customização dinâmica
- ✅ **Dark mode** - Suporte nativo
- ✅ **Bem documentado** - Comunidade ativa

### **Próximos Passos:**
1. ✅ **Substituir CSS custom** por classes Bulma
2. ✅ **Padronizar componentes** com sistema Bulma
3. ✅ **Implementar grid responsivo** nas telas
4. ✅ **Usar helpers de spacing** em vez de CSS inline
5. ✅ **Aproveitar sistema de cores** do Bulma

---

*Este guia cobre **100%** dos recursos do Bulma v1. Use como referência para implementar interfaces consistentes e modernas no projeto!* 🎨✨
