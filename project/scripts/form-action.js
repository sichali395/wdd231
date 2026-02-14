/**
 * Kisyombe Village Heritage - Form Action Page
 * External JavaScript file
 * WDD 231 Final Project
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    console.log('Form action page loaded');

    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Get form data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const formDataContainer = document.getElementById('formData');

    if (formDataContainer) {
        if (urlParams.toString() && urlParams.toString() !== '') {
            let html = '';
            let hasData = false;

            for (const [key, value] of urlParams.entries()) {
                if (value && value.trim() !== '') {
                    hasData = true;
                    const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    html += `<div class="data-card"><h3>${label}</h3><p>${value}</p></div>`;
                }
            }

            formDataContainer.innerHTML = hasData ? html : '<p class="no-data">No form data received.</p>';
        } else {
            formDataContainer.innerHTML = '<p class="no-data">No form data received. Please submit the form from the home page.</p>';
        }
    }

    // Initialize navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
            this.setAttribute('aria-expanded', expanded);
            navMenu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('show');
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});