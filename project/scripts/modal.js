// ES Module - Modal dialog functionality
export function initModal() {
    const modal = document.getElementById('heritage-modal');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');

    if (!modal) return;

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    function openModal() {
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Close on Escape key - KEYBOARD ACCESSIBILITY
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    return {
        closeModal,
        openModal
    };
}