// spa.js - Sistema Single Page Application
// Gerencia navegação sem recarregar a página

/**
 * Sistema SPA - Single Page Application
 * Permite navegação entre páginas sem reload completo
 * Gerencia rotas, histórico e renderização de conteúdo
 */

class SPARouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.contentContainer = null;
        
        // Inicializar quando o DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Inicializa o sistema SPA
     */
    init() {
        this.contentContainer = document.getElementById('spa-content');
        
        // Se não existir container SPA, página usa navegação tradicional
        if (!this.contentContainer) {
            console.log('SPA não ativado - container #spa-content não encontrado');
            return;
        }
        
        // Interceptar cliques em links de navegação
        this.setupNavigation();
        
        // Gerenciar botões voltar/avançar do navegador
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.loadRoute(e.state.route, false);
            }
        });
        
        // Carregar rota inicial
        const initialRoute = window.location.pathname;
        this.loadRoute(initialRoute, true);
    }
    
    /**
     * Configura interceptação de links de navegação
     */
    setupNavigation() {
        document.addEventListener('click', (e) => {
            // Verificar se clicou em um link de navegação
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Ignorar links externos e âncoras
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                return;
            }
            
            // Ignorar links que devem abrir em nova aba
            if (link.target === '_blank') {
                return;
            }
            
            // Interceptar navegação
            e.preventDefault();
            this.navigate(href);
        });
    }
    
    /**
     * Registra uma rota no sistema
     * @param {string} path - Caminho da rota
     * @param {Function} handler - Função que retorna o conteúdo HTML
     */
    register(path, handler) {
        this.routes[path] = handler;
    }
    
    /**
     * Navega para uma rota
     * @param {string} path - Caminho da rota
     */
    navigate(path) {
        // Normalizar path (remover .html se houver)
        const normalizedPath = path.replace('.html', '');
        
        this.loadRoute(normalizedPath, true);
        
        // Atualizar URL no navegador
        window.history.pushState(
            { route: normalizedPath },
            '',
            normalizedPath
        );
        
        // Scroll suave para o topo
        this.smoothScrollToTop();
    }
    
    /**
     * Carrega e renderiza uma rota
     * @param {string} path - Caminho da rota
     * @param {boolean} updateHistory - Se deve atualizar o histórico
     */
    async loadRoute(path, updateHistory = true) {
        // Normalizar path
        const normalizedPath = path.replace('.html', '').replace(/\/$/, '') || '/index';
        
        // Buscar handler da rota
        let handler = this.routes[normalizedPath];
        
        // Se não encontrou, tentar rota padrão
        if (!handler) {
            handler = this.routes['/index'] || this.routes['/'];
        }
        
        if (!handler) {
            console.error(`Rota não encontrada: ${normalizedPath}`);
            this.render404();
            return;
        }
        
        // Executar handler e obter conteúdo
        try {
            const content = await handler();
            this.render(content);
            this.currentRoute = normalizedPath;
            
            // Atualizar links ativos no menu
            this.updateActiveLinks(normalizedPath);
            
            // Disparar evento customizado
            window.dispatchEvent(new CustomEvent('spa:route-changed', {
                detail: { route: normalizedPath }
            }));
            
        } catch (error) {
            console.error('Erro ao carregar rota:', error);
            this.renderError(error);
        }
    }
    
    /**
     * Renderiza conteúdo no container SPA
     * @param {string} html - HTML a ser renderizado
     */
    render(html) {
        if (!this.contentContainer) return;
        
        // Fade out
        this.contentContainer.style.opacity = '0';
        
        setTimeout(() => {
            this.contentContainer.innerHTML = html;
            
            // Fade in
            this.contentContainer.style.opacity = '1';
            
            // Re-inicializar componentes JavaScript (formulários, etc)
            this.reinitializeComponents();
        }, 200);
    }
    
    /**
     * Renderiza página 404
     */
    render404() {
        const html = `
            <section class="section">
                <div class="container text-center">
                    <h2>Página não encontrada</h2>
                    <p class="text-lg mb-4">A página que você procura não existe.</p>
                    <a href="/" class="btn btn-primary">Voltar para Início</a>
                </div>
            </section>
        `;
        this.render(html);
    }
    
    /**
     * Renderiza página de erro
     */
    renderError(error) {
        const html = `
            <section class="section">
                <div class="container text-center">
                    <h2>Erro ao carregar página</h2>
                    <p class="text-lg mb-4">Ocorreu um erro. Tente novamente.</p>
                    <p class="alert alert-error">${error.message}</p>
                    <a href="/" class="btn btn-primary">Voltar para Início</a>
                </div>
            </section>
        `;
        this.render(html);
    }
    
    /**
     * Atualiza links ativos no menu de navegação
     */
    updateActiveLinks(currentPath) {
        // Remover classe active de todos os links
        document.querySelectorAll('.nav-link, .nav-link-hero').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adicionar classe active no link atual
        const normalizedPath = currentPath.replace('/index', '/');
        document.querySelectorAll(`a[href="${normalizedPath}"], a[href="${normalizedPath}.html"]`).forEach(link => {
            if (link.classList.contains('nav-link') || link.classList.contains('nav-link-hero')) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Re-inicializa componentes JavaScript após renderização
     */
    reinitializeComponents() {
        // Disparar evento para outros scripts reinicializarem seus componentes
        window.dispatchEvent(new CustomEvent('spa:components-ready'));
    }
    
    /**
     * Scroll suave para o topo
     */
    smoothScrollToTop() {
        const duration = 800;
        const start = window.pageYOffset;
        const startTime = performance.now();
        
        function scroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, start * (1 - easeInOutCubic));
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        }
        
        requestAnimationFrame(scroll);
    }
}

// Criar instância global do router
const router = new SPARouter();

// Exportar para uso global
window.SPARouter = router;
