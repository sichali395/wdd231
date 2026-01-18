// scripts/directory.js - Directory page functionality

document.addEventListener('DOMContentLoaded', async function () {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const gridContainer = document.getElementById('grid-container');
    const listContainer = document.getElementById('list-container');

    // Load member data
    async function loadMembers() {
        try {
            const response = await fetch('data/members.json');
            const members = await response.json();

            // Display grid view initially
            displayGrid(members);

            // Setup view toggle
            setupViewToggle(members);

        } catch (error) {
            console.error('Error loading members:', error);
            gridContainer.innerHTML = '<p class="loading">Error loading directory. Please try again.</p>';
            listContainer.innerHTML = '<p class="loading">Error loading directory. Please try again.</p>';
        }
    }

    // Display in grid view
    function displayGrid(members) {
        gridContainer.innerHTML = '';

        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';

            const membershipLevel = getMembershipLevel(member.membershipLevel);

            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name}" loading="lazy">
                <div class="card-content">
                    <h3>${member.name}</h3>
                    <p>${member.category}</p>
                    <p><strong>EMAIL:</strong> ${member.email || 'N/A'}</p>
                    <p><strong>PHONE:</strong> ${member.phone}</p>
                    <p><strong>URL:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                    <div class="membership-badge">${membershipLevel}</div>
                </div>
            `;

            gridContainer.appendChild(card);
        });
    }

    // Display in list view
    function displayList(members) {
        listContainer.innerHTML = '';

        members.forEach(member => {
            const item = document.createElement('div');
            item.className = 'member-item';

            const membershipLevel = getMembershipLevel(member.membershipLevel);

            item.innerHTML = `
                <div>
                    <h3>${member.name}</h3>
                    <p>${member.category}</p>
                </div>
                <div class="member-details">
                    <p><strong>EMAIL:</strong> ${member.email || 'N/A'}</p>
                    <p><strong>PHONE:</strong> ${member.phone}</p>
                    <p><strong>URL:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                    <p><strong>LEVEL:</strong> ${membershipLevel}</p>
                </div>
            `;

            listContainer.appendChild(item);
        });
    }

    // Get membership level name
    function getMembershipLevel(level) {
        if (level === 3) return 'Gold';
        if (level === 2) return 'Silver';
        return 'Member';
    }

    // Setup view toggle functionality
    function setupViewToggle(members) {
        gridViewBtn.addEventListener('click', function () {
            if (!gridViewBtn.classList.contains('active')) {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
                gridContainer.style.display = 'grid';
                listContainer.style.display = 'none';
                displayGrid(members);
            }
        });

        listViewBtn.addEventListener('click', function () {
            if (!listViewBtn.classList.contains('active')) {
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                gridContainer.style.display = 'none';
                listContainer.style.display = 'block';
                displayList(members);
            }
        });

        // Initialize with grid view active
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
    }

    // Initial load
    await loadMembers();
});