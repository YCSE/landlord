/**
 * 땅주인찾기 - Land Owner Finding Service
 * Main JavaScript
 */

(function() {
    'use strict';

    // === DOM Elements ===
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const reveals = document.querySelectorAll('.reveal');
    const faqItems = document.querySelectorAll('.faq-item');

    // === Header Scroll Effect ===
    let lastScroll = 0;
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    // Throttle scroll handler
    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // === Mobile Menu Toggle ===
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Intersection Observer for Reveal Animations ===
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    reveals.forEach(el => {
        revealObserver.observe(el);
    });

    // === FAQ Accordion ===
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');

        summary.addEventListener('click', function(e) {
            // Optional: Close other FAQ items when opening one
            // Uncomment if you want single-open behavior
            /*
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.hasAttribute('open')) {
                    otherItem.removeAttribute('open');
                }
            });
            */
        });
    });

    // === Parallax Effect for Hero (subtle, throttled) ===
    const heroImage = document.getElementById('heroImage');

    if (heroImage && window.matchMedia('(min-width: 768px)').matches) {
        let parallaxTicking = false;
        window.addEventListener('scroll', function() {
            if (!parallaxTicking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset;
                    const heroHeight = document.querySelector('.hero').offsetHeight;
                    if (scrolled < heroHeight) {
                        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
                    }
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        });
    }

    // === Active Navigation Link ===
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // === Phone Number Click Tracking (optional analytics) ===
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks (for analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    event_category: 'Contact',
                    event_label: 'Phone Call'
                });
            }
            console.log('Phone call initiated');
        });
    });

    // === CTA Button Interaction ===
    const ctaButtons = document.querySelectorAll('.btn');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // === Console Welcome Message ===
    console.log('%c땅주인찾기', 'font-size: 24px; font-weight: bold; color: #1a3a2f;');
    console.log('%c토지 소유자 조회 전문 서비스', 'font-size: 14px; color: #5a5a5a;');
    console.log('%c문의: 010-4679-6613', 'font-size: 12px; color: #c9a227;');

    // === Initialize ===
    function init() {
        // Initial header state check
        handleScroll();

        // Initial nav link highlight
        highlightNavLink();

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.scrollBehavior = 'auto';
            reveals.forEach(el => el.classList.add('visible'));
        }
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
