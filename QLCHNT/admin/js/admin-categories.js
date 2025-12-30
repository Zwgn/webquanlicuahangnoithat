// Admin Categories & Brands Management with CRUD

let currentTab = 'categories';
let categories = [];
let brands = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesAndBrands();
  renderCategories();
});

// Load from localStorage or use defaults
function loadCategoriesAndBrands() {
  // Load categories
  const savedCategories = localStorage.getItem('tdungdecor_categories');
  if (savedCategories) {
    categories = JSON.parse(savedCategories);
  } else {
    // Default categories
    categories = [
      { id: 'sofa', name: 'Sofa', desc: 'Ghế sofa, sofa bed các loại', icon: '🛋️', gradient: '#667eea, #764ba2' },
      { id: 'table', name: 'Bàn', desc: 'Bàn ăn, bàn làm việc, bàn coffee', icon: '🪑', gradient: '#f093fb, #f5576c' },
      { id: 'chair', name: 'Ghế', desc: 'Ghế ăn, ghế làm việc, ghế thư giãn', icon: '💺', gradient: '#4facfe, #00f2fe' },
      { id: 'cabinet', name: 'Tủ & Kệ', desc: 'Tủ quần áo, kệ sách, tủ tivi', icon: '🗄️', gradient: '#43e97b, #38f9d7' },
      { id: 'bed', name: 'Giường', desc: 'Giường ngủ các loại kích thước', icon: '🛏️', gradient: '#fa709a, #fee140' },
      { id: 'decor', name: 'Đồ Trang Trí', desc: 'Tranh, đèn, bình hoa, phụ kiện', icon: '🎨', gradient: '#a8edea, #fed6e3' }
    ];
    saveCategoriesAndBrands();
  }
  
  // Load brands
  const savedBrands = localStorage.getItem('tdungdecor_brands');
  if (savedBrands) {
    brands = JSON.parse(savedBrands);
  } else {
    // Default brands
    brands = [
      { id: 'ikea', name: 'IKEA', desc: 'Thương hiệu nội thất Thụy Điển', type: 'international' },
      { id: 'poliform', name: 'Poliform', desc: 'Nội thất cao cấp Ý', type: 'international' },
      { id: 'restoration', name: 'Restoration Hardware', desc: 'Nội thất xa xỉ Mỹ', type: 'international' },
      { id: 'vitra', name: 'Vitra', desc: 'Thiết kế hiện đại Thụy Sĩ', type: 'international' },
      { id: 'nhaxinh', name: 'Nhà Xinh', desc: 'Thương hiệu nội thất Việt Nam', type: 'domestic' },
      { id: 'phoxinh', name: 'Phố Xinh', desc: 'Nội thất hiện đại Việt Nam', type: 'domestic' },
      { id: 'hoaphat', name: 'Hòa Phát', desc: 'Nội thất văn phòng Việt Nam', type: 'domestic' },
      { id: 'hoanganh', name: 'Hoàng Anh', desc: 'Nội thất gia đình Việt Nam', type: 'domestic' }
    ];
    saveCategoriesAndBrands();
  }
}

// Save to localStorage
function saveCategoriesAndBrands() {
  localStorage.setItem('tdungdecor_categories', JSON.stringify(categories));
  localStorage.setItem('tdungdecor_brands', JSON.stringify(brands));
}

// Switch tabs
function switchTab(tab) {
  currentTab = tab;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Show/hide sections
  if (tab === 'categories') {
    document.getElementById('categories-section').style.display = 'block';
    document.getElementById('brands-section').style.display = 'none';
    renderCategories();
  } else {
    document.getElementById('categories-section').style.display = 'none';
    document.getElementById('brands-section').style.display = 'block';
    renderBrands();
  }
}

