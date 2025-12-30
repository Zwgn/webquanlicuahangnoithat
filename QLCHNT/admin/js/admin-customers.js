// Admin Customers Management JavaScript

let currentCustomers = [];

// Display all customers
function displayCustomers() {
  const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  
  // Calculate customer stats
  currentCustomers = users.map(user => {
    const userOrders = orders.filter(o => o.userId === user.email);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      ...user,
      orderCount: userOrders.length,
      totalSpent: totalSpent,
      lastOrderDate: userOrders.length > 0 
        ? new Date(Math.max(...userOrders.map(o => new Date(o.date))))
        : null
    };
  });
  
  calculateCustomerStats();
  renderCustomersTable();
}

// Calculate customer statistics
function calculateCustomerStats() {
  const total = currentCustomers.length;
  document.getElementById('total-customers').textContent = total;
  
  // New customers (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newCustomers = currentCustomers.filter(c => 
    new Date(c.createdAt) >= thirtyDaysAgo
  ).length;
  document.getElementById('new-customers').textContent = newCustomers;
  
  // Active customers (have orders)
  const activeCustomers = currentCustomers.filter(c => c.orderCount > 0).length;
  document.getElementById('active-customers').textContent = activeCustomers;
  
  // Average orders per customer
  const totalOrders = currentCustomers.reduce((sum, c) => sum + c.orderCount, 0);
  const avgOrders = total > 0 ? (totalOrders / total).toFixed(1) : '0';
  document.getElementById('avg-orders').textContent = avgOrders;
}

