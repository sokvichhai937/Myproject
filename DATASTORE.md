# Data Store Documentation
# ឯកសារណែនាំប្រព័ន្ធ Data Store

## Overview (ទិដ្ឋភាពទូទៅ)

The Data Store is a centralized data management system for the Social Platform application. It provides a clean, consistent API for managing all application data stored in localStorage.

ប្រព័ន្ធ Data Store គឺជាប្រព័ន្ធគ្រប់គ្រងទិន្នន័យមជ្ឈមណ្ឌលសម្រាប់កម្មវិធី Social Platform។ វាផ្តល់នូវ API ស្អាត និងសម្របសម្រួលសម្រាប់ការគ្រប់គ្រងទិន្នន័យទាំងអស់របស់កម្មវិធីដែលរក្សាទុកនៅក្នុង localStorage។

## Features (មុខងារ)

### Core Features (មុខងារសំខាន់)
- **Centralized API**: Single point of access for all data operations
- **Error Handling**: Built-in try-catch blocks with error logging
- **Type Safety**: Consistent data structures and validation
- **Performance**: Optimized for speed with efficient queries
- **Backward Compatible**: Works alongside existing code without conflicts

### Data Management (ការគ្រប់គ្រងទិន្នន័យ)
- Users management
- Posts management
- Comments management
- Messages management
- Notifications management
- Current user session management

### Advanced Features (មុខងារកម្រិតខ្ពស់)
- Export/Import data as JSON
- Storage statistics and size tracking
- Batch operations support
- Data validation
- Query helpers

## Installation (ការដំឡើង)

Add the dataStore.js script to your HTML file:

```html
<script src="js/dataStore.js"></script>
```

The DataStore automatically initializes with sample data on first load.

## Usage Examples (ឧទាហរណ៍ការប្រើប្រាស់)

### Basic Operations (ប្រតិបត្តិការមូលដ្ឋាន)

#### Users (អ្នកប្រើប្រាស់)

```javascript
// Get all users
const users = dataStore.getUsers();

// Get user by username
const user = dataStore.getUserByUsername('admin');

// Get user by email
const user = dataStore.getUserByEmail('admin@social.com');

// Add new user
dataStore.addUser({
    username: 'newuser',
    password: 'password123',
    fullName: 'New User',
    email: 'new@example.com',
    bio: '',
    profileImage: '',
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
});

// Update user
dataStore.updateUser('admin', {
    bio: 'Updated bio text',
    profileImage: 'base64imagedata...'
});

// Delete user
dataStore.deleteUser('username');

// Get current logged-in user
const currentUser = dataStore.getCurrentUser();

// Set current user (login)
dataStore.setCurrentUser(userObject);

// Clear current user (logout)
dataStore.clearCurrentUser();
```

#### Posts (ប្រកាស)

```javascript
// Get all posts
const posts = dataStore.getPosts();

// Get post by ID
const post = dataStore.getPostById(12345);

// Get posts by user
const userPosts = dataStore.getPostsByUsername('admin');

// Add new post
dataStore.addPost({
    id: Date.now(),
    username: 'admin',
    content: 'Hello World!',
    image: '',
    likes: [],
    timestamp: new Date().toISOString()
});

// Update post (e.g., add like)
const post = dataStore.getPostById(12345);
post.likes.push('username');
dataStore.updatePost(12345, { likes: post.likes });

// Delete post
dataStore.deletePost(12345);
```

#### Comments (មតិយោបល់)

```javascript
// Get all comments
const comments = dataStore.getComments();

// Get comments for a post
const postComments = dataStore.getCommentsByPostId(12345);

// Add comment
dataStore.addComment({
    id: Date.now(),
    postId: 12345,
    username: 'admin',
    content: 'Great post!',
    timestamp: new Date().toISOString()
});

// Delete comment
dataStore.deleteComment(67890);
```

#### Messages (សារ)

