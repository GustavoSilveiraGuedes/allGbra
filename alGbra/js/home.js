/**
 * O MESTRE DE OBRAS (Evento Principal)
 */
document.addEventListener('DOMContentLoaded', () => {

    const langBtn = document.getElementById('language-toggle');

    initScrollAnimations();
    initAccordions();
    initLanguageSystem(langBtn);

    const savedLang = localStorage.getItem('preferred-lang') || 'en';

    if (langBtn) {
        langBtn.innerHTML = savedLang === 'pt' ? 'PT-BR' : 'EN-US';
        changeLanguage(savedLang);
    }

    /* ------------------------------
       ANIMAÇÕES AO SCROLL (ÚNICO DONO)
    ------------------------------ */
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
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
            .forEach(el => observer.observe(el));
    }

    /* ------------------------------
       ACORDEÕES (SEM FORÇAR ANIMAÇÃO)
    ------------------------------ */
    function initAccordions() {
        const headers = document.querySelectorAll('.subject-card .set');

        const updateHeight = (card) => {
            const content = card.querySelector('.content');
            content.style.maxHeight = card.classList.contains('active')
                ? `${content.scrollHeight}px`
                : '0';
        };

        const resetAnimations = (card) => {
            card.querySelectorAll('.content [data-animation]').forEach(el => {
                el.classList.remove(el.dataset.animation);
                el.classList.add('hiddenScroll');
                void el.offsetWidth; // força reflow
            });
        };

        const toggleAccordion = (header) => {
            const card = header.closest('.subject-card');
            const isActive = card.classList.contains('active');

            document.querySelectorAll('.subject-card').forEach(item => {
                if (item !== card) {
                    item.classList.remove('active');
                    item.querySelector('.content').style.maxHeight = '0';
                    resetAnimations(item);
                }
            });

            if (isActive) {
                card.classList.remove('active');
                card.querySelector('.content').style.maxHeight = '0';
                resetAnimations(card);
                return;
            }

            card.classList.add('active');
            updateHeight(card);
            // ❌ NÃO força animação aqui
        };

        headers.forEach(header => {
            header.addEventListener('click', () => toggleAccordion(header));
        });

        window.addEventListener('resize', () => {
            const active = document.querySelector('.subject-card.active');
            if (active) updateHeight(active);
        });
    }

    /* ------------------------------
       SISTEMA DE IDIOMA
    ------------------------------ */
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

/* ------------------------------
   FUNÇÃO GLOBAL DE TRADUÇÃO
------------------------------ */
async function changeLanguage(lang) {
    try {
        const response = await fetch(`i18n/home/${lang}.json`);
        if (!response.ok) throw new Error(response.statusText);

        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });

        localStorage.setItem('preferred-lang', lang);

    } catch (error) {
        console.error('Falha na tradução:', error);
    }
}
