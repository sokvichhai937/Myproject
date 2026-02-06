// ប្រព័ន្ធប្រកាស (Posts System)

// បង្កើតប្រកាសថ្មី
function createPost(username, content, image = '') {
    if (!content.trim() && !image) {
        return { success: false, message: 'សូមបញ្ចូលខ្លឹមសារឬរូបភាព' };
    }
    
    const posts = getAllPosts();
    const newPost = {
        id: Date.now(),
        username: username,
        content: escapeHtml(content.trim()),
        image: image,
        likes: [],
        timestamp: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    saveAllPosts(posts);
    
    return { success: true, post: newPost };
}

// លុបប្រកាស
function deletePost(postId, username) {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
        return { success: false, message: 'រកមិនឃើញប្រកាស' };
    }
    
    if (posts[postIndex].username !== username) {
        return { success: false, message: 'អ្នកមិនមានសិទ្ធិលុបប្រកាសនេះ' };
    }
    
    posts.splice(postIndex, 1);
    saveAllPosts(posts);
    
    // លុបមតិយោបល់ដែលទាក់ទងនឹងប្រកាស
    const comments = getAllComments();
    const filteredComments = comments.filter(c => c.postId !== postId);
    saveAllComments(filteredComments);
    
    return { success: true };
}

// Toggle like
function toggleLike(postId, username) {
    const posts = getAllPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return { success: false, message: 'រកមិនឃើញប្រកាស' };
    }
    
    const likeIndex = post.likes.indexOf(username);
    
    if (likeIndex === -1) {
        // Add like
        post.likes.push(username);
        
        // បង្កើតជូនដំណឹងសម្រាប់ម្ចាស់ប្រកាស
        if (post.username !== username) {
            createNotification(post.username, 'like', username, postId);
        }
    } else {
        // Remove like
        post.likes.splice(likeIndex, 1);
    }
    
    saveAllPosts(posts);
    
    return { success: true, liked: likeIndex === -1, likesCount: post.likes.length };
}

// បន្ថែមមតិយោបល់
function addComment(postId, username, content) {
    if (!content.trim()) {
        return { success: false, message: 'សូមបញ្ចូលមតិយោបល់' };
    }
    
    const comments = getAllComments();
    const newComment = {
        id: Date.now(),
        postId: postId,
        username: username,
        content: escapeHtml(content.trim()),
        timestamp: new Date().toISOString()
    };
    
    comments.push(newComment);
    saveAllComments(comments);
    
    // បង្កើតជូនដំណឹងសម្រាប់ម្ចាស់ប្រកាស
    const posts = getAllPosts();
    const post = posts.find(p => p.id === postId);
    if (post && post.username !== username) {
        createNotification(post.username, 'comment', username, postId);
    }
    
    return { success: true, comment: newComment };
}

// លុបមតិយោបល់
function deleteComment(commentId, username) {
    const comments = getAllComments();
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
        return { success: false, message: 'រកមិនឃើញមតិយោបល់' };
    }
    
    if (comments[commentIndex].username !== username) {
        return { success: false, message: 'អ្នកមិនមានសិទ្ធិលុបមតិយោបល់នេះ' };
    }
    
    comments.splice(commentIndex, 1);
    saveAllComments(comments);
    
    return { success: true };
}