```javascript
// Get all messages
const messages = dataStore.getMessages();

// Get messages between two users
const conversation = dataStore.getMessagesBetweenUsers('user1', 'user2');

// Get all conversations for a user
const conversations = dataStore.getConversations('admin');

// Add message
dataStore.addMessage({
    id: Date.now(),
    from: 'admin',
    to: 'sokha',
    content: 'Hello!',
    read: false,
    timestamp: new Date().toISOString()
});

// Mark message as read
dataStore.markMessageAsRead(12345);
```

#### Notifications (ជូនដំណឹង)

```javascript
// Get all notifications
const notifications = dataStore.getNotifications();

// Get notifications for user
const userNotifications = dataStore.getNotificationsForUser('admin');

// Get unread count
const unreadCount = dataStore.getUnreadNotificationsCount('admin');

// Add notification
dataStore.addNotification({
    id: Date.now(),
    username: 'admin',
    type: 'like',
    fromUser: 'sokha',
    postId: 12345,
    read: false,
    timestamp: new Date().toISOString()
});

// Mark as read
dataStore.markNotificationAsRead(12345);

// Delete notification
dataStore.deleteNotification(12345);
```

### Advanced Operations (ប្រតិបត្តិការកម្រិតខ្ពស់)

#### Export Data (នាំចេញទិន្នន័យ)

```javascript
// Export all data as JSON string
const jsonData = dataStore.exportData();

// Save to file
const blob = new Blob([jsonData], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'social-data.json';
a.click();
```

#### Import Data (នាំចូលទិន្នន័យ)

```javascript
// Import data from JSON string
const success = dataStore.importData(jsonString);
if (success) {
    console.log('Data imported successfully');
}
```

#### Statistics (ស្ថិតិ)

```javascript
// Get storage statistics
const stats = dataStore.getStatistics();
console.log(stats);
// Output: {
//   users: 3,
//   posts: 2,
//   comments: 0,
//   messages: 0,
//   notifications: 0,
//   totalSize: '1.15 KB'
// }

// Get storage size
const size = dataStore.getStorageSize();
console.log(size); // "1.15 KB"
```

#### Direct Storage Access (ការចូលប្រើ Storage ដោយផ្ទាល់)

```javascript
// Low-level get/set operations with prefix
dataStore.set('customKey', { data: 'value' });
const data = dataStore.get('customKey');

// Without prefix
dataStore.set('key', value, false);
const value = dataStore.get('key', false);

// Remove data
dataStore.remove('customKey');

// Clear all data
dataStore.clear();
```

## API Reference (សំណើ API)

### DataStore Class

#### Constructor
```javascript
new DataStore()
```

#### Properties
- `storagePrefix`: String prefix for all keys (default: 'socialApp_')
- `keys`: Object containing key constants

#### Methods

##### Core Storage
- `get(key, usePrefix)`: Get data from localStorage
- `set(key, value, usePrefix)`: Set data in localStorage
- `remove(key, usePrefix)`: Remove data from localStorage
- `clear()`: Clear all data

##### Users
- `getUsers()`: Get all users
- `saveUsers(users)`: Save all users
- `getUserByUsername(username)`: Get user by username
- `getUserByEmail(email)`: Get user by email
- `addUser(user)`: Add new user
- `updateUser(username, updates)`: Update user
- `deleteUser(username)`: Delete user
- `getCurrentUser()`: Get current logged-in user
- `setCurrentUser(user)`: Set current user
- `clearCurrentUser()`: Clear current user

##### Posts
- `getPosts()`: Get all posts
- `savePosts(posts)`: Save all posts
- `getPostById(postId)`: Get post by ID
- `getPostsByUsername(username)`: Get posts by user
- `addPost(post)`: Add new post
- `updatePost(postId, updates)`: Update post
- `deletePost(postId)`: Delete post

##### Comments
- `getComments()`: Get all comments
- `saveComments(comments)`: Save all comments
- `getCommentsByPostId(postId)`: Get comments for post
- `addComment(comment)`: Add new comment
- `deleteComment(commentId)`: Delete comment

