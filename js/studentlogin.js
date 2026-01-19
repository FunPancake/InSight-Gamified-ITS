console.log('JavaScript loaded');

document.addEventListener('DOMContentLoaded', function() {
    
    // Select buttons
    const backBtn = document.getElementById('backBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.getElementById('studentLoginForm');
    
    // Back button - return to index
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Register button - go to registration page
    registerBtn.addEventListener('click', function() {
        window.location.href = 'registration.html';
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting normally
        
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // TODO: Add your login validation logic here
        // For now, just log the values
        console.log('Email:', email);
        console.log('Password:', password);
        
        // After successful login, redirect to student dashboard
        // window.location.href = 'student-dashboard.html';
    });
    
});