// scripts/thankyou.js - Thank you page functionality

document.addEventListener('DOMContentLoaded', function () {
    displayFormData();
});

function displayFormData() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Display each field
    displayField('summary-first-name', urlParams.get('first-name'), 'Not provided');
    displayField('summary-last-name', urlParams.get('last-name'), 'Not provided');
    displayField('summary-email', urlParams.get('email'), 'Not provided');
    displayField('summary-phone', formatPhoneNumber(urlParams.get('phone')), 'Not provided');
    displayField('summary-business', urlParams.get('business-name'), 'Not provided');

    // Format and display membership level
    const membershipLevel = urlParams.get('membership-level');
    displayField('summary-membership', formatMembershipLevel(membershipLevel), 'Not selected');

    // Format and display timestamp
    const timestamp = urlParams.get('timestamp');
    displayField('summary-date', formatTimestamp(timestamp), 'Not available');
}

function displayField(elementId, value, defaultValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || defaultValue;

        // Add some visual feedback for loaded data
        if (value) {
            element.classList.add('loaded');
        }
    }
}

function formatPhoneNumber(phone) {
    if (!phone) return '';

    // Format for display
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('265')) {
        return `+${cleaned.slice(0, 3)} (0) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }

    return phone;
}

function formatMembershipLevel(level) {
    const levels = {
        'np': 'NP Membership (Non-Profit)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };

    return levels[level] || level || 'Not selected';
}

function formatTimestamp(timestamp) {
    if (!timestamp) return '';

    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return timestamp;
    }
}

// Add some visual effects for the loaded data
document.addEventListener('DOMContentLoaded', function () {
    // Add animation to summary items
    setTimeout(() => {
        const summaryItems = document.querySelectorAll('.summary-item dd');
        summaryItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('loaded');
            }, index * 100);
        });
    }, 500);
});