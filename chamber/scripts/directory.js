// scripts/directory.js - Directory page functionality

document.addEventListener('DOMContentLoaded', async function () {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const gridContainer = document.getElementById('grid-container');
    const listContainer = document.getElementById('list-container');

    // Performance: Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Load member data
    async function loadMembers() {
        try {
            // Show loading state
            gridContainer.innerHTML = '<div class="loading" role="status" aria-live="polite">Loading business directory...</div>';

            const response = await fetch('data/members.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const members = await response.json();

            // Validate data
            if (!Array.isArray(members) || members.length === 0) {
                throw new Error('No member data available');
            }

            // Display grid view initially
            displayGrid(members);

            // Setup view toggle
            setupViewToggle(members);

        } catch (error) {
            console.error('Error loading members:', error);
            showErrorMessage('Unable to load business directory. Please check your connection and try again.');
        }
    }

    // Display in grid view
    function displayGrid(members) {
        if (!gridContainer || members.length === 0) return;

        gridContainer.innerHTML = '';

        members.forEach((member, index) => {
            const card = document.createElement('article');
            card.className = 'member-card';
            card.setAttribute('aria-label', `${member.name} - ${member.category}`);

            const membershipLevel = getMembershipLevel(member.membershipLevel);

            card.innerHTML = `
                <img src="images/${member.image}" 
                     alt="${member.name} - ${member.category}" 
                     loading="lazy" 
                     width="400" 
                     height="200"
                     onerror="this.onerror=null; this.src='images/business-conference.jpg';">
                <div class="card-content">
                    <h3>${member.name}</h3>
                    <p><strong>Category:</strong> ${member.category}</p>
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Phone:</strong> <a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
                    <p><strong>Email:</strong> ${member.email ? `<a href="mailto:${member.email}">${member.email}</a>` : 'N/A'}</p>
                    <p><strong>Website:</strong> <a href="https://${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
                    <div class="membership-badge" aria-label="Membership level: ${membershipLevel}">
                        ${membershipLevel}
                    </div>
                </div>
            `;

            gridContainer.appendChild(card);
        });
    }

    // Display in list view
    function displayList(members) {
        if (!listContainer || members.length === 0) return;

        listContainer.innerHTML = '';

        members.forEach(member => {
            const item = document.createElement('article');
            item.className = 'member-item';
            item.setAttribute('aria-label', `${member.name} details`);

            const membershipLevel = getMembershipLevel(member.membershipLevel);

            item.innerHTML = `
                <div>
                    <h3>${member.name}</h3>
                    <p><strong>Category:</strong> ${member.category}</p>
                </div>
                <div class="member-details">
                    <p><strong>Phone:</strong> <a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
                    <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
                    <p><strong>Website:</strong> <a href="https://${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
                    <p><strong>Membership:</strong> ${membershipLevel}</p>
                </div>
            `;

            listContainer.appendChild(item);
        });
    }

    // Get membership level name
    function getMembershipLevel(level) {
        const levels = {
            1: 'Member',
            2: 'Silver',
            3: 'Gold'
        };
        return levels[level] || 'Member';
    }

    // Setup view toggle functionality
    function setupViewToggle(members) {
        if (!gridViewBtn || !listViewBtn) return;

        // Grid view button
        gridViewBtn.addEventListener('click', function () {
            if (gridViewBtn.classList.contains('active')) return;

            // Update buttons
            gridViewBtn.classList.add('active');
            gridViewBtn.setAttribute('aria-pressed', 'true');
            listViewBtn.classList.remove('active');
            listViewBtn.setAttribute('aria-pressed', 'false');

            // Update views
            gridContainer.style.display = 'grid';
            listContainer.style.display = 'none';

            // Display grid view
            displayGrid(members);

            // Announce to screen readers
            announceToScreenReader('Switched to grid view');
        });

        // List view button
        listViewBtn.addEventListener('click', function () {
            if (listViewBtn.classList.contains('active')) return;

            // Update buttons
            listViewBtn.classList.add('active');
            listViewBtn.setAttribute('aria-pressed', 'true');
            gridViewBtn.classList.remove('active');
            gridViewBtn.setAttribute('aria-pressed', 'false');

            // Update views
            gridContainer.style.display = 'none';
            listContainer.style.display = 'block';

            // Display list view
            displayList(members);

            // Announce to screen readers
            announceToScreenReader('Switched to list view');
        });

        // Initialize with grid view active
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
    }

    // Show error message
    function showErrorMessage(message) {
        const errorHTML = `
            <div class="error-message" role="alert" aria-live="assertive">
                <p style="color: var(--accent-color); font-size: 1.1rem; margin-bottom: 1rem;">⚠️ ${message}</p>
                <button onclick="location.reload()" 
                        style="padding: 0.75rem 1.5rem; background-color: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                    Try Again
                </button>
            </div>
        `;

        if (gridContainer) {
            gridContainer.innerHTML = errorHTML;
        }

        if (listContainer) {
            listContainer.innerHTML = errorHTML;
        }
    }

    // Announce to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Initial load with error handling
    try {
        await loadMembers();
    } catch (error) {
        console.error('Failed to initialize directory:', error);
        showErrorMessage('Failed to load directory. Please refresh the page.');
    }
});