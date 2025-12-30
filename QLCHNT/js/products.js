// Tạo HTML cho thẻ sản phẩm
function createProductCard(product) {
  // Xác định prefix path dựa vào vị trí trang hiện tại
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const detailPrefix = isInPagesFolder ? '' : 'pages/';
  const imagePrefix = isInPagesFolder ? '../' : '';
  
  return `
    <div class="card" data-id="${product.id}">
      <img src="${imagePrefix}${product.img}" alt="${product.title}" loading="lazy">
      <div class="card-body">
        <h3>${product.title}</h3>
        <div class="price">${formatVND(product.price)}</div>
        <div class="actions">
          <a href="${detailPrefix}detail.html?id=${product.id}" class="btn btn-secondary">Xem chi tiết</a>
          <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  `;
}

// Hiển thị danh sách sản phẩm
function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p class="text-center">Không có sản phẩm nào.</p>';
    return;
  }

  container.innerHTML = products.map(createProductCard).join('');
}

// Hiển thị sản phẩm nổi bật
function renderFeaturedProducts() {
  const products = getProducts();
  const featured = products.filter(p => p.featured);
  renderProducts('featured-list', featured);
}

// Hiển thị sản phẩm bán chạy
function renderBestsellerProducts() {
  const products = getProducts();
  const bestsellers = products.filter(p => p.bestseller);
  renderProducts('bestseller-list', bestsellers);
}

// Hiển thị tất cả sản phẩm
function renderAllProducts() {
  const products = getProducts();
  renderProducts('product-grid', products);
  updateResultCount(products.length);
}

// Biến lưu trạng thái filter hiện tại
let currentCategory = 'all';
let currentSearchQuery = '';
let currentBrand = null;

// Filter sản phẩm theo danh mục và tìm kiếm
function filterProducts() {
  const products = getProducts();
  let filtered = products;
  // Filter theo brand
  if (currentBrand) {
    filtered = filtered.filter(p => p.brand === currentBrand);
  } else if (currentCategory !== 'all') {
    // Filter theo category nếu không có brand
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  // Filter theo search
  if (currentSearchQuery) {
    const searchTerm = currentSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(product => {
      return product.title.toLowerCase().includes(searchTerm) ||
             product.desc.toLowerCase().includes(searchTerm);
    });
  }
  renderProducts('product-grid', filtered);
  updateResultCount(filtered.length);
}

// Cập nhật số lượng kết quả
function updateResultCount(count) {
  const resultCountEl = document.getElementById('search-result-count');
  if (!resultCountEl) return;
  
  if (currentSearchQuery || currentCategory !== 'all') {
    if (count > 0) {
      resultCountEl.textContent = `Hiển thị ${count} sản phẩm`;
    } else {
      resultCountEl.textContent = 'Không tìm thấy sản phẩm nào';
    }
  } else {
    resultCountEl.textContent = `Tổng ${count} sản phẩm`;
  }
}

// Tìm kiếm sản phẩm
function searchProducts(query) {
  currentSearchQuery = query;
  filterProducts();
}

// Filter theo danh mục
function filterByCategory(category) {
  currentCategory = category;
  currentBrand = null;
  filterProducts();
  // Cập nhật active state cho nút danh mục
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  // Bỏ active ở brand
  document.querySelectorAll('.dropdown-items-wrapper a').forEach(a => a.classList.remove('active'));
}

// Filter theo brand
function filterByBrand(brand) {
  currentBrand = brand;
  currentCategory = 'all';
  filterProducts();
  // Cập nhật active cho brand
  document.querySelectorAll('.dropdown-items-wrapper a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') && a.getAttribute('href').includes('brand=' + brand)) {
      a.classList.add('active');
    }
  });
  // Bỏ active ở category
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
}

// Khởi tạo tìm kiếm
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (!searchInput) return;
  
  // Tìm kiếm khi gõ (debounce)
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchProducts(e.target.value);
    }, 300);
  });
  
  // Tìm kiếm khi click nút
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchProducts(searchInput.value);
    });
  }
  
  // Tìm kiếm khi nhấn Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchProducts(searchInput.value);
    }
  });
}

// Khởi tạo filter danh mục
function initCategoryFilter() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      filterByCategory(category);
    });
  });
}

// Xử lý thêm vào giỏ hàng
function handleAddToCart(e) {
  const btn = e.target.closest('.add-to-cart-btn');
  if (!btn) return;

  const productId = btn.dataset.id;
  const product = findProduct(productId);

  if (!product) {
    alert('Sản phẩm không tồn tại!');
    return;
  }

  Cart.add(productId, 1);

  // Phản hồi trực quan
  const originalText = btn.textContent;
  btn.textContent = '✓ Đã thêm';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  }, 1000);

  // Hiển thị thông báo
  showNotification(`Đã thêm "${product.title}" vào giỏ hàng!`);
}