##### Messages
- `getMessages()`: Get all messages
- `saveMessages(messages)`: Save all messages
- `getMessagesBetweenUsers(user1, user2)`: Get conversation
- `getConversations(username)`: Get all conversations
- `addMessage(message)`: Add new message
- `markMessageAsRead(messageId)`: Mark as read

##### Notifications
- `getNotifications()`: Get all notifications
- `saveNotifications(notifications)`: Save all notifications
- `getNotificationsForUser(username)`: Get user notifications
- `getUnreadNotificationsCount(username)`: Get unread count
- `addNotification(notification)`: Add notification
- `markNotificationAsRead(notificationId)`: Mark as read
- `deleteNotification(notificationId)`: Delete notification

##### Utilities
- `isDataInitialized()`: Check if initialized
- `markDataInitialized()`: Mark as initialized
- `initializeSampleData()`: Initialize sample data
- `exportData()`: Export all data as JSON
- `importData(jsonData)`: Import data from JSON
- `getStatistics()`: Get storage statistics
- `getStorageSize()`: Get total storage size

## Data Structures (រចនាសម្ព័ន្ធទិន្នន័យ)

### User Object
```javascript
{
    username: String,
    password: String,
    fullName: String,
    email: String,
    bio: String,
    profileImage: String,
    followers: Array<String>,
    following: Array<String>,
    createdAt: String (ISO 8601)
}
```

### Post Object
```javascript
{
    id: Number,
    username: String,
    content: String,
    image: String,
    likes: Array<String>,
    timestamp: String (ISO 8601)
}
```

### Comment Object
```javascript
{
    id: Number,
    postId: Number,
    username: String,
    content: String,
    timestamp: String (ISO 8601)
}
```

### Message Object
```javascript
{
    id: Number,
    from: String,
    to: String,
    content: String,
    read: Boolean,
    timestamp: String (ISO 8601)
}
```

### Notification Object
```javascript
{
    id: Number,
    username: String,
    type: String ('like', 'comment', 'follow'),
    fromUser: String,
    postId: Number (optional),
    read: Boolean,
    timestamp: String (ISO 8601)
}
```

## Best Practices (ការអនុវត្តល្អបំផុត)

1. **Always check return values**: Some methods return null if data not found
2. **Use timestamps**: Always use ISO 8601 format for dates
3. **Validate data**: Check data before saving to ensure consistency
4. **Handle errors**: Wrap operations in try-catch if needed
5. **Export regularly**: Backup your data using exportData()
6. **Keep IDs unique**: Use Date.now() for generating unique IDs

## Migration Guide (មគ្គុទ្ទេសការផ្លាស់ប្តូរ)

### From main.js functions to DataStore

Old way:
```javascript
const users = getAllUsers();
saveAllUsers(users);
const user = findUserByUsername('admin');
```

New way:
```javascript
const users = dataStore.getUsers();
dataStore.saveUsers(users);
const user = dataStore.getUserByUsername('admin');
```

The old functions in main.js still work for backward compatibility, but using DataStore is recommended for new code.

## Demo Page (ទំព័របង្ហាញ)

Visit `datastore-demo.html` to see the Data Store in action. The demo includes:
- Live statistics display
- Data export/import interface
- User listing
- Recent posts view
- Data management operations

## Browser Compatibility (ការគាំទ្រ Browser)

Works in all modern browsers that support:
- localStorage API
- ES6 JavaScript
- JSON.parse/JSON.stringify

## Limitations (កម្រិត)

- localStorage has size limit (~5-10MB depending on browser)
- Data is stored per domain
- Clearing browser data will delete all stored data
- No encryption (passwords stored in plain text)
- Synchronous operations (may block on large datasets)

## Future Enhancements (ការកែលម្អនាពេលអនាគត)

- IndexedDB support for larger datasets
- Encryption for sensitive data
- Async operations
- Data compression
- Auto-backup to server
- Real-time sync across tabs

## Support (ការគាំទ្រ)

For questions or issues:
1. Check this documentation
2. Review code examples in datastore-demo.html
3. Open an issue on GitHub

## License

MIT License - Free to use for learning and personal projects.
