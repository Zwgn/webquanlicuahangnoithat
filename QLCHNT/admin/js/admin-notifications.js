// Admin Notifications & Messages Management

// Load and display notification count
function updateNotificationBadge() {
  const notifications = JSON.parse(localStorage.getItem('tdungdecor_notifications') || '[]');
  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  
  const badge = document.getElementById('notification-badge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

// Load and display message count
function updateMessageBadge() {
  const messages = JSON.parse(localStorage.getItem('tdungdecor_messages') || '[]');
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  
  const badge = document.getElementById('message-badge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

// Render notifications dropdown
function renderNotifications() {
  const notifications = JSON.parse(localStorage.getItem('tdungdecor_notifications') || '[]');
  const dropdown = document.getElementById('notifications-dropdown');
  
  if (!dropdown) return;
  
  if (notifications.length === 0) {
    dropdown.innerHTML = `
      <div class="dropdown-empty">
        <span style="font-size: 32px;">🔔</span>
        <p>Không có thông báo mới</p>
      </div>
    `;
    return;
  }
  
  const recentNotifications = notifications.slice(0, 5);
  
  dropdown.innerHTML = `
    <div class="dropdown-header">
      <h4>Thông Báo</h4>
      <button class="btn-text" onclick="markAllNotificationsRead()">Đánh dấu đã đọc</button>
    </div>
    <div class="dropdown-list">
      ${recentNotifications.map(notif => `
        <div class="dropdown-item ${notif.status === 'unread' ? 'unread' : ''}" onclick="viewNotification(${notif.id})">
          <div class="item-icon ${notif.type === 'order' ? 'blue' : 'green'}">
            ${notif.type === 'order' ? '🛒' : '📧'}
          </div>
          <div class="item-content">
            <div class="item-title">${notif.message}</div>
            <div class="item-meta">
              <span>${formatDate(notif.date)}</span>
              ${notif.total ? `<span class="item-price">${formatVND(notif.total)}</span>` : ''}
            </div>
          </div>
          ${notif.status === 'unread' ? '<div class="unread-dot"></div>' : ''}
        </div>
      `).join('')}
    </div>
    <div class="dropdown-footer">
      <a href="pages/orders.html" class="btn-text">Xem tất cả đơn hàng →</a>
    </div>
  `;
}

// Render messages dropdown
function renderMessages() {
  const messages = JSON.parse(localStorage.getItem('tdungdecor_messages') || '[]');
  const dropdown = document.getElementById('messages-dropdown');
  
  if (!dropdown) return;
  
  if (messages.length === 0) {
    dropdown.innerHTML = `
      <div class="dropdown-empty">
        <span style="font-size: 32px;">✉️</span>
        <p>Không có tin nhắn mới</p>
      </div>
    `;
    return;
  }
  
  const recentMessages = messages.slice(0, 5);
  
  dropdown.innerHTML = `
    <div class="dropdown-header">
      <h4>Tin Nhắn</h4>
      <button class="btn-text" onclick="markAllMessagesRead()">Đánh dấu đã đọc</button>
    </div>
    <div class="dropdown-list">
      ${recentMessages.map(msg => `
        <div class="dropdown-item ${msg.status === 'unread' ? 'unread' : ''}" onclick="viewMessage(${msg.id})">
          <div class="item-icon purple">
            ${msg.name.charAt(0).toUpperCase()}
          </div>
          <div class="item-content">
            <div class="item-title">${msg.name}</div>
            <div class="item-text">${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}</div>
            <div class="item-meta">
              <span>${formatDate(msg.date)}</span>
              <span>${msg.email}</span>
            </div>
          </div>
          ${msg.status === 'unread' ? '<div class="unread-dot"></div>' : ''}
        </div>
      `).join('')}
    </div>
    <div class="dropdown-footer">
      <a href="pages/messages.html" class="btn-text">Xem tất cả tin nhắn →</a>
    </div>
  `;
}

// View notification detail
function viewNotification(id) {
  const notifications = JSON.parse(localStorage.getItem('tdungdecor_notifications') || '[]');
  const notif = notifications.find(n => n.id === id);
  
  if (notif) {
    // Mark as read
    notif.status = 'read';
    localStorage.setItem('tdungdecor_notifications', JSON.stringify(notifications));
    
    // Update badge
    updateNotificationBadge();
    
    // Redirect to orders page
    // Check if we're in admin root or admin/pages
    const isInAdminRoot = window.location.pathname.includes('/admin/index.html') || window.location.pathname.endsWith('/admin/');
    if (isInAdminRoot) {
      window.location.href = 'pages/orders.html';
    } else {
      window.location.href = 'orders.html';
    }
  }
}

// View message detail
function viewMessage(id) {
  const messages = JSON.parse(localStorage.getItem('tdungdecor_messages') || '[]');
  const msg = messages.find(m => m.id === id);
  
  if (msg) {
    // Mark as read
    msg.status = 'read';
    localStorage.setItem('tdungdecor_messages', JSON.stringify(messages));
    
    // Show modal with full message
    showMessageModal(msg);
  }
}

// Show message in modal
function showMessageModal(msg) {
  const modalHTML = `
    <div class="modal-overlay active" id="message-modal">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2>📧 Tin nhắn từ khách hàng</h2>
          <button class="modal-close" onclick="closeMessageModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 16px; margin-bottom: 16px;">
              <div style="flex: 1;">
                <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #64748b;">Họ tên</label>
                <div style="font-size: 16px;">${msg.name}</div>
              </div>
              <div style="flex: 1;">
                <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #64748b;">Ngày gửi</label>
                <div style="font-size: 16px;">${formatDate(msg.date)}</div>
              </div>
            </div>
            <div style="display: flex; gap: 16px; margin-bottom: 16px;">
              <div style="flex: 1;">
                <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #64748b;">Email</label>
                <div style="font-size: 16px;">${msg.email}</div>
              </div>
              <div style="flex: 1;">
                <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #64748b;">Số điện thoại</label>
                <div style="font-size: 16px;">${msg.phone || 'Không có'}</div>
              </div>
            </div>
            <div>
              <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #64748b;">Nội dung</label>
              <div style="padding: 16px; background: #f8fafc; border-radius: 8px; line-height: 1.6;">
                ${msg.message}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <a href="mailto:${msg.email}" class="btn btn-primary" style="text-decoration: none;">
              📧 Trả lời qua Email
            </a>
            <button class="btn btn-outline" onclick="deleteMessage(${msg.id})">
              🗑️ Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close message modal
function closeMessageModal() {
  const modal = document.getElementById('message-modal');
  if (modal) {
    modal.remove();
  }
}

// Mark all notifications as read
function markAllNotificationsRead() {
  const notifications = JSON.parse(localStorage.getItem('tdungdecor_notifications') || '[]');
  notifications.forEach(n => n.status = 'read');
  localStorage.setItem('tdungdecor_notifications', JSON.stringify(notifications));
  
  updateNotificationBadge();
  renderNotifications();
  showNotification('Đã đánh dấu tất cả thông báo là đã đọc', 'success');
}

// Mark all messages as read
function markAllMessagesRead() {
  const messages = JSON.parse(localStorage.getItem('tdungdecor_messages') || '[]');
  messages.forEach(m => m.status = 'read');
  localStorage.setItem('tdungdecor_messages', JSON.stringify(messages));
  
  updateMessageBadge();
  renderMessages();
  showNotification('Đã đánh dấu tất cả tin nhắn là đã đọc', 'success');
}

// Delete message
function deleteMessage(id) {
  if (confirm('Bạn có chắc muốn xóa tin nhắn này?')) {
    let messages = JSON.parse(localStorage.getItem('tdungdecor_messages') || '[]');
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem('tdungdecor_messages', JSON.stringify(messages));
    
    closeMessageModal();
    updateMessageBadge();
    renderMessages();
    showNotification('Đã xóa tin nhắn', 'success');
  }
}

// Toggle dropdown
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const allDropdowns = document.querySelectorAll('.header-dropdown');
  
  // Close other dropdowns
  allDropdowns.forEach(d => {
    if (d.id !== dropdownId) {
      d.classList.remove('active');
    }
  });
  
  // Toggle current dropdown
  if (dropdown) {
    dropdown.classList.toggle('active');
    
    // Render content when opened
    if (dropdown.classList.contains('active')) {
      if (dropdownId === 'notifications-dropdown') {
        renderNotifications();
      } else if (dropdownId === 'messages-dropdown') {
        renderMessages();
      }
    }
  }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.header-icon-btn') && !e.target.closest('.header-dropdown')) {
    document.querySelectorAll('.header-dropdown').forEach(d => {
      d.classList.remove('active');
    });
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateNotificationBadge();
  updateMessageBadge();
  
  // Update badges every 30 seconds
  setInterval(() => {
    updateNotificationBadge();
    updateMessageBadge();
  }, 30000);
});
