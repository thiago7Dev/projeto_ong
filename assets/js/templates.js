// templates.js - Sistema de Templates JavaScript
// Gerencia templates dinâmicos para renderização de conteúdo

/**
 * Sistema de Templates
 * Permite criar e renderizar templates HTML dinâmicos
 */

class TemplateEngine {
    constructor() {
        this.templates = {};
        this.components = {};
    }
    
    /**
     * Registra um template
     * @param {string} name - Nome do template
     * @param {Function} templateFn - Função que retorna HTML
     */
    register(name, templateFn) {
        this.templates[name] = templateFn;
    }
    
    /**
     * Renderiza um template com dados
     * @param {string} name - Nome do template
     * @param {Object} data - Dados para o template
     * @returns {string} HTML renderizado
     */
    render(name, data = {}) {
        const template = this.templates[name];
        
        if (!template) {
            console.error(`Template não encontrado: ${name}`);
            return '';
        }
        
        return template(data);
    }
    
    /**
     * Registra um componente reutilizável
     * @param {string} name - Nome do componente
     * @param {Function} componentFn - Função que retorna HTML do componente
     */
    registerComponent(name, componentFn) {
        this.components[name] = componentFn;
    }
    
    /**
     * Renderiza um componente
     * @param {string} name - Nome do componente
     * @param {Object} props - Propriedades do componente
     * @returns {string} HTML do componente
     */
    component(name, props = {}) {
        const component = this.components[name];
        
        if (!component) {
            console.error(`Componente não encontrado: ${name}`);
            return '';
        }
        
        return component(props);
    }
}

// Criar instância global
const templates = new TemplateEngine();

// ========================================
// COMPONENTES REUTILIZÁVEIS
// ========================================

/**
 * Componente: Card de Projeto
 */
templates.registerComponent('projectCard', (props) => {
    const { title, description, image, badge, status = 'Ativo' } = props;
    
    return `
        <article class="card card-project">
            ${image ? `<img src="${image}" alt="${title}" class="card-img">` : ''}
            <div class="card-body">
                <h3 class="card-title">${title}</h3>
                <p class="card-text">${description}</p>
                <div class="d-flex gap-2 flex-wrap">
                    <span class="badge badge-${badge.type}">${badge.text}</span>
                    <span class="badge badge-outline badge-success">${status}</span>
                </div>
            </div>
        </article>
    `;
});

/**
 * Componente: Card Simples
 */
templates.registerComponent('card', (props) => {
    const { title, content, className = '' } = props;
    
    return `
        <div class="card ${className}">
            <div class="card-body">
                ${title ? `<h3 class="card-title">${title}</h3>` : ''}
                <div class="card-text">${content}</div>
            </div>
        </div>
    `;
});

/**
 * Componente: Seção com Header
 */
templates.registerComponent('section', (props) => {
    const { title, subtitle, content, className = '' } = props;
    
    return `
        <section class="section ${className}">
            <div class="container">
                ${title || subtitle ? `
                    <div class="section-header text-center">
                        ${title ? `<h2>${title}</h2>` : ''}
                        ${subtitle ? `<p class="text-lg">${subtitle}</p>` : ''}
                    </div>
                ` : ''}
                ${content}
            </div>
        </section>
    `;
});

/**
 * Componente: Badge
 */
templates.registerComponent('badge', (props) => {
    const { text, type = 'primary', outline = false } = props;
    const classes = `badge badge-${type} ${outline ? 'badge-outline' : ''}`;
    
    return `<span class="${classes}">${text}</span>`;
});

/**
 * Componente: Botão
 */
templates.registerComponent('button', (props) => {
    const { text, type = 'primary', size = '', href, className = '' } = props;
    const classes = `btn btn-${type} ${size ? `btn-${size}` : ''} ${className}`;
    
    if (href) {
        return `<a href="${href}" class="${classes}">${text}</a>`;
    }
    
    return `<button class="${classes}">${text}</button>`;
});

/**
 * Componente: Alert
 */
templates.registerComponent('alert', (props) => {
    const { message, type = 'info', dismissible = false } = props;
    
    return `
        <div class="alert alert-${type}">
            <div class="alert-body">${message}</div>
            ${dismissible ? '<button class="alert-close" aria-label="Fechar">×</button>' : ''}
        </div>
    `;
});

// ========================================
// TEMPLATES DE PÁGINAS
// ========================================

/**
 * Template: Página Inicial
 */
