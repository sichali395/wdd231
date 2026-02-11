// ES Module - Main entry point for Kisyombe Village Heritage
import { loadHeritageData } from './data.js';
import { initModal } from './modal.js';
import { initStorage, getPreference, setPreference, getAllPreferences } from './storage.js';

// DOM Elements
const heritageGrid = document.getElementById('heritage-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const resetPrefsBtn = document.getElementById('reset-preferences');
const currentYearSpan = document.getElementById('current-year');
const currentDateSpan = document.getElementById('current-date');
const themePreference = document.getElementById('theme-preference');
const lastViewedSpan = document.getElementById('last-viewed');
const clanPreference = document.getElementById('clan-preference');

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Kisyombe Village Heritage - Initializing...');

    // Set current year and date
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    if (currentDateSpan) {
        currentDateSpan.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Initialize local storage
    initStorage();

    // Load user preferences
    const preferences = getAllPreferences();
    if (themePreference) themePreference.textContent = preferences.theme || 'Default';
    if (lastViewedSpan) lastViewedSpan.textContent = preferences.lastViewed || 'None';
    if (clanPreference) clanPreference.textContent = preferences.clanInterest || 'Not set';

    // Apply theme preference
    if (preferences.theme === 'Dark') {
        document.body.classList.add('dark-theme');
    }

    // Load heritage data from JSON
    await loadHeritageData();

    // Initialize modal dialog
    initModal();

    // Set active navigation link (wayfinding)
    setActiveNavLink();
});

