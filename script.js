document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links from script.js
    document.querySelectorAll('nav a, .btn').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                if(targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animation for elements when they come into view from script.js
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-section, .testimonial-card, .drone-card, .card, .application-card, .benefit-card').forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add hover effects to cards from script.js
    const cards = document.querySelectorAll('.card, .drone-card, .application-card, .benefit-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });
    });
    
    // Make horizontal scrolling easier with mouse wheel from script.js
    const scrollContainers = document.querySelectorAll('.cards-container, .drone-types, .applications, .benefits, .feedback-list');
    
    scrollContainers.forEach(container => {
        container.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        });
    });
    
    // Mobile menu toggle functionality for responsive design from script.js
    const createMobileMenu = () => {
        if(window.innerWidth <= 768) {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const navLinks = document.querySelector('.nav-links');
                
                if(!document.querySelector('.mobile-menu-btn')) {
                    const mobileMenuBtn = document.createElement('button');
                    mobileMenuBtn.classList.add('mobile-menu-btn');
                    mobileMenuBtn.innerText = 'Menu';
                    mobileMenuBtn.style.padding = '8px 15px';
                    mobileMenuBtn.style.background = '#0077b6';
                    mobileMenuBtn.style.color = 'white';
                    mobileMenuBtn.style.border = 'none';
                    mobileMenuBtn.style.borderRadius = '5px';
                    mobileMenuBtn.style.cursor = 'pointer';
                    mobileMenuBtn.style.marginTop = '10px';
                    
                    navLinks.style.display = 'none';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.gap = '15px';
                    navLinks.style.padding = '15px 0';
                    
                    mobileMenuBtn.addEventListener('click', () => {
                        if(navLinks.style.display === 'none') {
                            navLinks.style.display = 'flex';
                        } else {
                            navLinks.style.display = 'none';
                        }
                    });
                    
                    navbar.appendChild(mobileMenuBtn);
                }
            }
        } else {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if(mobileMenuBtn) {
                mobileMenuBtn.remove();
            }
            
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
            }
        }
    };
    
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // Feedback functionality from 4.html
    // Variables
    let currentRating = 0;
    const feedbacks = [];
    
    // Modal Functions
    window.openFeedbackModal = function() {
        const feedbackModal = document.getElementById('feedbackModal');
        if (feedbackModal) {
            feedbackModal.style.display = 'block';
        }
    };
    
    window.closeFeedbackModal = function() {
        const feedbackModal = document.getElementById('feedbackModal');
        if (feedbackModal) {
            feedbackModal.style.display = 'none';
            resetForm();
        }
    };
    
    // Initialize Star Rating System
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            currentRating = value;
            updateStars(value);
        });
        
        star.addEventListener('mouseover', function() {
            const value = parseInt(this.getAttribute('data-value'));
            updateStars(value);
        });
        
        star.addEventListener('mouseout', function() {
            updateStars(currentRating);
        });
    });
    
    function updateStars(rating) {
        document.querySelectorAll('.star').forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Form Submit Handler
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const feedbackText = document.getElementById('feedback').value;
            
            if (!name || !email || !feedbackText || currentRating === 0) {
                alert('Please fill all fields and provide a rating');
                return;
            }
            
            // Add feedback to array
            feedbacks.push({
                name: name,
                email: email,
                rating: currentRating,
                feedback: feedbackText,
                date: new Date()
            });
            
            // Display feedbacks
            displayFeedbacks();
            
            // Close modal and reset form
            window.closeFeedbackModal();
        });
    }
    
    function resetForm() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const feedbackInput = document.getElementById('feedback');
        
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (feedbackInput) feedbackInput.value = '';
        
        currentRating = 0;
        updateStars(0);
    }
    
    function displayFeedbacks() {
        const feedbackList = document.getElementById('feedbackList');
        if (!feedbackList) return;
        
        feedbackList.innerHTML = '';
        
        if (feedbacks.length === 0) {
            feedbackList.innerHTML = '<p class="no-feedback">No feedback submitted yet.</p>';
            return;
        }
        
        // Show feedback container
        const feedbackDisplay = document.getElementById('feedbackDisplay');
        if (feedbackDisplay) {
            feedbackDisplay.style.display = 'block';
        }
        
        // Add each feedback to the list
        feedbacks.forEach(item => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            
            const header = document.createElement('h4');
            header.innerHTML = `${item.name} <span class="feedback-rating">${getStarString(item.rating)}</span>`;
            
            const message = document.createElement('p');
            message.className = 'feedback-message';
            message.textContent = item.feedback;
            
            feedbackItem.appendChild(header);
            feedbackItem.appendChild(message);
            feedbackList.appendChild(feedbackItem);
        });
    }
    
    function getStarString(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }
});