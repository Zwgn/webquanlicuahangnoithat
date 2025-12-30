// Get product ID from URL
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Render product detail
function renderProductDetail() {
  const detailRoot = document.getElementById('detail-root');
  const productId = getProductIdFromURL();

  if (!productId) {
    detailRoot.innerHTML = `
      <div class="empty-state">
        <h3>Không tìm thấy sản phẩm</h3>
        <p>Vui lòng chọn sản phẩm từ danh sách.</p>
        <a href="../index.html" class="btn btn-primary mt-3">Về trang chủ</a>
      </div>
    `;
    return;
  }

  const product = findProduct(productId);

  if (!product) {
    detailRoot.innerHTML = `
      <div class="empty-state">
        <h3>Sản phẩm không tồn tại</h3>
        <p>Sản phẩm bạn tìm kiếm không có trong hệ thống.</p>
        <a href="products.html" class="btn btn-primary mt-3">Xem sản phẩm khác</a>
      </div>
    `;
    return;
  }

  detailRoot.innerHTML = `
    <div class="detail-container">
      <div class="detail-image">
        <img src="../${product.img}" alt="${product.title}">
      </div>
      <div class="detail-info">
        <h1>${product.title}</h1>
        <div class="detail-price">${formatVND(product.price)}</div>
        <div class="detail-desc">
          <p>${product.desc}</p>
        </div>
        ${product.featured ? '<span class="badge">⭐ Nổi bật</span>' : ''}
        ${product.bestseller ? '<span class="badge">🔥 Bán chạy</span>' : ''}
        <div class="detail-actions mt-3">
          <label for="quantity">Số lượng:</label>
          <input 
            type="number" 
            id="quantity" 
            value="1" 
            min="1" 
            max="99" 
            style="width: 80px; padding: 10px;"
          >
          <button class="btn btn-primary" id="add-to-cart-detail">
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Cập nhật thông tin chi tiết sản phẩm
  updateProductSpecifications(product);
  updateProductDescription(product);

  // Add to cart handler
  const addBtn = document.getElementById('add-to-cart-detail');
  const qtyInput = document.getElementById('quantity');

  addBtn.addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value) || 1;
    Cart.add(productId, quantity);

    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = '✓ Đã thêm vào giỏ';
    addBtn.disabled = true;

    setTimeout(() => {
      addBtn.innerHTML = originalText;
      addBtn.disabled = false;
    }, 1500);

    // Show notification
    const notification = document.createElement('div');
    notification.textContent = `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #00d97e;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  });
}

// Hàm cập nhật thông tin chi tiết
function updateProductSpecifications(product) {
  const categoryNames = {
    'sofa': 'Sofa',
    'table': 'Bàn',
    'chair': 'Ghế',
    'cabinet': 'Tủ & Kệ',
    'bed': 'Giường',
    'decor': 'Đồ trang trí'
  };
  
  // Load product details from localStorage
  const productDetails = getProductDetailsFromStorage(product.id);
  
  const table = document.getElementById('specifications-table');
  let specsHTML = '';
  
  // Standard fields
  const specs = [
    { icon: '🌍', label: 'Nguồn gốc', value: productDetails.origin || 'Việt Nam' },
    { icon: '🧵', label: 'Chất liệu', value: productDetails.material || 'Gỗ tự nhiên cao cấp, bền đẹp theo thời gian' },
    { icon: '📐', label: 'Kích thước', value: productDetails.dimensions || getDimensionsByCategory(product.category) },
    { icon: '🎨', label: 'Màu sắc', value: productDetails.color || 'Màu tự nhiên, có thể tùy chỉnh theo yêu cầu' },
    { icon: '⚖️', label: 'Trọng lượng', value: productDetails.weight || getWeightByCategory(product.category) },
    { icon: '🛡️', label: 'Bảo hành', value: productDetails.warranty || '12 tháng đổi trả miễn phí' }
  ];
  
  // Add brand
  const brandNames = {
    'ikea': 'IKEA - Thụy Điển',
    'poliform': 'Poliform - Ý',
    'restoration': 'Restoration Hardware - Mỹ',
    'vitra': 'Vitra - Đức',
    'nhaxinh': 'Nhà Xinh',
    'phoxinh': 'Phố Xinh',
    'hoaphat': 'Hòa Phát',
    'hoanganh': 'Hoàng Anh Gia Lai Furniture'
  };
  let brandText = 'TDUNG DECOR';
  if (product.brand && brandNames[product.brand]) {
    brandText = brandNames[product.brand];
  }
  specs.push({ icon: '🏭', label: 'Thương hiệu', value: brandText });
  
  // Add custom fields
  if (productDetails.customFields && productDetails.customFields.length > 0) {
    productDetails.customFields.forEach(field => {
      specs.push({ icon: '📌', label: field.label, value: field.value });
    });
  }
  
  // Render table
  specs.forEach(spec => {
    specsHTML += `
      <tr>
        <td class="spec-label">${spec.icon} ${spec.label}</td>
        <td class="spec-value">${spec.value}</td>
      </tr>
    `;
  });
  
  table.innerHTML = specsHTML;
}