// Hiển thị thông báo đơn giản
function showNotification(message) {
  // Xóa thông báo cũ nếu có
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 1.5rem;">✅</span>
      <span>${message}</span>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
    z-index: 1000;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    max-width: 350px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

// Thêm CSS animation cho thông báo
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from { 
        transform: translateX(400px) scale(0.8); 
        opacity: 0; 
      }
      to { 
        transform: translateX(0) scale(1); 
        opacity: 1; 
      }
    }
    @keyframes slideOut {
      from { 
        transform: translateX(0) scale(1); 
        opacity: 1; 
      }
      to { 
        transform: translateX(400px) scale(0.8); 
        opacity: 0; 
      }
    }
  `;
  document.head.appendChild(style);
}

// Khởi tạo filter brand từ dropdown
function initBrandFilter() {
  document.querySelectorAll('.dropdown-items-wrapper a').forEach(a => {
    a.addEventListener('click', function(e) {
      // Chặn chuyển trang
      e.preventDefault();
      const url = new URL(a.href, window.location.origin);
      const brand = url.searchParams.get('brand');
      if (brand) {
        filterByBrand(brand);
        // Cập nhật URL (không reload)
        const params = new URLSearchParams(window.location.search);
        params.set('brand', brand);
        params.delete('category');
        window.history.replaceState({}, '', window.location.pathname + '?' + params.toString());
      }
    });
  });
}

// Đọc brand/category từ URL khi load trang
function initFilterFromURL() {
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand');
  const category = params.get('category');
  if (brand) {
    filterByBrand(brand);
  } else if (category) {
    filterByCategory(category);
  } else {
    renderAllProducts();
  }
}

// Load dynamic categories and brands from localStorage
function loadDynamicCategoriesAndBrands() {
  // Load categories for filter buttons
  const categoriesData = localStorage.getItem('tdungdecor_categories');
  if (categoriesData) {
    const categories = JSON.parse(categoriesData);
    const categoryFilter = document.querySelector('.category-filter');
    
    if (categoryFilter) {
      categoryFilter.innerHTML = '<button class="category-btn active" data-category="all">Tất cả</button>';
      
      categories.forEach(cat => {
        const icon = cat.icon || '';
        categoryFilter.innerHTML += `<button class="category-btn" data-category="${cat.id}">${icon} ${cat.name}</button>`;
      });
    }
  }
  
  // Load categories for navigation dropdown
  const navCategoriesDropdown = document.getElementById('nav-categories-dropdown');
  if (navCategoriesDropdown && categoriesData) {
    const categories = JSON.parse(categoriesData);
    navCategoriesDropdown.innerHTML = categories.map(cat => {
      const icon = cat.icon || '📦';
      return `<a href="products.html?category=${cat.id}">${icon} ${cat.name}</a>`;
    }).join('');
  }
  
  // Load brands for navigation dropdown
  const brandsData = localStorage.getItem('tdungdecor_brands');
  if (brandsData) {
    const brands = JSON.parse(brandsData);
    const navBrandsDropdown = document.getElementById('nav-brands-dropdown');
    
    if (navBrandsDropdown) {
      navBrandsDropdown.innerHTML = brands.map(brand => {
        const flag = brand.type === 'domestic' ? '🇻🇳' : '🌍';
        // Only add country if it's not already in the brand name
        const displayName = brand.name.includes('-') || brand.name.includes(brand.country || '') 
          ? brand.name 
          : `${brand.name}${brand.country ? ' - ' + brand.country : ''}`;
        return `<a href="products.html?brand=${brand.id}">${flag} ${displayName}</a>`;
      }).join('');
    }
  }
}

// Khởi tạo trang sản phẩm
function initProductsPage() {
  loadDynamicCategoriesAndBrands(); // Load categories/brands từ localStorage
  renderFeaturedProducts();
  renderBestsellerProducts();
  initSearch();
  initCategoryFilter();
  initBrandFilter();
  initFilterFromURL();
  // Lắng nghe sự kiện click nút thêm vào giỏ
  document.addEventListener('click', handleAddToCart);
}

// Tự động khởi tạo nếu các phần tử tồn tại
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-grid') || 
      document.getElementById('featured-list') || 
      document.getElementById('bestseller-list')) {
    initProductsPage();
  }
});

// Accordion cho mục THƯƠNG HIỆU trong dropdown menu
// Hiện/ẩn danh sách brand khi bấm vào tiêu đề

document.addEventListener('DOMContentLoaded', function() {
  var brandToggle = document.querySelector('.brand-toggle');
  var brandList = document.querySelector('.brand-list');
  var brandArrow = document.querySelector('.brand-arrow');
  if (brandToggle && brandList) {
    brandToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = brandList.classList.contains('active');
      brandList.classList.toggle('active', !isOpen);
      brandArrow.textContent = isOpen ? '▼' : '▲';
    });
    document.addEventListener('click', function(e) {
      if (!brandToggle.contains(e.target) && !brandList.contains(e.target)) {
        brandList.classList.remove('active');
        brandArrow.textContent = '▼';
      }
    });
  }
});

// ...existing code...
