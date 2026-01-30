// scripts/main.js - Main site functionality

document.addEventListener('DOMContentLoaded', function () {
    // Navigation menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }

    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Update last modified date
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }

    // Initialize skip link focus
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                setTimeout(() => {
                    target.removeAttribute('tabindex');
                }, 1000);
            }
        });
    }
});