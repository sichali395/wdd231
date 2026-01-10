// Course data array (modified with your completed courses)
const courses = [
    { code: "CSE 110", name: "Programming Building Blocks", credits: 3, completed: true },
    { code: "WDD 130", name: "Web Fundamentals", credits: 3, completed: true },
    { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: true },
    { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: true },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, completed: true },
    { code: "WDD 231", name: "Web Frontend Development I", credits: 3, completed: false },
    { code: "WDD 221", name: "Client Side Programming", credits: 3, completed: false }
];

// DOM elements
const courseCardsContainer = document.getElementById('courseCards');
const totalCreditsElement = document.getElementById('totalCredits');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// Display courses
function displayCourses(filter = 'all') {
    courseCardsContainer.innerHTML = '';
    let filteredCourses = courses;

    if (filter !== 'all') {
        filteredCourses = courses.filter(course =>
            course.code.startsWith(filter)
        );
    }

    // Calculate total credits
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsElement.textContent = totalCredits;

    // Create course cards
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : ''}`;

        card.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
            <p class="status">${course.completed ? '✓ Completed' : 'In Progress'}</p>
        `;

        courseCardsContainer.appendChild(card);
    });
}

// Filter button event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        // Get filter value
        currentFilter = button.getAttribute('data-filter');
        displayCourses(currentFilter);
    });
});

// Initial display
displayCourses();