// Render Categories
function renderCategories() {
  const container = document.getElementById('categories-list');
  const products = getProducts();
  
  if (categories.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">📂</div>
        <h3 style="margin-bottom: 8px;">Chưa có danh mục nào</h3>
        <p style="color: #64748b; margin-bottom: 20px;">Thêm danh mục mới để phân loại sản phẩm</p>
        <button class="btn btn-primary" onclick="openCategoryModal()">➕ Thêm Danh Mục</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = categories.map(cat => {
    const count = products.filter(p => p.category === cat.id).length;
    const colors = cat.gradient ? cat.gradient.split(',').map(c => c.trim()) : ['#667eea', '#764ba2'];
    
    return `
      <div class="category-item">
        <div class="category-header">
          <div class="category-icon-box" style="background: linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]});">
            ${cat.icon || '📦'}
          </div>
          <div class="category-info">
            <div class="category-name">${cat.name}</div>
            <div class="category-id">${cat.id}</div>
          </div>
        </div>
        <div class="category-desc">${cat.desc || 'Không có mô tả'}</div>
        <div class="category-stats">
          <div class="category-count">${count} sản phẩm</div>
          <div class="category-actions">
            <button class="icon-btn" onclick="viewCategoryProducts('${cat.id}')" title="Xem sản phẩm">👁️</button>
            <button class="icon-btn" onclick="editCategory('${cat.id}')" title="Sửa">✏️</button>
            <button class="icon-btn delete" onclick="deleteCategory('${cat.id}')" title="Xóa">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Brands
function renderBrands() {
  const container = document.getElementById('brands-list');
  const products = getProducts();
  
  if (brands.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🏢</div>
        <h3 style="margin-bottom: 8px;">Chưa có thương hiệu nào</h3>
        <p style="color: #64748b; margin-bottom: 20px;">Thêm thương hiệu để phân loại sản phẩm</p>
        <button class="btn btn-primary" onclick="openBrandModal()">➕ Thêm Thương Hiệu</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = brands.map(brand => {
    const count = products.filter(p => p.brand === brand.id).length;
    const bgColor = brand.type === 'international' ? '#dbeafe' : '#d1fae5';
    const textColor = brand.type === 'international' ? '#1e40af' : '#065f46';
    
    return `
      <div class="category-item">
        <div class="category-header">
          <div class="category-icon-box" style="background: ${bgColor}; color: ${textColor}; font-weight: 600; font-size: 16px;">
            ${brand.name.substring(0, 2).toUpperCase()}
          </div>
          <div class="category-info">
            <div class="category-name">${brand.name}</div>
            <div class="category-id">${brand.id}</div>
          </div>
        </div>
        <div class="category-desc">${brand.desc || 'Không có mô tả'}</div>
        <div class="category-stats">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="category-count">${count} sản phẩm</span>
            <span style="padding: 2px 8px; background: ${bgColor}; color: ${textColor}; font-size: 11px; border-radius: 4px; font-weight: 600;">
              ${brand.type === 'international' ? 'Quốc tế' : 'Trong nước'}
            </span>
          </div>
          <div class="category-actions">
            <button class="icon-btn" onclick="viewBrandProducts('${brand.id}')" title="Xem sản phẩm">👁️</button>
            <button class="icon-btn" onclick="editBrand('${brand.id}')" title="Sửa">✏️</button>
            <button class="icon-btn delete" onclick="deleteBrand('${brand.id}')" title="Xóa">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category CRUD
function openCategoryModal(id = null) {
  const modal = document.getElementById('category-modal');
  const title = document.getElementById('category-modal-title');
  
  if (id) {
    const cat = categories.find(c => c.id === id);
    if (cat) {
      title.textContent = 'Sửa Danh Mục';
      document.getElementById('category-id').value = cat.id;
      document.getElementById('category-name-input').value = cat.name;
      document.getElementById('category-slug-input').value = cat.id;
      document.getElementById('category-desc-input').value = cat.desc || '';
      document.getElementById('category-icon-input').value = cat.icon || '';
      document.getElementById('category-color-input').value = cat.gradient || '';
      document.getElementById('category-slug-input').disabled = true;
    }
  } else {
    title.textContent = 'Thêm Danh Mục Mới';
    document.getElementById('category-id').value = '';
    document.getElementById('category-name-input').value = '';
    document.getElementById('category-slug-input').value = '';
    document.getElementById('category-desc-input').value = '';
    document.getElementById('category-icon-input').value = '';
    document.getElementById('category-color-input').value = '';
    document.getElementById('category-slug-input').disabled = false;
  }
  
  modal.classList.add('active');
}

function closeCategoryModal() {
  document.getElementById('category-modal').classList.remove('active');
}

function saveCategory() {
  const id = document.getElementById('category-id').value;
  const name = document.getElementById('category-name-input').value.trim();
  const slug = document.getElementById('category-slug-input').value.trim().toLowerCase();
  const desc = document.getElementById('category-desc-input').value.trim();
  const icon = document.getElementById('category-icon-input').value.trim();
  const gradient = document.getElementById('category-color-input').value.trim();
  
  if (!name || !slug) {
    alert('Vui lòng nhập tên và ID danh mục!');
    return;
  }
  
  if (!/^[a-z0-9-_]+$/.test(slug)) {
    alert('ID chỉ được chứa chữ thường, số, gạch ngang và gạch dưới!');
    return;
  }
  
  if (id) {
    // Update
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], name, desc, icon, gradient };
    }
  } else {
    // Add new
    if (categories.find(c => c.id === slug)) {
      alert('ID này đã tồn tại!');
      return;
    }
    categories.push({ id: slug, name, desc, icon, gradient });
  }
  
  saveCategoriesAndBrands();
  renderCategories();
  closeCategoryModal();
  showNotification(`Đã ${id ? 'cập nhật' : 'thêm'} danh mục thành công!`, 'success');
}

function editCategory(id) {
  openCategoryModal(id);
}

function deleteCategory(id) {
  const cat = categories.find(c => c.id === id);
  const products = getProducts();
  const count = products.filter(p => p.category === id).length;
  
  if (count > 0) {
    if (!confirm(`Danh mục "${cat.name}" có ${count} sản phẩm. Xóa danh mục sẽ không xóa sản phẩm nhưng sản phẩm sẽ không có danh mục. Bạn có chắc muốn xóa?`)) {
      return;
    }
  } else {
    if (!confirm(`Xóa danh mục "${cat.name}"?`)) {
      return;
    }
  }
  
  categories = categories.filter(c => c.id !== id);
  saveCategoriesAndBrands();
  renderCategories();
  showNotification('Đã xóa danh mục!', 'success');
}

function viewCategoryProducts(id) {
  window.location.href = `products.html?category=${id}`;
}

// Brand CRUD
function openBrandModal(id = null) {
  const modal = document.getElementById('brand-modal');
  const title = document.getElementById('brand-modal-title');
  
  if (id) {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      title.textContent = 'Sửa Thương Hiệu';
      document.getElementById('brand-id').value = brand.id;
      document.getElementById('brand-name-input').value = brand.name;
      document.getElementById('brand-slug-input').value = brand.id;
      document.getElementById('brand-desc-input').value = brand.desc || '';
      document.querySelector(`input[name="brand-type"][value="${brand.type}"]`).checked = true;
      document.getElementById('brand-slug-input').disabled = true;
    }
  } else {
    title.textContent = 'Thêm Thương Hiệu Mới';
    document.getElementById('brand-id').value = '';
    document.getElementById('brand-name-input').value = '';
    document.getElementById('brand-slug-input').value = '';
    document.getElementById('brand-desc-input').value = '';
    document.querySelector('input[name="brand-type"][value="international"]').checked = true;
    document.getElementById('brand-slug-input').disabled = false;
  }
  
  modal.classList.add('active');
}

