// Discover page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('main-menu');
    const welcomeMessage = document.getElementById('welcome-message');
    const closeWelcomeBtn = document.getElementById('close-welcome');
    const attractionsContainer = document.getElementById('attractions-container');
    const visitMessageElement = document.getElementById('visit-message');

    // Create modal dynamically
    const modal = document.createElement('dialog');
    modal.className = 'attraction-modal';
    modal.id = 'attraction-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" id="modal-close" aria-label="Close dialog">×</button>
            <div class="modal-header">
                <h2 id="modal-title">Attraction Details</h2>
                <p class="modal-category" id="modal-category"></p>
            </div>
            <div class="modal-body">
                <img id="modal-image" src="images/placeholder.webp" alt="Attraction image" class="modal-image" loading="lazy">
                <div class="modal-details">
                    <div class="modal-address" id="modal-address"></div>
                    <div class="modal-description" id="modal-description"></div>
                    <div class="modal-features">
                        <h3>Features</h3>
                        <ul id="modal-features"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalClose = document.getElementById('modal-close');

    // Navigation Toggle
    navToggle.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        navMenu.setAttribute('aria-expanded', !expanded);
    });

    // Close navigation when clicking outside
    document.addEventListener('click', function (event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-expanded', 'false');
        }
    });

    // localStorage for last visit
    function updateVisitMessage() {
        const now = new Date();
        const lastVisit = localStorage.getItem('karongaLastVisit');

        if (!lastVisit) {
            // First visit
            visitMessageElement.textContent = "Welcome! This is your first visit.";
        } else {
            const lastVisitDate = new Date(lastVisit);
            const timeDiff = now - lastVisitDate;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                visitMessageElement.textContent = "Welcome back! You were here earlier today.";
            } else if (daysDiff === 1) {
                visitMessageElement.textContent = "Welcome back! You were here yesterday.";
            } else {
                visitMessageElement.textContent = `Welcome back! You last visited ${daysDiff} days ago.`;
            }
        }

        // Store current visit
        localStorage.setItem('karongaLastVisit', now.toISOString());
    }

    // Close Welcome Message
    closeWelcomeBtn.addEventListener('click', function () {
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            welcomeMessage.style.display = 'none';
        }, 300);
    });

    // Load Attractions from JSON
    async function loadAttractions() {
        try {
            const response = await fetch('data/attractions.json');
            if (!response.ok) {
                throw new Error('Failed to load attractions');
            }

            const data = await response.json();
            attractionsContainer.innerHTML = '';

            // Create cards for each attraction
            data.attractions.forEach((attraction, index) => {
                const card = createAttractionCard(attraction, index);
                attractionsContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading attractions:', error);
            attractionsContainer.innerHTML = `
                <div class="error-message">
                    <p>Unable to load attractions. Please try again later.</p>
                </div>
            `;
        }
    }

    // Create Attraction Card
    function createAttractionCard(attraction, index) {
        const card = document.createElement('article');
        card.className = 'attraction-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${attraction.image}" alt="${attraction.title}" class="card-image" loading="lazy">
                <span class="image-badge">${attraction.category}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${attraction.title}</h3>
                <div class="card-location">📍 ${attraction.address}</div>
                <p class="card-description">${attraction.description}</p>
                <button class="card-button" data-id="${attraction.id}">
                    Learn More
                </button>
            </div>
        `;

        // Add click event to button
        const button = card.querySelector('.card-button');
        button.addEventListener('click', () => openModal(attraction));

        return card;
    }

    // Open Modal
    function openModal(attraction) {
        document.getElementById('modal-title').textContent = attraction.title;
        document.getElementById('modal-category').textContent = attraction.category;
        document.getElementById('modal-image').src = attraction.image;
        document.getElementById('modal-image').alt = attraction.title;
        document.getElementById('modal-address').textContent = attraction.address;
        document.getElementById('modal-description').textContent = attraction.description;

        const featuresList = document.getElementById('modal-features');
        featuresList.innerHTML = '';
        attraction.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        modal.showModal();
    }

    // Close Modal
    modalClose.addEventListener('click', () => modal.close());

    // Close modal when clicking outside
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });

    // Update Statistics with animation
    function animateStatistics() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
            const suffix = counter.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 20);
        });
    }

    // Initialize
    updateVisitMessage();
    loadAttractions();
    animateStatistics();

    // Update last modified date
    document.getElementById('last-modified-date').textContent = new Date(document.lastModified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
});