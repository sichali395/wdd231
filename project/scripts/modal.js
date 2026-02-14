/**
 * Kisyombe Village Heritage - MODAL DIALOG MODULE
 * WDD 231 Final Project
 * COMPLETE ACCESSIBLE MODAL with keyboard navigation, focus trapping, ARIA attributes
 */

export function initModal() {
    const modal = document.getElementById('heritageModal');
    const closeBtn = document.querySelector('.modal-close-btn');
    const overlay = document.querySelector('.modal-overlay');

    if (!modal) return;

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
        // Store current focused element
        lastFocusedElement = document.activeElement;

        // Show modal
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Set focus to first focusable element in modal
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

export function showModal(item) {
    const modal = document.getElementById('heritageModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    if (!modal || !modalBody) return;

    // Create modal content
    const categoryClass = item.category || 'practice';
    const categoryDisplay = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Heritage';

    modalBody.innerHTML = `
        <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" loading="lazy" width="600" height="400">
        
        <span class="modal-category-tag ${categoryClass}">${categoryDisplay}</span>
        
        <h3>${item.name}</h3>
        <p>${item.description || 'No description available.'}</p>
        
        <div class="modal-info-grid">
            ${item.location ? `
                <div class="modal-info-item">
                    <strong>📍 Location</strong>
                    <span>${item.location}</span>
                </div>
            ` : ''}
            
            ${item.era ? `
                <div class="modal-info-item">
                    <strong>⏱️ Era</strong>
                    <span>${item.era}</span>
                </div>
            ` : ''}
            
            ${item.clanAffiliation ? `
                <div class="modal-info-item">
                    <strong>🏷️ Clan</strong>
                    <span>${item.clanAffiliation}</span>
                </div>
            ` : ''}
            
            ${item.kyunguRelation ? `
                <div class="modal-info-item">
                    <strong>👑 Kyungu</strong>
                    <span>${item.kyunguRelation}</span>
                </div>
            ` : ''}
            
            ${item.significance ? `
                <div class="modal-info-item">
                    <strong>📜 Significance</strong>
                    <span>${item.significance}</span>
                </div>
            ` : ''}
            
            ${item.preservationStatus ? `
                <div class="modal-info-item">
                    <strong>🔮 Status</strong>
                    <span>${item.preservationStatus}</span>
                </div>
            ` : ''}
        </div>
        
        ${item.title ? `<p><strong>Title:</strong> ${item.title}</p>` : ''}
        ${item.descendants ? `<p><strong>Descendants:</strong> ${item.descendants}</p>` : ''}
    `;

    // Update modal title
    if (modalTitle) {
        modalTitle.textContent = item.name;
    }

    // Open modal
    const modalModule = initModal();
    modalModule.openModal();
}