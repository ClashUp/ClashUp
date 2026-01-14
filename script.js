// ===== DOM Elements =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.stat-number');
const sliderWrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.screenshot-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

// ===== Mobile Navigation =====
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Change icon
        const icon = hamburger.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
        
        // Add animation
        if (navMenu.classList.contains('active')) {
            navMenu.style.animation = 'slideInUp 0.3s ease';
        }
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.replace('fa-times', 'fa-bars');
    });
});

// ===== Scroll Reveal Animation =====
function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
            
            // Add sequential delay for child elements
            const children = element.querySelectorAll('.card-3d, .stat-item, .feature-item');
            children.forEach((child, index) => {
                child.style.transitionDelay = `${index * 0.1}s`;
            });
        }
    });
}

// Initial check on load
checkReveal();

// Check on scroll
window.addEventListener('scroll', checkReveal);

// ===== Counter Animation =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    return num.toLocaleString();
}

// Start counter when element is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            if (!counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        }
    });
}, {
    threshold: 0.5
});

counters.forEach(counter => {
    observer.observe(counter);
});

// ===== Screenshot Slider =====
let currentSlide = 0;
let slideInterval;

function initSlider() {
    if (!sliderWrapper || !slides.length) return;
    
    // Create dots if they don't exist
    const dotsContainer = document.querySelector('.slider-dots');
    if (dotsContainer && !dotsContainer.innerHTML.trim()) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    updateDots();
    startAutoSlide();
}

function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    updateSlider();
    resetAutoSlide();
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function updateSlider() {
    const offset = -currentSlide * 100;
    sliderWrapper.style.transform = `translateX(${offset}%)`;
    updateDots();
    
    // Add 3D effect to active slide
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.style.transform = 'translateZ(20px)';
            slide.style.opacity = '1';
        } else {
            slide.style.transform = 'translateZ(0)';
            slide.style.opacity = '0.7';
        }
    });
}

function updateDots() {
    const allDots = document.querySelectorAll('.dot');
    allDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// ===== Button Click Effects =====
const buttons = document.querySelectorAll('.btn-3d');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Cursor Effects =====
if (cursorDot && cursorRing) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        
        requestAnimationFrame(animateRing);
    }
    
    animateRing();
    
    // Interactive elements cursor effect
    const interactiveElements = document.querySelectorAll('a, button, .card-3d');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorRing.style.borderColor = 'var(--accent-color)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.borderColor = 'var(--secondary-color)';
        });
    });
}

// ===== Parallax Effect =====
const parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
        const rate = element.getAttribute('data-rate') || 0.5;
        const offset = scrolled * rate;
        element.style.transform = `translateY(${offset}px)`;
    });
});

// ===== 3D Hover Effects =====
const cards3D = document.querySelectorAll('.card-3d');
cards3D.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 10;
            const rotateX = ((centerY - y) / centerY) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        }
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Highlight section
            targetElement.classList.add('section-highlight');
            setTimeout(() => {
                targetElement.classList.remove('section-highlight');
            }, 1000);
            
            // Smooth scroll
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        }
    });
});

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Initialize slider
    initSlider();
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn-3d');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(2px)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-5px) rotateX(10deg)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) rotateX(0)';
        });
    });
    
    // Add section highlight animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlight {
            0% { background-color: transparent; }
            50% { background-color: rgba(91, 33, 182, 0.1); }
            100% { background-color: transparent; }
        }
        .section-highlight {
            animation: highlight 1s ease;
        }
    `;
    document.head.appendChild(style);
});

// ===== Window Load Event =====
window.addEventListener('load', () => {
    // Force reveal check on load
    checkReveal();
    
    // Add loaded class to body for transition effects
    document.body.classList.add('loaded');
    
    // Initialize any lazy loaded images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});

// ===== Window Resize Handler =====
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resizing');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resizing');
        checkReveal();
    }, 250);
});
