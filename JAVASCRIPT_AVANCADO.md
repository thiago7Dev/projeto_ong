# Documentação JavaScript Avançado - Entrega 3

## Projeto VôLuntar - ONG de Voluntariado

Esta documentação descreve as funcionalidades avançadas de JavaScript implementadas para transformar o site estático em uma aplicação web dinâmica e interativa.

---

## 📋 Índice

1. [Sistema SPA (Single Page Application)](#sistema-spa)
2. [Sistema de Templates JavaScript](#sistema-de-templates)
3. [Sistema Avançado de Validação de Formulários](#validação-de-formulários)
4. [Como Testar](#como-testar)

---

## 🚀 Sistema SPA (Single Page Application)

### Arquivo: `assets/js/spa.js`

### Descrição
Sistema completo de Single Page Application que permite navegação entre páginas sem reload completo do navegador. Gerencia rotas, histórico e renderização dinâmica de conteúdo.

### Funcionalidades Implementadas

#### 1. Gerenciamento de Rotas
```javascript
// Registrar uma rota
router.register('/projetos', () => {
    return '<div>Conteúdo da página de projetos</div>';
});
```

#### 2. Navegação sem Reload
- Intercepta cliques em links automaticamente
- Atualiza URL sem recarregar a página
- Mantém histórico do navegador (botões voltar/avançar funcionam)

#### 3. Transições Suaves
- Fade in/out ao trocar de página
- Scroll suave para o topo com easing customizado
- Animações fluidas usando `requestAnimationFrame`

#### 4. Atualização de Menu
- Destaca automaticamente o link da página atual
- Gerencia classe `.active` nos links de navegação

### Características Técnicas

- **Gerenciamento de Estado**: Usa `window.history.pushState` para URLs amigáveis
- **Event Listeners**: Intercepta navegação e eventos do navegador
- **Promises**: Suporta handlers assíncronos
- **Custom Events**: Dispara eventos `spa:route-changed` e `spa:components-ready`

### Exemplo de Uso
```javascript
// Configurar rotas
router.register('/', () => Templates.render('home'));
router.register('/projetos', () => Templates.render('projetos'));

// Navegar programaticamente
router.navigate('/projetos');
```

---

## 🎨 Sistema de Templates JavaScript

### Arquivo: `assets/js/templates.js`

### Descrição
Motor de templates que permite criar e renderizar componentes HTML dinâmicos de forma modular e reutilizável.

### Componentes Disponíveis

#### 1. **Card de Projeto**
```javascript
Templates.component('projectCard', {
    title: 'Educar para o Futuro',
    description: 'Descrição do projeto...',
    image: 'path/to/image.jpg',
    badge: { text: 'Educação', type: 'primary' }
});
```

#### 2. **Card Simples**
```javascript
Templates.component('card', {
    title: 'Título',
    content: 'Conteúdo HTML',
    className: 'custom-class'
});
```

#### 3. **Seção com Header**
```javascript
Templates.component('section', {
    title: 'Título da Seção',
    subtitle: 'Subtítulo opcional',
    content: 'Conteúdo HTML'
});
```

#### 4. **Badge**
```javascript
Templates.component('badge', {
    text: 'Educação',
    type: 'primary',
    outline: false
});
```

#### 5. **Botão**
```javascript
Templates.component('button', {
    text: 'Clique aqui',
    type: 'primary',
    size: 'lg',
    href: '/destino'
});
```

#### 6. **Alert**
```javascript
Templates.component('alert', {
    message: 'Mensagem de alerta',
    type: 'success',
    dismissible: true
});
```

### Templates de Páginas Completas

#### Página Inicial
```javascript
Templates.register('home', (data) => {
    // Retorna HTML completo da página inicial
});
```

#### Página de Projetos
```javascript
Templates.register('projetos', (data) => {
    // Aceita dados dinâmicos
    // Renderiza lista de projetos
});
```

### Características Técnicas

- **Modularidade**: Componentes isolados e reutilizáveis
- **Composição**: Componentes podem conter outros componentes
- **Template Strings**: Usa template literals do ES6
- **Props**: Aceita propriedades customizáveis
- **Fallbacks**: Valores padrão para props opcionais

---

## ✅ Sistema Avançado de Validação de Formulários

### Arquivo: `assets/js/form-validation.js`

### Descrição
Sistema robusto de validação de formulários com verificação de consistência de dados em tempo real, mensagens de erro específicas e feedback visual imediato.

### Funcionalidades de Validação

#### 1. **Validações HTML5 Suportadas**
- `required` - Campo obrigatório
- `minlength` / `maxlength` - Tamanho mínimo/máximo
- `min` / `max` - Valores numéricos mínimos/máximos
- `pattern` - Expressão regular customizada

#### 2. **Validações Customizadas**

##### Email com Verificação Avançada
```html
<input type="email" data-validate-email required>
```
- Formato correto de email
- Tamanho máximo de partes locais e domínio
- Verificação de domínio válido

##### CPF com Dígitos Verificadores
```html
<input type="text" data-validate-cpf required>
```
- Formato 000.000.000-00
- Validação de dígitos verificadores
- Rejeita CPFs com todos números iguais
- Mensagens específicas (primeiro/segundo dígito)

##### Telefone com DDD
```html
<input type="tel" data-validate-phone required>
```
- Formato (00) 00000-0000
- Valida quantidade de dígitos (10 ou 11)
- Verifica se DDD é válido (11-99)

##### CEP
```html
<input type="text" data-validate-cep required>
```
- Formato 00000-000
- Valida exatamente 8 dígitos

##### Data com Verificações Lógicas
```html
<input type="date" data-validate-date required>
```
- Data não pode estar no futuro
- Data não pode ser muito antiga (> 120 anos)
- Verifica se é data válida

#### 3. **Validação em Tempo Real**

##### Quando o campo perde o foco (blur)
```javascript
field.addEventListener('blur', () => {
    validateField(form, field);
});
```

##### Enquanto o usuário digita (debounced)
```javascript
field.addEventListener('input', () => {
    // Aguarda 300ms após parar de digitar
    setTimeout(() => validateField(form, field), 300);
});
```

### Feedback Visual

#### Estados dos Campos

**Campo Válido:**
- Borda verde
- Ícone de check (✓)
- Classe `.is-valid`

**Campo Inválido:**
- Borda vermelha
- Ícone de alerta (!)
- Classe `.is-invalid`
- Mensagens de erro específicas abaixo do campo

#### Mensagens de Erro

```html
<div class="field-error">
    <span class="error-message">⚠ Este campo é obrigatório</span>
    <span class="error-message">⚠ Mínimo de 3 caracteres</span>
</div>
```

### Alertas de Formulário

#### Sucesso
```javascript
showFormAlert(form, 'Cadastro enviado com sucesso!', 'success');
```

#### Erro
```javascript
showFormAlert(form, 'Por favor, corrija os erros...', 'error');
```

### Como Usar

#### 1. Adicionar atributo `data-validate` ao formulário
```html
<form data-validate>
    <!-- campos -->
</form>
```

#### 2. Adicionar validações aos campos
```html
<input 
    type="text" 
    id="cpf" 
    name="cpf" 
    data-validate-cpf 
    required 
    maxlength="14"
>
```

#### 3. Incluir o script
```html
<script src="assets/js/form-validation.js"></script>
```

### Validadores Disponíveis

| Validador | Data Attribute | Descrição |
|-----------|---------------|-----------|
| Email | `data-validate-email` | Valida formato e estrutura de email |
| CPF | `data-validate-cpf` | Valida CPF com dígitos verificadores |
| Telefone | `data-validate-phone` | Valida telefone com DDD |
| CEP | `data-validate-cep` | Valida formato de CEP |
| Data | `data-validate-date` | Valida datas com verificações lógicas |
| Match | `data-validate-match="field-id"` | Compara com outro campo |

### Eventos Customizados

#### Submit Válido
```javascript
form.addEventListener('form:valid-submit', (e) => {
    const formData = e.detail.formData;
    // Processar dados
});
```

---

## 🧪 Como Testar

### Opção 1: Demonstração SPA Completa

1. Abra o arquivo `spa-demo.html` no navegador
2. Navegue entre as páginas usando o menu
3. Observe que a página não recarrega completamente
4. Use os botões voltar/avançar do navegador
5. Teste o formulário de cadastro com validações

### Opção 2: Páginas Tradicionais com Validação

1. Abra `cadastro.html` no navegador
2. Tente enviar o formulário vazio
3. Preencha os campos incorretamente:
   - Email inválido
   - CPF inválido (ex: 111.111.111-11)
   - Telefone com DDD inválido
   - Data no futuro
4. Observe as mensagens de erro específicas
5. Corrija os erros e veja o feedback positivo

### Teste de Consistência de Dados

#### CPF
- ✅ Válido: `123.456.789-09`
- ❌ Inválido: `123.456.789-00` (dígito errado)
- ❌ Inválido: `111.111.111-11` (todos iguais)

#### Email
- ✅ Válido: `usuario@exemplo.com`
- ❌ Inválido: `usuario@` (falta domínio)
- ❌ Inválido: `@exemplo.com` (falta parte local)

#### Telefone
- ✅ Válido: `(11) 98765-4321`
- ✅ Válido: `(11) 3456-7890`
- ❌ Inválido: `(00) 98765-4321` (DDD inválido)
- ❌ Inválido: `(11) 9876-543` (poucos dígitos)

#### Data
- ✅ Válido: `1990-01-01`
- ❌ Inválido: `2030-01-01` (futuro)
- ❌ Inválido: `1800-01-01` (muito antiga)

---

## 📚 Arquitetura do Sistema

### Estrutura de Arquivos
```
projeto_ong/
├── assets/
│   ├── css/
│   │   └── main.css (estilos de validação e SPA)
│   └── js/
│       ├── spa.js (Sistema SPA)
│       ├── templates.js (Motor de templates)
│       ├── form-validation.js (Validação avançada)
│       └── main.js (Funcionalidades gerais)
├── index.html (Página tradicional)
├── projetos.html (Página tradicional)
├── cadastro.html (Página tradicional com validação)
└── spa-demo.html (Demonstração SPA completa)
```

### Fluxo de Funcionamento

#### SPA Mode
1. Usuário clica em link
2. SPA intercepta o evento
3. Router busca handler da rota
4. Template é renderizado
5. Conteúdo é inserido no `#spa-content`
6. URL é atualizada
7. Menu é atualizado
8. Componentes são reinicializados

#### Form Validation
1. Campo perde foco ou usuário digita
2. Validador extrai regras do campo
3. Executa validações específicas
4. Atualiza UI com feedback
5. Mostra mensagens de erro específicas
6. No submit, valida todo o formulário
7. Scroll para primeiro erro se houver
8. Mostra alerta de sucesso/erro

---

## 🎯 Requisitos Atendidos

### ✅ Manipulação do DOM
- Sistema SPA gerencia DOM dinamicamente
- Renderização de templates sem reload
- Atualização de elementos em tempo real
- Gerenciamento de eventos e listeners

### ✅ Sistema de Templates JavaScript
- Motor de templates completo
- Componentes reutilizáveis
- Templates de páginas completas
- Composição de componentes

### ✅ Validação de Formulários
- Verificação de consistência de dados
- Validações customizadas (CPF, email, telefone, etc)
- Mensagens específicas de erro
- Feedback visual em tempo real
- Avisos ao usuário de preenchimento incorreto

---

## 💡 Tecnologias Utilizadas

- **ES6+**: Classes, template literals, arrow functions, destructuring
- **DOM API**: Manipulation, eventos, classList, dataset
- **History API**: pushState, popstate para SPA
- **FormData API**: Captura de dados de formulário
- **Custom Events**: Comunicação entre componentes
- **CSS Variables**: Integração com design system
- **Animations API**: requestAnimationFrame para transições suaves

---

## 📝 Notas de Implementação

### Performance
- Debounce em validações enquanto digita
- Uso de `requestAnimationFrame` para animações
- Event delegation para eventos
- Lazy initialization de componentes

### Acessibilidade
- Atributos ARIA mantidos
- Labels associados a inputs
- Mensagens de erro descritivas
- Foco gerenciado corretamente

### Extensibilidade
- Fácil adicionar novos validadores
- Simples criar novos componentes
- Rotas facilmente configuráveis
- Sistema modular e desacoplado

---

**Desenvolvido para a Entrega 3 - JavaScript Avançado**
*Projeto VôLuntar - Organização Não Governamental*
