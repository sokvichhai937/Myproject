# Social Platform Project (គេហទំព័រសង្គម)

A complete social media platform built with Bootstrap 5, HTML, CSS, and vanilla JavaScript.

## Features (មុខងារ)

### 1. Registration/Login System (ប្រព័ន្ធចុះឈ្មោះ/ចូលប្រើ)
- User registration with form validation
- Login functionality
- Session management with localStorage
- Password validation

### 2. User Profiles (Profile អ្នកប្រើប្រាស់)
- Personal profile pages
- Edit profile (name, bio, profile image)
- View user's posts
- Followers and following count
- Follow/Unfollow functionality

### 3. Posts (បង្ហោះប្រកាស)
- Create posts with text and images
- News Feed with all posts
- Delete own posts
- Timestamp display
- Image upload with preview

### 4. Comments (មតិយោបល់)
- Comment system for posts
- View comment count
- Add and delete comments
- Real-time comment updates

### 5. Like Functionality (ចូលចិត្ត)
- Like/Unlike posts
- Like count display
- Visual feedback on like status

### 6. Follow Users (តាមដាន)
- Follow/Unfollow other users
- View followers and following lists
- Update follower counts

### 7. Notifications (ការជូនដំណឹង)
- Notification system for likes, comments, and follows
- Notification badge with count
- Mark as read functionality
- Delete notifications

### 8. Messaging/Chat (ផ្ញើសារ)
- Direct messaging system
- Conversation list
- Chat interface
- Unread message indicators
- Message timestamps

### 9. Image Upload (បង្ហោះរូបភាព)
- Profile image upload
- Post image upload
- Image preview before upload
- Images stored in base64 format

## File Structure (រចនាសម្ព័ន្ធឯកសារ)

```
/
├── index.html              # Login page
├── register.html           # Registration page
├── home.html              # News Feed/Home page
├── profile.html           # User profile page
├── messages.html          # Messaging page
├── notifications.html     # Notifications page
├── datastore-demo.html    # Data Store demo page
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── auth.js           # Authentication logic
│   ├── posts.js          # Posts functionality
│   ├── profile.js        # Profile management
│   ├── messages.js       # Messaging system
│   ├── notifications.js  # Notifications
│   ├── dataStore.js      # Centralized Data Store (NEW!)
│   └── main.js           # Common utilities
└── assets/
    └── images/           # Default images
```

## Technologies Used (បច្ចេកវិទ្យាដែលប្រើ)

- **Bootstrap 5**: Responsive UI framework
- **HTML5**: Structure and markup
- **CSS3**: Custom styling
- **Vanilla JavaScript**: All functionality (no frameworks)
- **localStorage**: Data persistence

## Installation & Usage (ការដំឡើង និងការប្រើប្រាស់)

### 1. Clone or Download
```bash
git clone https://github.com/sokvichhai937/Myproject.git
cd Myproject
```

### 2. Open in Browser
Simply open `index.html` in your web browser. No build process or server required!

### 3. Default Test Accounts (គណនីសាកល្បង)

You can login with these test accounts:

- **Username**: `admin` / **Password**: `admin123`
- **Username**: `sokha` / **Password**: `sokha123`
- **Username**: `dara` / **Password**: `dara123`

Or create your own account by clicking "បង្កើតគណនីថ្មី" (Create New Account).

## Features Details (លម្អិតមុខងារ)

### Data Storage
All data is stored in browser's localStorage:
- Users information
- Posts
- Comments
- Messages
- Notifications
- Follow relationships

**NEW: Centralized Data Store System**

A new centralized Data Store module (`dataStore.js`) is now available that provides:
- **Organized API**: Clean, consistent methods for all data operations
- **Better Error Handling**: Try-catch blocks and error logging
- **Enhanced Features**: 
  - Export/Import data functionality
  - Storage statistics and size tracking
  - Batch operations
  - Data validation
- **Demo Page**: Visit `datastore-demo.html` to explore the Data Store features
- **Backward Compatible**: Existing code continues to work without changes

To use the new Data Store in your code:
```javascript
// Get all users
const users = dataStore.getUsers();

// Add a new post
dataStore.addPost({
    id: Date.now(),
    username: 'user123',
    content: 'Hello World!',
    likes: [],
    timestamp: new Date().toISOString()
});

// Export all data
const jsonData = dataStore.exportData();

// Get statistics
const stats = dataStore.getStatistics();
```

### Security Features
- Input sanitization to prevent XSS attacks
- Form validation (client-side)
- Password requirements (minimum 6 characters)
- Email validation
- HTML escape for user content

### Responsive Design
- Mobile-friendly navigation
- Responsive cards and grids
- Works on all screen sizes
- Bootstrap 5 responsive utilities

### User Experience
- Clean and modern interface
- Smooth animations
- Loading states
- Error handling with user feedback
- Time ago format for timestamps
- Profile image placeholders
- Notification badges
- Unread message indicators

## How to Use (របៀបប្រើប្រាស់)

### 1. Registration (ចុះឈ្មោះ)
1. Go to `register.html`
2. Fill in your full name, username, email, and password
3. Click "ចុះឈ្មោះ" (Register)

### 2. Login (ចូលប្រើប្រាស់)
1. Go to `index.html`
2. Enter your username and password
3. Click "ចូលប្រើប្រាស់" (Login)

### 3. Create Post (បង្កើតប្រកាស)
1. Go to home page
2. Type your message in the text area
3. Optionally add an image
4. Click "បង្ហោះ" (Post)

### 4. Interact with Posts
- Click heart icon to like/unlike
- Click comment icon to view/add comments
- Delete your own posts with the trash icon

### 5. Follow Users (តាមដាន)
1. Go to a user's profile
2. Click "តាមដាន" (Follow) button
3. View their posts in your feed

### 6. Send Messages (ផ្ញើសារ)
1. Go to Messages page
2. Click on a conversation or start a new one
3. Type your message and click send

### 7. View Notifications (មើលជូនដំណឹង)
1. Check the notification badge in navigation
2. Go to Notifications page
3. Click on a notification to view details

### 8. Edit Profile (កែប្រែ Profile)
1. Go to your profile page
2. Click "កែប្រែ Profile" (Edit Profile)
3. Update your name, bio, or profile image
4. Click "រក្សាទុក" (Save)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Notes (កំណត់ចំណាំ)

- This is a client-side only application using localStorage
- Data is stored locally in your browser
- Clearing browser data will delete all information
- Images are stored as base64 strings (5MB limit)
- No backend server required

## Future Enhancements (ការកែលម្អនាពេលអនាគត)

- Real-time updates with WebSocket
- Backend API integration
- Database storage
- User authentication with JWT
- Password hashing
- Email verification
- Search functionality enhancement
- Dark mode toggle
- Post sharing
- Hashtags
- Stories feature
- Video upload support

## Credits

Created for educational purposes to demonstrate social media platform features using vanilla JavaScript and Bootstrap.

## License

MIT License - Free to use for learning and personal projects.
