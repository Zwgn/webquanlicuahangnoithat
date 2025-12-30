// Admin Main JavaScript - Common functionality

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  }
});

// Check admin authentication
function checkAdminAuth() {
  const currentUser = JSON.parse(localStorage.getItem('tdungdecor_current_user'));
  
  // Detect if we're in admin root or admin/pages
  const isInAdminRoot = window.location.pathname.includes('/admin/index.html') || window.location.pathname.endsWith('/admin/');
  const loginPath = isInAdminRoot ? '../pages/login.html' : '../../pages/login.html';
  
  // Check if user is logged in
  if (!currentUser) {
    alert('Vui lòng đăng nhập để truy cập trang Admin!');
    window.location.href = loginPath;
    return false;
  }
  
  // Check if user has admin role
  if (currentUser.role !== 'admin') {
    alert('Bạn không có quyền truy cập trang Admin!\nVui lòng đăng nhập bằng tài khoản Admin.');
    localStorage.removeItem('tdungdecor_current_user');
    window.location.href = loginPath;
    return false;
  }
  
  // Update user info in header
  const userName = document.querySelector('.user-name');
  const userAvatar = document.querySelector('.user-avatar');
  if (userName) userName.textContent = currentUser.name;
  if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  
  return true;
}

// Logout function
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('tdungdecor_current_user');
      
      // Detect correct path to login
      const isInAdminRoot = window.location.pathname.includes('/admin/index.html') || window.location.pathname.endsWith('/admin/');
      const loginPath = isInAdminRoot ? '../pages/login.html' : '../../pages/login.html';
      window.location.href = loginPath;
    }
  });
}

// Format currency
function formatVND(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get category name
function getCategoryName(category) {
  const categories = {
    'sofa': 'Sofa',
    'table': 'Bàn',
    'chair': 'Ghế',
    'cabinet': 'Tủ & Kệ',
    'bed': 'Giường',
    'decor': 'Đồ trang trí'
  };
  return categories[category] || category;
}

// Get brand name
function getBrandName(brand) {
  const brands = {
    'ikea': 'IKEA',
    'poliform': 'Poliform',
    'restoration': 'Restoration Hardware',
    'vitra': 'Vitra',
    'nhaxinh': 'Nhà Xinh',
    'phoxinh': 'Phố Xinh',
    'hoaphat': 'Hòa Phát',
    'hoanganh': 'Hoàng Anh Gia Lai'
  };
  return brands[brand] || brand;
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking outside
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay.id);
    }
  });
});

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 3000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  notification.style.background = colors[type] || colors.success;
  notification.style.color = 'white';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Confirm dialog
function confirmAction(message) {
  return confirm(message);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});
