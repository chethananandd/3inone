// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting on scroll
window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact Form Validation and Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData);

    // Basic validation
    let isValid = true;
    const errors = [];

    // Name validation
    if (!formValues.name.trim()) {
        errors.push('Name is required');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim() || !emailRegex.test(formValues.email)) {
        errors.push('Valid email is required');
        isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formValues.phone.trim() || !phoneRegex.test(formValues.phone.replace(/\s+/g, ''))) {
        errors.push('Valid 10-digit phone number is required');
        isValid = false;
    }

    // Subject validation
    if (!formValues.subject) {
        errors.push('Please select a subject');
        isValid = false;
    }

    // Message validation
    if (!formValues.message.trim()) {
        errors.push('Message is required');
        isValid = false;
    }

    if (!isValid) {
        showNotification('error', errors.join('<br>'));
        return;
    }

    // Simulate form submission (since no backend)
    showNotification('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');

    // Reset form
    contactForm.reset();
});

// Notification System
function showNotification(type, message) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
    `;

    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        border-radius: 5px;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
    `;

    // Add close functionality
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);

    // Add to page
    document.body.appendChild(notification);
}

// Add notification animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .course-card, .feature-item, .testimonial-card').forEach(card => {
    observer.observe(card);
});

// Course enrollment simulation
document.querySelectorAll('.course-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const courseName = btn.closest('.course-card').querySelector('h3').textContent;
        showEnrollmentModal(courseName);
    });
});

// Enrollment modal
function showEnrollmentModal(courseName) {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Enroll in ${courseName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Fill out the form below to enroll in our ${courseName}. Our admissions team will contact you within 24 hours.</p>
                <form id="enrollmentForm">
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" name="firstName" placeholder="First Name" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="lastName" placeholder="Last Name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <div class="form-group">
                        <select name="qualification" required>
                            <option value="">Highest Qualification</option>
                            <option value="btech">B.Tech/B.E.</option>
                            <option value="mtech">M.Tech/M.E.</option>
                            <option value="diploma">Diploma</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select name="experience" required>
                            <option value="">Work Experience</option>
                            <option value="fresher">Fresher</option>
                            <option value="1-2">1-2 years</option>
                            <option value="2-5">2-5 years</option>
                            <option value="5+">5+ years</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="Any special requirements or questions?" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Enrollment</button>
                </form>
            </div>
        </div>
    `;

    // Modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    `;

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Form submission
    const enrollmentForm = modal.querySelector('#enrollmentForm');
    enrollmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('success', 'Enrollment submitted successfully! Our team will contact you soon.');
        modal.remove();
    });

    document.body.appendChild(modal);
}

// Add modal animation styles
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        border-bottom: 1px solid #eee;
    }
    .modal-header h3 {
        margin: 0;
        color: #333;
    }
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    .modal-body {
        padding: 30px;
    }
    .modal-body p {
        margin-bottom: 20px;
        color: #666;
    }
`;
document.head.appendChild(modalStyle);

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active navigation
    const homeSection = document.getElementById('home');
    if (homeSection) {
        document.querySelector('a[href="#home"]').classList.add('active');
    }

    // Add loading animation to body
    document.body.classList.add('loaded');
});