// ប្រព័ន្ធផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ (Authentication System)

// ចុះឈ្មោះអ្នកប្រើប្រាស់ថ្មី
function register(username, password, fullName, email) {
    // Validation
    if (!username || !password || !fullName || !email) {
        return { success: false, message: 'សូមបំពេញព័ត៌មានទាំងអស់' };
    }
    
    if (username.length < 3) {
        return { success: false, message: 'ឈ្មោះអ្នកប្រើត្រូវមានយ៉ាងតិច 3 តួអក្សរ' };
    }
    
    if (password.length < 6) {
        return { success: false, message: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួអក្សរ' };
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, message: 'អ៊ីមែលមិនត្រឹមត្រូវ' };
    }
    
    // Check if username already exists
    const users = getAllUsers();
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'ឈ្មោះអ្នកប្រើនេះមានរួចហើយ' };
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'អ៊ីមែលនេះមានរួចហើយ' };
    }
    
    // Create new user
    const newUser = {
        username: username,
        password: password, // In production, should hash password
        fullName: fullName,
        email: email,
        bio: '',
        profileImage: '',
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveAllUsers(users);
    
    return { success: true, message: 'ចុះឈ្មោះជោគជ័យ' };
}

// ចូលប្រើប្រាស់
function login(username, password) {
    // Validation
    if (!username || !password) {
        return { success: false, message: 'សូមបំពេញឈ្មោះអ្នកប្រើ និងពាក្យសម្ងាត់' };
    }
    
    // Find user
    const user = findUserByUsername(username);
    
    if (!user) {
        return { success: false, message: 'ឈ្មោះអ្នកប្រើមិនត្រឹមត្រូវ' };
    }
    
    // Check password
    if (user.password !== password) {
        return { success: false, message: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ' };
    }
    
    // Create session
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, message: 'ចូលប្រើប្រាស់ជោគជ័យ' };
}

// Event listeners for login form
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const result = login(username, password);
        
        const alertDiv = document.getElementById('loginAlert');
        alertDiv.className = `alert ${result.success ? 'alert-success' : 'alert-danger'}`;
        alertDiv.textContent = result.message;
        alertDiv.classList.remove('d-none');
        
        if (result.success) {
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        }
    });
}

// Event listeners for registration form
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const fullName = document.getElementById('regFullName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        
        // Check password confirmation
        if (password !== confirmPassword) {
            const alertDiv = document.getElementById('registerAlert');
            alertDiv.className = 'alert alert-danger';
            alertDiv.textContent = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា';
            alertDiv.classList.remove('d-none');
            return;
        }
        
        const result = register(username, password, fullName, email);
        
        const alertDiv = document.getElementById('registerAlert');
        alertDiv.className = `alert ${result.success ? 'alert-success' : 'alert-danger'}`;
        alertDiv.textContent = result.message;
        alertDiv.classList.remove('d-none');
        
        if (result.success) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}
