/**
 * O MESTRE DE OBRAS (Evento Principal)
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. INICIALIZAÇÃO E CACHE DE ELEMENTOS
    const langBtn = document.getElementById('language-toggle');
    
    initScrollAnimations();
    initAccordions();
    initLanguageSystem(langBtn);
    
    // 2. VERIFICAÇÃO DE IDIOMA SALVO
    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    
    if (langBtn) {
        langBtn.innerHTML = savedLang === 'pt' ? 'PT-BR' : 'EN-US';
        changeLanguage(savedLang);
    }


    // --- FUNÇÃO 1: ANIMAÇÕES AO ROLAR A TELA ---
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add(el.dataset.animation);
                    el.classList.remove('hiddenScroll');
                }
            });
        }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

        document.querySelectorAll('[data-animation]').forEach(el => observer.observe(el));
    }


    // --- FUNÇÃO 2: LÓGICA DO ACORDEÃO ---
    function initAccordions() {
        const accordionHeaders = document.querySelectorAll('.subject-card .set');

        const updateHeight = (card) => {
            const content = card.querySelector('.content');
            content.style.maxHeight = card.classList.contains('active') 
                ? `${content.scrollHeight + 60}px` 
                : '0';
        };

        const toggleAccordion = (header) => {
            const card = header.closest('.subject-card');
            const isActive = card.classList.contains('active');

            // Fecha outros acordeões e reseta animações internas
            document.querySelectorAll('.subject-card').forEach(item => {
                if (item !== card) {
                    item.classList.remove('active');
                    item.querySelector('.content').style.maxHeight = '0';
                    
                    item.querySelectorAll('.content [data-animation]').forEach(el => {
                        el.classList.remove(el.dataset.animation);
                        el.classList.add('hiddenScroll');
                    });
                }
            });

            card.classList.toggle('active', !isActive);
            updateHeight(card);
        };

        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => toggleAccordion(header));
        });

        window.addEventListener('resize', () => {
            const activeCard = document.querySelector('.subject-card.active');
            if (activeCard) updateHeight(activeCard);
        });
    }


    // --- FUNÇÃO 3: SISTEMA DE IDIOMA ---
    function initLanguageSystem(btn) {
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isEn = btn.innerHTML.trim() === 'EN-US';
            const newLang = isEn ? 'pt' : 'en';
            
            btn.innerHTML = isEn ? 'PT-BR' : 'EN-US';
            changeLanguage(newLang);
        });
    }
});


/**
 * FUNÇÃO GLOBAL DE TRADUÇÃO
 */
async function changeLanguage(lang) {
    try {
        const response = await fetch(`../../i18n/home/${lang}.json`);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        
        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });

        localStorage.setItem('preferred-lang', lang);

    } catch (error) {
        console.error("Falha na tradução:", error);
    }
}