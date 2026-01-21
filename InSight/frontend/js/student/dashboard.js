document.addEventListener('DOMContentLoaded', function() {
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'student') {
        alert('Please login as a student first!');
        window.location.href = '../../pages/login.html';
        return;
    }
    
    // Display student information
    displayStudentInfo(currentUser);
    
    // Menu button handlers
    const startGameBtn = document.getElementById('startGameBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const achievementsBtn = document.getElementById('achievementsBtn');
    const profileBtn = document.getElementById('profileBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const quitBtn = document.getElementById('quitBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Start Game button
    startGameBtn.addEventListener('click', function() {
        window.location.href = 'game.html';
    });
    
    // Leaderboard button (placeholder)
    leaderboardBtn.addEventListener('click', function() {
        alert('Leaderboard feature coming soon!');
    });
    
    // Achievements button (placeholder)
    achievementsBtn.addEventListener('click', function() {
        alert('Achievements feature coming soon!');
    });
    
    // Profile button (placeholder)
    profileBtn.addEventListener('click', function() {
        alert('Profile feature coming soon!');
    });
    
    // Settings button (placeholder)
    settingsBtn.addEventListener('click', function() {
        alert('Settings feature coming soon!');
    });
    
    // Quit button
    quitBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to quit?')) {
            logout();
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
    
    // Display student information
    function displayStudentInfo(user) {
        document.getElementById('studentName').textContent = user.fullName;
        document.getElementById('studentClass').textContent = user.classSection || 'N/A';
        document.getElementById('studentId').textContent = user.studentId || 'N/A';
        
        // Display level and points
        const level = user.level || 1;
        const points = user.totalPoints || 0;
        const nextLevelPoints = level * 100; // 100 points per level
        
        document.getElementById('currentLevel').textContent = level;
        document.getElementById('currentPoints').textContent = points;
        document.getElementById('nextLevelPoints').textContent = nextLevelPoints;
        
        // Update progress bar
        const progressPercentage = (points / nextLevelPoints) * 100;
        document.getElementById('levelProgress').style.width = progressPercentage + '%';
        
        // Display stats (placeholder data)
        document.getElementById('totalGames').textContent = user.gamesPlayed || 0;
        document.getElementById('timeSpent').textContent = (user.timeSpent || 0) + 'h';
        document.getElementById('achievementsCount').textContent = user.achievementsEarned || 0;
        document.getElementById('classRank').textContent = user.classRank || '-';
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '../../../index.html';
    }
    
});
