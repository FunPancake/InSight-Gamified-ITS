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
    
    // Load and populate classes for students
    loadAvailableClasses();
    
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
            loadAvailableClasses(); // Refresh classes when student role is selected
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
            
            if (!userData.classSection) {
                alert('Please select a class/section!');
                return;
            }
            
            userData.totalPoints = 0;
            userData.level = 1;
            userData.gamesPlayed = 0;
            userData.timeSpent = 0;
            userData.achievementsEarned = 0;
            userData.classRank = '-';
        } else if (role === 'teacher') {
            userData.teacherId = document.getElementById('teacherId').value;
            userData.department = document.getElementById('department').value;
            
            // Get teacher's input for classes
            const classInput = document.getElementById('teacherClassInput').value.trim();
            
            if (!classInput) {
                alert('Please enter at least one class name!');
                return;
            }
            
            // Split by comma and clean up
            const classNames = classInput.split(',').map(c => c.trim()).filter(c => c !== '');
            
            if (classNames.length === 0) {
                alert('Please enter valid class names!');
                return;
            }
            
            userData.managedClasses = classNames;
            
            // Add these classes to the global classes list
            addClassesToSystem(classNames, userData.teacherId);
            
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
    
    // Helper function to add classes to system
    function addClassesToSystem(classNames, teacherId) {
        // Get existing classes from localStorage
        let classes = JSON.parse(localStorage.getItem('classes')) || [];
        
        // Add new classes
        classNames.forEach(className => {
            // Check if class already exists
            const existingClass = classes.find(c => c.name === className);
            
            if (!existingClass) {
                // Create new class
                classes.push({
                    id: generateId(),
                    name: className,
                    teacherId: teacherId,
                    createdAt: new Date().toISOString()
                });
            }
        });
        
        // Save back to localStorage
        localStorage.setItem('classes', JSON.stringify(classes));
    }
    
    // Helper function to load available classes for students
    function loadAvailableClasses() {
        const classes = JSON.parse(localStorage.getItem('classes')) || [];
        const classSelect = document.getElementById('classSection');
        
        // Clear existing options except the first one
        classSelect.innerHTML = '<option value="">-- Select Class --</option>';
        
        // Add classes from system
        classes.forEach(classItem => {
            const option = document.createElement('option');
            option.value = classItem.name;
            option.textContent = classItem.name;
            classSelect.appendChild(option);
        });
        
        // If no classes available, show message
        if (classes.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No classes available yet';
            option.disabled = true;
            classSelect.appendChild(option);
        }
    }
    
    // Helper function to generate unique ID
    function generateId() {
        return 'class_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Helper function to set required attribute on inputs
    function setRequiredFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.setAttribute('required', 'required');
        });
    }
    
    // Helper function to remove required attribute from inputs
    function clearRequiredFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.removeAttribute('required');
            input.value = ''; // Clear the value
        });
    }
    
});