templates.register('home', (data = {}) => {
    return `
        <!-- Seção Quem Somos -->
        ${templates.component('section', {
            content: templates.component('card', {
                title: 'Quem somos',
                content: `
                    <p class="text-lg">A VôLuntar é uma organização não governamental fundada com o propósito de promover transformação social em comunidades vulneráveis. Atuamos de forma integrada nas áreas de educação, saúde, inclusão social e sustentabilidade, acreditando que o desenvolvimento humano acontece quando há acesso a oportunidades dignas e apoio solidário.</p>
                `,
                className: 'card-scroll-reveal'
            })
        })}
        
        <!-- Visão e Valores -->
        <section class="section" style="padding-top: 0;">
            <div class="container">
                <div class="grid-2">
                    ${templates.component('card', {
                        title: 'Visão',
                        content: 'Ser referência em projetos sociais transformadores, construindo uma sociedade mais justa, inclusiva e sustentável, onde cada pessoa tenha oportunidade de desenvolver seu potencial e viver com dignidade.'
                    })}
                    ${templates.component('card', {
                        title: 'Valores',
                        content: 'Solidariedade, respeito à diversidade, transparência, compromisso com a comunidade, sustentabilidade e valorização do ser humano. Acreditamos que juntos podemos construir um futuro melhor para todos.'
                    })}
                </div>
            </div>
        </section>
        
        <!-- Participe e Apoie -->
        ${templates.component('section', {
            title: 'Participe e Apoie',
            subtitle: 'Nossa ONG desenvolve múltiplos projetos sociais integrados que promovem educação, saúde, inclusão e sustentabilidade em comunidades vulneráveis.',
            content: `
                <div class="grid-2 mb-4">
                    ${templates.component('card', {
                        title: 'Educar para o Futuro',
                        content: `
                            <p class="card-text">Reforço escolar, mentorias e apoio à permanência na escola.</p>
                            ${templates.component('badge', { text: 'Educação', type: 'primary' })}
                        `,
                        className: 'card-highlight'
                    })}
                    ${templates.component('card', {
                        title: 'Saúde e Bem-Estar',
                        content: `
                            <p class="card-text">Campanhas de prevenção, atendimentos básicos e orientação sobre saúde mental.</p>
                            ${templates.component('badge', { text: 'Saúde', type: 'success' })}
                        `,
                        className: 'card-highlight'
                    })}
                    ${templates.component('card', {
                        title: 'Inclusão e Trabalho',
                        content: `
                            <p class="card-text">Cursos profissionalizantes e encaminhamento para emprego.</p>
                            ${templates.component('badge', { text: 'Inclusão', type: 'warning' })}
                        `,
                        className: 'card-highlight'
                    })}
                    ${templates.component('card', {
                        title: 'Comunidade Sustentável',
                        content: `
                            <p class="card-text">Hortas urbanas, reciclagem e projetos de preservação ambiental.</p>
                            ${templates.component('badge', { text: 'Sustentabilidade', type: 'info' })}
                        `,
                        className: 'card-highlight'
                    })}
                </div>
                <p class="text-center mb-4">Atuamos com voluntários, parceiros e doadores para ampliar nosso alcance e garantir impactos duradouros.</p>
                <div class="d-flex gap-3 justify-center flex-wrap">
                    ${templates.component('button', { text: 'Veja nossos projetos', href: '/projetos', type: 'primary', size: 'lg' })}
                    ${templates.component('button', { text: 'Quero ser voluntário', href: '/cadastro', type: 'outline', size: 'lg' })}
                </div>
            `
        })}
    `;
});

/**
 * Template: Página de Projetos
 */
templates.register('projetos', (data = {}) => {
    const projetos = data.projetos || [
        {
            title: 'Educar para o Futuro',
            description: 'Oferecemos reforço escolar, mentorias e apoio à permanência na escola para crianças e jovens em situação de vulnerabilidade.',
            image: 'assets/images/projeto-educacao.jpg',
            badge: { text: 'Educação', type: 'primary' }
        },
        {
            title: 'Saúde e Bem-Estar',
            description: 'Realizamos campanhas de prevenção, atendimentos básicos e orientação sobre saúde mental para a comunidade.',
            image: 'assets/images/projeto-saude.jpg',
            badge: { text: 'Saúde', type: 'success' }
        },
        {
            title: 'Inclusão e Trabalho',
            description: 'Promovemos cursos profissionalizantes e encaminhamento para emprego, ajudando pessoas a conquistarem sua independência.',
            image: 'assets/images/projeto-inclusao.jpg',
            badge: { text: 'Inclusão', type: 'warning' }
        },
        {
            title: 'Comunidade Sustentável',
            description: 'Desenvolvemos hortas urbanas, reciclagem e projetos de preservação ambiental em parceria com a comunidade.',
            image: 'assets/images/projeto-sustentavel.jpg',
            badge: { text: 'Sustentabilidade', type: 'info' }
        }
    ];
    
    return `
        ${templates.component('section', {
            title: 'Nossos Projetos',
            subtitle: 'Conheça os projetos que desenvolvemos para transformar vidas e fortalecer comunidades.',
            content: ''
        })}
        
        <section class="section" style="padding-top: 0;">
            <div class="container">
                <div class="grid-2 mb-6">
                    ${projetos.map(projeto => templates.component('projectCard', projeto)).join('')}
                </div>
            </div>
        </section>
        
        <section class="section text-center" style="background-color: var(--color-ice-white); padding: var(--space-6);">
            <div class="container">
                <h2>Faça Parte</h2>
                <p class="text-lg mb-4">Quer contribuir com nossos projetos? Seja um voluntário ou apoiador.</p>
                ${templates.component('button', { text: 'Quero ser voluntário', href: '/cadastro', type: 'primary', size: 'lg' })}
            </div>
        </section>
    `;
});

// Exportar para uso global
window.Templates = templates;