// Get product details from localStorage
function getProductDetailsFromStorage(productId) {
  const allDetails = JSON.parse(localStorage.getItem('tdungdecor_product_details') || '{}');
  return allDetails[productId] || {
    origin: '',
    material: '',
    dimensions: '',
    color: '',
    weight: '',
    warranty: '',
    highlights: '',
    customFields: []
  };
}

// Hàm lấy kích thước theo danh mục
function getDimensionsByCategory(category) {
  const dimensions = {
    'sofa': '200 x 90 x 85 cm (Dài x Rộng x Cao)',
    'table': '120 x 70 x 75 cm (Dài x Rộng x Cao)',
    'chair': '50 x 55 x 90 cm (Dài x Rộng x Cao)',
    'cabinet': '80 x 40 x 180 cm (Dài x Rộng x Cao)',
    'bed': '200 x 180 x 100 cm (Dài x Rộng x Cao)',
    'decor': 'Đa dạng theo từng sản phẩm'
  };
  return dimensions[category] || '100 x 50 x 75 cm (Dài x Rộng x Cao)';
}

// Hàm lấy trọng lượng theo danh mục
function getWeightByCategory(category) {
  const weights = {
    'sofa': 'Khoảng 45-60 kg',
    'table': 'Khoảng 25-35 kg',
    'chair': 'Khoảng 8-12 kg',
    'cabinet': 'Khoảng 35-50 kg',
    'bed': 'Khoảng 60-80 kg',
    'decor': 'Từ 1-10 kg tùy sản phẩm'
  };
  return weights[category] || 'Khoảng 15-25 kg';
}

// Hàm cập nhật mô tả sản phẩm - CHỈ dùng dữ liệu từ localStorage
function updateProductDescription(product) {
  const productDetails = getProductDetailsFromStorage(product.id);
  let description = `
    <p><strong>${product.title}</strong></p>
    <p>${product.desc}</p>
  `;
  
  // Chỉ hiện highlights nếu có trong localStorage
  if (productDetails.highlights && productDetails.highlights.trim()) {
    const highlightItems = productDetails.highlights
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const text = line.trim().replace(/^[-•*]\s*/, '');
        return text ? `<li style="padding: 8px 12px; margin-bottom: 6px; background: #f0f9ff; border-left: 3px solid #0ea5e9; border-radius: 4px;">✓ ${text}</li>` : '';
      })
      .join('');
    
    description += `
      <h3 style="color: #2d3748; font-size: 18px; margin: 24px 0 12px 0;">✨ Đặc Điểm Nổi Bật</h3>
      <ul style="list-style: none; padding: 0;">${highlightItems}</ul>
    `;
  }
  
  document.getElementById('product-description').innerHTML = description;
}

// Xử lý tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove active class from all buttons and panes
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    
    // Add active class to clicked button
    this.classList.add('active');
    
    // Show corresponding pane
    const tabId = this.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', renderProductDetail);
