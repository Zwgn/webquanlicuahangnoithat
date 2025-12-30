// Admin Orders Management JavaScript

let currentOrders = [];
let currentOrderId = null;

// Display all orders
function displayOrders() {
  console.log('displayOrders called');
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  console.log('Orders from localStorage:', orders);
  currentOrders = [...orders].reverse(); // Newest first
  console.log('currentOrders:', currentOrders);
  
  calculateOrderStats();
  renderOrdersTable();
}

// Calculate order statistics
function calculateOrderStats() {
  const orders = currentOrders;
  
  document.getElementById('total-orders-count').textContent = orders.length;
  
  const pending = orders.filter(o => o.status === 'Đang xử lý').length;
  const shipping = orders.filter(o => o.status === 'Đang giao').length;
  const completed = orders.filter(o => o.status === 'Đã giao').length;
  
  document.getElementById('pending-orders').textContent = pending;
  document.getElementById('shipping-orders').textContent = shipping;
  document.getElementById('completed-orders').textContent = completed;
}

// Render orders table
function renderOrdersTable() {
  console.log('renderOrdersTable called, currentOrders:', currentOrders.length);
  const tbody = document.getElementById('orders-table');
  const orderCount = document.getElementById('order-count');
  
  console.log('tbody element:', tbody);
  console.log('orderCount element:', orderCount);
  
  if (orderCount) {
    orderCount.textContent = currentOrders.length;
  }
  
  if (!tbody) {
    console.error('Element orders-table not found');
    return;
  }
  
  if (currentOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <div class="empty-state-icon">🛒</div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Đơn hàng sẽ xuất hiện ở đây khi có khách hàng đặt hàng</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = currentOrders.map(order => {
    const statusClass = {
      'Đang xử lý': 'pending',
      'Đang giao': 'processing',
      'Đã giao': 'completed',
      'Đã hủy': 'cancelled'
    }[order.status] || 'pending';
    
    const productNames = order.items.map(item => item.title).join(', ');
    const shortProducts = productNames.length > 40 
      ? productNames.substring(0, 40) + '...' 
      : productNames;
    
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
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
        <td>
          <div title="${productNames}">
            ${shortProducts}
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
              ${itemCount} sản phẩm
            </div>
          </div>
        </td>
        <td>${formatDate(order.date)}</td>
        <td><strong>${formatVND(order.total)}</strong></td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn view" onclick="viewOrderDetail('${order.id}')" title="Xem chi tiết">👁️</button>
            <button class="action-btn edit" onclick="editOrderStatus('${order.id}')" title="Cập nhật trạng thái">✏️</button>
            <button class="action-btn delete" onclick="deleteOrder('${order.id}')" title="Xóa">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Filter orders
function filterOrders() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const status = document.getElementById('filter-status').value;
  const dateFilter = document.getElementById('filter-date').value;
  const searchText = document.getElementById('search-orders').value.toLowerCase();
  
  currentOrders = orders.filter(order => {
    // Status filter
    const matchStatus = !status || order.status === status;
    
    // Date filter
    let matchDate = true;
    if (dateFilter) {
      const orderDate = new Date(order.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') {
        const orderDay = new Date(orderDate);
        orderDay.setHours(0, 0, 0, 0);
        matchDate = orderDay.getTime() === today.getTime();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchDate = orderDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchDate = orderDate >= monthAgo;
      }
    }
    
    // Search filter
    const matchSearch = !searchText || 
                       (order.orderId && order.orderId.toLowerCase().includes(searchText)) ||
                       (order.id && order.id.toLowerCase().includes(searchText)) ||
                       (order.name && order.name.toLowerCase().includes(searchText)) ||
                       (order.phone && order.phone.includes(searchText)) ||
                       (order.address && order.address.toLowerCase().includes(searchText));
    
    return matchStatus && matchDate && matchSearch;
  }).reverse();
  
  calculateOrderStats();
  renderOrdersTable();
}

// View order detail
function viewOrderDetail(orderId) {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    showNotification('Không tìm thấy đơn hàng!', 'error');
    return;
  }
  
  // Fill modal with order details
  document.getElementById('modal-order-id').textContent = `#${order.id}`;
  document.getElementById('detail-order-id').textContent = order.id;
  document.getElementById('detail-order-date').textContent = formatDate(order.date);
  
  const statusClass = {
    'Đang xử lý': 'pending',
    'Đang giao': 'processing',
    'Đã giao': 'completed',
    'Đã hủy': 'cancelled'
  }[order.status] || 'pending';
  
  document.getElementById('detail-order-status').innerHTML = 
    `<span class="status-badge ${statusClass}">${order.status}</span>`;
  
  document.getElementById('detail-customer-name').textContent = order.userName || order.userId;
  document.getElementById('detail-customer-email').textContent = order.userEmail || order.userId;
  document.getElementById('detail-customer-phone').textContent = order.userPhone || 'N/A';
  
  // Render order items
  const itemsHtml = order.items.map(item => {
    // Fix image path for admin pages
    const imgPath = item.img.startsWith('images/') ? `../../${item.img}` : item.img;
    
    return `
    <div style="display: flex; align-items: center; gap: 16px; padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
      <img src="${imgPath}" alt="${item.title}" 
           style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
      <div style="flex: 1;">
        <strong style="font-size: 14px;">${item.title}</strong>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
          Số lượng: ${item.quantity} × ${formatVND(item.price)}
        </div>
      </div>
      <div style="font-weight: 600; font-size: 15px;">
        ${formatVND(item.price * item.quantity)}
      </div>
    </div>
    `;
  }).join('');
  
  document.getElementById('detail-order-items').innerHTML = itemsHtml;
  document.getElementById('detail-order-total').textContent = formatVND(order.total);
  
  openModal('order-detail-modal');
}

// Edit order status
function editOrderStatus(orderId) {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    showNotification('Không tìm thấy đơn hàng!', 'error');
    return;
  }
  
  currentOrderId = orderId;
  document.getElementById('edit-order-id').value = orderId;
  document.getElementById('edit-order-display-id').value = `#${orderId}`;
  document.getElementById('edit-order-status').value = order.status;
  
  openModal('edit-status-modal');
}

// Update order status
function updateOrderStatus() {
  const orderId = document.getElementById('edit-order-id').value;
  const newStatus = document.getElementById('edit-order-status').value;
  
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    showNotification('Không tìm thấy đơn hàng!', 'error');
    return;
  }
  
  orders[orderIndex].status = newStatus;
  localStorage.setItem('tdungdecor_orders', JSON.stringify(orders));
  
  showNotification('Cập nhật trạng thái đơn hàng thành công!', 'success');
  closeModal('edit-status-modal');
  displayOrders();
}

