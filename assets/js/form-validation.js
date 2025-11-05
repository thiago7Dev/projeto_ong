// form-validation.js - Sistema Avançado de Validação de Formulários
// Verificação de consistência de dados com avisos ao usuário

/**
 * Sistema de Validação de Formulários
 * Verifica consistência de dados em tempo real
 * Exibe avisos específicos para cada tipo de erro
 */

class FormValidator {
    constructor() {
        this.forms = new Map();
        this.validators = this.createValidators();
        this.init();
    }
    
    /**
     * Inicializa o validador
     */
    init() {
        // Escutar evento de componentes prontos (SPA)
        window.addEventListener('spa:components-ready', () => {
            this.initializeForms();
        });
        
        // Inicializar na primeira carga
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeForms());
        } else {
            this.initializeForms();
        }
    }
    
    /**
     * Inicializa todos os formulários na página
     */
    initializeForms() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            this.registerForm(form);
        });
    }
    
    /**
     * Registra um formulário para validação
     * @param {HTMLFormElement} form - Formulário a ser validado
     */
    registerForm(form) {
        if (this.forms.has(form)) return; // Já registrado
        
        const formData = {
            element: form,
            fields: new Map(),
            isValid: false
        };
        
        this.forms.set(form, formData);
        
        // Encontrar todos os campos do formulário
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            this.registerField(form, field);
        });
        
        // Interceptar submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });
    }
    
    /**
     * Registra um campo para validação
     * @param {HTMLFormElement} form - Formulário pai
     * @param {HTMLElement} field - Campo a ser validado
     */
    registerField(form, field) {
        const formData = this.forms.get(form);
        if (!formData) return;
        
        const fieldData = {
            element: field,
            rules: this.getFieldRules(field),
            errors: [],
            touched: false
        };
        
        formData.fields.set(field, fieldData);
        
        // Validação em tempo real (blur)
        field.addEventListener('blur', () => {
            fieldData.touched = true;
            this.validateField(form, field);
        });
        
        // Validação enquanto digita (para feedback imediato)
        field.addEventListener('input', () => {
            if (fieldData.touched) {
                // Debounce para não validar a cada tecla
                clearTimeout(fieldData.inputTimeout);
                fieldData.inputTimeout = setTimeout(() => {
                    this.validateField(form, field);
                }, 300);
            }
        });
    }
    
    /**
     * Extrai regras de validação do campo
     * @param {HTMLElement} field - Campo a analisar
     * @returns {Object} Regras de validação
     */
    getFieldRules(field) {
        const rules = {};
        
        // Regras básicas HTML5
        if (field.hasAttribute('required')) rules.required = true;
        if (field.hasAttribute('minlength')) rules.minLength = parseInt(field.getAttribute('minlength'));
        if (field.hasAttribute('maxlength')) rules.maxLength = parseInt(field.getAttribute('maxlength'));
        if (field.hasAttribute('min')) rules.min = parseFloat(field.getAttribute('min'));
        if (field.hasAttribute('max')) rules.max = parseFloat(field.getAttribute('max'));
        if (field.hasAttribute('pattern')) rules.pattern = new RegExp(field.getAttribute('pattern'));
        
        // Regras customizadas via data attributes
        if (field.dataset.validateEmail) rules.email = true;
        if (field.dataset.validateCpf) rules.cpf = true;
        if (field.dataset.validatePhone) rules.phone = true;
        if (field.dataset.validateCep) rules.cep = true;
        if (field.dataset.validateDate) rules.date = true;
        if (field.dataset.validateMatch) rules.match = field.dataset.validateMatch;
        
        // Regras de consistência
        if (field.dataset.validateConsistency) {
            rules.consistency = field.dataset.validateConsistency.split(',');
        }
        
        return rules;
    }
    
    /**
     * Valida um campo específico
     * @param {HTMLFormElement} form - Formulário pai
     * @param {HTMLElement} field - Campo a validar
     * @returns {boolean} Se o campo é válido
     */
    validateField(form, field) {
        const formData = this.forms.get(form);
        const fieldData = formData.fields.get(field);
        
        if (!fieldData) return true;
        
        fieldData.errors = [];
        const value = field.value.trim();
        const rules = fieldData.rules;
        
        // Validar cada regra
        for (const [ruleName, ruleValue] of Object.entries(rules)) {
            const validator = this.validators[ruleName];
            
            if (validator) {
                const result = validator(value, ruleValue, field, form);
                
                if (result !== true) {
                    fieldData.errors.push(result);
                }
            }
        }
        
        // Atualizar UI
        this.updateFieldUI(field, fieldData);
        
        return fieldData.errors.length === 0;
    }
    
    /**
     * Cria os validadores
     * @returns {Object} Objeto com funções validadoras
     */
    createValidators() {
        return {
            required: (value) => {
                if (!value || value.length === 0) {
                    return 'Este campo é obrigatório';
                }
                return true;
            },
            
            minLength: (value, min) => {
                if (value.length > 0 && value.length < min) {
                    return `Mínimo de ${min} caracteres`;
                }
                return true;
            },
            
            maxLength: (value, max) => {
                if (value.length > max) {
                    return `Máximo de ${max} caracteres`;
                }
                return true;
            },
            
            min: (value, min) => {
                const num = parseFloat(value);
                if (!isNaN(num) && num < min) {
                    return `Valor mínimo: ${min}`;
                }
                return true;
            },
            
            max: (value, max) => {
                const num = parseFloat(value);
                if (!isNaN(num) && num > max) {
                    return `Valor máximo: ${max}`;
                }
                return true;
            },
            
            email: (value) => {
                if (value.length === 0) return true;
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Email inválido';
                }
                
                // Verificações adicionais de consistência
                const [localPart, domain] = value.split('@');
                
                if (localPart.length > 64) {
                    return 'Parte local do email muito longa';
                }
                
                if (domain.length > 255) {
                    return 'Domínio do email muito longo';
                }
                
                if (domain.split('.').some(part => part.length === 0)) {
                    return 'Domínio do email inválido';
                }
                
                return true;
            },
            
            cpf: (value) => {
                if (value.length === 0) return true;
                
                // Remover pontos e traços
                const cpf = value.replace(/[^\d]/g, '');
                
                if (cpf.length !== 11) {
                    return 'CPF deve ter 11 dígitos';
                }
                
                // Verificar se todos os dígitos são iguais
                if (/^(\d)\1{10}$/.test(cpf)) {
                    return 'CPF inválido';
                }
                
                // Validar dígitos verificadores
                let sum = 0;
                for (let i = 0; i < 9; i++) {
                    sum += parseInt(cpf.charAt(i)) * (10 - i);
                }
                let digit = 11 - (sum % 11);
                if (digit >= 10) digit = 0;
                
                if (digit !== parseInt(cpf.charAt(9))) {
                    return 'CPF inválido (primeiro dígito verificador)';
                }
                
                sum = 0;
                for (let i = 0; i < 10; i++) {
                    sum += parseInt(cpf.charAt(i)) * (11 - i);
                }
                digit = 11 - (sum % 11);
                if (digit >= 10) digit = 0;
                
                if (digit !== parseInt(cpf.charAt(10))) {
                    return 'CPF inválido (segundo dígito verificador)';
                }
                
                return true;
            },
            
            phone: (value) => {
                if (value.length === 0) return true;
                
                const phone = value.replace(/[^\d]/g, '');
                
                if (phone.length < 10 || phone.length > 11) {
                    return 'Telefone deve ter 10 ou 11 dígitos';
                }
                
                // Verificar se o DDD é válido (11-99)
                const ddd = parseInt(phone.substring(0, 2));
                if (ddd < 11 || ddd > 99) {
                    return 'DDD inválido';
                }
                
                return true;
            },
            
            cep: (value) => {
                if (value.length === 0) return true;
                
                const cep = value.replace(/[^\d]/g, '');
                
                if (cep.length !== 8) {
                    return 'CEP deve ter 8 dígitos';
                }
                
                return true;
            },
            
            date: (value) => {
                if (value.length === 0) return true;
                
                const date = new Date(value);
                
                if (isNaN(date.getTime())) {
                    return 'Data inválida';
                }
                
                // Verificar se a data não está no futuro
                if (date > new Date()) {
                    return 'Data não pode estar no futuro';
                }
                
                // Verificar se a data não é muito antiga (> 120 anos)
                const minDate = new Date();
                minDate.setFullYear(minDate.getFullYear() - 120);
                
                if (date < minDate) {
                    return 'Data muito antiga';
                }
                
                return true;
            },
            
            match: (value, targetFieldId, field, form) => {
                if (value.length === 0) return true;
                
                const targetField = form.querySelector(`#${targetFieldId}`);
                
                if (!targetField) {
                    return 'Campo de comparação não encontrado';
                }
                
                if (value !== targetField.value) {
                    return 'Os campos não coincidem';
                }
                
                return true;
            },
            
            pattern: (value, pattern) => {
                if (value.length === 0) return true;
                
                if (!pattern.test(value)) {
                    return 'Formato inválido';
                }
                
                return true;
            }
        };
    }
    
    /**
     * Atualiza a interface do campo com feedback visual
     * @param {HTMLElement} field - Campo a atualizar
     * @param {Object} fieldData - Dados do campo
     */
    updateFieldUI(field, fieldData) {
        const formGroup = field.closest('.form-group');
        
        // Remover classes anteriores
        field.classList.remove('is-valid', 'is-invalid');
        
        // Remover mensagens de erro anteriores
        const oldError = formGroup?.querySelector('.field-error');
        if (oldError) {
            oldError.remove();
        }
        
        if (fieldData.errors.length > 0) {
            // Campo inválido
            field.classList.add('is-invalid');
            
            // Adicionar mensagem de erro
            if (formGroup) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.innerHTML = fieldData.errors.map(err => 
                    `<span class="error-message">⚠ ${err}</span>`
                ).join('');
                
                formGroup.appendChild(errorDiv);
            }
        } else if (field.value.trim().length > 0) {
            // Campo válido
            field.classList.add('is-valid');
        }
    }
    
    /**
     * Valida o formulário completo
     * @param {HTMLFormElement} form - Formulário a validar
     * @returns {boolean} Se o formulário é válido
     */
    validateForm(form) {
        const formData = this.forms.get(form);
        if (!formData) return false;
        
        let isValid = true;
        
        // Marcar todos os campos como touched
        formData.fields.forEach((fieldData, field) => {
            fieldData.touched = true;
            
            if (!this.validateField(form, field)) {
                isValid = false;
            }
        });
        
        formData.isValid = isValid;
        return isValid;
    }
    
    /**
     * Manipula o envio do formulário
     * @param {HTMLFormElement} form - Formulário enviado
     */
    handleSubmit(form) {
        const isValid = this.validateForm(form);
        
        if (!isValid) {
            // Mostrar alerta de erro
            this.showFormAlert(form, 'Por favor, corrija os erros no formulário antes de enviar.', 'error');
            
            // Scroll para o primeiro campo com erro
            const firstInvalidField = form.querySelector('.is-invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
            
            return;
        }
        
        // Formulário válido - processar
        this.showFormAlert(form, 'Cadastro enviado com sucesso!', 'success');
        
        // Disparar evento customizado
        form.dispatchEvent(new CustomEvent('form:valid-submit', {
            detail: { formData: new FormData(form) }
        }));
        
        // Resetar formulário após 2 segundos
        setTimeout(() => {
            form.reset();
            formData.fields.forEach((fieldData, field) => {
                field.classList.remove('is-valid', 'is-invalid');
                fieldData.touched = false;
                fieldData.errors = [];
            });
        }, 2000);
    }
    
    /**
     * Mostra alerta no formulário
     * @param {HTMLFormElement} form - Formulário
     * @param {string} message - Mensagem do alerta
     * @param {string} type - Tipo do alerta (success, error, warning, info)
     */
    showFormAlert(form, message, type = 'info') {
        // Remover alertas anteriores
        const oldAlert = form.querySelector('.form-alert');
        if (oldAlert) {
            oldAlert.remove();
        }
        
        // Criar novo alerta
        const alert = document.createElement('div');
        alert.className = `form-alert alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-body">${message}</div>
            <button class="alert-close" aria-label="Fechar">×</button>
        `;
        
        // Adicionar no topo do formulário
        form.insertBefore(alert, form.firstChild);
        
        // Fechar ao clicar no X
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.remove();
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
}

// Criar instância global
const formValidator = new FormValidator();

// Exportar para uso global
window.FormValidator = formValidator;
