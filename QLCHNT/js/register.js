// Xử lý đăng ký tài khoản
document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  // Validation
  if (password !== confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }

  if (password.length < 6) {
    alert('Mật khẩu phải có ít nhất 6 ký tự!');
    return;
  }

  // Get existing users
  const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    alert('Email này đã được đăng ký!');
    return;
  }

  // Add new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    phone,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('tdungdecor_users', JSON.stringify(users));

  alert('Đăng ký thành công! Vui lòng đăng nhập.');
  window.location.href = 'login.html';
});