// Delete order
function deleteOrder(orderId) {
  if (!confirmAction('Bạn có chắc chắn muốn xóa đơn hàng này?\nHành động này không thể hoàn tác!')) {
    return;
  }
  
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const filteredOrders = orders.filter(o => o.id !== orderId);
  
  localStorage.setItem('tdungdecor_orders', JSON.stringify(filteredOrders));
  
  showNotification('Đã xóa đơn hàng thành công!', 'success');
  displayOrders();
}

// Export orders to Excel
function exportOrdersToExcel() {
  try {
    if (currentOrders.length === 0) {
      alert('⚠️ Không có đơn hàng để xuất!');
      return;
    }
    
    // Create CSV content
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'STT,Mã Đơn,Ngày Đặt,Khách Hàng,Số Điện Thoại,Địa Chỉ,Tổng Tiền (VNĐ),Trạng Thái,Ghi Chú\n';
    
    currentOrders.forEach((order, index) => {
      const row = [
        index + 1,
        order.orderId || order.id,
        new Date(order.date).toLocaleString('vi-VN'),
        `"${order.name.replace(/"/g, '""')}"`,
        order.phone,
        `"${order.address.replace(/"/g, '""')}"`,
        order.total,
        order.status,
        `"${(order.note || '').replace(/"/g, '""')}"`
      ];
      csv += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `DonHang_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`✅ Đã xuất ${currentOrders.length} đơn hàng ra Excel!`, 'success');
  } catch (error) {
    console.error('Export error:', error);
    alert('❌ Lỗi khi xuất file: ' + error.message);
  }
}

// Export orders to PDF
function exportOrdersToPDF() {
  try {
    if (currentOrders.length === 0) {
      alert('⚠️ Không có đơn hàng để xuất!');
      return;
    }
    
    let html = `
      <div style="font-family: 'Roboto', Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 10px;">DANH SÁCH ĐƠN HÀNG</h2>
        <p style="text-align: center; font-size: 12px; color: #666; margin-bottom: 20px;">
          Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #4CAF50; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Mã Đơn</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Ngày Đặt</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Khách Hàng</th>
              <th style="border: 1px solid #ddd; padding: 8px;">SĐT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tổng Tiền</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    currentOrders.forEach((o, i) => {
      html += `
        <tr style="background: ${i % 2 === 0 ? '#f9f9f9' : 'white'};">
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${i + 1}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${o.orderId || o.id}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${new Date(o.date).toLocaleDateString('vi-VN')}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${o.name}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${o.phone}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatVND(o.total)}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${o.status}</td>
        </tr>
      `;
    });
    
    html += `</tbody></table></div>`;
    
    const element = document.createElement('div');
    element.innerHTML = html;
    
    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `DonHang_${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
      })
      .save()
      .then(() => {
        showNotification(`✅ Đã xuất ${currentOrders.length} đơn hàng ra PDF!`, 'success');
      })
      .catch(err => {
        console.error(err);
        alert('❌ Lỗi: ' + err.message);
      });
      
  } catch (error) {
    console.error('Export PDF error:', error);
    alert('❌ Lỗi khi xuất PDF: ' + error.message);
  }
}

// Event listeners
document.getElementById('filter-status').addEventListener('change', filterOrders);
document.getElementById('filter-date').addEventListener('change', filterOrders);
document.getElementById('search-orders').addEventListener('input', filterOrders);

// Initialize
document.addEventListener('DOMContentLoaded', displayOrders);
