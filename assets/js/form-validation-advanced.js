// form-validation-advanced.js - Validações avançadas e integração com APIs
// Funções: Validação de CPF, CEP, integração ViaCEP, validação de data

(function() {
    'use strict';

    // ========================================
    // VALIDAÇÃO DE CPF
    // ========================================
    function validarCPF(cpf) {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/[^\d]/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    // ========================================
    // VALIDAÇÃO DE CEP
    // ========================================
    function validarCEP(cep) {
        // Remove caracteres não numéricos
        cep = cep.replace(/[^\d]/g, '');
        
        // Verifica se tem 8 dígitos
        return cep.length === 8;
    }

    // ========================================
    // VALIDAÇÃO DE DATA DE NASCIMENTO
    // ========================================
    function validarDataNascimento(data) {
        if (!data) return false;
        
        const hoje = new Date();
        const nascimento = new Date(data);
        
        // Verifica se a data é válida
        if (isNaN(nascimento.getTime())) return false;
        
        // Verifica se não é data futura
        if (nascimento > hoje) return false;
        
        // Calcula idade
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();
        
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        // Verifica idade mínima (16 anos) e máxima (120 anos)
        return idade >= 16 && idade <= 120;
    }

    // ========================================
    // INTEGRAÇÃO COM VIACEP
    // ========================================
    function buscarCEP(cep, callback) {
        // Remove caracteres não numéricos
        cep = cep.replace(/[^\d]/g, '');
        
        // Verifica se o CEP é válido
        if (cep.length !== 8) {
            callback({ erro: true, mensagem: 'CEP inválido' });
            return;
        }
        
        // Mostra loading
        const cepInput = document.getElementById('cep');
        const originalPlaceholder = cepInput.placeholder;
        cepInput.placeholder = 'Buscando...';
        cepInput.disabled = true;
        
        // Faz requisição para ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                cepInput.placeholder = originalPlaceholder;
                cepInput.disabled = false;
                
                if (data.erro) {
                    callback({ erro: true, mensagem: 'CEP não encontrado' });
                } else {
                    callback({ erro: false, dados: data });
                }
            })
            .catch(error => {
                cepInput.placeholder = originalPlaceholder;
                cepInput.disabled = false;
                callback({ erro: true, mensagem: 'Erro ao buscar CEP' });
            });
    }

    // ========================================
    // PREENCHIMENTO AUTOMÁTICO DE ENDEREÇO
    // ========================================
    function preencherEndereco(dados) {
        const enderecoInput = document.getElementById('endereco');
        const bairroInput = document.getElementById('bairro');
        const cidadeInput = document.getElementById('cidade');
        const estadoSelect = document.getElementById('estado');
        
        if (dados.logradouro) {
            enderecoInput.value = dados.logradouro;
            enderecoInput.classList.add('is-valid');
            enderecoInput.classList.remove('is-invalid');
        }
        
        if (dados.bairro) {
            bairroInput.value = dados.bairro;
            bairroInput.classList.add('is-valid');
            bairroInput.classList.remove('is-invalid');
        }
        
        if (dados.localidade) {
            cidadeInput.value = dados.localidade;
            cidadeInput.classList.add('is-valid');
            cidadeInput.classList.remove('is-invalid');
        }
        
        if (dados.uf) {
            estadoSelect.value = dados.uf;
            estadoSelect.classList.add('is-valid');
            estadoSelect.classList.remove('is-invalid');
        }
        
        // Foca no campo número
        const numeroInput = document.getElementById('numero');
        if (numeroInput) {
            numeroInput.focus();
        }
    }

    // ========================================
    // MÁSCARAS DE INPUT
    // ========================================
    function aplicarMascaraCPF(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        input.value = value;
    }

    function aplicarMascaraCEP(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 8) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        input.value = value;
    }

    function aplicarMascaraTelefone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        input.value = value;
    }

    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        
        // Máscara para CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function() {
                aplicarMascaraCPF(this);
            });
            
            // Validação ao sair do campo
            cpfInput.addEventListener('blur', function() {
                const errorDiv = this.parentElement.querySelector('.form-error');
                
                if (this.value && !validarCPF(this.value)) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                    
                    if (errorDiv) {
                        errorDiv.textContent = 'CPF inválido';
                    } else {
                        const newErrorDiv = document.createElement('div');
                        newErrorDiv.className = 'form-error';
                        newErrorDiv.textContent = 'CPF inválido';
                        this.parentElement.appendChild(newErrorDiv);
                    }
                } else if (this.value) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                    if (errorDiv) errorDiv.remove();
                }
            });
        }
        
        // Máscara para CEP e busca automática
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('input', function() {
                aplicarMascaraCEP(this);
            });
            
            // Busca automática ao completar o CEP
            cepInput.addEventListener('blur', function() {
                const cep = this.value.replace(/\D/g, '');
                const errorDiv = this.parentElement.querySelector('.form-error');
                
                if (cep.length === 8) {
                    buscarCEP(cep, function(resultado) {
                        if (resultado.erro) {
                            cepInput.classList.add('is-invalid');
                            cepInput.classList.remove('is-valid');
                            
                            if (errorDiv) {
                                errorDiv.textContent = resultado.mensagem;
                            } else {
                                const newErrorDiv = document.createElement('div');
                                newErrorDiv.className = 'form-error';
                                newErrorDiv.textContent = resultado.mensagem;
                                cepInput.parentElement.appendChild(newErrorDiv);
                            }
                        } else {
                            cepInput.classList.add('is-valid');
                            cepInput.classList.remove('is-invalid');
                            if (errorDiv) errorDiv.remove();
                            
                            // Preenche os campos de endereço
                            preencherEndereco(resultado.dados);
                            
                            // Mostra toast de sucesso
                            if (window.showToast) {
                                window.showToast('Endereço encontrado com sucesso!', 'success');
                            }
                        }
                    });
                } else if (cep.length > 0) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                    
                    if (errorDiv) {
                        errorDiv.textContent = 'CEP deve ter 8 dígitos';
                    } else {
                        const newErrorDiv = document.createElement('div');
                        newErrorDiv.className = 'form-error';
                        newErrorDiv.textContent = 'CEP deve ter 8 dígitos';
                        this.parentElement.appendChild(newErrorDiv);
                    }
                }
            });
        }
        
        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function() {
                aplicarMascaraTelefone(this);
            });
        }
        
        // Validação de data de nascimento
        const nascimentoInput = document.getElementById('nascimento');
        if (nascimentoInput) {
            nascimentoInput.addEventListener('blur', function() {
                const errorDiv = this.parentElement.querySelector('.form-error');
                
                if (this.value && !validarDataNascimento(this.value)) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                    
                    const hoje = new Date();
                    const nascimento = new Date(this.value);
                    let mensagem = 'Data de nascimento inválida';
                    
                    if (nascimento > hoje) {
                        mensagem = 'Data não pode ser futura';
                    } else {
                        let idade = hoje.getFullYear() - nascimento.getFullYear();
                        const mesAtual = hoje.getMonth();
                        const mesNascimento = nascimento.getMonth();
                        
                        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
                            idade--;
                        }
                        
                        if (idade < 16) {
                            mensagem = 'Idade mínima: 16 anos';
                        } else if (idade > 120) {
                            mensagem = 'Data de nascimento inválida';
                        }
                    }
                    
                    if (errorDiv) {
                        errorDiv.textContent = mensagem;
                    } else {
                        const newErrorDiv = document.createElement('div');
                        newErrorDiv.className = 'form-error';
                        newErrorDiv.textContent = mensagem;
                        this.parentElement.appendChild(newErrorDiv);
                    }
                } else if (this.value) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                    if (errorDiv) errorDiv.remove();
                }
            });
        }
        
        // Validação em tempo real das áreas de interesse
        const areaCheckboxes = document.querySelectorAll('input[name="area"]');
        if (areaCheckboxes.length > 0) {
            const checkboxFieldset = areaCheckboxes[0].closest('fieldset');
            
            areaCheckboxes.forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    const atLeastOneChecked = Array.from(areaCheckboxes).some(cb => cb.checked);
                    
                    if (atLeastOneChecked && checkboxFieldset) {
                        // Remove erro
                        const oldError = checkboxFieldset.querySelector('.form-error');
                        if (oldError) oldError.remove();
                        checkboxFieldset.style.border = 'none';
                        checkboxFieldset.style.padding = '0';
                    }
                });
            });
        }
        
        // Validação completa no submit
        const form = document.getElementById('form-voluntario');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const errors = [];
                
                // Valida CPF
                if (cpfInput && cpfInput.value) {
                    if (!validarCPF(cpfInput.value)) {
                        isValid = false;
                        errors.push('CPF inválido');
                        cpfInput.classList.add('is-invalid');
                    }
                }
                
                // Valida CEP
                if (cepInput && cepInput.value) {
                    if (!validarCEP(cepInput.value)) {
                        isValid = false;
                        errors.push('CEP inválido');
                        cepInput.classList.add('is-invalid');
                    }
                }
                
                // Valida data de nascimento
                if (nascimentoInput && nascimentoInput.value) {
                    if (!validarDataNascimento(nascimentoInput.value)) {
                        isValid = false;
                        errors.push('Data de nascimento inválida');
                        nascimentoInput.classList.add('is-invalid');
                    }
                }
                
                // Valida campos obrigatórios
                const requiredInputs = form.querySelectorAll('[required]');
                requiredInputs.forEach(function(input) {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('is-invalid');
                    }
                });
                
                // Valida área de interesse
                const checkboxes = form.querySelectorAll('input[name="area"]');
                const atLeastOneChecked = Array.from(checkboxes).some(cb => cb.checked);
                const checkboxFieldset = checkboxes.length > 0 ? checkboxes[0].closest('fieldset') : null;
                
                if (!atLeastOneChecked) {
                    isValid = false;
                    errors.push('Selecione pelo menos uma área de interesse');
                    
                    // Adiciona mensagem de erro visual
                    if (checkboxFieldset) {
                        // Remove erro anterior se existir
                        const oldError = checkboxFieldset.querySelector('.form-error');
                        if (oldError) oldError.remove();
                        
                        // Adiciona novo erro
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'form-error';
                        errorDiv.style.marginTop = '8px';
                        errorDiv.textContent = 'Selecione pelo menos uma área de interesse';
                        checkboxFieldset.appendChild(errorDiv);
                        
                        // Adiciona borda vermelha em volta do fieldset
                        checkboxFieldset.style.border = '2px solid #dc3545';
                        checkboxFieldset.style.borderRadius = '4px';
                        checkboxFieldset.style.padding = '12px';
                    }
                } else {
                    // Remove erro se houver seleção
                    if (checkboxFieldset) {
                        const oldError = checkboxFieldset.querySelector('.form-error');
                        if (oldError) oldError.remove();
                        checkboxFieldset.style.border = 'none';
                        checkboxFieldset.style.padding = '0';
                    }
                }
                
                if (isValid) {
                    // Salva o nome do voluntário no localStorage
                    const nomeInput = document.getElementById('nome');
                    if (nomeInput && nomeInput.value) {
                        localStorage.setItem('voluntario_nome', nomeInput.value);
                    }
                    
                    if (window.showToast) {
                        window.showToast('Cadastro enviado com sucesso! Redirecionando...', 'success');
                    }
                    
                    // Redireciona para página de agradecimento após 1.5 segundos
                    setTimeout(function() {
                        window.location.href = 'agradecimento.html';
                    }, 1500);
                } else {
                    if (window.showToast) {
                        const errorMessage = errors.length > 0 ? errors.join(', ') : 'Por favor, corrija os erros no formulário';
                        window.showToast(errorMessage, 'error');
                    }
                }
            });
        }
    });

    // Exporta funções para uso global
    window.FormValidationAdvanced = {
        validarCPF: validarCPF,
        validarCEP: validarCEP,
        validarDataNascimento: validarDataNascimento,
        buscarCEP: buscarCEP
    };

})();
