/**
 * Kisyombe Village Heritage - MODAL DIALOG MODULE
 * WDD 231 Final Project
 * COMPLETE ACCESSIBLE MODAL with keyboard navigation, focus trapping, ARIA attributes
 */

export function initModal() {
    const modal = document.getElementById('heritageModal');
    const closeBtn = document.querySelector('.modal-close-btn');
    const overlay = document.querySelector('.modal-overlay');

    if (!modal) {
        console.warn('Modal element not found');
        return { openModal: () => { }, closeModal: () => { } };
    }

    // Store last focused element before modal opens
    let lastFocusedElement = null;

    // Focusable elements within modal for tab trapping
    const getFocusableElements = () => {
        return modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    };

    // Trap focus inside modal
    const trapFocus = (e) => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab: If on first element, go to last
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab: If on last element, go to first
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    };

    function openModal() {
        console.log('Opening modal');

        // Store current focused element
        lastFocusedElement = document.activeElement;

        // Show modal
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Set focus to close button (first focusable element)
        setTimeout(() => {
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }, 100);

        // Add event listeners for focus trapping
        document.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        console.log('Closing modal');

        // Hide modal
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        // Remove focus trapping
        document.removeEventListener('keydown', trapFocus);

        // Return focus to element that opened modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // Event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    // Prevent clicks inside modal from closing it
    const modalContainer = modal.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    return {
        openModal,
        closeModal
    };
}