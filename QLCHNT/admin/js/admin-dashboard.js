// Admin Dashboard JavaScript

// Calculate and display statistics
function calculateStats() {
  // Get data from localStorage
  const products = getProducts();
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');
  
  // Update stats
  document.getElementById('total-products').textContent = products.length;
  document.getElementById('total-orders').textContent = orders.length;
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  document.getElementById('total-revenue').textContent = formatVND(totalRevenue);
  
  document.getElementById('total-customers').textContent = users.length;
}

// Display recent orders
function displayRecentOrders() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const recentOrders = orders.slice(-5).reverse(); // Get last 5 orders
  
  const tbody = document.getElementById('recent-orders');
  
  if (recentOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Đơn hàng sẽ xuất hiện ở đây khi có khách hàng đặt hàng</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = recentOrders.map(order => {
    const statusClass = {
      'Đang xử lý': 'pending',
      'Đang giao': 'processing',
      'Đã giao': 'completed',
      'Đã hủy': 'cancelled'
    }[order.status] || 'pending';
    
    const productNames = order.items.map(item => item.title).join(', ');
    const shortProducts = productNames.length > 50 
      ? productNames.substring(0, 50) + '...' 
      : productNames;
    
    // Lấy tên khách hàng từ users
    let customerName = order.name || order.userName || order.customerName;
    if (!customerName && order.userId) {
      const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');
      const user = users.find(u => u.email === order.userId);
      customerName = user ? user.name : null;
    }
    customerName = customerName || 'Khách hàng';
    
    return `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>
          <div>
            <strong>${customerName}</strong>
            <div style="font-size: 12px; color: #64748b;">${order.userEmail || order.userId}</div>
          </div>
        </td>
        <td>${shortProducts}</td>
        <td>${formatDate(order.date)}</td>
        <td><strong>${formatVND(order.total)}</strong></td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn view" onclick="viewOrder('${order.id}')" title="Xem chi tiết">👁️</button>
            <button class="action-btn edit" onclick="editOrder('${order.id}')" title="Chỉnh sửa">✏️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Display bestselling products
function displayBestsellingProducts() {
  const products = getProducts();
  const bestsellers = products.filter(p => p.bestseller).slice(0, 5);
  
  const tbody = document.getElementById('bestselling-products');
  
  if (bestsellers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <div class="empty-state-icon">🔥</div>
            <h3>Chưa có sản phẩm bán chạy</h3>
            <p>Đánh dấu sản phẩm là "bestseller" để hiển thị ở đây</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = bestsellers.map(product => {
    // Mock sold count
    const soldCount = Math.floor(Math.random() * 50) + 10;
    
    return `
      <tr>
        <td>
          <img src="../${product.img}" alt="${product.title}" 
               style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
        </td>
        <td><strong>${product.title}</strong></td>
        <td>${getCategoryName(product.category)}</td>
        <td>${getBrandName(product.brand)}</td>
        <td><strong>${formatVND(product.price)}</strong></td>
        <td>
          <span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
            ${soldCount} đã bán
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// View order details
function viewOrder(orderId) {
  window.location.href = `pages/orders.html?id=${orderId}`;
}

// Edit order
function editOrder(orderId) {
  window.location.href = `pages/orders.html?edit=${orderId}`;
}

// Initialize dashboard
function initDashboard() {
  calculateStats();
  displayRecentOrders();
  displayBestsellingProducts();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initDashboard);
