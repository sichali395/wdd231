// scripts/join.js - Join page functionality

document.addEventListener('DOMContentLoaded', function () {
    // Set timestamp in hidden field
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }

    // Form validation
    const form = document.getElementById('membership-form');
    if (form) {
        setupFormValidation(form);
    }

    // Modal functionality
    setupModals();

    // Animation for membership cards
    animateMembershipCards();
});

function setupFormValidation(form) {
    const titleField = form.querySelector('#title');
    const emailField = form.querySelector('#email');

    // Real-time validation
    if (titleField) {
        titleField.addEventListener('input', () => validateTitleField(titleField));
        titleField.addEventListener('blur', () => validateTitleField(titleField));
    }

    if (emailField) {
        emailField.addEventListener('input', () => validateEmailField(emailField));
        emailField.addEventListener('blur', () => validateEmailField(emailField));
    }

    // Form submission
    form.addEventListener('submit', function (event) {
        if (!validateForm(form)) {
            event.preventDefault();
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                const input = firstError.closest('.form-group').querySelector('input, select, textarea');
                if (input) input.focus();
            }
        }
    });

    // Clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function () {
            const errorSpan = this.closest('.form-group')?.querySelector('.error-message');
            if (errorSpan) errorSpan.textContent = '';
        });
    });
}

function validateTitleField(field) {
    const errorSpan = field.closest('.form-group')?.querySelector('.error-message');
    if (!errorSpan) return true;

    const value = field.value.trim();
    if (value === '') {
        errorSpan.textContent = '';
        return true;
    }

    const pattern = field.getAttribute('pattern');
    if (pattern && !new RegExp(pattern).test(value)) {
        errorSpan.textContent = 'Title must be at least 7 characters and contain only letters, hyphens, and spaces.';
        return false;
    }

    errorSpan.textContent = '';
    return true;
}

function validateEmailField(field) {
    const errorSpan = field.closest('.form-group')?.querySelector('.error-message');
    if (!errorSpan) return true;

    const value = field.value.trim();
    if (value === '') {
        if (field.required) {
            errorSpan.textContent = 'Email address is required.';
            return false;
        }
        errorSpan.textContent = '';
        return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        errorSpan.textContent = 'Please enter a valid email address.';
        return false;
    }

    errorSpan.textContent = '';
    return true;
}

function validateForm(form) {
    let isValid = true;

    // Required fields
    form.querySelectorAll('[required]').forEach(field => {
        const errorSpan = field.closest('.form-group')?.querySelector('.error-message');
        if (!errorSpan) return;

        if (!field.value.trim()) {
            errorSpan.textContent = 'This field is required.';
            isValid = false;
        } else {
            errorSpan.textContent = '';
        }
    });

    // Validate specific fields
    const titleField = form.querySelector('#title');
    if (titleField && titleField.value.trim() && !validateTitleField(titleField)) {
        isValid = false;
    }

    const emailField = form.querySelector('#email');
    if (emailField && !validateEmailField(emailField)) {
        isValid = false;
    }

    return isValid;
}

function setupModals() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modals = document.querySelectorAll('.modal');

    // Open modal
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) openModal(modal, modalOverlay);
        });
    });

    // Close modal
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal, modalOverlay);
        });
    });

    // Close with overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) closeModal(activeModal, modalOverlay);
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) closeModal(activeModal, modalOverlay);
        }
    });
}

function openModal(modal, overlay) {
    if (!modal || !overlay) return;

    modal.style.display = 'block';
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus trap
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function closeModal(modal, overlay) {
    if (!modal || !overlay) return;

    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function animateMembershipCards() {
    // Cards are animated with CSS only
    // This function is kept for future enhancements
}