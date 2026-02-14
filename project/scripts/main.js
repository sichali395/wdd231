/**
 * Kisyombe Village Heritage - MAIN JAVASCRIPT
 * WDD 231 Final Project
 * FIXED: Hamburger menu functionality
 */

import { loadHeritageData } from './data.js';
import { initModal } from './modal.js';
import { initStorage, getPreference, setPreference, getAllPreferences } from './storage.js';

// ===== DOM ELEMENT SELECTIONS =====
const heritageGrid = document.getElementById('heritage-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const hamburger = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const resetPrefsBtn = document.getElementById('resetPrefs');
const currentYearSpan = document.getElementById('currentYear');
const currentDateSpan = document.getElementById('currentDate');
const themePreference = document.getElementById('themePref');
const lastViewedSpan = document.getElementById('lastViewedPref');
const clanPreference = document.getElementById('clanPref');

// ===== INITIALIZATION =====
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

    // Initialize Local Storage
    initStorage();

    // Load user preferences from Local Storage
    loadUserPreferences();

    // Load heritage data from JSON file
    await loadHeritageData();

    // Initialize modal dialog
    initModal();

    // Set active navigation link (wayfinding)
    setActiveNavLink();

    // Initialize hamburger menu
    initHamburgerMenu();

    // Initialize filter buttons
    initFilterButtons();

    // Initialize reset preferences button
    initResetPreferences();

    // Record current page visit in Local Storage
    recordPageVisit();
});

// ===== HAMBURGER MENU - FIXED =====
function initHamburgerMenu() {
    if (!hamburger || !navMenu) {
        console.warn('Hamburger menu elements not found');
        return;
    }

    console.log('Initializing hamburger menu');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
        this.setAttribute('aria-expanded', expanded);
        navMenu.classList.toggle('show');

        console.log('Hamburger clicked - expanded:', expanded);
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('show');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('show');
        }
    });

    // Close menu on window resize (if switching to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== FILTER BUTTONS =====
function initFilterButtons() {
    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;

            // Store filter preference in Local Storage
            setPreference('lastFilter', filter);

            // Load and filter data
            await loadHeritageData(filter);
        });
    });
}

// ===== RESET PREFERENCES =====
function initResetPreferences() {
    if (!resetPrefsBtn) return;

    resetPrefsBtn.addEventListener('click', () => {
        // Clear preferences from Local Storage
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

// ===== LOCAL STORAGE - LOAD USER PREFERENCES =====
function loadUserPreferences() {
    const preferences = getAllPreferences();

    if (themePreference) themePreference.textContent = preferences.theme || 'Default';
    if (lastViewedSpan) lastViewedSpan.textContent = preferences.lastViewed || 'None';
    if (clanPreference) clanPreference.textContent = preferences.clanInterest || 'Not set';

    // Apply theme preference
    if (preferences.theme === 'Dark') {
        document.body.classList.add('dark-theme');
    }
}

// ===== RECORD PAGE VISIT IN LOCAL STORAGE =====
function recordPageVisit() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    setPreference('lastPage', currentPage);
    setPreference('lastVisit', new Date().toISOString());
}

// ===== FETCH API - ASYNCHRONOUS WITH TRY/CATCH =====
export async function fetchHeritageData() {
    try {
        console.log('Fetching Kisyombe heritage data from JSON...');
        const response = await fetch('data/kisyombe-data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Successfully loaded ${data.length} heritage items from JSON`);
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch Kisyombe heritage data:', error);

        // Display user-friendly error message in the grid
        if (heritageGrid) {
            heritageGrid.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Unable to Load Heritage Data</h3>
                    <p>Please check your connection and try again.</p>
                    <p class="error-details">${error.message}</p>
                    <button class="primary-button" onclick="location.reload()">Retry</button>
                </div>
            `;
        }
        return null;
    }
}

// ===== DYNAMIC CONTENT GENERATION =====
export function displayHeritageItems(items, filter = 'all') {
    if (!heritageGrid) return;

    // ARRAY METHOD 1: .filter() - Filter items based on category
    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.category === filter);

    if (filteredItems.length === 0) {
        heritageGrid.innerHTML = `<p class="no-results">No heritage items found in this category.</p>`;
        return;
    }

    // ARRAY METHOD 2: .map() - Transform array into HTML
    // TEMPLATE LITERALS - Multi-line strings with expressions
    const html = filteredItems.map(item => `
        <article class="heritage-card" data-id="${item.id}">
            <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" loading="lazy" width="350" height="250">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p class="category-badge ${item.category}">${item.category} • ${item.type || ''}</p>
                <p class="description">${item.description ? item.description.substring(0, 100) + '...' : 'No description available.'}</p>
                <div class="card-details">
                    <span class="detail"><strong>📍 Location:</strong> ${item.location || 'Unknown'}</span>
                    <span class="detail"><strong>⏱️ Era:</strong> ${item.era || 'Traditional'}</span>
                    <span class="detail"><strong>🏷️ Clan:</strong> ${item.clanAffiliation || 'All clans'}</span>
                </div>
                <button class="btn-view-details" data-id="${item.id}" aria-label="View details for ${item.name}">View Details</button>
            </div>
        </article>
    `).join('');

    heritageGrid.innerHTML = html;

    // ARRAY METHOD 3: .forEach() - Attach event listeners to each button
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.currentTarget.dataset.id);
            const allItems = window.heritageData || [];
            const item = allItems.find(i => i.id === id);

            if (item) {
                // Save to Local Storage - user preference
                setPreference('lastViewed', item.name);
                if (lastViewedSpan) lastViewedSpan.textContent = item.name;

                // Open modal with item details
                showModal(item);
            }
        });
    });
}

// ===== MODAL DIALOG =====
function showModal(item) {
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
        </div>
    `;

    // Update modal title
    if (modalTitle) {
        modalTitle.textContent = item.name;
    }

    // Open modal
    const modalModule = initModal();
    modalModule.openModal();
}

// ===== WAYFINDING - SET ACTIVE NAVIGATION LINK =====
export function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');

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

// ===== FORM HANDLING - URL SEARCH PARAMS =====
export function getFormDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const formData = {};

    for (const [key, value] of urlParams.entries()) {
        // Convert field names to readable labels
        const readableKey = key
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

        if (value && value.trim() !== '') {
            formData[readableKey] = value;
        }
    }

    return formData;
}