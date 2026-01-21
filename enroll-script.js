// Enrollment page specific JavaScript

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const enrollmentForm = document.getElementById('detailedEnrollmentForm');
const faqItems = document.querySelectorAll('.faq-item');

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
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// FAQ Accordion Functionality
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-question i');

    question.addEventListener('click', () => {
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
                otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                otherItem.classList.remove('active');
            }
        });

        // Toggle current FAQ item
        if (item.classList.contains('active')) {
            answer.style.maxHeight = null;
            icon.style.transform = 'rotate(0deg)';
            item.classList.remove('active');
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
            item.classList.add('active');
        }
    });
});

// Form Validation and Submission
enrollmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(enrollmentForm);
    const formValues = Object.fromEntries(formData);

    // Validation
    let isValid = true;
    const errors = [];

    // Personal Information Validation
    if (!formValues.firstName.trim()) {
        errors.push('First name is required');
        isValid = false;
    }

    if (!formValues.lastName.trim()) {
        errors.push('Last name is required');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim() || !emailRegex.test(formValues.email)) {
        errors.push('Valid email address is required');
        isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formValues.phone.trim() || !phoneRegex.test(formValues.phone.replace(/\s+/g, ''))) {
        errors.push('Valid 10-digit phone number is required');
        isValid = false;
    }

    // Date of birth validation
    if (!formValues.dateOfBirth) {
        errors.push('Date of birth is required');
        isValid = false;
    } else {
        const birthDate = new Date(formValues.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18 || age > 35) {
            errors.push('Age should be between 18 and 35 years');
            isValid = false;
        }
    }

    if (!formValues.gender) {
        errors.push('Gender selection is required');
        isValid = false;
    }

    // Educational Information Validation
    if (!formValues.qualification) {
        errors.push('Qualification is required');
        isValid = false;
    }

    if (!formValues.college.trim()) {
        errors.push('College/University name is required');
        isValid = false;
    }

    if (!formValues.yearOfPassing) {
        errors.push('Year of passing is required');
        isValid = false;
    }

    if (!formValues.stream) {
        errors.push('Engineering stream is required');
        isValid = false;
    }

    // Course Selection Validation
    if (!formValues.courseType) {
        errors.push('Course selection is required');
        isValid = false;
    }

    // Terms and Conditions
    if (!formValues.terms) {
        errors.push('You must agree to the Terms and Conditions');
        isValid = false;
    }

    if (!isValid) {
        showNotification('error', errors.join('<br>'));
        // Scroll to first error
        const firstErrorField = enrollmentForm.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Show loading state
    const submitBtn = enrollmentForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Simulate form submission (since no backend)
    setTimeout(() => {
        showNotification('success',
            'Enrollment application submitted successfully!<br><br>' +
            'Application ID: GATE' + Date.now() + '<br>' +
            'Our admissions team will contact you within 24-48 hours.<br>' +
            'Please check your email for further instructions.'
        );

        // Reset form
        enrollmentForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
});

// Real-time form validation
const formInputs = enrollmentForm.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });

    input.addEventListener('input', () => {
        clearFieldError(input);
    });
});

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                errorMessage = `${field.placeholder || 'This field'} is required`;
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Minimum 2 characters required';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'phone':
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!value) {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
                errorMessage = 'Please enter a valid 10-digit phone number';
                isValid = false;
            }
            break;

        case 'dateOfBirth':
            if (!value) {
                errorMessage = 'Date of birth is required';
                isValid = false;
            } else {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 18 || age > 35) {
                    errorMessage = 'Age should be between 18 and 35 years';
                    isValid = false;
                }
            }
            break;

        default:
            if (field.hasAttribute('required') && !value) {
                errorMessage = 'This field is required';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add('error');
    field.style.borderColor = '#dc3545';

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    `;

    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '#e9ecef';

    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Dynamic course price display
const courseTypeSelect = document.getElementById('courseType');
courseTypeSelect.addEventListener('change', () => {
    const selectedOption = courseTypeSelect.options[courseTypeSelect.selectedIndex];
    const price = selectedOption.text.match(/₹[\d,]+/)?.[0];

    // Remove existing price display
    const existingPrice = courseTypeSelect.parentNode.querySelector('.course-price-display');
    if (existingPrice) {
        existingPrice.remove();
    }

    if (price) {
        const priceDisplay = document.createElement('div');
        priceDisplay.className = 'course-price-display';
        priceDisplay.textContent = `Selected Course Fee: ${price}`;
        priceDisplay.style.cssText = `
            color: #28a745;
            font-weight: 600;
            margin-top: 10px;
            padding: 10px;
            background: #d4edda;
            border-radius: 5px;
            border: 1px solid #c3e6cb;
        `;

        courseTypeSelect.parentNode.appendChild(priceDisplay);
    }
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
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
        min-width: 350px;
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
        align-items: flex-start;
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
        flex-shrink: 0;
    `;

    // Add close functionality
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 8 seconds for success, 10 seconds for error
    const duration = type === 'success' ? 8000 : 10000;
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);

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
    // Set minimum date for date of birth (18 years ago)
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 35, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    const dateInput = document.getElementById('dateOfBirth');
    dateInput.setAttribute('min', minDate.toISOString().split('T')[0]);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);

    // Add loading animation to body
    document.body.classList.add('loaded');
});