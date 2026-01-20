document.addEventListener('DOMContentLoaded', function() {
    
    // Select elements
    const roleSelect = document.getElementById('role');
    const registrationForm = document.getElementById('registrationForm');
    const backBtn = document.getElementById('backBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    // Select role-specific field containers
    const studentFields = document.getElementById('studentFields');
    const teacherFields = document.getElementById('teacherFields');
    const adminFields = document.getElementById('adminFields');
    
    // Show/hide fields based on role selection
    roleSelect.addEventListener('change', function() {
        const selectedRole = this.value;
        
        // Hide all role-specific fields first
        studentFields.style.display = 'none';
        teacherFields.style.display = 'none';
        adminFields.style.display = 'none';
        
        // Clear required attributes from hidden fields
        clearRequiredFields(studentFields);
        clearRequiredFields(teacherFields);
        clearRequiredFields(adminFields);
        
        // Show appropriate fields based on selection
        if (selectedRole === 'student') {
            studentFields.style.display = 'block';
            setRequiredFields(studentFields);
        } else if (selectedRole === 'teacher') {
            teacherFields.style.display = 'block';
            setRequiredFields(teacherFields);
        } else if (selectedRole === 'admin') {
            adminFields.style.display = 'block';
            setRequiredFields(adminFields);
        }
    });
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get basic form values
        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value;
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Check if username already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const usernameExists = users.find(u => u.username === username);
        
        if (usernameExists) {
            alert('Username already exists! Please choose a different username.');
            return;
        }
        
        // Create user object with basic info
        const userData = {
            username: username,
            role: role,
            fullName: fullName,
            email: email,
            password: password,
            phone: phone,
            createdAt: new Date().toISOString()
        };
        
        // Add role-specific data
        if (role === 'student') {
            userData.studentId = document.getElementById('studentId').value;
            userData.classSection = document.getElementById('classSection').value;
            userData.totalPoints = 0;
            userData.level = 1;
        } else if (role === 'teacher') {
            userData.teacherId = document.getElementById('teacherId').value;
            userData.department = document.getElementById('department').value;
            
            // Get selected classes (multiple select)
            const managedClassesSelect = document.getElementById('managedClasses');
            const selectedClasses = Array.from(managedClassesSelect.selectedOptions).map(option => option.value);
            userData.managedClasses = selectedClasses;
        } else if (role === 'admin') {
            userData.adminId = document.getElementById('adminId').value;
            userData.adminDepartment = document.getElementById('adminDepartment').value;
            const accessCode = document.getElementById('accessCode').value;
            
            // Validate access code (change this to your actual access code)
            if (accessCode !== 'ADMIN2024') {
                alert('Invalid Admin Access Code!');
                return;
            }
        }
        
        // Save user data to localStorage
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
    
    // Back button
    backBtn.addEventListener('click', function() {
        window.location.href = '../../index.html';
    });
    
    // Login button
    loginBtn.addEventListener('click', function() {
        window.location.href = 'login.html';
    });
    
    // Helper function to set required attribute on inputs
    function setRequiredFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.id !== 'managedClasses') { // Don't make multiple select required
                input.setAttribute('required', 'required');
            }
        });
    }
    
    // Helper function to remove required attribute from inputs
    function clearRequiredFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.removeAttribute('required');
            if (input.type !== 'select-multiple') {
                input.value = ''; // Clear the value
            }
        });
    }
    
});