// Xử lý form liên hệ
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    id: Date.now(),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
    date: new Date().toISOString(),
    status: 'unread'
  };

  // Lưu vào localStorage cho admin
  let messages = JSON.parse(localStorage.getItem('tdungdecor_messages') || '[]');
  messages.unshift(data); // Thêm vào đầu mảng
  localStorage.setItem('tdungdecor_messages', JSON.stringify(messages));

  console.log('Contact form submitted:', data);

  alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
  e.target.reset();
});