// ----- DATA FETCHING with Async/Await and Try/Catch -----
export async function fetchHeritageData() {
    try {
        console.log('Fetching Kisyombe heritage data...');
        const response = await fetch('data/kisyombe-data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Successfully loaded ${data.length} heritage items`);
        return data;
    } catch (error) {
        console.error('Failed to fetch Kisyombe heritage data:', error);

        // Display user-friendly error message
        if (heritageGrid) {
            heritageGrid.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Unable to Load Heritage Data</h3>
                    <p>Please check your connection and try again.</p>
                    <p class="error-details">${error.message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Retry</button>
                </div>
            `;
        }
        return null;
    }
}

// ----- DYNAMIC CONTENT GENERATION with Array Methods and Template Literals -----
export function displayHeritageItems(items, filter = 'all') {
    if (!heritageGrid) return;

    // ARRAY METHOD 1: filter() - Process data based on user selection
    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.category === filter);

    if (filteredItems.length === 0) {
        heritageGrid.innerHTML = `<p class="no-results">No heritage items found in this category.</p>`;
        return;
    }

    // ARRAY METHOD 2: map() - Transform array into HTML
    // TEMPLATE LITERALS - Multi-line strings with expressions
    const html = filteredItems.map(item => `
        <article class="heritage-card" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name} - ${item.type}, ${item.location}" loading="lazy" width="350" height="250" onerror="this.src='assets/placeholder.jpg'">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p class="category-badge ${item.category}">${item.category} • ${item.type || ''}</p>
                <p class="description">${item.description.substring(0, 100)}...</p>
                <div class="card-details">
                    <span class="detail"><strong>📍 Location:</strong> ${item.location}</span>
                    <span class="detail"><strong>⏱️ Era:</strong> ${item.era || 'Traditional'}</span>
                    <span class="detail"><strong>🏷️ Clan:</strong> ${item.clanAffiliation || 'All clans'}</span>
                    <span class="detail"><strong>👑 Kyungu Relation:</strong> ${item.kyunguRelation || 'Under Kyungu authority'}</span>
                </div>
                <button class="btn-view-details" data-id="${item.id}" aria-label="View details for ${item.name}">View Details</button>
            </div>
        </article>
    `).join('');

    heritageGrid.innerHTML = html;

    // DOM MANIPULATION & EVENT HANDLING
    // Attach event listeners to each "View Details" button
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.currentTarget.dataset.id);
            const item = items.find(i => i.id === id);

            if (item) {
                // Save to local storage - user preference
                setPreference('lastViewed', item.name);
                if (lastViewedSpan) lastViewedSpan.textContent = item.name;

                // Save clan interest if applicable
                if (item.clanAffiliation && item.clanAffiliation !== 'All clans') {
                    setPreference('clanInterest', item.clanAffiliation);
                    if (clanPreference) clanPreference.textContent = item.clanAffiliation;
                }

                // Open modal with item details
                showModal(item);
            }
        });
    });
}

// ----- MODAL DIALOG for Detailed Information -----
function showModal(item) {
    const modal = document.getElementById('heritage-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    // Template literal for detailed modal content
    modalBody.innerHTML = `
        <h2 id="modal-title">${item.name}</h2>
        <img src="${item.image}" alt="${item.name}" loading="lazy" width="600" height="400" onerror="this.src='assets/placeholder.jpg'">
        
        <div id="modal-description" class="modal-details">
            <p class="category-tag ${item.category}">${item.category} • ${item.type || ''}</p>
            
            <h3>About ${item.name}</h3>
            <p>${item.description}</p>
            
            <div class="modal-info-grid">
                <div class="info-item">
                    <strong>📍 Location</strong>
                    <span>${item.location}</span>
                </div>
                <div class="info-item">
                    <strong>⏱️ Era/Period</strong>
                    <span>${item.era || 'Traditional'}</span>
                </div>
                <div class="info-item">
                    <strong>🏷️ Clan Affiliation</strong>
                    <span>${item.clanAffiliation || 'All clans of Kisyombe'}</span>
                </div>
                <div class="info-item">
                    <strong>👑 Kyungu Authority</strong>
                    <span>${item.kyunguRelation || 'Under Paramount Traditional Authority Kyungu'}</span>
                </div>
                <div class="info-item">
                    <strong>📜 Significance</strong>
                    <span>${item.significance}</span>
                </div>
                <div class="info-item">
                    <strong>🔮 Preservation Status</strong>
                    <span>${item.preservationStatus || 'Preserved through oral tradition'}</span>
                </div>
            </div>
            
            ${item.title ? `<p><strong>Title:</strong> ${item.title}</p>` : ''}
            ${item.descendants ? `<p><strong>Descendants:</strong> ${item.descendants}</p>` : ''}
            ${item.ceremonies ? `<p><strong>Ceremonies:</strong> ${item.ceremonies}</p>` : ''}
        </div>
    `;

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

// ----- FILTER EVENT HANDLERS -----
if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;

            // Store filter preference in local storage
            setPreference('lastFilter', filter);

            // Load and filter data
            await loadHeritageData(filter);
        });
    });
}

// ----- RESPONSIVE NAVIGATION - Hamburger Menu -----
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true' ? false : true;
        hamburger.setAttribute('aria-expanded', expanded);
        navMenu.classList.toggle('show');
    });

    // Close menu when clicking on a link (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('show');
        });
    });
}

// ----- LOCAL STORAGE - Reset Preferences -----
if (resetPrefsBtn) {
    resetPrefsBtn.addEventListener('click', () => {
        // Clear preferences from local storage
        localStorage.removeItem('kisyombe_preferences');

        // Re-initialize with defaults
        initStorage();

        // Update UI
        if (themePreference) themePreference.textContent = 'Default';
        if (lastViewedSpan) lastViewedSpan.textContent = 'None';
        if (clanPreference) clanPreference.textContent = 'Not set';

        document.body.classList.remove('dark-theme');

        alert('Your preferences have been reset to default.');
    });
}

// ----- WAYFINDING - Set Active Navigation Link -----
export function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// ----- FORM HANDLING - URL Search Params for Form Action Page -----
export function getFormDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const formData = {};

    // ARRAY METHOD 3: for...of iteration
    for (const [key, value] of urlParams.entries()) {
        // Convert field names to readable labels
        const readableKey = key
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

        formData[readableKey] = value;
    }

    return formData;
}

// ----- EXPORT for ES Module pattern -----
export default {
    fetchHeritageData,
    displayHeritageItems,
    setActiveNavLink,
    getFormDataFromURL
};