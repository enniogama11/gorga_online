/* ===========================
   FUTURISTIC ANIMATIONS & PARALLAX
   =========================== */

// ===== PRELOADER =====
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1200);
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) {
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });
});

// ===== CINEMATIC HEADER SCROLL EFFECT =====
const header = document.querySelector('header');
let lastScrollY = 0;
let ticking = false;

function updateHeaderOnScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Parallax effect for header
    const parallaxAmount = scrollY * 0.5;
    
    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeaderOnScroll);
        ticking = true;
    }
}, { passive: true });

// ===== ACTIVE NAVIGATION LINK =====
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== BACK TO TOP BUTTON =====
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            const shouldShow = filter === 'all' || item.getAttribute('data-category') === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== PORTFOLIO MODAL/LIGHTBOX =====
const modal = document.getElementById('portfolioModal');
const modalImg = document.querySelector('.modal-img');
const modalTitle = document.querySelector('.modal-info h3');
const modalDesc = document.querySelector('.modal-info p');
const modalClose = document.querySelector('.modal-close');

portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('.portfolio-img').getAttribute('src');
        const title = item.querySelector('.portfolio-overlay h3').textContent;
        const desc = item.querySelector('.portfolio-overlay p').textContent;
        
        if (modalImg && modalTitle && modalDesc) {
            modalImg.setAttribute('src', imgSrc);
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });
});

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});

// ===== PARALLAX EFFECT ON SECTIONS =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.scrollY;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            const parallaxValue = distance * 0.5;
            
            if (Math.abs(distance) < window.innerHeight * 1.5) {
                element.style.transform = `translateY(${parallaxValue}px)`;
            }
        });
    }, { passive: true });
}

initParallax();

// ===== MOUSE FOLLOW EFFECT FOR CARDS =====
function initMouseFollowEffect() {
    const cards = document.querySelectorAll('.service-card, .team-member, .contact-info, .contact-form');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

initMouseFollowEffect();

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add loading animation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===== DYNAMIC GLOW EFFECT =====
function initGlowEffect() {
    const glowElements = document.querySelectorAll('[data-glow]');
    
    glowElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--glow-x', `${x}px`);
            element.style.setProperty('--glow-y', `${y}px`);
        });
    });
}

initGlowEffect();

// ===== STAGGER ANIMATION ON LOAD =====
function staggerAnimateElements() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach((element, index) => {
        const delay = index * 0.1;
        element.style.animationDelay = `${delay}s`;
    });
}

staggerAnimateElements();

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('appear');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ===== NEON GLOW ANIMATION ON HOVER =====
function initNeonGlow() {
    const neonElements = document.querySelectorAll('.btn, .service-icon, .social-links a');
    
    neonElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'neon-pulse 0.6s ease-out';
        });
    });
}

// Add neon pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes neon-pulse {
        0% {
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }
        50% {
            box-shadow: 0 0 30px rgba(0, 217, 255, 0.8), 0 0 50px rgba(199, 0, 255, 0.5);
        }
        100% {
            box-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
        }
    }
    
    @keyframes float-animation {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .floating {
        animation: float-animation 3s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

initNeonGlow();

// ===== PORTFOLIO ITEM TRANSITIONS =====
portfolioItems.forEach(item => {
    item.style.opacity = '1';
    item.style.transform = 'scale(1)';
    item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
});

// ===== CURSOR EFFECT (Optional - Premium feel) =====
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(0, 217, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .team-member');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = (e.clientX - 10) + 'px';
        cursor.style.top = (e.clientY - 10) + 'px';
        cursor.style.display = 'block';
    });
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.borderColor = 'rgba(0, 217, 255, 0.8)';
            cursor.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.6)';
            cursor.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.borderColor = 'rgba(0, 217, 255, 0.5)';
            cursor.style.boxShadow = 'none';
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Uncomment to enable custom cursor
// initCursorEffect();

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
});

// ===== ACCESSIBILITY: FOCUS MANAGEMENT =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Futuristic design loaded successfully!');
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize effects on resize if needed
        initMouseFollowEffect();
    }, 250);
});
