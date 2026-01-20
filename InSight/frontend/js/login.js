document.addEventListener('DOMContentLoaded', function() {
    
    // Select elements
    const loginForm = document.getElementById('loginForm');
    const backBtn = document.getElementById('backBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    // Back button - return to landing page
    backBtn.addEventListener('click', function() {
        window.location.href = '../../index.html';
    });
    
    // Register button - go to registration page
    registerBtn.addEventListener('click', function() {
        window.location.href = 'registration.html';
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting normally
        
        // Get form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching username and password
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Login successful
            alert('Login successful!');
            
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect based on role
            if (user.role === 'student') {
                window.location.href = 'student/student-dashboard.html';
            } else if (user.role === 'teacher') {
                window.location.href = 'teacher/teacher-dashboard.html';
            } else if (user.role === 'admin') {
                window.location.href = 'admin/admin-dashboard.html';
            }
        } else {
            // Login failed
            alert('Invalid username or password!');
        }
    });
    
});