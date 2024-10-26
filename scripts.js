const courses = [
    {
        id: 1,
        title: 'Python Programming for Beginners',
        description: 'Learn Python programming from scratch with practical examples.',
        price: 49,
        duration: '15 hours',
        lessons: 40,
        rating: 4.8,
        category: 'python',
        formLink: 'https://forms.gle/iSTyRkxhC3MStBLR8',
        messengerLink: 'https://m.me/424216210783420',
        image: 'python.png'
    },
    {
        id: 2,
        title: 'HSC ICT Course',
        description: 'Explore all concepts of HSC ICT and prepare for Exam.',
        price: 60,
        duration: '20 hours',
        lessons: 60,
        rating: 4.5,
        category: 'hsc',
        formLink: 'https://forms.gle/YJEsmwkv53qWA4MG7',
        messengerLink: 'https://m.me/424216210783420',
        image: 'HSC_ICT.png'
    },
    {
        id: 3,
        title: 'SSC ICT Course',
        description: 'Learn project management skills specific to HSC ICT projects.',
        price: 49,
        duration: '14 hours',
        lessons: 30,
        rating: 4.6,
        category: 'hsc',
        formLink: 'https://forms.gle/Wm8jsa74jU8uCv6v5',
        messengerLink: 'https://m.me/424216210783420',
        image: 'SSC_ICT.png'
    },
    {
        id: 4,
        title: 'Python Quiz',
        description: 'This is free for everyone.',
        price: 0,
        category: 'python',
        image: 'quiz.png',
        startQuiz: 'quis.html',
        messengerLink: 'https://m.me/424216210783420',
    }
];

function displayCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card">
            <img src="${course.image}" alt="${course.title}" class="course-image">
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    ${course.duration ? `<span>${course.duration}</span>` : ''}
                    ${course.lessons ? `<span>${course.lessons} Lessons</span>` : ''}
                    ${course.rating ? `<span>Rating: ${course.rating}</span>` : ''}
                </div>
                <div class="price">${course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}</div>
                ${course.price > 0 
                    ? `<button class="enroll-btn" onclick="window.open('${course.formLink}', '_blank')">Buy Now</button>`
                    : `<button class="enroll-btn" onclick="window.location.href='${course.startQuiz}'">Free Quiz</button>`
                }
                <button class="messenger-btn" onclick="window.open('${course.messengerLink}', '_blank')">Message Us</button>
            </div>
        </div>
    `).join('');
}

displayCourses(courses);

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const category = button.getAttribute('data-category');
        const filteredCourses = (category === 'all') ? courses : courses.filter(course => course.category === category);
        displayCourses(filteredCourses);
    });
});

function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}


// DOM Elements
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

// Toggle menu function
function toggleMenu() {
    navLinks.classList.toggle('active');
}

// Handle navigation clicks
navLinksItems.forEach(link => {
    link.addEventListener('click', (e) => {
        
        if (link.getAttribute('onclick')) {
            return;
        }
        
        e.preventDefault();
        
        
        const targetId = link.getAttribute('href');
        
        
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                
                navLinks.classList.remove('active');
                
              
                const headerHeight = document.querySelector('nav').offsetHeight;
                
            
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                
                navLinksItems.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && 
        !e.target.closest('.mobile-menu') && 
        navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});
