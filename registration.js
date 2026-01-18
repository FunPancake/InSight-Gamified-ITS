document.addEventListener('DOMContentLoaded', function() {
    
    // Select elements
    const roleSelect = document.getElementById('role');
    const registrationForm = document.getElementById('registrationForm');
    const backBtn = document.getElementById('backBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    // Select role-specific field containers
    const studentFields = document.getElementById('studentFields');
    const teacherFields = document.getElementById('teacherFields');
    const proctorFields = document.getElementById('proctorFields');
    
    // Show/hide fields based on role selection
    roleSelect.addEventListener('change', function() {
        const selectedRole = this.value;
        
        // Hide all role-specific fields first
        studentFields.style.display = 'none';
        teacherFields.style.display = 'none';
        proctorFields.style.display = 'none';
        
        // Clear required attributes from hidden fields
        clearRequiredFields(studentFields);
        clearRequiredFields(teacherFields);
        clearRequiredFields(proctorFields);
        
        // Show appropriate fields based on selection
        if (selectedRole === 'student') {
            studentFields.style.display = 'block';
            setRequiredFields(studentFields);
        } else if (selectedRole === 'teacher') {
            teacherFields.style.display = 'block';
            setRequiredFields(teacherFields);
        } else if (selectedRole === 'proctor') {
            proctorFields.style.display = 'block';
            setRequiredFields(proctorFields);
        }
    });
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get basic form values
        const role = document.getElementById('role').value;
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
        
        // Create user object with basic info
        const userData = {
            role: role,
            fullName: fullName,
            email: email,
            password: password,
            phone: phone
        };
        
        // Add role-specific data
        if (role === 'student') {
            userData.studentId = document.getElementById('studentId').value;
            userData.grade = document.getElementById('grade').value;
            userData.section = document.getElementById('section').value;
        } else if (role === 'teacher') {
            userData.teacherId = document.getElementById('teacherId').value;
            userData.department = document.getElementById('department').value;
            userData.subject = document.getElementById('subject').value;
        } else if (role === 'proctor') {
            userData.proctorId = document.getElementById('proctorId').value;
            userData.proctorDepartment = document.getElementById('proctorDepartment').value;
            userData.accessCode = document.getElementById('accessCode').value;
            
            // Validate access code (example: check if it's correct)
            // You should change this to your actual access code
            if (userData.accessCode !== 'ADMIN123') {
                alert('Invalid Admin Access Code!');
                return;
            }
        }
        
        // TODO: Save user data (localStorage, send to server, etc.)
        console.log('User registered:', userData);
        
        // For now, save to localStorage as example
        // In real application, send this to your backend server
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful!');
        
        // Redirect to appropriate login page based on role
        if (role === 'student') {
            window.location.href = 'student.html';
        } else if (role === 'teacher') {
            window.location.href = 'teacher.html';
        } else if (role === 'proctor') {
            window.location.href = 'admin.html';
        }
    });
    
    // Back button
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Login button
    loginBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Helper function to set required attribute on inputs
    function setRequiredFields(container) {
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.setAttribute('required', 'required');
        });
    }
    
    // Helper function to remove required attribute from inputs
    function clearRequiredFields(container) {
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.removeAttribute('required');
            input.value = ''; // Clear the value
        });
    }
    
});