function closeBrandModal() {
  document.getElementById('brand-modal').classList.remove('active');
}

function saveBrand() {
  const id = document.getElementById('brand-id').value;
  const name = document.getElementById('brand-name-input').value.trim();
  const slug = document.getElementById('brand-slug-input').value.trim().toLowerCase();
  const desc = document.getElementById('brand-desc-input').value.trim();
  const type = document.querySelector('input[name="brand-type"]:checked').value;
  
  if (!name || !slug) {
    alert('Vui lòng nhập tên và ID thương hiệu!');
    return;
  }
  
  if (!/^[a-z0-9-_]+$/.test(slug)) {
    alert('ID chỉ được chứa chữ thường, số, gạch ngang và gạch dưới!');
    return;
  }
  
  if (id) {
    // Update
    const index = brands.findIndex(b => b.id === id);
    if (index !== -1) {
      brands[index] = { ...brands[index], name, desc, type };
    }
  } else {
    // Add new
    if (brands.find(b => b.id === slug)) {
      alert('ID này đã tồn tại!');
      return;
    }
    brands.push({ id: slug, name, desc, type });
  }
  
  saveCategoriesAndBrands();
  renderBrands();
  closeBrandModal();
  showNotification(`Đã ${id ? 'cập nhật' : 'thêm'} thương hiệu thành công!`, 'success');
}

function editBrand(id) {
  openBrandModal(id);
}

function deleteBrand(id) {
  const brand = brands.find(b => b.id === id);
  const products = getProducts();
  const count = products.filter(p => p.brand === id).length;
  
  if (count > 0) {
    if (!confirm(`Thương hiệu "${brand.name}" có ${count} sản phẩm. Xóa thương hiệu sẽ không xóa sản phẩm nhưng sản phẩm sẽ không có thương hiệu. Bạn có chắc muốn xóa?`)) {
      return;
    }
  } else {
    if (!confirm(`Xóa thương hiệu "${brand.name}"?`)) {
      return;
    }
  }
  
  brands = brands.filter(b => b.id !== id);
  saveCategoriesAndBrands();
  renderBrands();
  showNotification('Đã xóa thương hiệu!', 'success');
}

function viewBrandProducts(id) {
  window.location.href = `products.html?brand=${id}`;
}
