document.addEventListener('DOMContentLoaded', function() {
    
    // Check if user is logged in as admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Access denied! Admin only.');
        window.location.href = '../../pages/login.html';
        return;
    }
    
    // Display admin information
    displayAdminInfo(currentUser);
    
    // Load statistics
    loadStatistics();
    
    // Load all users
    loadUsers('all');
    
    // Event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    const roleFilter = document.getElementById('roleFilter');
    const searchBtn = document.getElementById('searchBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const editModal = document.getElementById('editModal');
    const viewModal = document.getElementById('viewModal');
    const closeModal = document.querySelector('.close');
    const closeViewModal = document.querySelector('.close-view');
    const cancelEdit = document.getElementById('cancelEdit');
    const closeView = document.getElementById('closeView');
    const editUserForm = document.getElementById('editUserForm');
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
    
    // Filter by role
    roleFilter.addEventListener('change', function() {
        loadUsers(this.value);
    });
    
    // Search users
    searchBtn.addEventListener('click', function() {
        const searchTerm = document.getElementById('searchUser').value;
        searchUsers(searchTerm);
    });
    
    // Refresh users
    refreshBtn.addEventListener('click', function() {
        document.getElementById('searchUser').value = '';
        roleFilter.value = 'all';
        loadUsers('all');
    });
    
    // Close modals
    closeModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });
    
    closeViewModal.addEventListener('click', function() {
        viewModal.style.display = 'none';
    });
    
    cancelEdit.addEventListener('click', function() {
        editModal.style.display = 'none';
    });
    
    closeView.addEventListener('click', function() {
        viewModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
        if (e.target === viewModal) {
            viewModal.style.display = 'none';
        }
    });
    
    // Edit user form submission
    editUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveUserChanges();
    });
    
    // Display admin information
    function displayAdminInfo(user) {
        document.getElementById('adminName').textContent = user.fullName;
        document.getElementById('adminId').textContent = user.adminId || 'N/A';
        document.getElementById('adminDepartment').textContent = user.adminDepartment || 'N/A';
    }
    
    // Load statistics
    function loadStatistics() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const classes = JSON.parse(localStorage.getItem('classes')) || [];
        
        const students = users.filter(u => u.role === 'student');
        const teachers = users.filter(u => u.role === 'teacher');
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('totalTeachers').textContent = teachers.length;
        document.getElementById('totalClasses').textContent = classes.length;
    }
    
    // Load users
    function loadUsers(roleFilter) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = document.getElementById('usersTableBody');
        
        // Filter users by role
        let filteredUsers = users;
        if (roleFilter !== 'all') {
            filteredUsers = users.filter(u => u.role === roleFilter);
        }
        
        // Clear table
        tbody.innerHTML = '';
        
        // Populate table
        if (filteredUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
            return;
        }
        
        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            const createdDate = new Date(user.createdAt).toLocaleDateString();
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                <td>${createdDate}</td>
                <td class="action-buttons">
                    <button class="btn-view" data-username="${user.username}">View</button>
                    <button class="btn-edit" data-username="${user.username}">Edit</button>
                    <button class="btn-delete" data-username="${user.username}">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        addActionListeners();
    }
    
    // Search users
    function searchUsers(searchTerm) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = document.getElementById('usersTableBody');
        
        const filteredUsers = users.filter(u => 
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        tbody.innerHTML = '';
        
        if (filteredUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
            return;
        }
        
        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            const createdDate = new Date(user.createdAt).toLocaleDateString();
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                <td>${createdDate}</td>
                <td class="action-buttons">
                    <button class="btn-view" data-username="${user.username}">View</button>
                    <button class="btn-edit" data-username="${user.username}">Edit</button>
                    <button class="btn-delete" data-username="${user.username}">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        addActionListeners();
    }
    
    // Add event listeners to action buttons
    function addActionListeners() {
        // View buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                viewUser(username);
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                editUser(username);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                deleteUser(username);
            });
        });
    }
    
    // View user details
    function viewUser(username) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username);
        
        if (!user) {
            alert('User not found!');
            return;
        }
        
        const viewDetails = document.getElementById('viewUserDetails');
        
        let detailsHTML = `
            <div class="user-details">
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Full Name:</strong> ${user.fullName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <p><strong>Created At:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
        `;
        
        if (user.role === 'student') {
            detailsHTML += `
                <hr>
                <h3>Student Information</h3>
                <p><strong>Student ID:</strong> ${user.studentId || 'N/A'}</p>
                <p><strong>Class/Section:</strong> ${user.classSection || 'N/A'}</p>
                <p><strong>Total Points:</strong> ${user.totalPoints || 0}</p>
                <p><strong>Level:</strong> ${user.level || 1}</p>
                <p><strong>Games Played:</strong> ${user.gamesPlayed || 0}</p>
                <p><strong>Time Spent:</strong> ${user.timeSpent || 0} hours</p>
                <p><strong>Achievements Earned:</strong> ${user.achievementsEarned || 0}</p>
            `;
        } else if (user.role === 'teacher') {
            detailsHTML += `
                <hr>
                <h3>Teacher Information</h3>
                <p><strong>Teacher ID:</strong> ${user.teacherId || 'N/A'}</p>
                <p><strong>Department:</strong> ${user.department || 'N/A'}</p>
                <p><strong>Managed Classes:</strong> ${user.managedClasses ? user.managedClasses.join(', ') : 'None'}</p>
            `;
        } else if (user.role === 'admin') {
            detailsHTML += `
                <hr>
                <h3>Admin Information</h3>
                <p><strong>Admin ID:</strong> ${user.adminId || 'N/A'}</p>
                <p><strong>Department:</strong> ${user.adminDepartment || 'N/A'}</p>
            `;
        }
        
        detailsHTML += '</div>';
        viewDetails.innerHTML = detailsHTML;
        
        viewModal.style.display = 'block';
    }
    
    // Edit user
    function editUser(username) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username);
        
        if (!user) {
            alert('User not found!');
            return;
        }
        
        // Populate form
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editFullName').value = user.fullName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editRole').value = user.role;
        
        // Hide all role-specific fields
        document.getElementById('editStudentFields').style.display = 'none';
        document.getElementById('editTeacherFields').style.display = 'none';
        
        // Show role-specific fields
        if (user.role === 'student') {
            document.getElementById('editStudentFields').style.display = 'block';
            document.getElementById('editStudentId').value = user.studentId || '';
            document.getElementById('editTotalPoints').value = user.totalPoints || 0;
            document.getElementById('editLevel').value = user.level || 1;
            
            // Load classes for dropdown
            const classes = JSON.parse(localStorage.getItem('classes')) || [];
            const classSelect = document.getElementById('editClassSection');
            classSelect.innerHTML = '<option value="">-- Select Class --</option>';
            classes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.name;
                option.textContent = c.name;
                if (c.name === user.classSection) {
                    option.selected = true;
                }
                classSelect.appendChild(option);
            });
        } else if (user.role === 'teacher') {
            document.getElementById('editTeacherFields').style.display = 'block';
            document.getElementById('editTeacherId').value = user.teacherId || '';
            document.getElementById('editDepartment').value = user.department || '';
            document.getElementById('editManagedClasses').value = user.managedClasses ? user.managedClasses.join(', ') : '';
        }
        
        editModal.style.display = 'block';
    }
    
    // Save user changes
    function saveUserChanges() {
        const username = document.getElementById('editUsername').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
            alert('User not found!');
            return;
        }
        
        const user = users[userIndex];
        
        // Update basic info
        user.fullName = document.getElementById('editFullName').value;
        user.email = document.getElementById('editEmail').value;
        user.phone = document.getElementById('editPhone').value;
        
        // Update role-specific info
        if (user.role === 'student') {
            user.studentId = document.getElementById('editStudentId').value;
            user.classSection = document.getElementById('editClassSection').value;
            user.totalPoints = parseInt(document.getElementById('editTotalPoints').value) || 0;
            user.level = parseInt(document.getElementById('editLevel').value) || 1;
        } else if (user.role === 'teacher') {
            user.teacherId = document.getElementById('editTeacherId').value;
            user.department = document.getElementById('editDepartment').value;
            const classesInput = document.getElementById('editManagedClasses').value;
            user.managedClasses = classesInput.split(',').map(c => c.trim()).filter(c => c !== '');
        }
        
        // Save to localStorage
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user if editing self
        if (currentUser.username === username) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        alert('User updated successfully!');
        editModal.style.display = 'none';
        loadUsers(roleFilter.value);
        loadStatistics();
    }
    
    // Delete user
    function deleteUser(username) {
        if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone!`)) {
            return;
        }
        
        // Prevent admin from deleting themselves
        if (currentUser.username === username) {
            alert('You cannot delete your own account!');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const filteredUsers = users.filter(u => u.username !== username);
        
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        
        alert('User deleted successfully!');
        loadUsers(roleFilter.value);
        loadStatistics();
    }
    
    // Logout
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '../../../index.html';
    }
    
});