// main.js - Script principal para o site VôLuntar
// Funcionalidades: menu hambúrguer, validação de formulário, scroll suave

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // AUTO SCROLL APÓS CARREGAMENTO DA PÁGINA
    // ========================================
    // Scroll automático para primeira seção após navegação
    setTimeout(function() {
        const firstSection = document.querySelector('main section');
        if (firstSection && window.location.hash === '') {
            const offset = 100; // Offset para não ficar colado no topo
            const elementPosition = firstSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            // Scroll suave com animação customizada
            const startPosition = window.pageYOffset;
            const distance = offsetPosition - startPosition;
            const duration = 1500; // 1.5 segundos para scroll mais suave
            let start = null;
            
            function smoothScroll(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(smoothScroll);
            }
            
            // Função de easing para movimento mais suave (easeInOutCubic)
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }
            
            requestAnimationFrame(smoothScroll);
        }
    }, 500); // Delay de 500ms
    
    // ========================================
    // MENU HAMBÚRGUER (MOBILE)
    // ========================================
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu') || document.querySelector('.navbar-menu-hero');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            // Toggle do menu
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
            
            // Atualizar aria-expanded
            const isExpanded = navbarMenu.classList.contains('active');
            navbarToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            const isClickInside = navbarToggle.contains(event.target) || navbarMenu.contains(event.target);
            
            if (!isClickInside && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
                navbarToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // ========================================
    // VALIDAÇÃO DE FORMULÁRIO (cadastro.html)
    // ========================================
    const form = document.getElementById('form-voluntario');
    
    if (form) {
        // Máscaras de input
        const cpfInput = document.getElementById('cpf');
        const telefoneInput = document.getElementById('telefone');
        const cepInput = document.getElementById('cep');
        
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                }
                e.target.value = value;
            });
        }
        
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        }
        
        if (cepInput) {
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        }
        
        // Validação ao enviar
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Resetar estados de validação
            const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Validar campos obrigatórios
            let isValid = true;
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else if (input.value.trim()) {
                    input.classList.add('is-valid');
                }
            });
            
            // Validar email
            const emailInput = document.getElementById('email');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailInput.classList.remove('is-valid');
                    emailInput.classList.add('is-invalid');
                    isValid = false;
                }
            }
            
            // Validar pelo menos uma área de interesse
            const checkboxes = form.querySelectorAll('input[name="area"]');
            const atLeastOneChecked = Array.from(checkboxes).some(cb => cb.checked);
            
            if (!atLeastOneChecked) {
                alert('Por favor, selecione pelo menos uma área de interesse.');
                isValid = false;
            }
            
            if (isValid) {
                // Mostrar mensagem de sucesso
                showToast('Cadastro enviado com sucesso!', 'success');
                
                // Resetar formulário após 2 segundos
                setTimeout(() => {
                    form.reset();
                    inputs.forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                    });
                }, 2000);
            } else {
                showToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
            }
        });
    }
    
    // ========================================
    // FUNÇÃO PARA EXIBIR TOAST
    // ========================================
    function showToast(message, type = 'info') {
        // Criar container de toasts se não existir
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Criar toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const titles = {
            'success': 'Sucesso!',
            'error': 'Erro!',
            'warning': 'Atenção!',
            'info': 'Informação'
        };
        
        toast.innerHTML = `
            <div class="toast-body">
                <div class="toast-title">${titles[type] || 'Informação'}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="alert-close" aria-label="Fechar">×</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remover toast ao clicar no X
        const closeBtn = toast.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
    
    // ========================================
    // SCROLL SUAVE PARA ÂNCORAS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
});
