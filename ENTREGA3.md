# Entrega 3 - JavaScript Avançado

## Objetivos Implementados

Esta entrega implementa JavaScript avançado para transformar a interface estática em uma aplicação web dinâmica e interativa, demonstrando domínio de manipulação do DOM, eventos, armazenamento local e técnicas avançadas de validação.

---

## 1. Manipulação do DOM

### 1.1 Sistema de Single Page Application (SPA) Básico

**Arquivo:** `assets/js/spa-router.js`

**Funcionalidades:**
- Router básico com suporte a hash navigation (`#/home`, `#/projetos`, `#/cadastro`)
- Sistema de templates dinâmicos carregados via JavaScript
- Transições suaves entre páginas
- Histórico de navegação
- Fallback para página 404

**Como usar:**
```javascript
// Definir rotas
SPA.addRoute('home', () => {
    return `<h1>Página Inicial</h1>`;
});

// Navegar
SPA.navigate('projetos');
```

**Demonstração:**
- Arquivo: `spa-demo.html`
- Acesse e navegue entre as seções sem recarregar a página

---

### 1.2 Sistema de Templates JavaScript

**Arquivo:** `assets/js/template-engine.js`

**Funcionalidades:**
- Engine de templates com sintaxe `{{ variavel }}`
- Suporte a loops com `{{#each items}}...{{/each}}`
- Condicionais com `{{#if condition}}...{{/if}}`
- Partials (templates reutilizáveis)
- Binding de dados bidirecional

