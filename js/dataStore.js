// ប្រព័ន្ធ Data Store មជ្ឈមណ្ឌល (Centralized Data Store System)
// Provides a centralized way to manage all application data

class DataStore {
    constructor() {
        this.storagePrefix = 'socialApp_';
        this.keys = {
            USERS: 'users',
            POSTS: 'posts',
            COMMENTS: 'comments',
            MESSAGES: 'messages',
            NOTIFICATIONS: 'notifications',
            CURRENT_USER: 'currentUser',
            DATA_INITIALIZED: 'dataInitialized'
        };
    }

    // ==================== Core Storage Methods ====================
    
    /**
     * Get data from localStorage with optional prefix
     * @param {string} key - Storage key
     * @param {boolean} usePrefix - Whether to use storage prefix
     * @returns {any} Parsed data or null
     */
    get(key, usePrefix = true) {
        try {
            const storageKey = usePrefix ? this.storagePrefix + key : key;
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting data for key "${key}":`, error);
            return null;
        }
    }

    /**
     * Set data in localStorage with optional prefix
     * @param {string} key - Storage key
     * @param {any} value - Data to store
     * @param {boolean} usePrefix - Whether to use storage prefix
     */
    set(key, value, usePrefix = true) {
        try {
            const storageKey = usePrefix ? this.storagePrefix + key : key;
            localStorage.setItem(storageKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting data for key "${key}":`, error);
            return false;
        }
    }

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @param {boolean} usePrefix - Whether to use storage prefix
     */
    remove(key, usePrefix = true) {
        try {
            const storageKey = usePrefix ? this.storagePrefix + key : key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error(`Error removing data for key "${key}":`, error);
            return false;
        }
    }

    /**
     * Clear all data from localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // ==================== User Management ====================
    
    /**
     * Get all users
     * @returns {Array} Array of user objects
     */
    getUsers() {
        return this.get(this.keys.USERS) || [];
    }

    /**
     * Save all users
     * @param {Array} users - Array of user objects
     */
    saveUsers(users) {
        return this.set(this.keys.USERS, users);
    }

    /**
     * Get user by username
     * @param {string} username - Username to search for
     * @returns {Object|null} User object or null
     */
    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username) || null;
    }

    /**
     * Get user by email
     * @param {string} email - Email to search for
     * @returns {Object|null} User object or null
     */
    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email) || null;
    }

    /**
     * Add new user
     * @param {Object} user - User object to add
     * @returns {boolean} Success status
     */
    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        return this.saveUsers(users);
    }

    /**
     * Update user data
     * @param {string} username - Username of user to update
     * @param {Object} updates - Object with fields to update
     * @returns {Object|null} Updated user or null
     */
    updateUser(username, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.username === username);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.saveUsers(users);
            
            // Update current user if it's the logged-in user
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.username === username) {
                this.setCurrentUser(users[index]);
            }
            
            return users[index];
        }
        
        return null;
    }

    /**
     * Delete user
     * @param {string} username - Username of user to delete
     * @returns {boolean} Success status
     */
    deleteUser(username) {
        const users = this.getUsers();
        const filteredUsers = users.filter(u => u.username !== username);
        
        if (filteredUsers.length < users.length) {
            return this.saveUsers(filteredUsers);
        }
        
        return false;
    }

    /**
     * Get current logged-in user
     * @returns {Object|null} Current user or null
     */
    getCurrentUser() {
        return this.get(this.keys.CURRENT_USER) || null;
    }

    /**
     * Set current logged-in user
     * @param {Object} user - User object
     */
    setCurrentUser(user) {
        return this.set(this.keys.CURRENT_USER, user);
    }

    /**
     * Clear current user (logout)
     */
    clearCurrentUser() {
        return this.remove(this.keys.CURRENT_USER);
    }

    // ==================== Posts Management ====================
    
    /**
     * Get all posts
     * @returns {Array} Array of post objects
     */
    getPosts() {
        return this.get(this.keys.POSTS) || [];
    }

    /**
     * Save all posts
     * @param {Array} posts - Array of post objects
     */
    savePosts(posts) {
        return this.set(this.keys.POSTS, posts);
    }

    /**
     * Get post by ID
     * @param {number} postId - Post ID
     * @returns {Object|null} Post object or null
     */
    getPostById(postId) {
        const posts = this.getPosts();
        return posts.find(p => p.id === postId) || null;
    }

    /**
     * Get posts by username
     * @param {string} username - Username
     * @returns {Array} Array of posts by user
     */
    getPostsByUsername(username) {
        const posts = this.getPosts();
        return posts.filter(p => p.username === username);
    }

    /**
     * Add new post
     * @param {Object} post - Post object to add
     * @returns {boolean} Success status
     */
    addPost(post) {
        const posts = this.getPosts();
        posts.unshift(post); // Add to beginning for reverse chronological order (newest first)
        return this.savePosts(posts);
    }

    /**
     * Update post
     * @param {number} postId - Post ID
     * @param {Object} updates - Object with fields to update
     * @returns {Object|null} Updated post or null
     */
    updatePost(postId, updates) {
        const posts = this.getPosts();
        const index = posts.findIndex(p => p.id === postId);
        
        if (index !== -1) {
            posts[index] = { ...posts[index], ...updates };
            this.savePosts(posts);
            return posts[index];
        }
        
        return null;
    }

    /**
     * Delete post
     * @param {number} postId - Post ID
     * @returns {boolean} Success status
     */
    deletePost(postId) {
        const posts = this.getPosts();
        const filteredPosts = posts.filter(p => p.id !== postId);
        
        if (filteredPosts.length < posts.length) {
            return this.savePosts(filteredPosts);
        }
        
        return false;
    }

    // ==================== Comments Management ====================
    
    /**
     * Get all comments
     * @returns {Array} Array of comment objects
     */
    getComments() {
        return this.get(this.keys.COMMENTS) || [];
    }

    /**
     * Save all comments
     * @param {Array} comments - Array of comment objects
     */
    saveComments(comments) {
        return this.set(this.keys.COMMENTS, comments);
    }

    /**
     * Get comments by post ID
     * @param {number} postId - Post ID
     * @returns {Array} Array of comments for post
     */
    getCommentsByPostId(postId) {
        const comments = this.getComments();
        return comments.filter(c => c.postId === postId);
    }

    /**
     * Add new comment
     * @param {Object} comment - Comment object to add
     * @returns {boolean} Success status
     */
    addComment(comment) {
        const comments = this.getComments();
        comments.push(comment);
        return this.saveComments(comments);
    }

    /**
     * Delete comment
     * @param {number} commentId - Comment ID
     * @returns {boolean} Success status
     */
    deleteComment(commentId) {
        const comments = this.getComments();
        const filteredComments = comments.filter(c => c.id !== commentId);
        
        if (filteredComments.length < comments.length) {
            return this.saveComments(filteredComments);
        }
        
        return false;
    }

    // ==================== Messages Management ====================
    
    /**
     * Get all messages
     * @returns {Array} Array of message objects
     */
    getMessages() {
        return this.get(this.keys.MESSAGES) || [];
    }

    /**
     * Save all messages
     * @param {Array} messages - Array of message objects
     */
    saveMessages(messages) {
        return this.set(this.keys.MESSAGES, messages);
    }

    /**
     * Get messages between two users
     * @param {string} user1 - First username
     * @param {string} user2 - Second username
     * @returns {Array} Array of messages between users
     */
    getMessagesBetweenUsers(user1, user2) {
        const messages = this.getMessages();
        return messages.filter(m => 
            (m.from === user1 && m.to === user2) || 
            (m.from === user2 && m.to === user1)
        );
    }

    /**
     * Get conversations for a user
     * @param {string} username - Username
     * @returns {Array} Array of conversation objects
     */
    getConversations(username) {
        const messages = this.getMessages();
        const conversations = {};
        
        messages.forEach(msg => {
            const otherUser = msg.from === username ? msg.to : msg.from;
            if (!conversations[otherUser]) {
                conversations[otherUser] = {
                    username: otherUser,
                    messages: [],
                    lastMessage: msg
                };
            }
            conversations[otherUser].messages.push(msg);
            if (new Date(msg.timestamp) > new Date(conversations[otherUser].lastMessage.timestamp)) {
                conversations[otherUser].lastMessage = msg;
            }
        });
        
        return Object.values(conversations);
    }

    /**
     * Add new message
     * @param {Object} message - Message object to add
     * @returns {boolean} Success status
     */
    addMessage(message) {
        const messages = this.getMessages();
        messages.push(message);
        return this.saveMessages(messages);
    }

    /**
     * Mark message as read
     * @param {number} messageId - Message ID
     * @returns {boolean} Success status
     */
    markMessageAsRead(messageId) {
        const messages = this.getMessages();
        const message = messages.find(m => m.id === messageId);
        
        if (message) {
            message.read = true;
            return this.saveMessages(messages);
        }
        
        return false;
    }

    // ==================== Notifications Management ====================
    
    /**
     * Get all notifications
     * @returns {Array} Array of notification objects
     */
    getNotifications() {
        return this.get(this.keys.NOTIFICATIONS) || [];
    }

    /**
     * Save all notifications
     * @param {Array} notifications - Array of notification objects
     */
    saveNotifications(notifications) {
        return this.set(this.keys.NOTIFICATIONS, notifications);
    }

    /**
     * Get notifications for user
     * @param {string} username - Username
     * @returns {Array} Array of notifications for user
     */
    getNotificationsForUser(username) {
        const notifications = this.getNotifications();
        return notifications.filter(n => n.username === username);
    }

    /**
     * Get unread notifications count for user
     * @param {string} username - Username
     * @returns {number} Count of unread notifications
     */
    getUnreadNotificationsCount(username) {
        const notifications = this.getNotificationsForUser(username);
        return notifications.filter(n => !n.read).length;
    }

    /**
     * Add new notification
     * @param {Object} notification - Notification object to add
     * @returns {boolean} Success status
     */
    addNotification(notification) {
        const notifications = this.getNotifications();
        notifications.push(notification);
        return this.saveNotifications(notifications);
    }

    /**
     * Mark notification as read
     * @param {number} notificationId - Notification ID
     * @returns {boolean} Success status
     */
    markNotificationAsRead(notificationId) {
        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        
        if (notification) {
            notification.read = true;
            return this.saveNotifications(notifications);
        }
        
        return false;
    }

    /**
     * Delete notification
     * @param {number} notificationId - Notification ID
     * @returns {boolean} Success status
     */
    deleteNotification(notificationId) {
        const notifications = this.getNotifications();
        const filteredNotifications = notifications.filter(n => n.id !== notificationId);
        
        if (filteredNotifications.length < notifications.length) {
            return this.saveNotifications(filteredNotifications);
        }
        
        return false;
    }

    // ==================== Initialization ====================
    
    /**
     * Check if data has been initialized
     * @returns {boolean} Initialization status
     */
    isDataInitialized() {
        return this.get(this.keys.DATA_INITIALIZED) === true;
    }

    /**
     * Mark data as initialized
     */
    markDataInitialized() {
        return this.set(this.keys.DATA_INITIALIZED, true);
    }

    /**
     * Initialize sample data for the application
     */
    initializeSampleData() {
        // ពិនិត្យថាតើមានទិន្នន័យរួចហើយឬនៅ
        if (this.isDataInitialized()) {
            return;
        }
        
        // បង្កើតអ្នកប្រើប្រាស់គំរូ
        const sampleUsers = [
            {
                username: 'admin',
                password: 'admin123',
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
        
        this.saveUsers(sampleUsers);
        
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
        
        this.savePosts(samplePosts);
        this.saveComments([]);
        this.saveMessages([]);
        this.saveNotifications([]);
        
        this.markDataInitialized();
    }

    // ==================== Export/Import ====================
    
    /**
     * Export all data as JSON string
     * @returns {string} JSON string of all data
     */
    exportData() {
        const data = {
            users: this.getUsers(),
            posts: this.getPosts(),
            comments: this.getComments(),
            messages: this.getMessages(),
            notifications: this.getNotifications(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    /**
     * Import data from JSON string
     * @param {string} jsonData - JSON string of data to import
     * @returns {boolean} Success status
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.users) this.saveUsers(data.users);
            if (data.posts) this.savePosts(data.posts);
            if (data.comments) this.saveComments(data.comments);
            if (data.messages) this.saveMessages(data.messages);
            if (data.notifications) this.saveNotifications(data.notifications);
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // ==================== Statistics ====================
    
    /**
     * Get storage statistics
     * @returns {Object} Object with storage statistics
     */
    getStatistics() {
        return {
            users: this.getUsers().length,
            posts: this.getPosts().length,
            comments: this.getComments().length,
            messages: this.getMessages().length,
            notifications: this.getNotifications().length,
            totalSize: this.getStorageSize()
        };
    }

    /**
     * Get total storage size used
     * @returns {string} Storage size in KB or MB
     */
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        const sizeInKB = (total / 1024).toFixed(2);
        return sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(2)} MB` : `${sizeInKB} KB`;
    }
}

// Create singleton instance
const dataStore = new DataStore();

// Initialize sample data when loaded (only once)
if (typeof window !== 'undefined') {
    dataStore.initializeSampleData();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataStore;
}
