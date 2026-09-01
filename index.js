/* ============================================================
   ALB — Aliança Liberal Brasileira (projeto escolar fictício)
   script.js — JavaScript puro (sem frameworks)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ========== MENU HAMBÚRGUER (MOBILE) ========== */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBackdrop = document.getElementById('menuBackdrop');

    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        menuBackdrop.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuBackdrop.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
        });

        menuBackdrop.addEventListener('click', closeMenu);

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
                hamburger.focus();
            }
        });
    }

    /* ========== EFEITO DE ROLAGEM NO CABEÇALHO ========== */
    const header = document.getElementById('header');

    function handleHeaderScroll() {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ========== LINK ATIVO CONFORME A SEÇÃO VISÍVEL ========== */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* ========== ROLAGEM SUAVE COM COMPENSAÇÃO DO CABEÇALHO ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
                window.scrollTo({ top: targetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    });

    /* ========== ACCORDION DE PROPOSTAS ========== */
    const proposalCards = document.querySelectorAll('.proposal-card');
    proposalCards.forEach(card => {
        const trigger = card.querySelector('.proposal-trigger');
        trigger.addEventListener('click', () => {
            const isOpen = card.classList.contains('open');

            // Fecha os demais cards para manter o foco em uma proposta por vez
            proposalCards.forEach(other => {
                if (other !== card) {
                    other.classList.remove('open');
                    other.querySelector('.proposal-trigger').setAttribute('aria-expanded', 'false');
                }
            });

            card.classList.toggle('open', !isOpen);
            trigger.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    /* ========== CONTADORES ANIMADOS (metas/indicadores fictícios) ========== */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (prefersReducedMotion) {
            el.textContent = target.toLocaleString('pt-BR');
            return;
        }
        const duration = 1400;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('pt-BR');
        }
        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    /* ========== ANIMAÇÕES AO ENTRAR NA VIEWPORT ========== */
    const revealTargets = document.querySelectorAll(
        '.animate-on-scroll, .proposal-card, .project-card, .news-card, .gallery-item, .care-card, .indicator-card'
    );
    revealTargets.forEach(el => el.classList.add('animate-on-scroll'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => revealObserver.observe(el));

    /* ========== BOTÃO VOLTAR AO TOPO ========== */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* ========== LIGHTBOX DA GALERIA ========== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentIndex = 0;
    const galleryData = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        galleryData.push({ src: img.src, alt: img.alt, caption: caption ? caption.textContent : '' });

        function openThisItem() {
            currentIndex = index;
            openLightbox(currentIndex);
        }

        item.addEventListener('click', openThisItem);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openThisItem();
            }
        });
    });

    function openLightbox(index) {
        if (!lightbox) return;
        lightboxImg.src = galleryData[index].src;
        lightboxImg.alt = galleryData[index].alt;
        lightboxCaption.textContent = galleryData[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);

        lightboxPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            openLightbox(currentIndex);
        });

        lightboxNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryData.length;
            openLightbox(currentIndex);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        });
    }

    /* ========== VALIDAÇÃO DE FORMULÁRIOS ========== */
    function validateField(field) {
        const group = field.closest('.form-group');
        if (!group) return true;
        let valid = field.checkValidity();

        // Validação adicional simples de e-mail (o navegador já cobre o básico)
        if (field.type === 'email' && field.value.trim() !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            valid = valid && emailPattern.test(field.value.trim());
        }

        group.classList.toggle('invalid', !valid);
        return valid;
    }

    function setupFormValidation(formId, statusId, onValidSubmit) {
        const form = document.getElementById(formId);
        if (!form) return;
        const status = document.getElementById(statusId);
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.closest('.form-group').classList.contains('invalid')) {
                    validateField(field);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let formIsValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) formIsValid = false;
            });

            const termos = form.querySelector('#termos');
            if (termos && !termos.checked) formIsValid = false;

            if (!formIsValid) {
                if (status) {
                    status.textContent = 'Por favor, corrija os campos destacados antes de enviar.';
                    status.classList.add('visible');
                    status.classList.remove('success');
                }
                const firstInvalid = form.querySelector('.form-group.invalid input, .form-group.invalid textarea');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            if (status) {
                status.classList.remove('visible');
            }
            onValidSubmit(form, status);
        });
    }

    setupFormValidation('joinForm', 'joinStatus', (form) => {
        form.style.display = 'none';
        const success = document.getElementById('joinSuccess');
        if (success) success.style.display = 'flex';
    });

    setupFormValidation('contactForm', 'contactStatus', (form, status) => {
        if (status) {
            status.textContent = 'Mensagem enviada! (envio simulado — nenhum dado foi transmitido.)';
            status.classList.add('visible', 'success');
        }
        form.reset();
    });

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input && input.checkValidity()) {
                input.value = 'Inscrição simulada ✓';
                input.disabled = true;
            }
        });
    }

    /* ========== BANNER DE COOKIES ========== */
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');

    if (cookieBanner && !sessionStorage.getItem('albCookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1500);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            sessionStorage.setItem('albCookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

});