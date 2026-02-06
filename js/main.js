// ឧបករណ៍ប្រើប្រាស់ទូទៅ (Common Utilities)

// ពិនិត្យ Session
function checkSession() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// លុប Session
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ទទួលបានអ្នកប្រើប្រាស់ទាំងអស់
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// រក្សាទុកអ្នកប្រើប្រាស់ទាំងអស់
function saveAllUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// ស្វែងរកអ្នកប្រើប្រាស់តាម username
function findUserByUsername(username) {
    const users = getAllUsers();
    return users.find(u => u.username === username);
}

// ធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់
function updateUser(username, updates) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        saveAllUsers(users);
        
        // ធ្វើបច្ចុប្បន្នភាព current user ប្រសិនបើវាជាអ្នកប្រើប្រាស់បច្ចុប្បន្ន
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.username === username) {
            localStorage.setItem('currentUser', JSON.stringify(users[index]));
        }
        
        return users[index];
    }
    return null;
}

// ទទួលបានប្រកាសទាំងអស់
function getAllPosts() {
    const posts = localStorage.getItem('posts');
    return posts ? JSON.parse(posts) : [];
}

// រក្សាទុកប្រកាសទាំងអស់
function saveAllPosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// ទទួលបានមតិយោបល់ទាំងអស់
function getAllComments() {
    const comments = localStorage.getItem('comments');
    return comments ? JSON.parse(comments) : [];
}

// រក្សាទុកមតិយោបល់ទាំងអស់
function saveAllComments(comments) {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// ទទួលបានសារទាំងអស់
function getAllMessages() {
    const messages = localStorage.getItem('messages');
    return messages ? JSON.parse(messages) : [];
}

// រក្សាទុកសារទាំងអស់
function saveAllMessages(messages) {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// ទទួលបានជូនដំណឹងទាំងអស់
function getAllNotifications() {
    const notifications = localStorage.getItem('notifications');
    return notifications ? JSON.parse(notifications) : [];
}

// រក្សាទុកជូនដំណឹងទាំងអស់
function saveAllNotifications(notifications) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// បង្កើតជូនដំណឹង
function createNotification(username, type, fromUser, postId = null) {
    const notifications = getAllNotifications();
    const notification = {
        id: Date.now(),
        username: username,
        type: type, // 'like', 'comment', 'follow'
        fromUser: fromUser,
        postId: postId,
        read: false,
        timestamp: new Date().toISOString()
    };
    notifications.push(notification);
    saveAllNotifications(notifications);
}

// Format time ago
function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now - past) / 1000);
    
    if (seconds < 60) return 'ម្តងនេះ';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} នាទីមុន`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ម៉ោងមុន`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ថ្ងៃមុន`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} សប្តាហ៍មុន`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ខែមុន`;
    const years = Math.floor(days / 365);
    return `${years} ឆ្នាំមុន`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize sample data
function initializeSampleData() {
    // ពិនិត្យថាតើមានទិន្នន័យរួចហើយឬនៅ
    if (localStorage.getItem('dataInitialized')) {
        return;
    }
    
    // បង្កើតអ្នកប្រើប្រាស់គំរូ
    const sampleUsers = [
        {
            username: 'admin',
            password: 'admin123', // In production, this should be hashed
            fullName: 'Admin User',
            email: 'admin@social.com',
            bio: 'Administrator of this social platform',
            profileImage: '',
            followers: [],
            following: [],
            createdAt: new Date().toISOString()
        },
        {
            username: 'sokha',
            password: 'sokha123',
            fullName: 'Sok Sokha',
            email: 'sokha@example.com',
            bio: 'Software Developer from Phnom Penh 🇰🇭',
            profileImage: '',
            followers: [],
            following: [],
            createdAt: new Date().toISOString()
        },
        {
            username: 'dara',
            password: 'dara123',
            fullName: 'Chea Dara',
            email: 'dara@example.com',
            bio: 'Designer & Creative Thinker',
            profileImage: '',
            followers: [],
            following: [],
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('users', JSON.stringify(sampleUsers));
    
    // បង្កើតប្រកាសគំរូ
    const samplePosts = [
        {
            id: Date.now() - 3600000,
            username: 'admin',
            content: 'Welcome to our Social Platform! 🎉 Share your thoughts and connect with friends.',
            image: '',
            likes: [],
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: Date.now() - 7200000,
            username: 'sokha',
            content: 'Just finished building an amazing web application! 💻 #coding #webdev',
            image: '',
            likes: [],
            timestamp: new Date(Date.now() - 7200000).toISOString()
        }
    ];
    
    localStorage.setItem('posts', JSON.stringify(samplePosts));
    localStorage.setItem('comments', JSON.stringify([]));
    localStorage.setItem('messages', JSON.stringify([]));
    localStorage.setItem('notifications', JSON.stringify([]));
    
    localStorage.setItem('dataInitialized', 'true');
}

// Initialize data when page loads
if (typeof window !== 'undefined') {
    initializeSampleData();
}
