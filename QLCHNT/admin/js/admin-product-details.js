// Admin Product Details Management

let currentEditingProductId = null;

// Open product details modal
function editProductDetails(productId) {
  try {
    currentEditingProductId = productId;
    const product = getProductById(productId);
    
    if (!product) {
      alert('❌ Không tìm thấy sản phẩm!');
      return;
    }
  
  // Update modal header
  document.getElementById('details-product-name').textContent = product.title;
  document.getElementById('details-product-id').textContent = product.id;
  document.getElementById('details-current-product-id').value = productId;
  
  // Load existing details from localStorage
  const details = getProductDetails(productId);
  
  // Fill basic details
  document.getElementById('detail-origin').value = details.origin || '';
  document.getElementById('detail-material').value = details.material || '';
  document.getElementById('detail-dimensions').value = details.dimensions || '';
  document.getElementById('detail-color').value = details.color || '';
  document.getElementById('detail-weight').value = details.weight || '';
  document.getElementById('detail-warranty').value = details.warranty || '';
  document.getElementById('detail-highlights').value = details.highlights || '';
  
  // Render custom fields
  renderCustomFields(details.customFields || []);
  
  // Open modal
  openModal('product-details-modal');
  
  } catch (error) {
    console.error('Error opening product details:', error);
    alert('❌ Lỗi khi mở chi tiết sản phẩm: ' + error.message);
  }
}

// Get product details from localStorage
function getProductDetails(productId) {
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

// Save product details to localStorage
function saveProductDetails() {
  const productId = document.getElementById('details-current-product-id').value;
  
  if (!productId) {
    alert('❌ Lỗi: Không xác định được sản phẩm!');
    return;
  }
  
  // Collect data
  const details = {
    origin: document.getElementById('detail-origin').value.trim(),
    material: document.getElementById('detail-material').value.trim(),
    dimensions: document.getElementById('detail-dimensions').value.trim(),
    color: document.getElementById('detail-color').value.trim(),
    weight: document.getElementById('detail-weight').value.trim(),
    warranty: document.getElementById('detail-warranty').value.trim(),
    highlights: document.getElementById('detail-highlights').value.trim(),
    customFields: collectCustomFields()
  };
  
  // Load all details
  const allDetails = JSON.parse(localStorage.getItem('tdungdecor_product_details') || '{}');
  
  // Update this product's details
  allDetails[productId] = details;
  
  // Save back to localStorage
  localStorage.setItem('tdungdecor_product_details', JSON.stringify(allDetails));
  
  showNotification('✅ Đã lưu chi tiết sản phẩm thành công!', 'success');
  closeModal('product-details-modal');
}

// Render custom fields
function renderCustomFields(customFields) {
  const container = document.getElementById('custom-fields-container');
  
  if (customFields.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #94a3b8;">
        <div style="font-size: 48px; margin-bottom: 8px;">📝</div>
        <p>Chưa có trường tùy chỉnh nào</p>
        <p style="font-size: 14px;">Nhấn "➕ Thêm trường" để thêm mới</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = customFields.map((field, index) => `
    <div class="custom-field-item" data-index="${index}" style="display: grid; grid-template-columns: 1fr 2fr auto; gap: 12px; margin-bottom: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <input type="text" 
             class="form-control custom-field-label" 
             placeholder="Tên trường (VD: Xuất xứ)" 
             value="${field.label}"
             style="font-weight: 600;">
      <input type="text" 
             class="form-control custom-field-value" 
             placeholder="Giá trị (VD: Made in Vietnam)" 
             value="${field.value}">
      <button type="button" 
              class="btn btn-sm btn-danger" 
              onclick="removeCustomField(${index})"
              style="padding: 8px 12px;">
        🗑️
      </button>
    </div>
  `).join('');
}

// Add new custom field
function addCustomField() {
  const container = document.getElementById('custom-fields-container');
  
  // Remove empty state if exists
  if (container.querySelector('div[style*="text-align: center"]')) {
    container.innerHTML = '';
  }
  
  const index = container.children.length;
  
  const fieldHTML = `
    <div class="custom-field-item" data-index="${index}" style="display: grid; grid-template-columns: 1fr 2fr auto; gap: 12px; margin-bottom: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <input type="text" 
             class="form-control custom-field-label" 
             placeholder="Tên trường (VD: Xuất xứ)" 
             style="font-weight: 600;">
      <input type="text" 
             class="form-control custom-field-value" 
             placeholder="Giá trị (VD: Made in Vietnam)">
      <button type="button" 
              class="btn btn-sm btn-danger" 
              onclick="removeCustomField(${index})"
              style="padding: 8px 12px;">
        🗑️
      </button>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', fieldHTML);
}

// Remove custom field
function removeCustomField(index) {
  const container = document.getElementById('custom-fields-container');
  const fields = container.querySelectorAll('.custom-field-item');
  
  if (fields[index]) {
    fields[index].remove();
  }
  
  // Show empty state if no fields left
  if (container.children.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #94a3b8;">
        <div style="font-size: 48px; margin-bottom: 8px;">📝</div>
        <p>Chưa có trường tùy chỉnh nào</p>
        <p style="font-size: 14px;">Nhấn "➕ Thêm trường" để thêm mới</p>
      </div>
    `;
  }
}

// Collect custom fields data
function collectCustomFields() {
  const fields = [];
  const items = document.querySelectorAll('.custom-field-item');
  
  items.forEach(item => {
    const label = item.querySelector('.custom-field-label').value.trim();
    const value = item.querySelector('.custom-field-value').value.trim();
    
    if (label && value) {
      fields.push({ label, value });
    }
  });
  
  return fields;
}

// Use global modal functions (defined in admin-products.js)
// No need to redefine openModal and closeModal here
