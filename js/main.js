/**
 * foRPro - Main JavaScript
 * Smooth animations and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initHeader();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    initFormValidation();
});

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                const menuToggle = document.querySelector('.menu-toggle');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = [
        { selector: '.section-header', class: 'fade-in' },
        { selector: '.problem-card', class: 'fade-in' },
        { selector: '.about-text', class: 'slide-in-left' },
        { selector: '.about-image', class: 'slide-in-right' },
        { selector: '.feature-card', class: 'fade-in' },
        { selector: '.service-card', class: 'fade-in' },
        { selector: '.case-card', class: 'fade-in' },
        { selector: '.consultant-card', class: 'fade-in' },
        { selector: '.flow-step', class: 'fade-in' },
        { selector: '.contact-info', class: 'slide-in-left' },
        { selector: '.contact-form', class: 'slide-in-right' }
    ];

    animatedElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach((el, index) => {
            el.classList.add(item.class);
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;

    if (!menuToggle || !nav) return;

    // Create mobile nav container
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = nav.innerHTML;
    document.body.appendChild(mobileNav);

    // Add styles for mobile nav
    const style = document.createElement('style');
    style.textContent = `
        .mobile-nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 320px;
            height: 100vh;
            background-color: #fff;
            padding: 80px 2rem 2rem;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease;
            z-index: 999;
            overflow-y: auto;
        }

        .mobile-nav.active {
            right: 0;
        }

        .mobile-nav .nav-list {
            flex-direction: column;
            gap: 0;
        }

        .mobile-nav .nav-list li {
            border-bottom: 1px solid #E5E0D8;
        }

        .mobile-nav .nav-list a {
            display: block;
            padding: 1rem 0;
            font-size: 1rem;
        }

        .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 998;
        }

        .mobile-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }

        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close on overlay click
    overlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
}

/**
 * Form validation
 */
function initFormValidation() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            // Remove previous error state
            field.classList.remove('error');

            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                }
            }

            // Checkbox validation
            if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                field.classList.add('error');
            }
        });

        if (isValid) {
            // Show success message (in real implementation, this would send the form)
            showFormMessage('送信が完了しました。担当者より1営業日以内にご連絡いたします。', 'success');
            form.reset();
        } else {
            showFormMessage('必須項目を入力してください。', 'error');
        }
    });

    // Add error styles
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
        .contact-form input.error,
        .contact-form select.error,
        .contact-form textarea.error {
            border-color: #C85A5A;
        }

        .form-message {
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.9375rem;
        }

        .form-message.success {
            background-color: #E8F5E9;
            color: #2E7D32;
        }

        .form-message.error {
            background-color: #FFEBEE;
            color: #C62828;
        }
    `;
    document.head.appendChild(errorStyle);
}

/**
 * Show form message
 */
function showFormMessage(message, type) {
    const form = document.querySelector('.contact-form');

    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;

    // Insert at top of form
    form.insertBefore(messageEl, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

/**
 * Counter animation for stats
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    updateCounter();
}

// Initialize counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/,/g, ''));
                if (!isNaN(target)) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});
