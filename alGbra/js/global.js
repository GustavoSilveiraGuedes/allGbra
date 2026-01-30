/**
 * global.js
 * Funcionalidades globais do site:
 * - Sistema de idioma (i18n)
 * - Animações por IntersectionObserver
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       SISTEMA GLOBAL DE IDIOMA
    ===================================================== */

    const langBtn = document.getElementById('language-toggle');
    const savedLang = localStorage.getItem('preferred-lang') || 'en';

    if (langBtn) {
        // Estado inicial do botão
        langBtn.innerHTML = savedLang === 'pt' ? 'PT-BR' : 'EN-US';

        // Aplica idioma salvo
        changeLanguage(savedLang);

        // Alternar idioma
        langBtn.addEventListener('click', () => {
            const isEn = langBtn.innerHTML.trim() === 'EN-US';
            const newLang = isEn ? 'pt' : 'en';

            langBtn.innerHTML = isEn ? 'PT-BR' : 'EN-US';
            changeLanguage(newLang);
        });
    }

    /* =====================================================
       ANIMAÇÕES GLOBAIS (SCROLL)
    ===================================================== */

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.classList.remove('hiddenScroll');
            el.classList.add(el.dataset.animation);
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    document
        .querySelectorAll('[data-animation]')
        .forEach(el => animationObserver.observe(el));
});


/* =====================================================
   FUNÇÃO GLOBAL DE TRADUÇÃO
   (funciona em qualquer página)
===================================================== */

async function changeLanguage(lang) {
    try {
        const body = document.body;

        // Caminhos configuráveis pelo HTML
        const basePath = body.dataset.basePath ?? '.';
        const pagePath = body.dataset.i18nPath ?? 'home';

        const url = `${basePath}/i18n/${pagePath}/${lang}.json`
            .replace(/\/{2,}/g, '/');

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${url}`);
        }

        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const attr = el.dataset.i18nAttr;

            if (!translations[key]) return;

            // Se tiver atributo, aplica nele (placeholder, value, etc.)
            if (attr) {
                el.setAttribute(attr, translations[key]);
            } 
            // Senão, aplica como texto normal
            else {
                el.innerHTML = translations[key];
            }
        });

        localStorage.setItem('preferred-lang', lang);

    } catch (error) {
        console.error('Falha na tradução:', error);
    }
}
