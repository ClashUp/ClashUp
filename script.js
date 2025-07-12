document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle navigation menu on mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close nav menu when a link is clicked (for single-page navigation)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Simple "Show Password" toggle for the mockup (if you choose to use it in your screenshots section)
    const showPasswordSpan = document.querySelector('.show-password');
    const passwordInput = document.querySelector('.password-input input[type="password"]');

    if (showPasswordSpan && passwordInput) {
        showPasswordSpan.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                showPasswordSpan.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                showPasswordSpan.textContent = 'Show';
            }
        });
    }

    // --- Number Counting Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');
    let hasAnimated = false; // Flag to ensure animation runs only once

    const animateNumber = (element, target) => {
        let current = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 10); // Calculate increment for smoother animation

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString(); // Add .toLocaleString() for commas
        }, 10);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    animateNumber(num, target);
                });
                hasAnimated = true; // Set flag to true after animation
                observer.unobserve(statsSection); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the section is visible
    });

    if (statsSection) {
        observer.observe(statsSection);
    }

    // --- Screenshot Slider ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.screenshot-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;

    if (sliderWrapper && slides.length > 0 && sliderDotsContainer) {
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            sliderDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        const goToSlide = (index) => {
            if (index < 0) {
                currentIndex = slides.length - 1;
            } else if (index >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // Optional: Auto-slide
        // setInterval(() => {
        //     goToSlide(currentIndex + 1);
        // }, 5000); // Change slide every 5 seconds
    }
});
