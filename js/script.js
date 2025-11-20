    // Preloader
        window.addEventListener('load', function() {
            const preloader = document.getElementById('preloader');
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });

        // Mobile Menu Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            });
        });

        // Active Navigation Link
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
            // Header scroll effect
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Back to top button
            const backToTop = document.querySelector('.back-to-top');
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Portfolio Filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Portfolio Modal/Lightbox
        const portfolioItemsAll = document.querySelectorAll('.portfolio-item');
        const modal = document.getElementById('portfolioModal');
        const modalImg = document.querySelector('.modal-img');
        const modalTitle = document.querySelector('.modal-info h3');
        const modalDesc = document.querySelector('.modal-info p');
        const modalClose = document.querySelector('.modal-close');
        
        portfolioItemsAll.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('.portfolio-img').getAttribute('src');
                const title = item.querySelector('.portfolio-overlay h3').textContent;
                const desc = item.querySelector('.portfolio-overlay p').textContent;
                
                modalImg.setAttribute('src', imgSrc);
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });
        
        modalClose.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        });

        // Scroll Animations
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });

        // Form Submission
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });

        // assets/js/main.js
(() => {
  'use strict';

  const SELECTOR = '.back-to-top';
  const SHOW_AFTER = 300;        // px de scroll para mostrar botão
  const SCROLL_DURATION = 600;   // ms para fallback de scroll suave

  const btn = document.querySelector(SELECTOR);
  if (!btn) return;

  // Accessibility: ensure role/aria exist
  if (!btn.hasAttribute('role')) btn.setAttribute('role', 'button');
  if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Voltar ao topo');

  // Performance-friendly scroll listener using rAF
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        toggleVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }

  function toggleVisibility() {
    const sc = window.scrollY || document.documentElement.scrollTop;
    if (sc > SHOW_AFTER) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  // Smooth scroll with fallback + respects reduced motion
  function scrollToTop(duration = SCROLL_DURATION) {
    // Respect user preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      return;
    }

    // Native smooth if available
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } catch (err) {
      // fallthrough to fallback
    }

    // Fallback: custom animation
    const start = performance.now();
    const initial = window.scrollY || document.documentElement.scrollTop;
    const delta = -initial;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(now) {
      const time = Math.min(1, (now - start) / duration);
      const eased = easeInOutCubic(time);
      const current = Math.round(initial + delta * eased);
      window.scrollTo(0, current);

      if (time < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Click & keyboard handlers
  function onClick(e) {
    e.preventDefault();
    scrollToTop();
    // return focus to body after animation (a11y)
    btn.blur();
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  }

  // Init
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', onClick);
  btn.addEventListener('keydown', onKey);

  // Show/hide on load (in case user reloads scrolled)
  toggleVisibility();

  // Optional: if site uses dynamic content that may change height,
  // expose a small API to re-run the visibility check:
  window.GORGA = window.GORGA || {};
  window.GORGA.backToTop = { refresh: toggleVisibility };

})();
