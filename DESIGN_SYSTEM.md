# Design System - VôLuntar

Documentação completa do sistema de design implementado para o projeto VôLuntar ONG.

## 📋 Índice

1. [Variáveis CSS](#variáveis-css)
2. [Tipografia](#tipografia)
3. [Cores](#cores)
4. [Espaçamento](#espaçamento)
5. [Grid System](#grid-system)
6. [Componentes](#componentes)
7. [Responsividade](#responsividade)

---

## 🎨 Variáveis CSS

### Cores

```css
/* Paleta principal */
--color-deep-navy: #042940
--color-teal: #005C53
--color-pale-lime: #D6D58E
--color-olive: #526403
--color-lime: #9FC131
--color-neon-lime: #DBF227
--color-sage: #587E68
--color-sun: #EFB01D

/* Tokens semânticos */
--bg: var(--color-pale-lime)
--surface: #ffffff
--text: #17252a
--primary: var(--color-teal)
--primary-strong: var(--color-deep-navy)
--accent: var(--color-olive)
--positive: var(--color-lime)
--highlight: var(--color-neon-lime)
--warning: var(--color-sun)
```

### Fontes

```css
/* Fontes disponíveis */
--font-crimson: 'Crimson Text', serif
--font-franklin: 'Libre Franklin', sans-serif
--font-montserrat: 'Montserrat', sans-serif
--font-raleway: 'Raleway', sans-serif
--font-roboto: 'Roboto', sans-serif

/* Tokens semânticos */
--font-heading: var(--font-roboto)        /* Títulos principais */
--font-subheading: var(--font-raleway)    /* Subtítulos */
--font-body: var(--font-franklin)         /* Corpo de texto */
--font-button: var(--font-montserrat)     /* Botões e CTAs */
--font-accent: var(--font-crimson)        /* Destaques/citações */
```

### Espaçamento (Sistema modular base 8px)

```css
--space-1: 8px     /* mínimo */
--space-2: 16px    /* pequeno */
--space-3: 24px    /* médio */
--space-4: 32px    /* grande */
--space-6: 48px    /* muito grande */
--space-8: 64px    /* extra grande */
```

---

## 📝 Tipografia

### Hierarquia de Títulos

- **h1**: clamp(2rem, 5vw, 3rem) - Roboto Bold
- **h2**: clamp(1.75rem, 4vw, 2.5rem) - Roboto Bold
- **h3**: clamp(1.5rem, 3vw, 2rem) - Raleway Bold
- **h4**: clamp(1.25rem, 2.5vw, 1.75rem) - Raleway Bold
- **h5**: 1.125rem - Roboto Bold
- **h6**: 1rem - Roboto Bold

### Corpo de Texto

- **Padrão**: Libre Franklin, 16px, line-height 1.6

---

## 🌈 Sistema de Cores

### Uso Semântico

| Token | Cor | Uso |
|-------|-----|-----|
| `--primary` | Teal (#005C53) | Ações principais, links importantes |
| `--primary-strong` | Deep Navy (#042940) | Títulos, textos de destaque |
| `--accent` | Olive (#526403) | Ações secundárias |
| `--positive` | Lime (#9FC131) | Sucesso, confirmações |
| `--warning` | Sun (#EFB01D) | Avisos, alertas |
| `--bg` | Pale Lime (#D6D58E) | Background geral |
| `--surface` | White (#FFFFFF) | Cards, modais |

---

## 📏 Sistema de Espaçamento

Use as variáveis `--space-*` para consistência:

```css
.card { 
  padding: var(--space-3);  /* 24px */
  margin-bottom: var(--space-4);  /* 32px */
}
```

### Classes Utilitárias

```html
<div class="mt-3 mb-4 px-3 py-2">...</div>
<!-- mt = margin-top, mb = margin-bottom -->
<!-- px = padding horizontal, py = padding vertical -->
```

---

## 🎯 Grid System

### Breakpoints (5 pontos)

- **xs**: 320px (mobile pequeno)
- **sm**: 576px (mobile)
- **md**: 768px (tablet)
- **lg**: 992px (desktop)
- **xl**: 1200px (desktop grande)

### Sistema de 12 Colunas

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">...</div>
    <div class="col-12 col-md-6 col-lg-8">...</div>
  </div>
</div>
```

### Grids Responsivos

```html
<!-- Grid automático (auto-fit) -->
<div class="grid-auto">...</div>

<!-- Grid de 2 colunas (responsivo) -->
<div class="grid-2">...</div>

<!-- Grid de 3 colunas (responsivo) -->
<div class="grid-3">...</div>

<!-- Grid de 4 colunas (responsivo) -->
<div class="grid-4">...</div>
```

---

## 🧩 Componentes

### Botões

**Variantes:**
- `.btn-primary` - Ação principal
- `.btn-secondary` - Ação secundária
- `.btn-outline` - Botão sem preenchimento
- `.btn-success` - Confirmação
- `.btn-warning` - Atenção

**Tamanhos:**
- `.btn-sm` - Pequeno
- `.btn` - Padrão
- `.btn-lg` - Grande

**Estados:**
- `:hover` - Elevação + mudança de cor
- `:focus` - Box-shadow de acessibilidade
- `:active` - Feedback visual
- `:disabled` - Opacidade reduzida

**Exemplo:**
```html
<button class="btn btn-primary btn-lg">Enviar</button>
<button class="btn btn-outline">Cancelar</button>
```

---

### Cards

**Tipos:**
- `.card` - Card padrão
- `.card-horizontal` - Layout horizontal
- `.card-highlight` - Com borda de destaque
- `.card-project` - Com overlay de hover

**Estrutura:**
```html
<div class="card">
  <img src="..." alt="..." class="card-img">
  <div class="card-body">
    <h3 class="card-title">Título</h3>
    <p class="card-text">Conteúdo...</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Ação</button>
  </div>
</div>
```

---

### Formulários

**Classes:**
- `.form-group` - Container do campo
- `.form-label` - Label do campo (adicione `.required` para *)
- `.form-input` - Input de texto
- `.form-select` - Select dropdown
- `.form-textarea` - Textarea
- `.form-check` - Container de checkbox/radio

**Estados de Validação:**
- `.is-valid` - Campo válido (ícone verde)
- `.is-invalid` - Campo inválido (ícone vermelho)
- `.is-warning` - Aviso (borda amarela)

**Exemplo:**
```html
<div class="form-group">
  <label for="email" class="form-label required">E-mail:</label>
  <input type="email" id="email" class="form-input is-valid">
  <div class="form-feedback valid">E-mail válido!</div>
</div>
```

---

### Navegação

**Menu Principal:**
```html
<header class="site-header">
  <nav class="navbar container">
    <a href="/" class="navbar-brand">VôLuntar</a>
    <button class="navbar-toggle">
      <span></span><span></span><span></span>
    </button>
    <ul class="navbar-menu">
      <li class="nav-item">
        <a href="#" class="nav-link active">Início</a>
      </li>
    </ul>
  </nav>
</header>
```

**Dropdown:**
```html
<li class="nav-item has-dropdown">
  <a href="#" class="nav-link">Menu</a>
  <ul class="dropdown-menu">
    <li><a href="#" class="dropdown-item">Item 1</a></li>
  </ul>
</li>
```

---

### Componentes de Feedback

**Alerts:**
```html
<div class="alert alert-success">
  <div class="alert-icon">✓</div>
  <div class="alert-content">
    <div class="alert-title">Sucesso!</div>
    <p>Operação realizada com sucesso.</p>
  </div>
  <button class="alert-close">×</button>
</div>
```

**Variantes:** `.alert-success`, `.alert-error`, `.alert-warning`, `.alert-info`

**Toasts:**
```html
<div class="toast-container">
  <div class="toast toast-success">
    <div class="toast-body">
      <div class="toast-title">Sucesso!</div>
      <div class="toast-message">Mensagem...</div>
    </div>
  </div>
</div>
```

**Modal:**
```html
<div class="modal active">
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">Título</h3>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">Conteúdo...</div>
    <div class="modal-footer">
      <button class="btn btn-primary">Confirmar</button>
    </div>
  </div>
</div>
```

---

### Badges e Tags

**Badges:**
```html
<span class="badge badge-primary">Educação</span>
<span class="badge badge-success">Ativo</span>
<span class="badge badge-outline badge-warning">Pendente</span>
```

**Tags:**
```html
<div class="tag tag-primary">Facebook</div>
<div class="tag tag-removable">
  JavaScript
  <button class="tag-close">×</button>
</div>
```

---

## 📱 Responsividade

### Abordagem Mobile-First

Todos os estilos são desenvolvidos primeiro para mobile, com media queries adicionando complexidade para telas maiores.

### Classes Utilitárias Responsivas

```html
<!-- Ocultar em mobile, mostrar em desktop -->
<div class="d-none d-md-block">...</div>

<!-- Texto centralizado apenas no mobile -->
<p class="text-center-mobile">...</p>
```

### Grid Responsivo Automático

```html
<!-- Automaticamente se adapta ao tamanho da tela -->
<div class="grid-auto">
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

---

## 🚀 JavaScript

### Funcionalidades Implementadas

1. **Menu Hambúrguer** - Toggle mobile com animação
2. **Validação de Formulário** - Feedback visual em tempo real
3. **Máscaras de Input** - CPF, telefone, CEP automáticos
4. **Toast Notifications** - Sistema de notificações
5. **Scroll Suave** - Navegação suave para âncoras

### Uso do Toast via JS

```javascript
showToast('Mensagem de sucesso!', 'success');
showToast('Erro ao processar!', 'error');
showToast('Atenção necessária!', 'warning');
showToast('Informação importante!', 'info');
```

---

## ✅ Checklist de Implementação

- [x] Variáveis de cores da paleta
- [x] Tokens semânticos de fontes
- [x] Sistema de espaçamento modular
- [x] 5 breakpoints responsivos
- [x] Grid de 12 colunas customizado
- [x] Layout principal com CSS Grid
- [x] Menu responsivo com dropdown
- [x] Menu hambúrguer mobile
- [x] Sistema de botões (5+ variantes)
- [x] Cards responsivos (4 tipos)
- [x] Formulários estilizados
- [x] Validação visual de formulário
- [x] Alerts, toasts e modals
- [x] Badges e tags
- [x] Classes utilitárias
- [x] JavaScript funcional

---

## 📖 Recursos

- **Google Fonts**: Crimson Text, Libre Franklin, Montserrat, Raleway, Roboto
- **Adobe Color**: Paleta de cores anexada
- **CSS Grid**: Layout principal
- **Flexbox**: Componentes internos
- **Mobile-First**: Abordagem responsiva

---

**Última atualização:** Novembro 2025  
**Desenvolvido para:** VôLuntar ONG
