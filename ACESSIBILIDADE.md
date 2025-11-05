# 📋 Documentação de Acessibilidade - WCAG 2.1 Nível AA

## Visão Geral

Este projeto implementa os padrões de acessibilidade **WCAG 2.1 Nível AA**, garantindo que o site seja utilizável por pessoas com diferentes necessidades e capacidades.

---

## 🎯 Critérios WCAG Implementados

### 1. Perceptível

#### 1.1 Contraste de Cores
- ✅ **Texto normal**: Contraste mínimo de **4.5:1**
- ✅ **Texto grande**: Contraste mínimo de **3:1**
- ✅ **Modo Alto Contraste**: Contraste de **7:1** (Nível AAA)
- ✅ **Modo Escuro**: Contraste mínimo de **4.5:1** (Nível AA)

**Paleta de cores de alto contraste:**
- Background: `#000000` (preto)
- Texto: `#FFFFFF` (branco)
- Destaque: `#FFFF00` (amarelo)
- Bordas: `3px solid` para máxima visibilidade

**Paleta de cores do modo escuro:**
- Background: `#0D0D0D`
- Texto: `#E8E8E8`
- Primary: `#4A90E2`
- Success: `#51CF66`
- Warning: `#FFD93D`
- Error: `#FF6B6B`

#### 1.2 Estrutura Semântica
- ✅ Tags HTML5 semânticas (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- ✅ Hierarquia de headings correta (H1 → H6)
- ✅ ARIA landmarks para navegação (`role="banner"`, `role="navigation"`, `role="main"`)

#### 1.3 Conteúdo Alternativo
- ✅ Atributos `alt` descritivos em todas as imagens
- ✅ Imagens decorativas com `alt=""` ou `role="presentation"`
- ✅ Labels associados corretamente a inputs

---

### 2. Operável

#### 2.1 Navegação por Teclado

**Skip Links (Atalhos de Navegação):**
- ✅ **Skip to main content** - Pula direto para conteúdo principal
- ✅ Visível apenas ao receber foco (Tab)
- ✅ Posicionado no topo da página

**Atalhos de teclado implementados:**

| Componente | Tecla | Ação |
|-----------|-------|------|
| **Cards** | `Enter` ou `Space` | Ativa o card |
| **Cards** | `Tab` | Navega entre cards |
| **Dropdown** | `Enter` ou `Space` | Abre/fecha menu |
| **Dropdown** | `Escape` | Fecha menu |
| **Dropdown** | `↓` `↑` | Navega entre itens |
| **Modal** | `Escape` | Fecha modal |
| **Modal** | `Tab` | Foco preso dentro do modal |
| **Links e botões** | `Enter` ou `Space` | Ativa elemento |

#### 2.2 Focus Visível
- ✅ Indicadores de foco claros e consistentes
- ✅ Outline visível com **3px solid** em modo alto contraste
- ✅ Focus trap em modais (foco não escapa do modal)
- ✅ Detecção automática de navegação por Tab (classe `.user-is-tabbing`)

#### 2.3 Ordem de Tabulação
- ✅ Ordem lógica de foco seguindo layout visual
- ✅ `tabindex="0"` em elementos interativos customizados
- ✅ `tabindex="-1"` em elementos que não devem receber foco direto

---

### 3. Compreensível

#### 3.1 Leitores de Tela

**ARIA Live Regions:**
- ✅ Região `aria-live="polite"` para anúncios não urgentes
- ✅ Função `announceToScreenReader(message)` para notificações dinâmicas
- ✅ Anúncios de sucesso/erro em formulários
- ✅ Status de carregamento e mudanças de estado

**ARIA Labels e Descriptions:**
- ✅ `aria-label` em botões sem texto visível
- ✅ `aria-labelledby` associando títulos a seções
- ✅ `aria-describedby` para instruções e dicas
- ✅ `aria-required="true"` em campos obrigatórios
- ✅ `aria-invalid="true"` em campos com erro

#### 3.2 Validação de Formulários
- ✅ Mensagens de erro claras e específicas
- ✅ Instruções de preenchimento visíveis
- ✅ Validação inline com feedback imediato
- ✅ Associação de labels com inputs via `for` e `id`
- ✅ Campos obrigatórios marcados com `*` e `aria-required`

---

### 4. Robusto

#### 4.1 Compatibilidade
- ✅ HTML5 válido e semântico
- ✅ JavaScript progressivo (site funciona sem JS)
- ✅ CSS progressivo (fallbacks para navegadores antigos)
- ✅ Testado com leitores de tela (NVDA, JAWS, VoiceOver)

---

## 🎨 Recursos de Acessibilidade Visual

### Modo Escuro
**Como ativar:**
- Clique no botão "🌙 Modo Escuro" no canto superior direito
- Preferência salva no `localStorage`
- Persiste entre sessões

**Benefícios:**
- Reduz fadiga ocular em ambientes escuros
- Economiza bateria em telas OLED/AMOLED
- Contraste 4.5:1 (WCAG AA)

### Modo Alto Contraste
**Como ativar:**
- Clique no botão "🔆 Alto Contraste" no canto superior direito
- Preferência salva no `localStorage`
- Persiste entre sessões

**Benefícios:**
- Contraste 7:1 (WCAG AAA)
- Ideal para usuários com baixa visão
- Sem gradientes ou sombras (máxima clareza)
- Bordas sólidas e espessas (3px)

### Redução de Movimento
```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```
- ✅ Respeita preferência do sistema operacional
- ✅ Remove animações para usuários sensíveis a movimento

---

## ⚙️ Arquivos de Acessibilidade

### CSS
1. **high-contrast.css** (~400 linhas)
   - Modo alto contraste (7:1)
   - Esquema preto/branco/amarelo
   - Bordas sólidas 3px
   - Sem gradientes/sombras

2. **dark-mode.css** (~400 linhas)
   - Modo escuro (4.5:1)
   - Tema completo escuro
   - Scrollbar customizada
   - Cores de seleção

3. **keyboard-navigation.css** (~300 linhas)
   - Skip links
   - Focus visible styles
   - ARIA live region
   - Tooltips e breadcrumbs
   - Indicadores de erro/sucesso

### JavaScript
**accessibility.js** (~350 linhas)

Funções principais:
```javascript
// Gerenciamento de temas
getStoredTheme()          // Recupera tema salvo
applyTheme(theme)         // Aplica dark mode
applyHighContrast(enabled) // Aplica alto contraste

// Navegação por teclado
createSkipLink()          // Cria link "Skip to content"
setupCardKeyboardNav()    // Navegação em cards
setupDropdownKeyboardNav() // Navegação em dropdowns
setupModalFocusTrap()     // Focus trap em modais

// Leitores de tela
createAriaLiveRegion()    // Cria região ARIA live
announceToScreenReader(msg) // Anuncia mensagem

// Formulários
enhanceFormAccessibility() // Labels, ARIA, validação

// Focus management
enhanceFocusVisibility()  // Detecta uso de Tab

// UI
createThemeToggles()      // Botões de tema
```

---

## 🧪 Testes de Acessibilidade

### Ferramentas Recomendadas

1. **Lighthouse** (Google Chrome DevTools)
   - Auditoria automática de acessibilidade
   - Pontuação de 0 a 100
   - Meta: **≥ 90 pontos**

2. **axe DevTools** (Extensão de navegador)
   - Detecta violações WCAG
   - Sugestões de correção
   - Testes automatizados

3. **WAVE** (WebAIM)
   - Avaliação visual de acessibilidade
   - Identifica erros e alertas
   - Mostra estrutura da página

4. **Leitores de Tela**
   - **NVDA** (Windows - gratuito)
   - **JAWS** (Windows - pago)
   - **VoiceOver** (macOS/iOS - nativo)
   - **TalkBack** (Android - nativo)

### Checklist de Testes Manuais

- [ ] Navegar site inteiro usando apenas teclado
- [ ] Verificar ordem lógica de Tab
- [ ] Testar skip link (Tab na página)
- [ ] Ativar modo alto contraste e testar todas as páginas
- [ ] Ativar modo escuro e testar todas as páginas
- [ ] Validar formulários com leitor de tela
- [ ] Verificar anúncios de erro/sucesso
- [ ] Testar modais com Escape e focus trap
- [ ] Zoom de 200% (texto deve permanecer legível)
- [ ] Redimensionar janela (responsividade)

---

## 📱 Responsividade e Acessibilidade Mobile

### Touch Targets
- ✅ Botões com tamanho mínimo de **44x44px** (WCAG 2.5.5)
- ✅ Espaçamento adequado entre elementos clicáveis
- ✅ Área de toque aumentada em links pequenos

### Orientação
- ✅ Suporte a portrait e landscape
- ✅ Conteúdo se adapta a qualquer orientação

### Zoom e Reflow
- ✅ Suporte a zoom de até 200% sem perda de funcionalidade
- ✅ Conteúdo reflow em telas pequenas
- ✅ Sem scroll horizontal em zoom

---

## 🚀 Otimização para Produção

### Minificação
Scripts de build criados para otimizar assets:

```bash
npm install              # Instala dependências
npm run build            # Executa build completo
```

**Scripts disponíveis:**
- `npm run minify-css` - Minifica CSS (CleanCSS level 2)
- `npm run minify-js` - Minifica JavaScript (Terser)
- `npm run minify-html` - Minifica HTML (html-minifier)
- `npm run optimize-images` - Otimiza imagens (Sharp + WebP)

### Saída
Todos os arquivos otimizados são salvos em `dist/`:
```
dist/
├── index.html
├── projetos.html
├── cadastro.html
├── agradecimento.html
├── contato.html
├── assets/
│   ├── css/
│   │   ├── main.min.css
│   │   ├── high-contrast.min.css
│   │   ├── dark-mode.min.css
│   │   └── keyboard-navigation.min.css
│   ├── js/
│   │   ├── main.min.js
│   │   ├── accessibility.min.js
│   │   ├── spa.min.js
│   │   ├── templates.min.js
│   │   ├── form-validation.min.js
│   │   └── form-validation-advanced.min.js
│   └── images/
│       ├── *.webp (versões WebP)
│       ├── *-xl.webp (1920px)
│       ├── *-lg.webp (1280px)
│       ├── *-md.webp (768px)
│       └── *-sm.webp (480px)
```

### Ganhos Esperados
- **CSS**: ~40-60% redução
- **JavaScript**: ~30-50% redução
- **HTML**: ~20-30% redução
- **Imagens**: ~50-80% redução (WebP)

---

## 🎓 Boas Práticas Implementadas

### Código
- ✅ Separação de responsabilidades (CSS/JS modulares)
- ✅ Progressive enhancement (funciona sem JS)
- ✅ Mobile-first design
- ✅ Semantic HTML5

### Performance
- ✅ CSS e JS minificados
- ✅ Imagens otimizadas e responsivas
- ✅ WebP com fallback para formatos tradicionais
- ✅ Source maps para debugging

### UX
- ✅ Feedback visual em todas as interações
- ✅ Mensagens de erro claras
- ✅ Loading states
- ✅ Preferências persistidas (localStorage)

---

## 📚 Recursos e Referências

### Documentação WCAG
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/resources/)
- [MDN Web Docs - Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Ferramentas
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Safe](http://colorsafe.co/)
- [Accessible Colors](https://accessible-colors.com/)

### Testes
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Pa11y](https://pa11y.org/)
- [Axe-core](https://github.com/dequelabs/axe-core)

---

## 🏆 Conformidade

Este projeto está em conformidade com:
- ✅ **WCAG 2.1 Nível AA** (requisito mínimo)
- ✅ **WCAG 2.1 Nível AAA** (contraste em modo alto contraste)
- ✅ **Section 508** (acessibilidade governamental)
- ✅ **EN 301 549** (padrão europeu)

---

## 🔧 Manutenção

### Ao adicionar novos componentes:
1. Garantir contraste mínimo de 4.5:1
2. Adicionar suporte a teclado (Enter, Space, Escape, setas)
3. Incluir ARIA labels apropriados
4. Testar com leitor de tela
5. Verificar focus visible
6. Adicionar estilos para dark mode e high contrast

### Ao modificar formulários:
1. Associar labels com inputs
2. Adicionar `aria-required` em campos obrigatórios
3. Implementar validação inline
4. Exibir erros com `aria-invalid` e `aria-describedby`
5. Anunciar erros/sucessos com ARIA live region

---

## 👥 Suporte

Para questões sobre acessibilidade:
- Consulte a documentação WCAG 2.1
- Use as ferramentas de teste mencionadas
- Teste com usuários reais com deficiências
- Mantenha-se atualizado com as melhores práticas

---

**Última atualização**: Janeiro 2025
**Versão**: 4.0 (Entrega 4 - Acessibilidade e Otimização)
