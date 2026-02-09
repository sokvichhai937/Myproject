// ប្រព័ន្ធជូនដំណឹង (Notifications System)

// ទទួលបានជូនដំណឹងសម្រាប់អ្នកប្រើប្រាស់
function getNotificationsForUser(username) {
  const notifications = getAllNotifications();
  return notifications
    .filter((n) => n.username === username)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ទទួលបានចំនួនជូនដំណឹងដែលមិនទាន់អាន
function getUnreadNotificationsCount(username) {
  const notifications = getNotificationsForUser(username);
  return notifications.filter((n) => !n.read).length;
}

// សម្គាល់ជូនដំណឹងថាបានអាន
function markNotificationAsRead(notificationId) {
  const notifications = getAllNotifications();
  const notification = notifications.find((n) => n.id === notificationId);

  if (notification) {
    notification.read = true;
    saveAllNotifications(notifications);
    return { success: true };
  }

  return { success: false };
}

// សម្គាល់ជូនដំណឹងទាំងអស់ថាបានអាន
function markAllNotificationsAsRead(username) {
  const notifications = getAllNotifications();
  let updated = false;

  notifications.forEach((n) => {
    if (n.username === username && !n.read) {
      n.read = true;
      updated = true;
    }
  });

  if (updated) {
    saveAllNotifications(notifications);
  }
}

// លុបជូនដំណឹង
function deleteNotification(notificationId) {
  const notifications = getAllNotifications();
  const index = notifications.findIndex((n) => n.id === notificationId);

  if (index !== -1) {
    notifications.splice(index, 1);
    saveAllNotifications(notifications);
    return { success: true };
  }

  return { success: false };
}

// ទទួលបានអត្ថបទជូនដំណឹង
function getNotificationText(notification) {
  const fromUser = findUserByUsername(notification.fromUser);
  const fromUserName = fromUser ? fromUser.fullName : notification.fromUser;

  switch (notification.type) {
    case "like":
      return `<a href="profile.html?user=${notification.fromUser}" class="text-decoration-none fw-bold" onclick="event.stopPropagation()">${escapeHtml(fromUserName)}</a> បានចូលចិត្តប្រកាសរបស់អ្នក`;
    case "comment":
      return `<a href="profile.html?user=${notification.fromUser}" class="text-decoration-none fw-bold" onclick="event.stopPropagation()">${escapeHtml(fromUserName)}</a> បានបញ្ចេញមតិលើប្រកាសរបស់អ្នក`;
    case "follow":
      return `<a href="profile.html?user=${notification.fromUser}" class="text-decoration-none fw-bold" onclick="event.stopPropagation()">${escapeHtml(fromUserName)}</a> បានចាប់ផ្តើមតាមដានអ្នក`;
    default:
      return "ជូនដំណឹងថ្មី";
  }
}

// ទទួលបាន icon សម្រាប់ជូនដំណឹង
function getNotificationIcon(type) {
  switch (type) {
    case "like":
      return "bi-heart-fill text-danger";
    case "comment":
      return "bi-chat-fill text-primary";
    case "follow":
      return "bi-person-fill text-success";
    default:
      return "bi-bell-fill text-secondary";
  }
}

// បង្ហាញជូនដំណឹងទាំងអស់
function displayNotifications() {
  const currentUser = checkSession();
  if (!currentUser) return;

  const container = document.getElementById("notificationsContainer");
  if (!container) return;

  const notifications = getNotificationsForUser(currentUser.username);

  if (notifications.length === 0) {
    container.innerHTML =
      '<div class="alert alert-info">មិនមានជូនដំណឹងនៅឡើយទេ</div>';
    return;
  }

  container.innerHTML = notifications
    .map((notification) => {
      const fromUser = findUserByUsername(notification.fromUser);
      const text = getNotificationText(notification);
      const icon = getNotificationIcon(notification.type);

      return `
            <div class="list-group-item ${notification.read ? "" : "bg-light"} notification-item" data-notification-id="${notification.id}">
                <div class="d-flex align-items-start">
                    <a href="profile.html?user=${notification.fromUser}" class="profile-image-small me-3 text-decoration-none" onclick="event.stopPropagation()">
                        ${
                          fromUser.profileImage
                            ? `<img src="${fromUser.profileImage}" alt="${fromUser.fullName}">`
                            : `<div class="profile-placeholder">${fromUser.fullName.charAt(0)}</div>`
                        }
                    </a>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <p class="mb-1">
                                    <i class="bi ${icon} me-2"></i>
                                    ${text}
                                </p>
                                <small class="text-muted">${timeAgo(notification.timestamp)}</small>
                            </div>
                            <button class="btn btn-sm btn-link text-danger delete-notification-btn" data-notification-id="${notification.id}">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  // Add event listeners
  document.querySelectorAll(".notification-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      if (e.target.closest(".delete-notification-btn")) return;

      const notificationId = parseInt(this.dataset.notificationId);
      const notification = notifications.find((n) => n.id === notificationId);

      if (notification) {
        markNotificationAsRead(notificationId);

        // Navigate based on notification type
        if (notification.type === "follow") {
          window.location.href = `profile.html?user=${notification.fromUser}`;
        } else if (notification.postId) {
          window.location.href = `home.html`;
        }
      }
    });
  });

  document.querySelectorAll(".delete-notification-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const notificationId = parseInt(this.dataset.notificationId);
      deleteNotification(notificationId);
      displayNotifications();
      updateNotificationBadge();
    });
  });
}

// ធ្វើបច្ចុប្បន្នភាព notification badge
function updateNotificationBadge() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const badge = document.getElementById("notificationBadge");
  if (!badge) return;

  const count = getUnreadNotificationsCount(currentUser.username);

  if (count > 0) {
    badge.textContent = count > 99 ? "99+" : count;
    badge.classList.remove("d-none");
  } else {
    badge.classList.add("d-none");
  }
}

// Initialize notifications page
if (document.getElementById("notificationsContainer")) {
  const currentUser = checkSession();
  if (currentUser) {
    displayNotifications();

    // Mark all as read button
    const markAllReadBtn = document.getElementById("markAllReadBtn");
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", function () {
        markAllNotificationsAsRead(currentUser.username);
        displayNotifications();
        updateNotificationBadge();
      });
    }
  }
}

// Update badge on all pages
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    updateNotificationBadge();
  });
}
