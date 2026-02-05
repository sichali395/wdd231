// Discover page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('main-menu');
    const welcomeMessage = document.getElementById('welcome-message');
    const closeWelcomeBtn = document.getElementById('close-welcome');
    const attractionsContainer = document.getElementById('attractions-container');
    const modal = document.getElementById('attraction-modal');
    const modalClose = document.getElementById('modal-close');
    const visitCountElement = document.getElementById('visit-count');

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

    // Visit Counter
    function updateVisitCount() {
        let visitCount = localStorage.getItem('karongaDiscoverVisits') || 0;
        visitCount = parseInt(visitCount) + 1;
        localStorage.setItem('karongaDiscoverVisits', visitCount);

        const visitText = visitCount === 1 ? 'first' :
            visitCount === 2 ? 'second' :
                visitCount === 3 ? 'third' :
                    `${visitCount}th`;

        visitCountElement.textContent = visitText;
    }

    // Close Welcome Message
    closeWelcomeBtn.addEventListener('click', function () {
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            welcomeMessage.style.display = 'none';
        }, 300);
    });

    // Load Attractions Data
    async function loadAttractions() {
        try {
            // Remove loading state
            attractionsContainer.innerHTML = '';

            // In a real app, you would fetch from discover.mjs
            // For now, we'll use static data
            const attractions = [
                {
                    id: 1,
                    title: "Karonga Cultural Centre",
                    category: "Cultural",
                    image: "images/karonga-cultural-centre.webp",
                    address: "Town Centre, Karonga",
                    description: "A vibrant cultural hub showcasing traditional dances, crafts, and historical exhibitions of the northern region tribes.",
                    features: ["Traditional dance performances", "Cultural exhibitions", "Craft workshops", "Historical artifacts"]
                },
                {
                    id: 2,
                    title: "Lake Malawi Beach",
                    category: "Natural",
                    image: "images/lake-malawi-beach.webp",
                    address: "Lakeshore Road, Karonga",
                    description: "Pristine sandy beaches along the world's third largest lake, perfect for swimming, fishing, and sunset views.",
                    features: ["Swimming", "Fishing", "Boating", "Bird watching", "Sunset views"]
                },
                {
                    id: 3,
                    title: "Karonga Museum",
                    category: "Historical",
                    image: "images/karonga-museum.webp",
                    address: "Mzumara Street, Karonga",
                    description: "Home to the famous Malawisaurus fossil and exhibits tracing human evolution in the region.",
                    features: ["Malawisaurus fossil", "Archaeological exhibits", "Educational tours", "Research center"]
                },
                {
                    id: 4,
                    title: "Kayelekera Mine Viewpoint",
                    category: "Industrial",
                    image: "images/kayelekera-mine.webp",
                    address: "Kayelekera, 50km West",
                    description: "Viewpoint overlooking one of Africa's largest uranium mines with educational tours about mineral resources.",
                    features: ["Mine viewpoint", "Educational tours", "Geology exhibits", "Photo opportunities"]
                },
                {
                    id: 5,
                    title: "Livingstonia Mission",
                    category: "Historical",
                    image: "images/livingstonia-mission.webp",
                    address: "Livingstonia, 90km South",
                    description: "Historical mission station established by Scottish missionaries in the 19th century with panoramic views.",
                    features: ["Historical buildings", "Museum", "Scenic views", "Cultural heritage"]
                },
                {
                    id: 6,
                    title: "Rukuru River Park",
                    category: "Natural",
                    image: "images/rukuru-river.webp",
                    address: "Rukuru River Banks",
                    description: "Beautiful riverside park ideal for picnics, bird watching, and nature walks along the riverbanks.",
                    features: ["Picnic areas", "Bird watching", "Nature trails", "Fishing spots"]
                }
            ];

            // Render attractions
            attractions.forEach((attraction, index) => {
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
    updateVisitCount();
    loadAttractions();
    animateStatistics();

    // Update last modified date
    document.getElementById('last-modified-date').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
});