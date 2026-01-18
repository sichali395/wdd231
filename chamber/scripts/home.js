// scripts/home.js - Home page functionality

document.addEventListener('DOMContentLoaded', async function () {
    // Load and display spotlight members
    await loadSpotlights();

    // Initialize other home page functionality
    setupHomePage();
});

async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();

        // Filter gold and silver members
        const eligibleMembers = members.filter(member =>
            member.membershipLevel === 3 || member.membershipLevel === 2
        );

        // Randomly select 2-3 members
        const shuffled = [...eligibleMembers].sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {
        console.error('Error loading spotlights:', error);
        const container = document.getElementById('spotlight-container');
        container.innerHTML = '<p>Unable to load member spotlights. Please try again later.</p>';
    }
}

function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'spotlight-card';

        const membershipLevel = member.membershipLevel === 3 ? 'Gold' : 'Silver';

        card.innerHTML = `
            <h4>${member.name}</h4>
            <p><strong>Category:</strong> ${member.category}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Website:</strong> <a href="https://${member.website}" target="_blank">${member.website}</a></p>
            <div class="membership">${membershipLevel} Member</div>
        `;

        container.appendChild(card);
    });
}

function setupHomePage() {
    // Add any additional home page setup here
    console.log('Home page initialized');
}