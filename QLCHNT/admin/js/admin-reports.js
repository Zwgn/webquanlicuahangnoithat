// Admin Reports & Analytics JavaScript

// Refresh all reports
function refreshReports() {
  calculateRevenueOverview();
  drawRevenueChart();
  drawStatusChart();
  analyzeTopProducts();
  analyzeCategoryPerformance();
  analyzeBrandPerformance();
  showNotification('Đã làm mới báo cáo!', 'success');
}

// Calculate revenue overview
function calculateRevenueOverview() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const days = parseInt(document.getElementById('time-filter').value);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentOrders = orders.filter(o => new Date(o.date) >= cutoffDate);
  
  // Total revenue
  const totalRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
  document.getElementById('total-revenue').textContent = formatVND(totalRevenue);
  
  // Average order value
  const avgOrderValue = recentOrders.length > 0 
    ? totalRevenue / recentOrders.length 
    : 0;
  document.getElementById('avg-order-value').textContent = formatVND(avgOrderValue);
  
  // Total orders
  document.getElementById('total-orders-report').textContent = recentOrders.length;
  
  // Completion rate
  const completedOrders = recentOrders.filter(o => o.status === 'Đã giao').length;
  const completionRate = recentOrders.length > 0 
    ? ((completedOrders / recentOrders.length) * 100).toFixed(1)
    : 0;
  document.getElementById('completion-rate').textContent = completionRate + '%';
  
  // Mock change percentages
  document.getElementById('revenue-change').textContent = '↑ 12.5% so với trước';
  document.getElementById('orders-change').textContent = '↑ 8.3% so với trước';
}

// Draw revenue chart (simple bar chart)
function drawRevenueChart() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const days = parseInt(document.getElementById('time-filter').value);
  
  // Group by date
  const revenueByDate = {};
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  orders.forEach(order => {
    const orderDate = new Date(order.date);
    if (orderDate >= cutoffDate) {
      const dateKey = orderDate.toLocaleDateString('vi-VN');
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + order.total;
    }
  });
  
  const sortedDates = Object.keys(revenueByDate).sort((a, b) => {
    return new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'));
  });
  
  const maxRevenue = Math.max(...Object.values(revenueByDate), 1);
  
  const chartHtml = sortedDates.length > 0
    ? sortedDates.slice(-10).map(date => {
        const revenue = revenueByDate[date];
        const heightPercent = (revenue / maxRevenue) * 100;
        
        return `
          <div style="display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 60px;">
            <div style="font-weight: 600; font-size: 12px; color: #1e293b; margin-bottom: 4px;">
              ${formatVND(revenue)}
            </div>
            <div style="width: 100%; background: #e2e8f0; border-radius: 4px 4px 0 0; height: 200px; display: flex; align-items: flex-end; justify-content: center;">
              <div style="width: 70%; background: linear-gradient(to top, #6366f1, #8b5cf6); border-radius: 4px 4px 0 0; height: ${heightPercent}%; transition: height 0.3s; position: relative;">
              </div>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 8px; text-align: center;">
              ${date}
            </div>
          </div>
        `;
      }).join('')
    : `
      <div style="text-align: center; padding: 60px; color: #94a3b8;">
        <div style="font-size: 48px; margin-bottom: 12px;">📊</div>
        <p>Chưa có dữ liệu doanh thu</p>
      </div>
    `;
  
  document.getElementById('revenue-chart').innerHTML = `
    <div style="display: flex; gap: 8px; align-items: flex-end; justify-content: space-around;">
      ${chartHtml}
    </div>
  `;
}

// Draw status distribution chart
function drawStatusChart() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  
  const statusCount = {
    'Đang xử lý': 0,
    'Đang giao': 0,
    'Đã giao': 0,
    'Đã hủy': 0
  };
  
  orders.forEach(order => {
    if (statusCount[order.status] !== undefined) {
      statusCount[order.status]++;
    }
  });
  
  const total = orders.length || 1;
  
  const statusColors = {
    'Đang xử lý': '#f59e0b',
    'Đang giao': '#3b82f6',
    'Đã giao': '#10b981',
    'Đã hủy': '#ef4444'
  };
  
  const chartHtml = Object.entries(statusCount).map(([status, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    const color = statusColors[status];
    
    return `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 600; font-size: 14px;">${status}</span>
          <span style="font-weight: 600; font-size: 14px;">${count} (${percentage}%)</span>
        </div>
        <div style="width: 100%; height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
          <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
        </div>
      </div>
    `;
  }).join('');
  
  document.getElementById('status-chart').innerHTML = chartHtml || `
    <div style="text-align: center; padding: 60px; color: #94a3b8;">
      <div style="font-size: 48px; margin-bottom: 12px;">📈</div>
      <p>Chưa có dữ liệu đơn hàng</p>
    </div>
  `;
}

