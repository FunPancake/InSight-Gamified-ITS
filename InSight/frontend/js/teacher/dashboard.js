document.addEventListener('DOMContentLoaded', function() {
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'teacher') {
        alert('Please login as a teacher first!');
        window.location.href = '../../pages/login.html';
        return;
    }
    
    // Display teacher information
    displayTeacherInfo(currentUser);
    
    // Load teacher's classes
    loadClasses(currentUser);
    
    // Button handlers
    const logoutBtn = document.getElementById('logoutBtn');
    const viewClassesBtn = document.getElementById('viewClassesBtn');
    const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
    const manageStudentsBtn = document.getElementById('manageStudentsBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
    
    // View Classes button
    viewClassesBtn.addEventListener('click', function() {
        window.location.href = 'class-selection.html';
    });
    
    // View Analytics button (placeholder)
    viewAnalyticsBtn.addEventListener('click', function() {
        alert('Analytics feature coming soon!');
    });
    
    // Manage Students button (placeholder)
    manageStudentsBtn.addEventListener('click', function() {
        alert('Student management feature coming soon!');
    });
    
    // Settings button (placeholder)
    settingsBtn.addEventListener('click', function() {
        alert('Settings feature coming soon!');
    });
    
    // Display teacher information
    function displayTeacherInfo(user) {
        document.getElementById('teacherName').textContent = user.fullName;
        document.getElementById('teacherId').textContent = user.teacherId || 'N/A';
        document.getElementById('teacherDepartment').textContent = user.department || 'N/A';
        
        // Display overview stats (placeholder)
        const managedClasses = user.managedClasses || [];
        document.getElementById('totalClasses').textContent = managedClasses.length;
        
        // Count students in managed classes (placeholder)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const students = users.filter(u => 
            u.role === 'student' && managedClasses.includes(u.classSection)
        );
        
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('activeStudents').textContent = '0'; // Placeholder
        document.getElementById('avgProgress').textContent = '0%'; // Placeholder
    }
    
    // Load and display classes
    function loadClasses(user) {
        const classesList = document.getElementById('classesList');
        const managedClasses = user.managedClasses || [];
        
        if (managedClasses.length === 0) {
            classesList.innerHTML = '<p class="no-classes">You are not managing any classes yet.</p>';
            return;
        }
        
        // Count students per class
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        classesList.innerHTML = '';
        
        managedClasses.forEach(className => {
            const studentsInClass = users.filter(u => 
                u.role === 'student' && u.classSection === className
            ).length;
            
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            classCard.innerHTML = `
                <h4>${className}</h4>
                <p>${studentsInClass} student(s)</p>
                <button class="view-class-btn" data-class="${className}">View Class</button>
            `;
            
            classesList.appendChild(classCard);
        });
        
        // Add click handlers to view class buttons
        document.querySelectorAll('.view-class-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const className = this.getAttribute('data-class');
                localStorage.setItem('selectedClass', className);
                window.location.href = 'class-selection.html';
            });
        });
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '../../../index.html';
    }
    
});
