// scripts/main.js - Common functionality

document.addEventListener('DOMContentLoaded', function () {
    // Set current year
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Set last modified date
    const lastModified = document.getElementById('last-modified');
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }

    // Mobile menu functionality - FIXED
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        // Create overlay for mobile menu
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        // Toggle menu function
        function toggleMenu() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        }

        // Menu toggle click
        menuToggle.addEventListener('click', toggleMenu);

        // Overlay click to close
        overlay.addEventListener('click', toggleMenu);

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth < 768) {
                    toggleMenu();
                }
            });
        });

        // Close menu on window resize to desktop
        function handleResize() {
            if (window.innerWidth >= 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Debounced resize handler
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 250);
        });
    }

    // Add loading="lazy" to images for performance
    document.addEventListener('DOMContentLoaded', function () {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    });

    // Performance: Preload critical images
    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    // Preload important images if needed
    const criticalImages = [
        'images/business-conference.jpg',
        'images/logo.jpg'
    ];

    // Only preload on good connections
    if (navigator.connection && navigator.connection.saveData === false) {
        criticalImages.forEach(preloadImage);
    }
});