// ទទួលបានមតិយោបល់សម្រាប់ប្រកាស
function getCommentsForPost(postId) {
    const comments = getAllComments();
    return comments.filter(c => c.postId === postId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// បង្ហាញប្រកាសទាំងអស់
function displayPosts(containerId, filterUsername = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const currentUser = checkSession();
    if (!currentUser) return;
    
    let posts = getAllPosts();
    
    // Filter by username if provided
    if (filterUsername) {
        posts = posts.filter(p => p.username === filterUsername);
    }
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="alert alert-info">មិនមានប្រកាសនៅឡើយទេ</div>';
        return;
    }
    
    container.innerHTML = posts.map(post => {
        const user = findUserByUsername(post.username);
        const comments = getCommentsForPost(post.id);
        const isLiked = post.likes.includes(currentUser.username);
        const isOwner = post.username === currentUser.username;
        
        return `
            <div class="card mb-3 post-card" data-post-id="${post.id}">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="profile-image-small me-2">
                            ${user.profileImage ? `<img src="${user.profileImage}" alt="${user.fullName}">` : 
                            `<div class="profile-placeholder">${user.fullName.charAt(0)}</div>`}
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-0">
                                <a href="profile.html?user=${post.username}" class="text-decoration-none text-dark">
                                    ${escapeHtml(user.fullName)}
                                </a>
                            </h6>
                            <small class="text-muted">@${post.username} • ${timeAgo(post.timestamp)}</small>
                        </div>
                        ${isOwner ? `
                            <button class="btn btn-sm btn-outline-danger delete-post-btn" data-post-id="${post.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                    
                    ${post.content ? `<p class="card-text">${post.content}</p>` : ''}
                    ${post.image ? `<img src="${post.image}" class="img-fluid rounded mb-3" alt="Post image">` : ''}
                    
                    <div class="post-actions d-flex gap-3 mb-3">
                        <button class="btn btn-sm like-btn ${isLiked ? 'btn-primary' : 'btn-outline-primary'}" data-post-id="${post.id}">
                            <i class="bi bi-heart${isLiked ? '-fill' : ''}"></i>
                            <span class="likes-count">${post.likes.length}</span>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary toggle-comments-btn" data-post-id="${post.id}">
                            <i class="bi bi-chat"></i>
                            <span>${comments.length}</span>
                        </button>
                    </div>
                    
                    <div class="comments-section" id="comments-${post.id}" style="display: none;">
                        <div class="comments-list mb-3" id="comments-list-${post.id}">
                            ${comments.map(comment => {
                                const commentUser = findUserByUsername(comment.username);
                                const isCommentOwner = comment.username === currentUser.username;
                                return `
                                    <div class="comment mb-2 p-2 bg-light rounded">
                                        <div class="d-flex align-items-start">
                                            <div class="profile-image-tiny me-2">
                                                ${commentUser.profileImage ? `<img src="${commentUser.profileImage}" alt="${commentUser.fullName}">` : 
                                                `<div class="profile-placeholder">${commentUser.fullName.charAt(0)}</div>`}
                                            </div>
                                            <div class="flex-grow-1">
                                                <div class="d-flex justify-content-between align-items-start">
                                                    <small><strong>${escapeHtml(commentUser.fullName)}</strong></small>
                                                    <div>
                                                        <small class="text-muted">${timeAgo(comment.timestamp)}</small>
                                                        ${isCommentOwner ? `
                                                            <button class="btn btn-sm btn-link text-danger p-0 ms-2 delete-comment-btn" data-comment-id="${comment.id}">
                                                                <i class="bi bi-trash"></i>
                                                            </button>
                                                        ` : ''}
                                                    </div>
                                                </div>
                                                <p class="mb-0">${comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="add-comment">
                            <div class="input-group">
                                <input type="text" class="form-control comment-input" placeholder="សរសេរមតិយោបល់..." data-post-id="${post.id}">
                                <button class="btn btn-primary add-comment-btn" data-post-id="${post.id}">
                                    <i class="bi bi-send"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    attachPostEventListeners();
}

// Attach event listeners to posts
function attachPostEventListeners() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.dataset.postId);
            const result = toggleLike(postId, currentUser.username);
            
            if (result.success) {
                this.classList.toggle('btn-primary');
                this.classList.toggle('btn-outline-primary');
                const icon = this.querySelector('i');
                icon.classList.toggle('bi-heart');
                icon.classList.toggle('bi-heart-fill');
                this.querySelector('.likes-count').textContent = result.likesCount;
            }
        });
    });
    
    // Toggle comments
    document.querySelectorAll('.toggle-comments-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.dataset.postId;
            const commentsSection = document.getElementById(`comments-${postId}`);
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        });
    });
    
    // Add comment
    document.querySelectorAll('.add-comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.dataset.postId);
            const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
            const content = input.value.trim();
            
            if (content) {
                const result = addComment(postId, currentUser.username, content);
                if (result.success) {
                    input.value = '';
                    // Refresh comments
                    const container = this.closest('.post-card').parentElement;
                    displayPosts(container.id);
                }
            }
        });
    });
    
    // Add comment on Enter key
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const postId = this.dataset.postId;
                document.querySelector(`.add-comment-btn[data-post-id="${postId}"]`).click();
            }
        });
    });
    
    // Delete post
    document.querySelectorAll('.delete-post-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('តើអ្នកចង់លុបប្រកាសនេះមែនទេ?')) {
                const postId = parseInt(this.dataset.postId);
                const result = deletePost(postId, currentUser.username);
                if (result.success) {
                    const container = this.closest('.post-card').parentElement;
                    displayPosts(container.id);
                }
            }
        });
    });
    
    // Delete comment
    document.querySelectorAll('.delete-comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('តើអ្នកចង់លុបមតិយោបល់នេះមែនទេ?')) {
                const commentId = parseInt(this.dataset.commentId);
                const result = deleteComment(commentId, currentUser.username);
                if (result.success) {
                    const container = this.closest('.post-card').parentElement;
                    displayPosts(container.id);
                }
            }
        });
    });
}
