// Course data (modify completed as needed)
const courses = [
    { code: "CSE 110", name: "introduction to Programming", credits: 3, completed: true },
    { code: "WDD 130", name: "Web Fundamentals", credits: 3, completed: true },
    { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: true },
    { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: true },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, completed: true },
    { code: "WDD 231", name: "Web Frontend Development I", credits: 3, completed: false },
    { code: "WDD 221", name: "Client Side Programming", credits: 3, completed: false }
];

// Display courses
function displayCourses(filter = 'all') {
    const container = document.getElementById('courseCards');
    let filtered = courses;

    if (filter !== 'all') {
        filtered = courses.filter(course => course.code.startsWith(filter));
    }

    // Calculate total credits using reduce
    const totalCredits = filtered.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('totalCredits').textContent = totalCredits;
    document.getElementById('courseCount').textContent = filtered.length;

    // Create cards
    container.innerHTML = '';
    filtered.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : ''}`;
        const check = course.completed ? '✓ ' : '';

        card.innerHTML = `
            <h3>${check}${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
            <span class="course-status">${course.completed ? 'Completed' : 'In Progress'}</span>
        `;

        container.appendChild(card);
    });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayCourses(button.dataset.filter);
    });
});

// Initial load
displayCourses();