// Analyze top products
function analyzeTopProducts() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const products = getProducts();
  
  // Count sales per product
  const productSales = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = {
          id: item.id,
          title: item.title,
          category: item.category || 'N/A',
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.id].quantity += item.quantity;
      productSales[item.id].revenue += item.total;
    });
  });
  
  // Sort by quantity
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
  
  const totalRevenue = Object.values(productSales).reduce((sum, p) => sum + p.revenue, 0) || 1;
  
  const tbody = document.getElementById('top-products-table');
  
  if (topProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <div class="empty-state-icon">🔥</div>
            <h3>Chưa có dữ liệu bán hàng</h3>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = topProducts.map((product, index) => {
    const percentage = ((product.revenue / totalRevenue) * 100).toFixed(1);
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
    
    return `
      <tr>
        <td><strong style="font-size: 18px;">${medal}</strong></td>
        <td><strong>${product.title}</strong></td>
        <td>${getCategoryName(product.category)}</td>
        <td>
          <span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
            ${product.quantity} đã bán
          </span>
        </td>
        <td><strong>${formatVND(product.revenue)}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div style="width: ${percentage}%; height: 100%; background: #6366f1;"></div>
            </div>
            <span style="font-size: 13px; font-weight: 600;">${percentage}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Analyze category performance
function analyzeCategoryPerformance() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const products = getProducts();
  
  const categoryStats = {};
  
  // Count products per category
  products.forEach(product => {
    if (!categoryStats[product.category]) {
      categoryStats[product.category] = {
        category: product.category,
        productCount: 0,
        sold: 0,
        revenue: 0
      };
    }
    categoryStats[product.category].productCount++;
  });
  
  // Count sales
  orders.forEach(order => {
    order.items.forEach(item => {
      if (categoryStats[item.category]) {
        categoryStats[item.category].sold += item.quantity;
        categoryStats[item.category].revenue += item.total;
      }
    });
  });
  
  const sortedCategories = Object.values(categoryStats)
    .sort((a, b) => b.revenue - a.revenue);
  
  const totalRevenue = sortedCategories.reduce((sum, c) => sum + c.revenue, 0) || 1;
  
  const tbody = document.getElementById('category-performance-table');
  
  tbody.innerHTML = sortedCategories.map(cat => {
    const percentage = ((cat.revenue / totalRevenue) * 100).toFixed(1);
    
    return `
      <tr>
        <td><strong>${getCategoryName(cat.category)}</strong></td>
        <td>${cat.productCount} sản phẩm</td>
        <td>
          <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
            ${cat.sold} đã bán
          </span>
        </td>
        <td><strong>${formatVND(cat.revenue)}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div style="width: ${percentage}%; height: 100%; background: #10b981;"></div>
            </div>
            <span style="font-size: 13px; font-weight: 600;">${percentage}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Analyze brand performance
function analyzeBrandPerformance() {
  const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
  const products = getProducts();
  
  const brandStats = {};
  
  // Count products per brand
  products.forEach(product => {
    if (!brandStats[product.brand]) {
      brandStats[product.brand] = {
        brand: product.brand,
        productCount: 0,
        sold: 0,
        revenue: 0
      };
    }
    brandStats[product.brand].productCount++;
  });
  
  // Count sales
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product && brandStats[product.brand]) {
        brandStats[product.brand].sold += item.quantity;
        brandStats[product.brand].revenue += item.total;
      }
    });
  });
  
  const sortedBrands = Object.values(brandStats)
    .sort((a, b) => b.revenue - a.revenue);
  
  const totalRevenue = sortedBrands.reduce((sum, b) => sum + b.revenue, 0) || 1;
  
  const tbody = document.getElementById('brand-performance-table');
  
  tbody.innerHTML = sortedBrands.map(brand => {
    const percentage = ((brand.revenue / totalRevenue) * 100).toFixed(1);
    
    return `
      <tr>
        <td><strong>${getBrandName(brand.brand)}</strong></td>
        <td>${brand.productCount} sản phẩm</td>
        <td>
          <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
            ${brand.sold} đã bán
          </span>
        </td>
        <td><strong>${formatVND(brand.revenue)}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div style="width: ${percentage}%; height: 100%; background: #f59e0b;"></div>
            </div>
            <span style="font-size: 13px; font-weight: 600;">${percentage}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Export reports to Excel
function exportReportsToExcel() {
  try {
    const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
    const products = JSON.parse(localStorage.getItem('tdungdecor_products') || '[]');
    const days = parseInt(document.getElementById('time-filter').value);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const recentOrders = orders.filter(o => new Date(o.date) >= cutoffDate);
    
    if (recentOrders.length === 0) {
      alert('⚠️ Không có dữ liệu báo cáo để xuất!');
      return;
    }
    
    // Create CSV content
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += `BÁO CÁO THỐNG KÊ - ${days} NGÀY QUA\n\n`;
    
    // Revenue overview
    const totalRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / recentOrders.length;
    const completedOrders = recentOrders.filter(o => o.status === 'Đã giao').length;
    const completionRate = ((completedOrders / recentOrders.length) * 100).toFixed(1);
    
    csv += 'TỔNG QUAN DOANH THU\n';
    csv += 'Chỉ Tiêu,Giá Trị\n';
    csv += `Tổng Doanh Thu,${totalRevenue} VNĐ\n`;
    csv += `Giá Trị Đơn Trung Bình,${avgOrderValue.toFixed(0)} VNĐ\n`;
    csv += `Tổng Đơn Hàng,${recentOrders.length}\n`;
    csv += `Tỷ Lệ Hoàn Thành,${completionRate}%\n\n`;
    
    // Top products
    csv += 'TOP SẢN PHẨM BÁN CHẠY\n';
    csv += 'STT,Mã SP,Tên Sản Phẩm,Số Lượng Bán,Doanh Thu (VNĐ)\n';
    
    const productSales = {};
    recentOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            id: item.id,
            title: item.title,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    topProducts.forEach((product, index) => {
      csv += `${index + 1},${product.id},"${product.title.replace(/"/g, '""')}",${product.quantity},${product.revenue}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `BaoCao_${days}Ngay_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('✅ Đã xuất báo cáo ra Excel!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    alert('❌ Lỗi khi xuất file: ' + error.message);
  }
}

