// Kiểm tra đăng nhập
const currentUser = JSON.parse(localStorage.getItem('tdungdecor_current_user'));
if (!currentUser) {
  alert('Vui lòng đăng nhập!');
  window.location.href = 'login.html';
}

// Hiển thị danh sách đơn hàng
function renderOrders() {
  const ordersRoot = document.getElementById('orders-root');
  if (!ordersRoot) return;

  const allOrders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const userOrders = allOrders.filter(order => order.userId === currentUser.email);

  if (userOrders.length === 0) {
    ordersRoot.innerHTML = `
      <div class="empty-state">
        <h3>📦 Chưa có đơn hàng nào</h3>
        <p>Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
        <a href="products.html" class="btn btn-primary mt-3">Xem sản phẩm</a>
      </div>
    `;
    return;
  }

  const ordersHTML = userOrders.map(order => {
    const orderDate = new Date(order.date);
    const dateStr = orderDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsHTML = order.items.map(item => `
      <div class="order-item">
        <img src="${item.img}" alt="${item.title}">
        <div class="order-item-info">
          <span class="order-item-name">${item.title}</span>
          <span class="order-item-qty">x${item.quantity}</span>
        </div>
        <span class="order-item-price">${formatVND(item.total)}</span>
      </div>
    `).join('');

    const statusClass = order.status === 'Đã giao' ? 'status-delivered' : 
                       order.status === 'Đang giao' ? 'status-shipping' : 'status-processing';

    return `
      <div class="order-card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-id">Mã đơn: <strong>${order.id}</strong></span>
            <span class="order-date">📅 ${dateStr}</span>
          </div>
          <span class="order-status ${statusClass}">${order.status}</span>
        </div>
        <div class="order-items">
          ${itemsHTML}
        </div>
        <div class="order-footer">
          <span class="order-total-label">Tổng cộng:</span>
          <span class="order-total-amount">${formatVND(order.total)}</span>
        </div>
      </div>
    `;
  }).join('');

  ordersRoot.innerHTML = `<div class="orders-list">${ordersHTML}</div>`;
}

renderOrders();
