/* ═══════════════════════════════════════════════════════════
   Interactive Academic Site — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll Progress Bar ────────────────────────────────
    const progressBar = document.querySelector('.scroll-progress');
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = progress + '%';
    };

    // ── Active Nav Highlighting ────────────────────────────
    const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id], header[id], .hero[id]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 120;
        let current = '';
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollPos) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };

    // ── Back to Top Button ─────────────────────────────────
    const backBtn = document.querySelector('.back-to-top');
    const toggleBackToTop = () => {
        if (backBtn) {
            if (window.scrollY > 400) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        }
    };

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Combined scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                highlightNav();
                toggleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ── Scroll Reveal Animations ───────────────────────────
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // ── (Dark mode removed — light only) ─────────────────────

    // ── Mobile Hamburger Menu ──────────────────────────────
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.sidebar-nav');

    if (hamburger && navLinksContainer) {
        const setMenuOpen = (open) => {
            navLinksContainer.classList.toggle('open', open);
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', String(open));
        };

        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.addEventListener('click', () => {
            setMenuOpen(!navLinksContainer.classList.contains('open'));
        });

        // Close on link click or Escape
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        });
    }

    // ── Typing Animation ───────────────────────────────────
    const typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        const phrases = [
            '3D Shape Analysis',
            'Medical Image Analysis',
            '3D Human Vision & Graphics',
            'Visual AI Agent'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 80;

        function typeLoop() {
            const current = phrases[phraseIndex];
            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                delay = 40;
            } else {
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                delay = 80;
            }

            if (!isDeleting && charIndex === current.length) {
                delay = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
            }

            setTimeout(typeLoop, delay);
        }

        setTimeout(typeLoop, 1000);
    }

    // ── Publication Tabs ───────────────────────────────────
    const filterTabs = document.querySelectorAll('#publications .filter-tab');
    const pubPanels = document.querySelectorAll('#publications .pub-panel');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.toggle('active', t === tab));
            pubPanels.forEach(panel => {
                panel.hidden = panel.dataset.panel !== tab.dataset.panel;
            });
        });
    });

    // ── Blog Modal ─────────────────────────────────────────
    const blogCards = document.querySelectorAll('.blog-card[data-blog]');
    const blogOverlay = document.querySelector('.blog-expanded');
    const blogClose = document.querySelector('.blog-close');

    blogCards.forEach(card => {
        card.addEventListener('click', () => {
            const blogId = card.dataset.blog;
            const content = document.querySelector(`.blog-content-data[data-blog="${blogId}"]`);
            const inner = document.querySelector('.blog-expanded-inner');

            if (content && inner && blogOverlay) {
                const title = card.querySelector('h3').textContent;
                const meta = card.querySelector('.blog-card-meta').innerHTML;
                const body = content.innerHTML;

                inner.querySelector('h2').textContent = title;
                inner.querySelector('.blog-card-meta').innerHTML = meta;
                inner.querySelector('.blog-content').innerHTML = body;

                blogOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeBlog() {
        if (blogOverlay) {
            blogOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (blogClose) blogClose.addEventListener('click', closeBlog);
    if (blogOverlay) {
        blogOverlay.addEventListener('click', (e) => {
            if (e.target === blogOverlay) closeBlog();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeBlog();
    });

    // ── Smooth scroll for nav links ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Initial calls ──────────────────────────────────────
    updateProgress();
    highlightNav();
});
