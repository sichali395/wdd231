/**
 * Kisyombe Village Heritage - Validation Report Page
 * External JavaScript file - NO INLINE SCRIPTS
 * WDD 231 Final Project
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
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
    }
});