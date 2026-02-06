// ប្រព័ន្ធ Profile (Profile System)

// Toggle follow/unfollow
function toggleFollow(targetUsername, currentUsername) {
    if (targetUsername === currentUsername) {
        return { success: false, message: 'អ្នកមិនអាចតាមដានខ្លួនឯងបានទេ' };
    }
    
    const users = getAllUsers();
    const currentUser = users.find(u => u.username === currentUsername);
    const targetUser = users.find(u => u.username === targetUsername);
    
    if (!currentUser || !targetUser) {
        return { success: false, message: 'រកមិនឃើញអ្នកប្រើប្រាស់' };
    }
    
    // Check if already following
    const followingIndex = currentUser.following.indexOf(targetUsername);
    const followerIndex = targetUser.followers.indexOf(currentUsername);
    
    if (followingIndex === -1) {
        // Follow
        currentUser.following.push(targetUsername);
        targetUser.followers.push(currentUsername);
        
        // បង្កើតជូនដំណឹង
        createNotification(targetUsername, 'follow', currentUsername);
        
        saveAllUsers(users);
        
        // Update current user session
        if (localStorage.getItem('currentUser')) {
            const sessionUser = JSON.parse(localStorage.getItem('currentUser'));
            if (sessionUser.username === currentUsername) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
        
        return { success: true, following: true, followersCount: targetUser.followers.length };
    } else {
        // Unfollow
        currentUser.following.splice(followingIndex, 1);
        targetUser.followers.splice(followerIndex, 1);
        
        saveAllUsers(users);
        
        // Update current user session
        if (localStorage.getItem('currentUser')) {
            const sessionUser = JSON.parse(localStorage.getItem('currentUser'));
            if (sessionUser.username === currentUsername) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
        
        return { success: true, following: false, followersCount: targetUser.followers.length };
    }
}

// ធ្វើបច្ចុប្បន្នភាព profile
function updateProfile(username, updates) {
    const result = updateUser(username, updates);
    
    if (result) {
        return { success: true, message: 'ធ្វើបច្ចុប្បន្នភាព Profile ជោគជ័យ', user: result };
    }
    
    return { success: false, message: 'មិនអាចធ្វើបច្ចុប្បន្នភាព Profile បានទេ' };
}

// Load and display profile
function loadProfile(username) {
    const user = findUserByUsername(username);
    const currentUser = checkSession();
    
    if (!user) {
        document.body.innerHTML = '<div class="container mt-5"><div class="alert alert-danger">រកមិនឃើញអ្នកប្រើប្រាស់</div></div>';
        return;
    }
    
    const isOwnProfile = currentUser && currentUser.username === username;
    const isFollowing = currentUser && currentUser.following.includes(username);
    
    // Display profile header
    const profileHeader = document.getElementById('profileHeader');
    if (profileHeader) {
        profileHeader.innerHTML = `
            <div class="row">
                <div class="col-md-3 text-center">
                    <div class="profile-image-large mb-3">
                        ${user.profileImage ? `<img src="${user.profileImage}" alt="${user.fullName}">` : 
                        `<div class="profile-placeholder">${user.fullName.charAt(0)}</div>`}
                    </div>
                    ${isOwnProfile ? `
                        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                            <i class="bi bi-pencil"></i> កែប្រែ Profile
                        </button>
                    ` : `
                        <button class="btn ${isFollowing ? 'btn-outline-primary' : 'btn-primary'} btn-sm" id="followBtn">
                            <i class="bi bi-person-${isFollowing ? 'check' : 'plus'}"></i>
                            ${isFollowing ? 'កំពុងតាមដាន' : 'តាមដាន'}
                        </button>
                    `}
                </div>
                <div class="col-md-9">
                    <h2>${escapeHtml(user.fullName)}</h2>
                    <p class="text-muted">@${user.username}</p>
                    ${user.bio ? `<p>${escapeHtml(user.bio)}</p>` : ''}
                    <div class="d-flex gap-4 mt-3">
                        <div>
                            <strong>${getAllPosts().filter(p => p.username === username).length}</strong>
                            <span class="text-muted">ប្រកាស</span>
                        </div>
                        <div>
                            <strong>${user.followers.length}</strong>
                            <span class="text-muted">អ្នកតាមដាន</span>
                        </div>
                        <div>
                            <strong>${user.following.length}</strong>
                            <span class="text-muted">កំពុងតាមដាន</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add follow button event listener
        const followBtn = document.getElementById('followBtn');
        if (followBtn && currentUser) {
            followBtn.addEventListener('click', function() {
                const result = toggleFollow(username, currentUser.username);
                if (result.success) {
                    loadProfile(username);
                }
            });
        }
    }
    
    // Display user's posts
    displayPosts('profilePosts', username);
    
    // Setup edit profile form if it's own profile
    if (isOwnProfile) {
        setupEditProfileForm(user);
    }
}

// Setup edit profile form
function setupEditProfileForm(user) {
    const form = document.getElementById('editProfileForm');
    if (!form) return;
    
    // Fill in current values
    document.getElementById('editFullName').value = user.fullName;
    document.getElementById('editBio').value = user.bio || '';
    
    // Preview current profile image
    const previewDiv = document.getElementById('profileImagePreview');
    if (user.profileImage) {
        previewDiv.innerHTML = `<img src="${user.profileImage}" class="img-fluid rounded" alt="Profile">`;
    }
    
    // Handle profile image upload
    const imageInput = document.getElementById('editProfileImage');
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert('រូបភាពធំពេក! សូមជ្រើសរើសរូបភាពតូចជាង 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                previewDiv.innerHTML = `<img src="${event.target.result}" class="img-fluid rounded" alt="Profile">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('editFullName').value.trim();
        const bio = document.getElementById('editBio').value.trim();
        const imageFile = imageInput.files[0];
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const updates = {
                    fullName: fullName,
                    bio: bio,
                    profileImage: event.target.result
                };
                
                const result = updateProfile(user.username, updates);
                if (result.success) {
                    bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
                    loadProfile(user.username);
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            const updates = {
                fullName: fullName,
                bio: bio
            };
            
            const result = updateProfile(user.username, updates);
            if (result.success) {
                bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
                loadProfile(user.username);
            }
        }
    });
}

// Search users
function searchUsers(query) {
    const users = getAllUsers();
    query = query.toLowerCase().trim();
    
    if (!query) return users;
    
    return users.filter(u => 
        u.username.toLowerCase().includes(query) ||
        u.fullName.toLowerCase().includes(query)
    );
}