// Render customers table
function renderCustomersTable() {
  const tbody = document.getElementById('customers-table');
  const customerCount = document.getElementById('customer-count');
  
  customerCount.textContent = currentCustomers.length;
  
  if (currentCustomers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <div class="empty-state-icon">👥</div>
            <h3>Chưa có khách hàng nào</h3>
            <p>Khách hàng đăng ký sẽ xuất hiện ở đây</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = currentCustomers.map((customer, index) => {
    const hasOrders = customer.orderCount > 0;
    
    return `
      <tr>
        <td><strong>#${index + 1}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">
              ${customer.name.charAt(0).toUpperCase()}
            </div>
            <strong>${customer.name}</strong>
          </div>
        </td>
        <td>${customer.email}</td>
        <td>${customer.phone || 'N/A'}</td>
        <td>${formatDate(customer.createdAt)}</td>
        <td>
          ${hasOrders 
            ? `<span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${customer.orderCount} đơn</span>`
            : `<span style="background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Chưa có</span>`
          }
        </td>
        <td><strong>${formatVND(customer.totalSpent)}</strong></td>
        <td>
          <div class="table-actions">
            <button class="action-btn view" onclick="viewCustomerDetail('${customer.email}')" title="Xem chi tiết">👁️</button>
            <button class="action-btn delete" onclick="deleteCustomer('${customer.email}')" title="Xóa">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Filter/search customers
function filterCustomers() {
  const searchText = document.getElementById('search-customers').value.toLowerCase();
  const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  
  const filteredUsers = users.filter(user => 
    (user.fullName && user.fullName.toLowerCase().includes(searchText)) ||
    (user.name && user.name.toLowerCase().includes(searchText)) ||
    user.email.toLowerCase().includes(searchText) ||
    (user.phone && user.phone.includes(searchText))
  );
  
  currentCustomers = filteredUsers.map(user => {
    const userOrders = orders.filter(o => o.userId === user.email);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      ...user,
      orderCount: userOrders.length,
      totalSpent: totalSpent,
      lastOrderDate: userOrders.length > 0 
        ? new Date(Math.max(...userOrders.map(o => new Date(o.date))))
        : null
    };
  });
  
  renderCustomersTable();
}

// View customer detail
function viewCustomerDetail(email) {
  const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  
  const customer = users.find(u => u.email === email);
  if (!customer) {
    showNotification('Không tìm thấy khách hàng!', 'error');
    return;
  }
  
  const customerOrders = orders.filter(o => o.userId === email);
  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = customerOrders.length > 0 ? totalSpent / customerOrders.length : 0;
  
  // Fill customer info
  document.getElementById('detail-name').textContent = customer.name;
  document.getElementById('detail-email').textContent = customer.email;
  document.getElementById('detail-phone').textContent = customer.phone || 'N/A';
  document.getElementById('detail-created').textContent = formatDate(customer.createdAt);
  
  // Fill stats
  document.getElementById('detail-total-orders').textContent = customerOrders.length;
  document.getElementById('detail-total-spent').textContent = formatVND(totalSpent);
  document.getElementById('detail-avg-order').textContent = formatVND(avgOrder);
  
  if (customerOrders.length > 0) {
    const lastOrder = customerOrders.reduce((latest, order) => 
      new Date(order.date) > new Date(latest.date) ? order : latest
    );
    document.getElementById('detail-last-order').textContent = formatDate(lastOrder.date);
  } else {
    document.getElementById('detail-last-order').textContent = 'Chưa có đơn hàng';
  }
  
  // Render order history
  const orderHistoryHtml = customerOrders.length > 0
    ? customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => {
        const statusClass = {
          'Đang xử lý': 'pending',
          'Đang giao': 'processing',
          'Đã giao': 'completed',
          'Đã hủy': 'cancelled'
        }[order.status] || 'pending';
        
        return `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>
                <strong style="font-size: 14px;">Đơn hàng #${order.id}</strong>
                <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
                  ${formatDate(order.date)}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 600; font-size: 15px; margin-bottom: 4px;">
                  ${formatVND(order.total)}
                </div>
                <span class="status-badge ${statusClass}">${order.status}</span>
              </div>
            </div>
            <div style="font-size: 13px; color: #64748b;">
              ${order.items.length} sản phẩm: ${order.items.map(i => i.title).join(', ')}
            </div>
          </div>
        `;
      }).join('')
    : `
      <div style="text-align: center; padding: 40px; color: #94a3b8;">
        <div style="font-size: 48px; margin-bottom: 12px;">🛒</div>
        <p>Khách hàng chưa có đơn hàng nào</p>
      </div>
    `;
  
  document.getElementById('detail-order-history').innerHTML = orderHistoryHtml;
  
  openModal('customer-detail-modal');
}

// Delete customer
function deleteCustomer(email) {
  if (!confirmAction('Bạn có chắc chắn muốn xóa khách hàng này?\nTất cả đơn hàng của khách cũng sẽ bị xóa!\nHành động này không thể hoàn tác!')) {
    return;
  }
  
  // Remove from users
  const users = JSON.parse(localStorage.getItem('tdungdecor_users') || '[]');
  const filteredUsers = users.filter(u => u.email !== email);
  localStorage.setItem('tdungdecor_users', JSON.stringify(filteredUsers));
  
  // Remove their orders
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const filteredOrders = orders.filter(o => o.userId !== email);
  localStorage.setItem('tdungdecor_orders', JSON.stringify(filteredOrders));
  
  showNotification('Đã xóa khách hàng thành công!', 'success');
  displayCustomers();
}

// Export customers to Excel
function exportCustomersToExcel() {
  try {
    if (currentCustomers.length === 0) {
      alert('⚠️ Không có khách hàng để xuất!');
      return;
    }
    
    // Create CSV content
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'STT,Họ Tên,Email,Số Điện Thoại,Địa Chỉ,Số Đơn Hàng,Tổng Chi Tiêu (VNĐ),Ngày Đăng Ký\n';
    
    currentCustomers.forEach((customer, index) => {
      const fullName = customer.name || customer.fullName || '';
      const address = customer.address || '';
      
      const row = [
        index + 1,
        `"${fullName.replace(/"/g, '""')}"`,
        customer.email,
        customer.phone || '',
        `"${address.replace(/"/g, '""')}"`,
        customer.orderCount,
        customer.totalSpent,
        new Date(customer.createdAt).toLocaleDateString('vi-VN')
      ];
      csv += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `KhachHang_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`✅ Đã xuất ${currentCustomers.length} khách hàng ra Excel!`, 'success');
  } catch (error) {
    console.error('Export error:', error);
    alert('❌ Lỗi khi xuất file: ' + error.message);
  }
}

// Export customers to PDF
function exportCustomersToPDF() {
  try {
    if (currentCustomers.length === 0) {
      alert('⚠️ Không có khách hàng để xuất!');
      return;
    }
    
    let html = `
      <div style="font-family: 'Roboto', Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 10px;">DANH SÁCH KHÁCH HÀNG</h2>
        <p style="text-align: center; font-size: 12px; color: #666; margin-bottom: 20px;">
          Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #4CAF50; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Họ Tên</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
              <th style="border: 1px solid #ddd; padding: 8px;">SĐT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Số Đơn</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tổng Chi Tiêu</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Ngày Đăng Ký</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    currentCustomers.forEach((c, i) => {
      html += `
        <tr style="background: ${i % 2 === 0 ? '#f9f9f9' : 'white'};">
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${i + 1}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${c.name || c.fullName || ''}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${c.email}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${c.phone || ''}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${c.orderCount}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatVND(c.totalSpent)}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
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
        filename: `KhachHang_${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
      })
      .save()
      .then(() => {
        showNotification(`✅ Đã xuất ${currentCustomers.length} khách hàng ra PDF!`, 'success');
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
document.getElementById('search-customers').addEventListener('input', filterCustomers);

// Initialize
document.addEventListener('DOMContentLoaded', displayCustomers);
