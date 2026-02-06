// ប្រព័ន្ធសារ (Messaging System)

// ផ្ញើសារ
function sendMessage(fromUsername, toUsername, content) {
    if (!content.trim()) {
        return { success: false, message: 'សូមបញ្ចូលសារ' };
    }
    
    const messages = getAllMessages();
    const newMessage = {
        id: Date.now(),
        from: fromUsername,
        to: toUsername,
        content: escapeHtml(content.trim()),
        read: false,
        timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    saveAllMessages(messages);
    
    return { success: true, message: newMessage };
}

// ទទួលបានការសន្ទនាទាំងអស់
function getConversations(username) {
    const messages = getAllMessages();
    const conversations = {};
    
    messages.forEach(msg => {
        let otherUser;
        if (msg.from === username) {
            otherUser = msg.to;
        } else if (msg.to === username) {
            otherUser = msg.from;
        } else {
            return;
        }
        
        if (!conversations[otherUser]) {
            conversations[otherUser] = {
                username: otherUser,
                messages: [],
                unreadCount: 0,
                lastMessage: null
            };
        }
        
        conversations[otherUser].messages.push(msg);
        conversations[otherUser].lastMessage = msg;
        
        if (msg.to === username && !msg.read) {
            conversations[otherUser].unreadCount++;
        }
    });
    
    // Sort by last message timestamp
    const conversationsList = Object.values(conversations);
    conversationsList.sort((a, b) => 
        new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );
    
    return conversationsList;
}

// ទទួលបានសារជាមួយអ្នកប្រើប្រាស់ម្នាក់
function getMessagesWithUser(username, otherUsername) {
    const messages = getAllMessages();
    return messages.filter(msg => 
        (msg.from === username && msg.to === otherUsername) ||
        (msg.from === otherUsername && msg.to === username)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// សម្គាល់សារថាបានអាន
function markMessagesAsRead(username, fromUsername) {
    const messages = getAllMessages();
    let updated = false;
    
    messages.forEach(msg => {
        if (msg.to === username && msg.from === fromUsername && !msg.read) {
            msg.read = true;
            updated = true;
        }
    });
    
    if (updated) {
        saveAllMessages(messages);
    }
}

// បង្ហាញបញ្ជីការសន្ទនា
function displayConversations() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    const conversationsList = document.getElementById('conversationsList');
    if (!conversationsList) return;
    
    const conversations = getConversations(currentUser.username);
    
    if (conversations.length === 0) {
        conversationsList.innerHTML = '<div class="alert alert-info">មិនមានសារនៅឡើយទេ</div>';
        return;
    }
    
    conversationsList.innerHTML = conversations.map(conv => {
        const user = findUserByUsername(conv.username);
        const lastMsg = conv.lastMessage;
        const preview = lastMsg.from === currentUser.username ? 
            `អ្នក: ${lastMsg.content.substring(0, 30)}...` : 
            lastMsg.content.substring(0, 30) + '...';
        
        return `
            <a href="#" class="list-group-item list-group-item-action conversation-item" data-username="${conv.username}">
                <div class="d-flex align-items-center">
                    <div class="profile-image-small me-3">
                        ${user.profileImage ? `<img src="${user.profileImage}" alt="${user.fullName}">` : 
                        `<div class="profile-placeholder">${user.fullName.charAt(0)}</div>`}
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                            <h6 class="mb-0">${escapeHtml(user.fullName)}</h6>
                            <small class="text-muted">${timeAgo(lastMsg.timestamp)}</small>
                        </div>
                        <small class="text-muted">${preview}</small>
                        ${conv.unreadCount > 0 ? `<span class="badge bg-primary ms-2">${conv.unreadCount}</span>` : ''}
                    </div>
                </div>
            </a>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const username = this.dataset.username;
            openChat(username);
        });
    });
}

// បើកការសន្ទនា
function openChat(otherUsername) {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    const otherUser = findUserByUsername(otherUsername);
    if (!otherUser) return;
    
    // Mark messages as read
    markMessagesAsRead(currentUser.username, otherUsername);
    
    // Display chat header
    const chatHeader = document.getElementById('chatHeader');
    if (chatHeader) {
        chatHeader.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="profile-image-small me-2">
                    ${otherUser.profileImage ? `<img src="${otherUser.profileImage}" alt="${otherUser.fullName}">` : 
                    `<div class="profile-placeholder">${otherUser.fullName.charAt(0)}</div>`}
                </div>
                <div>
                    <h6 class="mb-0">${escapeHtml(otherUser.fullName)}</h6>
                    <small class="text-muted">@${otherUsername}</small>
                </div>
            </div>
        `;
    }
    
    // Display messages
    displayChatMessages(currentUser.username, otherUsername);
    
    // Show chat area
    const chatArea = document.getElementById('chatArea');
    const emptyState = document.getElementById('emptyState');
    if (chatArea) chatArea.classList.remove('d-none');
    if (emptyState) emptyState.classList.add('d-none');
    
    // Setup send message form
    setupSendMessageForm(currentUser.username, otherUsername);
    
    // Refresh conversations list
    displayConversations();
}

// បង្ហាញសារក្នុងការសន្ទនា
function displayChatMessages(currentUsername, otherUsername) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messages = getMessagesWithUser(currentUsername, otherUsername);
    
    messagesContainer.innerHTML = messages.map(msg => {
        const isOwn = msg.from === currentUsername;
        return `
            <div class="message ${isOwn ? 'message-own' : 'message-other'} mb-3">
                <div class="message-bubble ${isOwn ? 'bg-primary text-white' : 'bg-light'}">
                    <p class="mb-1">${msg.content}</p>
                    <small class="${isOwn ? 'text-white-50' : 'text-muted'}">${timeAgo(msg.timestamp)}</small>
                </div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Setup send message form
function setupSendMessageForm(currentUsername, otherUsername) {
    const form = document.getElementById('sendMessageForm');
    const input = document.getElementById('messageInput');
    
    if (!form || !input) return;
    
    // Remove old event listeners by cloning
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    const newInput = document.getElementById('messageInput');
    
    document.getElementById('sendMessageForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const content = newInput.value.trim();
        if (content) {
            const result = sendMessage(currentUsername, otherUsername, content);
            if (result.success) {
                newInput.value = '';
                displayChatMessages(currentUsername, otherUsername);
                displayConversations();
            }
        }
    });
}

// Initialize messaging page
if (document.getElementById('conversationsList')) {
    const currentUser = checkSession();
    if (currentUser) {
        displayConversations();
        
        // Check for user parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const chatUser = urlParams.get('user');
        if (chatUser) {
            openChat(chatUser);
        }
    }
}