**Exemplo de uso:**
```javascript
const template = `
    <h2>{{ titulo }}</h2>
    {{#each projetos}}
        <div class="card">
            <h3>{{ nome }}</h3>
            <p>{{ descricao }}</p>
        </div>
    {{/each}}
`;

const html = TemplateEngine.render(template, {
    titulo: 'Nossos Projetos',
    projetos: [...]
});
```

---

## 2. Sistema de Validação de Formulários

### 2.1 Validação Básica

**Arquivo:** `assets/js/form-validation.js`

**Funcionalidades:**
- Validação em tempo real de campos
- Feedback visual (bordas verdes/vermelhas)
- Mensagens de erro contextualizadas
- Validação de email com regex
- Validação de campos obrigatórios
- Validação de comprimento mínimo/máximo

**Atributos suportados:**
```html
<input 
    data-validate 
    data-validate-email 
    required 
    minlength="3" 
    maxlength="100"
>
```

---

### 2.2 Validações Avançadas

**Arquivo:** `assets/js/form-validation-advanced.js`

#### 2.2.1 Validação de CPF

**Algoritmo:**
- Remove caracteres não numéricos
- Verifica se tem 11 dígitos
- Valida que não são todos dígitos iguais
- Calcula e valida os dois dígitos verificadores

**Uso:**
```html
<input type="text" id="cpf" data-validate-cpf required>
```

**Feedback:**
- ✅ CPF válido: borda verde
- ❌ CPF inválido: borda vermelha + mensagem "CPF inválido"

---

#### 2.2.2 Validação de CEP com Integração ViaCEP

**Funcionalidades:**
- Validação de formato (8 dígitos)
- Busca automática de endereço na API ViaCEP
- Preenchimento automático de:
  - Endereço (logradouro)
  - Bairro
  - Cidade
  - Estado (UF)
- Máscara automática: `00000-000`
- Loading durante busca
- Tratamento de erros

**Uso:**
```html
<input type="text" id="cep" data-validate-cep required>
```

**Fluxo:**
1. Usuário digita o CEP
2. Ao sair do campo (blur), valida formato
3. Se válido, busca na API ViaCEP
4. Preenche automaticamente os campos de endereço
5. Foca no campo "número" para continuação
6. Mostra toast de sucesso

**Tratamento de erros:**
- CEP não encontrado: mensagem "CEP não encontrado"
- Erro de rede: mensagem "Erro ao buscar CEP"
- CEP inválido: mensagem "CEP deve ter 8 dígitos"

---

#### 2.2.3 Validação de Data de Nascimento

**Regras:**
- Idade mínima: 16 anos
- Idade máxima: 120 anos
- Data não pode ser futura
- Cálculo correto considerando dia e mês

**Mensagens de erro:**
- "Data não pode ser futura"
- "Idade mínima: 16 anos"
- "Data de nascimento inválida"

---

#### 2.2.4 Validação de Telefone

**Formato aceito:**
- Celular: (00) 00000-0000
- Fixo: (00) 0000-0000
- Máscara automática aplicada durante digitação

---

### 2.3 Máscaras de Input

**Implementadas:**
- CPF: `000.000.000-00`
- CEP: `00000-000`
- Telefone: `(00) 00000-0000`

**Características:**
- Aplicadas em tempo real durante digitação
- Não permitem caracteres inválidos
- Limite automático de caracteres

---

## 3. Campos do Formulário de Cadastro

### 3.1 Dados Pessoais

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| Nome completo | text | minlength: 3 | ✅ |
| E-mail | email | regex email | ✅ |
| CPF | text | algoritmo CPF | ✅ |
| Telefone | tel | máscara | ✅ |
| Data de nascimento | date | idade 16-120 anos | ✅ |

### 3.2 Endereço

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| CEP | text | 8 dígitos + ViaCEP | ✅ |
| Endereço | text | minlength: 5 | ✅ |
| Número | text | - | ✅ |
| Complemento | text | - | ❌ |
| Bairro | text | minlength: 2 | ✅ |
| Cidade | text | minlength: 2 | ✅ |
| Estado | select | lista de UFs | ✅ |

### 3.3 Áreas de Interesse

- ☐ Educar para o Futuro (educação)
- ☐ Saúde e Bem-Estar (saúde)
- ☐ Inclusão e Trabalho (inclusão)
- ☐ Comunidade Sustentável (sustentabilidade)

**Validação:** Pelo menos uma área deve ser selecionada

---

## 4. Feedback ao Usuário

### 4.1 Visual

- **Campo válido:** borda verde + ícone ✓
- **Campo inválido:** borda vermelha + ícone ✗
- **Mensagem de erro:** texto vermelho abaixo do campo

### 4.2 Toast Notifications

**Situações:**
- ✅ Sucesso: "Endereço encontrado com sucesso!"
- ✅ Sucesso: "Cadastro enviado com sucesso!"
- ❌ Erro: "CPF inválido"
- ❌ Erro: "CEP não encontrado"
- ❌ Erro: "Por favor, corrija os erros no formulário"

---

## 5. Estrutura de Arquivos

```
projeto_ong/
├── assets/
│   ├── js/
│   │   ├── main.js                          # Script principal
│   │   ├── spa-router.js                    # Sistema SPA
│   │   ├── template-engine.js               # Engine de templates
│   │   ├── form-validation.js               # Validação básica
│   │   └── form-validation-advanced.js      # Validações avançadas + ViaCEP
│   └── css/
│       └── main.css                         # Estilos incluindo validação
├── cadastro.html                            # Formulário completo
├── spa-demo.html                            # Demonstração do SPA
└── ENTREGA3.md                             # Esta documentação
```

---

## 6. APIs Utilizadas

### 6.1 ViaCEP

**Endpoint:** `https://viacep.com.br/ws/{cep}/json/`

**Método:** GET

**Resposta de sucesso:**
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "complemento": "",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

**Resposta de erro:**
```json
{
  "erro": true
}
```

---

## 7. Tecnologias Utilizadas

- **JavaScript ES6+**
  - Arrow functions
  - Template literals
  - Destructuring
  - Promises
  - Fetch API
  - Async/await
  
- **DOM API**
  - querySelector/querySelectorAll
  - addEventListener
  - classList
  - createElement
  - innerHTML/textContent
  
- **APIs Externas**
  - ViaCEP (consulta de CEP)

---

## 8. Como Testar

### 8.1 Formulário de Cadastro

1. Abra `cadastro.html`
2. Preencha o CEP: `01310-100` (Av. Paulista, SP)
3. Observe o preenchimento automático
4. Digite um CPF inválido: `111.111.111-11`
5. Observe a mensagem de erro
6. Digite um CPF válido: `123.456.789-09`
7. Observe a validação em verde
8. Tente enviar sem selecionar áreas de interesse
9. Observe a mensagem de erro

### 8.2 Sistema SPA

1. Abra `spa-demo.html`
2. Navegue entre as seções clicando nos links
3. Observe que a página não recarrega
4. Use os botões de voltar/avançar do navegador
5. Observe que funciona corretamente

---

## 9. Validações Implementadas

### Resumo Checklist

✅ **Manipulação do DOM**
- ✅ Sistema SPA básico com router
- ✅ Templates JavaScript dinâmicos

✅ **Validação de Formulários**
- ✅ Validação em tempo real
- ✅ Feedback visual imediato
- ✅ Mensagens de erro contextualizadas
- ✅ Validação de CPF com algoritmo oficial
- ✅ Validação de CEP com formato
- ✅ Integração ViaCEP para autocompletar
- ✅ Validação de data de nascimento (idade)
- ✅ Validação de email com regex
- ✅ Validação de campos obrigatórios
- ✅ Máscaras automáticas (CPF, CEP, telefone)

✅ **Funcionalidades Extras**
- ✅ Toast notifications
- ✅ Loading durante busca de CEP
- ✅ Tratamento de erros de API
- ✅ Scroll suave automático
- ✅ Sistema de templates reutilizáveis

---

## 10. Requisitos Atendidos

### Especificações Técnicas Obrigatórias

✅ **Manipulação do DOM**
- ✅ Implementar sistema de Single Page Application (SPA) básico
- ✅ Criar sistema de templates JavaScript

✅ **Funcionalidades Específicas Obrigatórias**
- ✅ Sistema de verificação de consistência de dados em formulários
- ✅ Aviso ao usuário de preenchimento incorreto

### Funcionalidades Extras Implementadas

- ✅ Integração com API externa (ViaCEP)
- ✅ Validação avançada de CPF (algoritmo oficial)
- ✅ Preenchimento automático de endereço
- ✅ Máscaras de input em tempo real
- ✅ Sistema de notificações toast
- ✅ Validação de idade mínima/máxima
- ✅ Feedback visual avançado

---

## 11. Exemplos de Código

### Validação de CPF

```javascript
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}
```

### Integração ViaCEP

```javascript
function buscarCEP(cep, callback) {
    cep = cep.replace(/[^\d]/g, '');
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                callback({ erro: true, mensagem: 'CEP não encontrado' });
            } else {
                callback({ erro: false, dados: data });
            }
        })
        .catch(error => {
            callback({ erro: true, mensagem: 'Erro ao buscar CEP' });
        });
}
```

---

## 12. Considerações Finais

Esta implementação demonstra:

1. **Domínio de JavaScript avançado**
   - Manipulação complexa do DOM
   - Programação orientada a eventos
   - Promises e async/await
   - Integração com APIs externas

2. **Boas práticas de desenvolvimento**
   - Código modular e reutilizável
   - Tratamento robusto de erros
   - Feedback claro ao usuário
   - Validações do lado do cliente

3. **Experiência do usuário**
   - Validação em tempo real
   - Preenchimento automático
   - Feedback visual imediato
   - Máscaras de input intuitivas

4. **Segurança**
   - Validações robustas de dados
   - Tratamento de entradas inválidas
   - Sanitização de dados

---

**Desenvolvido para:** Entrega 3 - JavaScript Avançado  
**Data:** Novembro 2025  
**Projeto:** VôLuntar - Sistema de Cadastro de Voluntários
