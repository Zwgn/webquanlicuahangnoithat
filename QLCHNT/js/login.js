// Xử lý đăng nhập tài khoản
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  // Check admin account first
  if (email === 'adminchnt@gmail.com' && password === '123') {
    // Admin account
    const adminUser = {
      id: 'admin',
      name: 'Admin',
      email: 'adminchnt@gmail.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('tdungdecor_current_user', JSON.stringify(adminUser));
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
    
    alert('Đăng nhập thành công! Chào mừng Admin');
    window.location.href = '../admin/index.html';
    return;
  }

  // Get regular users from localStorage
  const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Add role for regular user
    user.role = 'user';
    
    // Save logged in user
    localStorage.setItem('tdungdecor_current_user', JSON.stringify(user));
    
    // Phát sự kiện đăng nhập
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
    
    alert('Đăng nhập thành công! Chào mừng ' + user.name);
    window.location.href = '../index.html';
  } else {
    alert('Email hoặc mật khẩu không đúng!');
  }
});

// Check if already logged in
const currentUser = localStorage.getItem('tdungdecor_current_user');
if (currentUser) {
  const user = JSON.parse(currentUser);
  if (confirm('Bạn đã đăng nhập với tài khoản ' + user.name + '. Đăng xuất?')) {
    localStorage.removeItem('tdungdecor_current_user');
  } else {
    window.location.href = '../index.html';
  }
}
