// Admin Products Management JavaScript

let currentProducts = [];
let editingProductId = null;

// Display all products
function displayProducts() {
  currentProducts = [...getProducts()];
  renderProductsTable();
}

// Render products table
function renderProductsTable() {
  const tbody = document.getElementById('products-table');
  const productCount = document.getElementById('product-count');
  
  productCount.textContent = currentProducts.length;
  
  if (currentProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h3>Không có sản phẩm nào</h3>
            <p>Thêm sản phẩm mới để bắt đầu</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = currentProducts.map(product => `
    <tr>
      <td><strong>#${product.id}</strong></td>
      <td>
        <img src="${product.img.startsWith('data:') ? product.img : '../../' + product.img}" 
             alt="${product.title}" 
             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #dee2e6;"
             onerror="this.src='../../images/placeholder.png'; this.style.opacity='0.5';">
      </td>
      <td>
        <strong>${product.title}</strong>
        <div style="display: flex; gap: 4px; margin-top: 4px;">
          ${product.featured ? '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">⭐ Nổi bật</span>' : ''}
          ${product.bestseller ? '<span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">🔥 Bán chạy</span>' : ''}
        </div>
      </td>
      <td>${getCategoryName(product.category)}</td>
      <td>${getBrandName(product.brand)}</td>
      <td><strong>${formatVND(product.price)}</strong></td>
      <td>
        <span class="status-badge completed">Đang bán</span>
      </td>
      <td>
        <div class="table-actions">
          <button class="action-btn view" onclick="viewProduct('${product.id}')" title="Xem chi tiết">👁️</button>
          <button class="action-btn edit" onclick="editProduct('${product.id}')" title="Chỉnh sửa">✏️</button>
          <button class="action-btn info" onclick="editProductDetails('${product.id}')" title="Chi tiết sản phẩm">📋</button>
          <button class="action-btn delete" onclick="deleteProduct('${product.id}')" title="Xóa">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Filter products
function filterProducts() {
  const category = document.getElementById('filter-category').value;
  const brand = document.getElementById('filter-brand').value;
  const searchText = document.getElementById('search-products').value.toLowerCase();
  
  currentProducts = getProducts().filter(product => {
    const matchCategory = !category || product.category === category;
    const matchBrand = !brand || product.brand === brand;
    const matchSearch = !searchText || 
                       product.title.toLowerCase().includes(searchText) ||
                       product.id.toLowerCase().includes(searchText);
    
    return matchCategory && matchBrand && matchSearch;
  });
  
  renderProductsTable();
}

// View product details
function viewProduct(productId) {
  window.open(`../../pages/detail.html?id=${productId}`, '_blank');
}

// Edit product
function editProduct(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) {
    showNotification('Không tìm thấy sản phẩm!', 'error');
    return;
  }
  
  editingProductId = productId;
  document.getElementById('modal-title').textContent = 'Chỉnh Sửa Sản Phẩm';
  
  // Fill form with product data
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-title').value = product.title;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-brand').value = product.brand;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-img').value = product.img;
  document.getElementById('product-desc').value = product.desc || '';
  document.getElementById('product-featured').checked = product.featured || false;
  document.getElementById('product-bestseller').checked = product.bestseller || false;
  
  openModal('product-modal');
}

// Save product (add or update)
// Convert plain text to HTML
function textToHTML(text) {
  if (!text) return '';
  
  // Nếu đã có HTML tags, giữ nguyên
  if (text.includes('<p>') || text.includes('<ul>') || text.includes('<h3>')) {
    return text;
  }
  
  // Chuyển đổi text thuần sang HTML
  let html = '';
  const lines = text.split('\n');
  let inList = false;
  
  for (let line of lines) {
    line = line.trim();
    
    if (!line) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      continue;
    }
    
    // Tiêu đề (dòng bắt đầu bằng ##)
    if (line.startsWith('## ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<h3>${line.substring(3)}</h3>\n`;
    }
    // List item (bắt đầu bằng - hoặc *)
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += '<ul>\n';
        inList = true;
      }
      html += `<li>${line.substring(2)}</li>\n`;
    }
    // Đoạn văn bình thường
    else {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<p>${line}</p>\n`;
    }
  }
  
  if (inList) {
    html += '</ul>\n';
  }
  
  return html;
}

function saveProduct() {
  const id = document.getElementById('product-id').value;
  const title = document.getElementById('product-title').value.trim();
  const category = document.getElementById('product-category').value;
  const brand = document.getElementById('product-brand').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const img = document.getElementById('product-img').value.trim();
  const desc = document.getElementById('product-desc').value.trim();
  const featured = document.getElementById('product-featured').checked;
  const bestseller = document.getElementById('product-bestseller').checked;
  
  // Validation
  if (!title || !category || !brand || !price || !img) {
    showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
    return;
  }
  
  const products = getProducts();
  
  if (editingProductId) {
    // Update existing product
    const index = products.findIndex(p => p.id === editingProductId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        title,
        category,
        brand,
        price,
        img,
        desc,
        featured,
        bestseller
      };
      
      // Update localStorage
      saveProducts(products);
      
      showNotification('Cập nhật sản phẩm thành công!', 'success');
      closeModal('product-modal');
      displayProducts();
    }
  } else {
    // Add new product
    const newId = 'p' + (products.length + 1);
    const newProduct = {
      id: newId,
      title,
      price,
      img,
      category,
      brand,
      desc,
      featured,
      bestseller
    };
    
    products.push(newProduct);
    
    // Update localStorage
    saveProducts(products);
    
    showNotification('Thêm sản phẩm mới thành công!', 'success');
    closeModal('product-modal');
    displayProducts();
  }
}

// Delete product
function deleteProduct(productId) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    return;
  }
  
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    const productName = products[index].title;
    products.splice(index, 1);
    
    // Update localStorage
    saveProducts(products);
    
    showNotification(`Đã xóa sản phẩm "${productName}"`, 'success');
    displayProducts();
  }
}

// Handle image file upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('⚠️ Vui lòng chọn file ảnh (JPG, PNG, GIF...)');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('⚠️ Kích thước ảnh không được vượt quá 5MB');
    return;
  }
  
  // Convert to base64 or create object URL
  const reader = new FileReader();
  reader.onload = function(e) {
    const imgInput = document.getElementById('product-img');
    // Store as data URL (base64)
    imgInput.value = e.target.result;
    showNotification('✅ Đã tải ảnh lên thành công!', 'success');
  };
  reader.readAsDataURL(file);
}

// Export products to Excel
function exportToExcel() {
  try {
    const products = getProducts();
    
    if (products.length === 0) {
      alert('⚠️ Không có sản phẩm để xuất!');
      return;
    }
    
    // Create CSV content
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'STT,Mã SP,Tên Sản Phẩm,Danh Mục,Thương Hiệu,Giá (VNĐ),Nổi Bật,Bán Chạy,Mô Tả\n';
    
    products.forEach((product, index) => {
      const row = [
        index + 1,
        product.id,
        `"${product.title.replace(/"/g, '""')}"`, // Escape quotes
        getCategoryName(product.category),
        getBrandName(product.brand),
        product.price,
        product.featured ? 'Có' : 'Không',
        product.bestseller ? 'Có' : 'Không',
        `"${(product.desc || '').replace(/"/g, '""')}"`
      ];
      csv += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `SanPham_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`✅ Đã xuất ${products.length} sản phẩm ra Excel!`, 'success');
  } catch (error) {
    console.error('Export error:', error);
    alert('❌ Lỗi khi xuất file: ' + error.message);
  }
}

// Export to PDF
function exportToPDF() {
  try {
    const products = getProducts();
    
    if (products.length === 0) {
      alert('⚠️ Không có sản phẩm để xuất!');
      return;
    }
    
    // Tạo bảng HTML
    let html = `
      <div style="font-family: 'Roboto', Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 10px;">DANH SÁCH SẢN PHẨM</h2>
        <p style="text-align: center; font-size: 12px; color: #666; margin-bottom: 20px;">
          Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #4CAF50; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Mã SP</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Sản Phẩm</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Danh Mục</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Thương Hiệu</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Giá</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Nổi Bật</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Bán Chạy</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    products.forEach((p, i) => {
      html += `
        <tr style="background: ${i % 2 === 0 ? '#f9f9f9' : 'white'};">
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${i + 1}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${p.id}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${p.title}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${getCategoryName(p.category)}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${getBrandName(p.brand)}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${formatVND(p.price)}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${p.featured ? '✓' : ''}</td>
          <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${p.bestseller ? '✓' : ''}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
    
    // Tạo div tạm
    const element = document.createElement('div');
    element.innerHTML = html;
    
    // Xuất PDF
    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `SanPham_${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
      })
      .save()
      .then(() => {
        showNotification(`✅ Đã xuất ${products.length} sản phẩm ra PDF!`, 'success');
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

// Load products from localStorage if exists
function loadProductsFromStorage() {
  const stored = localStorage.getItem('tdungdecor_products');
  if (stored) {
    try {
      const products = JSON.parse(stored);
      if (Array.isArray(products) && products.length > 0) {
        window.PRODUCTS = products;
      }
    } catch (e) {
      console.error('Error loading products from storage:', e);
    }
  }
}

// Event listeners
document.getElementById('filter-category').addEventListener('change', filterProducts);
document.getElementById('filter-brand').addEventListener('change', filterProducts);
document.getElementById('search-products').addEventListener('input', filterProducts);

// Load categories and brands from localStorage
function loadCategoriesAndBrandsOptions() {
  // Load categories
  const savedCategories = localStorage.getItem('tdungdecor_categories');
  const categories = savedCategories ? JSON.parse(savedCategories) : [
    { id: 'sofa', name: 'Sofa' },
    { id: 'table', name: 'Bàn' },
    { id: 'chair', name: 'Ghế' },
    { id: 'cabinet', name: 'Tủ & Kệ' },
    { id: 'bed', name: 'Giường' },
    { id: 'decor', name: 'Đồ trang trí' }
  ];
  
  // Load brands
  const savedBrands = localStorage.getItem('tdungdecor_brands');
  const brands = savedBrands ? JSON.parse(savedBrands) : [
    { id: 'ikea', name: 'IKEA' },
    { id: 'poliform', name: 'Poliform' },
    { id: 'restoration', name: 'Restoration Hardware' },
    { id: 'vitra', name: 'Vitra' },
    { id: 'nhaxinh', name: 'Nhà Xinh' },
    { id: 'phoxinh', name: 'Phố Xinh' },
    { id: 'hoaphat', name: 'Hòa Phát' },
    { id: 'hoanganh', name: 'Hoàng Anh' }
  ];
  
  // Update filter dropdowns
  const filterCategory = document.getElementById('filter-category');
  const filterBrand = document.getElementById('filter-brand');
  
  filterCategory.innerHTML = '<option value="">Tất cả danh mục</option>' + 
    categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
  
  filterBrand.innerHTML = '<option value="">Tất cả thương hiệu</option>' + 
    brands.map(brand => `<option value="${brand.id}">${brand.name}</option>`).join('');
  
  // Update modal dropdowns
  const productCategory = document.getElementById('product-category');
  const productBrand = document.getElementById('product-brand');
  
  productCategory.innerHTML = '<option value="">Chọn danh mục</option>' + 
    categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
  
  productBrand.innerHTML = '<option value="">Chọn thương hiệu</option>' + 
    brands.map(brand => `<option value="${brand.id}">${brand.name}</option>`).join('');
}

// Modal management functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Wait for animation
    document.body.style.overflow = 'auto';
    
    // Reset form if it's product modal
    if (modalId === 'product-modal') {
      document.getElementById('product-form').reset();
      editingProductId = null;
      document.getElementById('modal-title').textContent = 'Thêm Sản Phẩm Mới';
    }
  }
}

// Open add product modal
function openAddProductModal() {
  editingProductId = null;
  document.getElementById('modal-title').textContent = 'Thêm Sản Phẩm Mới';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  openModal('product-modal');
}

// Note: editProductDetails function is defined in admin-product-details.js
// Do not redefine it here to avoid conflicts

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesAndBrandsOptions();
  displayProducts();
});
