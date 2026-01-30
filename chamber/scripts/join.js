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

// Form validation setup
function setupFormValidation(form) {
    const titleField = form.querySelector('#title');
    const emailField = form.querySelector('#email');

    // Real-time validation for title field
    if (titleField) {
        titleField.addEventListener('input', function () {
            validateTitleField(titleField);
        });

        titleField.addEventListener('blur', function () {
            validateTitleField(titleField);
        });
    }

    // Real-time validation for email field
    if (emailField) {
        emailField.addEventListener('input', function () {
            validateEmailField(emailField);
        });

        emailField.addEventListener('blur', function () {
            validateEmailField(emailField);
        });
    }

    // Form submission validation
    form.addEventListener('submit', function (event) {
        if (!validateForm(form)) {
            event.preventDefault();
            // Focus on first error
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                const input = firstError.closest('.form-group').querySelector('input, select, textarea');
                if (input) {
                    input.focus();
                }
            }
        }
    });

    // Clear error messages on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            const errorSpan = this.closest('.form-group').querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
    });
}

// Validate title field with pattern
function validateTitleField(field) {
    const errorSpan = field.closest('.form-group').querySelector('.error-message');
    const value = field.value.trim();

    if (value === '') {
        // Not required, so no error if empty
        errorSpan.textContent = '';
        return true;
    }

    // Check pattern
    const pattern = field.getAttribute('pattern');
    const regex = new RegExp(pattern);

    if (!regex.test(value)) {
        errorSpan.textContent = 'Title must be at least 7 characters and contain only letters, hyphens, and spaces.';
        return false;
    }

    errorSpan.textContent = '';
    return true;
}

// Validate email field
function validateEmailField(field) {
    const errorSpan = field.closest('.form-group').querySelector('.error-message');
    const value = field.value.trim();

    if (value === '') {
        if (field.required) {
            errorSpan.textContent = 'Email address is required.';
            return false;
        }
        errorSpan.textContent = '';
        return true;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        errorSpan.textContent = 'Please enter a valid email address.';
        return false;
    }

    errorSpan.textContent = '';
    return true;
}

// Validate entire form
function validateForm(form) {
    let isValid = true;

    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        const errorSpan = field.closest('.form-group').querySelector('.error-message');

        if (!field.value.trim()) {
            errorSpan.textContent = 'This field is required.';
            isValid = false;
        } else {
            errorSpan.textContent = '';
        }
    });

    // Validate title field if filled
    const titleField = form.querySelector('#title');
    if (titleField && titleField.value.trim()) {
        if (!validateTitleField(titleField)) {
            isValid = false;
        }
    }

    // Validate email field
    const emailField = form.querySelector('#email');
    if (emailField) {
        if (!validateEmailField(emailField)) {
            isValid = false;
        }
    }

    return isValid;
}

// Modal functionality
function setupModals() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modals = document.querySelectorAll('.modal');
    const detailButtons = document.querySelectorAll('.details-btn');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Open modal when details button is clicked
    detailButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);

            if (modal) {
                openModal(modal, modalOverlay);
            }
        });

        // Add keyboard support
        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);

                if (modal) {
                    openModal(modal, modalOverlay);
                }
            }
        });
    });

    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal, modalOverlay);
        });
    });

    // Close modal when overlay is clicked
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function () {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal, modalOverlay);
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal, modalOverlay);
            }
        }
    });

    // Trap focus within modal
    modals.forEach(modal => {
        modal.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        });
    });
}

function openModal(modal, overlay) {
    if (!modal || !overlay) return;

    modal.style.display = 'block';
    modal.classList.add('active');
    overlay.classList.add('active');

    // Set focus to first focusable element in modal
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    } else {
        modal.setAttribute('tabindex', '-1');
        modal.focus();
    }

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal(modal, overlay) {
    if (!modal || !overlay) return;

    modal.classList.remove('active');
    overlay.classList.remove('active');

    // Small delay before hiding to allow animation
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    // Restore body scrolling
    document.body.style.overflow = '';

    // Return focus to the button that opened the modal
    const activeButton = document.querySelector('.details-btn[aria-expanded="true"]');
    if (activeButton) {
        activeButton.focus();
        activeButton.removeAttribute('aria-expanded');
    }
}

// Animate membership cards on page load
function animateMembershipCards() {
    const cards = document.querySelectorAll('.membership-card');

    // Trigger animation after page load
    setTimeout(() => {
        cards.forEach(card => {
            card.style.animationPlayState = 'running';
        });
    }, 300);
}