// Export reports to PDF
function exportReportsToPDF() {
  try {
    const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
    const days = parseInt(document.getElementById('time-filter').value);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const recentOrders = orders.filter(o => new Date(o.date) >= cutoffDate);
    
    if (recentOrders.length === 0) {
      alert('⚠️ Không có dữ liệu báo cáo để xuất!');
      return;
    }
    
    // Tính toán
    const totalRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / recentOrders.length;
    const completedOrders = recentOrders.filter(o => o.status === 'Đã giao').length;
    const completionRate = ((completedOrders / recentOrders.length) * 100).toFixed(1);
    
    // Top products
    const productSales = {};
    recentOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            id: item.id,
            title: item.title,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    // Tạo HTML
    let html = `
      <div style="font-family: 'Roboto', Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 5px;">BÁO CÁO THỐNG KÊ - ${days} NGÀY QUA</h2>
        <p style="text-align: center; font-size: 12px; color: #666; margin-bottom: 20px;">
          Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
        </p>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">TỔNG QUAN DOANH THU</h3>
          <p style="margin: 5px 0;"><strong>Tổng Doanh Thu:</strong> ${formatVND(totalRevenue)}</p>
          <p style="margin: 5px 0;"><strong>Giá Trị Đơn Trung Bình:</strong> ${formatVND(avgOrderValue)}</p>
          <p style="margin: 5px 0;"><strong>Tổng Đơn Hàng:</strong> ${recentOrders.length}</p>
          <p style="margin: 5px 0;"><strong>Tỷ Lệ Hoàn Thành:</strong> ${completionRate}%</p>
        </div>
        
        <h3 style="margin: 20px 0 10px 0;">TOP SẢN PHẨM BÁN CHẠY</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #4CAF50; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Sản Phẩm</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Số Lượng</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Doanh Thu</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    topProducts.forEach((p, i) => {
      html += `
        <tr style="background: ${i % 2 === 0 ? '#f9f9f9' : 'white'};">
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${i + 1}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${p.title}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${p.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatVND(p.revenue)}</td>
        </tr>
      `;
    });
    
    html += `</tbody></table></div>`;
    
    const element = document.createElement('div');
    element.innerHTML = html;
    
    html2pdf()
      .from(element)
      .set({
        margin: 15,
        filename: `BaoCao_${days}Ngay_${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      })
      .save()
      .then(() => {
        showNotification('✅ Đã xuất báo cáo ra PDF!', 'success');
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
document.getElementById('time-filter').addEventListener('change', refreshReports);

// Initialize
document.addEventListener('DOMContentLoaded', refreshReports);
