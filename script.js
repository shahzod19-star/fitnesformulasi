/* ===================================================
   FITNESS FORMULA — Mobile Optimized JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Elements ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');

    // ---- Mobile Drawer Toggle Functions ----
    function openMobileMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('open');
        if (navBackdrop) navBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        if (navBackdrop) navBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link, .mobile-menu-cta a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ---- Navbar & Scroll State ----
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Navbar sticky glassmorphism
                if (scrollY > 40) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Back to top
                if (scrollY > 400) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }

                // Active nav item
                updateActiveNavLink(scrollY);

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function updateActiveNavLink(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ---- Counter Animation ----
    let animatedCounters = false;

    function animateCounters() {
        if (animatedCounters) return;
        animatedCounters = true;

        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target)) return;

            const duration = 1600;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuad
                const current = Math.floor(progress * (2 - progress) * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    // Observe stats section for animation
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    } else {
        animateCounters();
    }

    // ---- Particle Light Sparks (lightweight for mobile) ----
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        // fewer particles on mobile for 60fps performance
        const count = window.innerWidth < 768 ? 14 : 25;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 2.5 + 1.2;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(29, 161, 242, ${Math.random() * 0.35 + 0.15});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 5 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 3}s;
                pointer-events: none;
            `;
            container.appendChild(particle);
        }
    }
    createParticles();

    // ---- Smooth Anchor Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = 65;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementPosition - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Contact Form Handler ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const goal = document.getElementById('goal').value;
            const message = document.getElementById('message').value.trim();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-check"></i> QABUL QILINDI!';
            submitBtn.style.background = '#00C853';

            // Telegram or call link
            const telegramMsg = `Salom! Fitnes Formulasi dasturiga yozilmoqchiman:%0A%0A👤 Ism: ${encodeURIComponent(name)}%0A📞 Tel: ${encodeURIComponent(phone)}%0A🎯 Maqsad: ${encodeURIComponent(goal)}%0A💬 Xabar: ${encodeURIComponent(message || 'Yo\'q')}`;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                contactForm.reset();

                // Open Telegram chat with direct pre-filled message
                window.open(`https://t.me/fitnessformulasi?text=${telegramMsg}`, '_blank');
            }, 1200);
        });
    }

    // Try playing video safely on mobile
    const video = document.querySelector('.hero-logo-video');
    if (video) {
        video.muted = true;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay was prevented (e.g. low power mode)
            });
        }
    }
});
