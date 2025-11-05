// accessibility.js - Gerenciamento de Acessibilidade
// Funcionalidades: Alto Contraste, Modo Escuro, Navegação por Teclado, Skip Links

(function() {
    'use strict';

    // ========================================
    // GERENCIAMENTO DE TEMAS
    // ========================================
    
    // Verifica preferências salvas
    function getStoredTheme() {
        return localStorage.getItem('theme') || 'default';
    }
    
    function getStoredContrast() {
        return localStorage.getItem('highContrast') === 'true';
    }
    
    // Aplica tema
    function applyTheme(theme) {
        document.body.classList.remove('dark-mode');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        localStorage.setItem('theme', theme);
        
        // Atualiza ícone do botão
        const themeIcon = document.querySelector('.theme-toggle-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // Aplica alto contraste
    function applyHighContrast(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        localStorage.setItem('highContrast', enabled);
        
        // Atualiza ícone do botão
        const contrastIcon = document.querySelector('.contrast-toggle-icon');
        if (contrastIcon) {
            contrastIcon.textContent = enabled ? '◐' : '◑';
        }
    }
    
    // ========================================
    // NAVEGAÇÃO POR TECLADO
    // ========================================
    
    // Skip to main content
    function createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.style.cssText = `
            position: absolute;
            top: -100px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 12px 20px;
            text-decoration: none;
            font-weight: 700;
            z-index: 10000;
            border-radius: 0 0 8px 0;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-100px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Navegação por teclado em cards
    function setupCardKeyboardNav() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            // Torna cards focáveis
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            // Adiciona role se não tiver
            if (!card.hasAttribute('role')) {
                card.setAttribute('role', 'article');
            }
        });
    }
    
    // Menu dropdown com teclado
    function setupDropdownKeyboardNav() {
        const dropdowns = document.querySelectorAll('.nav-item.has-dropdown');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (trigger && menu) {
                trigger.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        menu.classList.toggle('show');
                        menu.setAttribute('aria-expanded', menu.classList.contains('show'));
                    }
                    
                    if (e.key === 'Escape') {
                        menu.classList.remove('show');
                        menu.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    }
    
    // Gerenciamento de foco em modais
    function setupModalFocusTrap() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal(modal);
                }
                
                // Trap focus dentro do modal
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        });
    }
    
    function closeModal(modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Retorna foco para o elemento que abriu o modal
        const trigger = document.querySelector('[data-modal-trigger]');
        if (trigger) {
            trigger.focus();
        }
    }
    
    // ========================================
    // ANÚNCIOS PARA LEITORES DE TELA
    // ========================================
    
    function createAriaLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
        
        return liveRegion;
    }
    
    function announceToScreenReader(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = '';
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        }
    }
    
    // Exporta função globalmente
    window.announceToScreenReader = announceToScreenReader;
    
    // ========================================
    // MELHORIAS DE FORMULÁRIO
    // ========================================
    
    function enhanceFormAccessibility() {
        // Associa labels com inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && input.id) {
                console.warn(`Input ${input.id} não tem label associado`);
            }
            
            // Adiciona descrição de erro se houver
            if (input.classList.contains('is-invalid')) {
                const errorMsg = input.parentElement.querySelector('.form-error');
                if (errorMsg && !input.hasAttribute('aria-describedby')) {
                    const errorId = `${input.id}-error`;
                    errorMsg.id = errorId;
                    input.setAttribute('aria-describedby', errorId);
                    input.setAttribute('aria-invalid', 'true');
                }
            }
        });
        
        // Anuncia erros de validação
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                const invalidInputs = form.querySelectorAll('.is-invalid');
                if (invalidInputs.length > 0) {
                    const errorCount = invalidInputs.length;
                    const message = `Formulário contém ${errorCount} ${errorCount === 1 ? 'erro' : 'erros'}. Por favor, corrija antes de enviar.`;
                    announceToScreenReader(message);
                }
            });
        }
    }
    
    // ========================================
    // INDICADOR DE FOCO VISÍVEL
    // ========================================
    
    function enhanceFocusVisibility() {
        // Adiciona classe quando usuário está usando teclado
        let isUsingKeyboard = false;
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                isUsingKeyboard = true;
                document.body.classList.add('user-is-tabbing');
            }
        });
        
        document.addEventListener('mousedown', function() {
            isUsingKeyboard = false;
            document.body.classList.remove('user-is-tabbing');
        });
    }
    
    // ========================================
    // CRIAÇÃO DOS BOTÕES DE TOGGLE
    // ========================================
    
    function createThemeToggles() {
        // Container para os botões
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'accessibility-toggles';
        
        // Botão de modo escuro
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Alternar modo escuro');
        themeToggle.innerHTML = '<span class="theme-toggle-icon">🌙</span>';
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = getStoredTheme();
            const newTheme = currentTheme === 'dark' ? 'default' : 'dark';
            applyTheme(newTheme);
            announceToScreenReader(`Modo ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`);
        });
        
        // Botão de alto contraste
        const contrastToggle = document.createElement('button');
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.setAttribute('aria-label', 'Alternar alto contraste');
        contrastToggle.innerHTML = '<span class="contrast-toggle-icon">◑</span>';
        
        contrastToggle.addEventListener('click', function() {
            const currentContrast = getStoredContrast();
            applyHighContrast(!currentContrast);
            announceToScreenReader(`Alto contraste ${!currentContrast ? 'ativado' : 'desativado'}`);
        });
        
        toggleContainer.appendChild(themeToggle);
        toggleContainer.appendChild(contrastToggle);
        document.body.appendChild(toggleContainer);
    }
    
    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    document.addEventListener('DOMContentLoaded', function() {
        // Aplica temas salvos
        applyTheme(getStoredTheme());
        applyHighContrast(getStoredContrast());
        
        // Cria elementos de acessibilidade
        createSkipLink();
        createAriaLiveRegion();
        createThemeToggles();
        
        // Configura navegação por teclado
        setupCardKeyboardNav();
        setupDropdownKeyboardNav();
        setupModalFocusTrap();
        
        // Melhora formulários
        enhanceFormAccessibility();
        
        // Melhora indicador de foco
        enhanceFocusVisibility();
        
        // Detecta preferência de sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme')) {
            applyTheme('dark');
        }
        
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches && !localStorage.getItem('highContrast')) {
            applyHighContrast(true);
        }
        
        console.log('✅ Sistema de acessibilidade inicializado');
    });
    
    // Exporta funções globalmente
    window.AccessibilityManager = {
        applyTheme: applyTheme,
        applyHighContrast: applyHighContrast,
        announceToScreenReader: announceToScreenReader
    };

})();
