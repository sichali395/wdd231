// scripts/discover.js - Discover page functionality

import discoverItems from '../data/discover.mjs' assert { type: 'json' };

document.addEventListener('DOMContentLoaded', function () {
    console.log('Discover page loaded');

    // Initialize localStorage for visit tracking
    initializeVisitTracking();

    // Load and display discover items
    loadDiscoverItems();

    // Setup close button for visitor message
    setupCloseButton();
});

// Initialize visit tracking with localStorage
function initializeVisitTracking() {
    const visitorText = document.getElementById('visitor-text');
    const visitorMessage = document.getElementById('visitor-message');

    if (!visitorText || !visitorMessage) return;

    // Get current visit timestamp
    const currentVisit = Date.now();
    const lastVisit = localStorage.getItem('karongaLastVisit');

    // Store current visit for next time
    localStorage.setItem('karongaLastVisit', currentVisit.toString());

    // Determine message based on last visit
    let message = '';

    if (!lastVisit) {
        // First visit
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const timeDifference = currentVisit - lastVisitTime;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference === 0) {
            // Same day visit
            message = 'Back so soon! Awesome!';
        } else if (daysDifference === 1) {
            // 1 day ago
            message = `You last visited ${daysDifference} day ago.`;
        } else {
            // Multiple days ago
            message = `You last visited ${daysDifference} days ago.`;
        }
    }

    // Display message
    visitorText.textContent = message;

    // Store message in localStorage for persistence
    localStorage.setItem('karongaWelcomeMessage', message);
}

// Load discover items from JSON and create cards
function loadDiscoverItems() {
    const discoverContainer = document.getElementById('discover-grid');

    if (!discoverContainer) {
        console.error('Discover container not found');
        return;
    }

    console.log('Loading discover items...', discoverItems);

    // Clear loading message
    discoverContainer.innerHTML = '';
    discoverContainer.className = 'discover-grid';

    // Create cards for each discover item
    discoverItems.forEach((item, index) => {
        const card = createDiscoverCard(item, index + 1);
        discoverContainer.appendChild(card);
    });
}

// Create a discover card
function createDiscoverCard(item, cardNumber) {
    console.log(`Creating card for: ${item.name}, image: ${item.image}`);

    const card = document.createElement('article');
    card.className = 'discover-card';
    card.setAttribute('aria-label', `${item.name} - ${item.category} attraction`);

    // Create image figure
    const figure = document.createElement('figure');
    figure.className = 'card-figure';

    const img = document.createElement('img');
    // FIXED: Use relative path from discover.html location
    // Since discover.html is in chamber/ folder, images are in chamber/images/
    // So we need: ./images/filename.webp
    img.src = `./images/${item.image}`;
    img.alt = `${item.name} in Karonga, Malawi`;
    img.className = 'card-image';
    img.loading = 'lazy';
    img.width = 300;
    img.height = 200;

    // Add detailed error handling
    img.onerror = function () {
        console.error(`❌ Failed to load image: ${this.src}`);
        console.error(`Looking for: ${item.image} in ./images/`);

        // Try alternative paths
        const alternativePaths = [
            `images/${item.image}`,
            `../images/${item.image}`,
            `/chamber/images/${item.image}`
        ];

        let found = false;
        for (let i = 0; i < alternativePaths.length; i++) {
            const testImg = new Image();
            testImg.onload = () => {
                if (!found) {
                    found = true;
                    console.log(`✓ Found image at: ${alternativePaths[i]}`);
                    this.src = alternativePaths[i];
                }
            };
            testImg.src = alternativePaths[i];
        }

        // If still not found after 1 second, use fallback
        setTimeout(() => {
            if (!found) {
                console.log('Using fallback image');
                this.src = './images/business-conference.jpg';
                this.alt = 'Karonga attraction image';
            }
        }, 1000);

        this.onerror = null; // Prevent infinite loop
    };

    img.onload = function () {
        console.log(`✓ Successfully loaded: ${this.src}`);
    };

    figure.appendChild(img);

    // Create card content
    const content = document.createElement('div');
    content.className = 'card-content';

    const title = document.createElement('h2');
    title.textContent = item.name;

    const address = document.createElement('address');
    address.textContent = item.address;

    const description = document.createElement('p');
    description.textContent = item.description;

    const learnMoreBtn = document.createElement('button');
    learnMoreBtn.className = 'learn-more-btn';
    learnMoreBtn.textContent = 'Learn More';
    learnMoreBtn.setAttribute('aria-label', `Learn more about ${item.name}`);

    // Add click event to button
    learnMoreBtn.addEventListener('click', function () {
        showItemDetails(item);
    });

    // Add keyboard support
    learnMoreBtn.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showItemDetails(item);
        }
    });

    // Assemble card content
    content.appendChild(title);
    content.appendChild(address);
    content.appendChild(description);
    content.appendChild(learnMoreBtn);

    // Assemble card
    card.appendChild(figure);
    card.appendChild(content);

    return card;
}

// Show item details modal
function showItemDetails(item) {
    // Create modal for details
    showDetailModal(item);
}

// Show modal with item details
function showDetailModal(item) {
    // Check if modal already exists
    let modal = document.getElementById('item-detail-modal');

    if (!modal) {
        // Create modal
        modal = document.createElement('div');
        modal.id = 'item-detail-modal';
        modal.className = 'detail-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-modal', 'true');
        modal.hidden = true;

        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">×</button>
                <h2 id="modal-title"></h2>
                <div class="modal-body">
                    <img class="modal-image" alt="">
                    <div class="modal-details">
                        <address class="modal-address"></address>
                        <p class="modal-description"></p>
                        <p class="modal-category"></p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeModal);

        // Close when clicking outside
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !modal.hidden) {
                closeModal();
            }
        });
    }

    // Populate modal with item data - FIXED IMAGE PATH HERE TOO
    modal.querySelector('#modal-title').textContent = item.name;
    modal.querySelector('.modal-image').src = `./images/${item.image}`;
    modal.querySelector('.modal-image').alt = item.name;
    modal.querySelector('.modal-address').textContent = item.address;
    modal.querySelector('.modal-description').textContent = item.description;
    modal.querySelector('.modal-category').textContent = `Category: ${item.category}`;

    // Show modal
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus on close button for accessibility
    setTimeout(() => {
        modal.querySelector('.modal-close').focus();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('item-detail-modal');
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
    }
}

// Setup close button for visitor message
function setupCloseButton() {
    const closeBtn = document.getElementById('close-message');
    const visitorMessage = document.getElementById('visitor-message');

    if (closeBtn && visitorMessage) {
        closeBtn.addEventListener('click', function () {
            visitorMessage.style.display = 'none';
            localStorage.setItem('karongaHideWelcome', 'true');
        });

        if (localStorage.getItem('karongaHideWelcome') === 'true') {
            visitorMessage.style.display = 'none';
        }
    }
}

// Debug function to test image paths
function testImagePaths() {
    console.log('Testing image paths...');

    const testImages = [
        './images/lake-malawi.webp',
        'images/lake-malawi.webp',
        '../images/lake-malawi.webp',
        '/chamber/images/lake-malawi.webp'
    ];

    testImages.forEach(path => {
        const img = new Image();
        img.onload = () => console.log(`✓ ${path} works`);
        img.onerror = () => console.log(`✗ ${path} fails`);
        img.src = path;
    });
}

// Run path test on load
setTimeout(testImagePaths, 1000);