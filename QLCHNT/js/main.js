// Xử lý menu mobile
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Xử lý dropdown trên mobile
    const dropdowns = navLinks.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          // Chỉ prevent default trên mobile
          if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            
            // Đóng các dropdown khác
            dropdowns.forEach(other => {
              if (other !== dropdown) {
                other.classList.remove('active');
              }
            });
          }
        });
      }
    });

    // Đóng menu khi click vào link (không phải toggle)
    navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        dropdowns.forEach(d => d.classList.remove('active'));
      });
    });

    // Đóng menu khi click bên ngoài
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        dropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  }
}

// Cập nhật huy hiệu giỏ hàng
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const count = Cart.getItemCount();
  
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// Cập nhật menu tài khoản người dùng
function updateUserMenu() {
  const currentUser = JSON.parse(localStorage.getItem('tdungdecor_current_user') || 'null');
  const navLinks = document.getElementById('nav-links');
  
  if (!navLinks) return;
  
  // Tìm link đăng nhập hoặc user menu hiện có
  const existingLoginLink = navLinks.querySelector('a[href*="login.html"]');
  const existingUserMenu = navLinks.querySelector('.user-menu-wrapper');
  
  if (currentUser) {
    // Đã đăng nhập - hiển thị dropdown
    if (existingLoginLink) {
      existingLoginLink.remove();
    }
    
    if (!existingUserMenu) {
      // Kiểm tra role để hiển thị menu phù hợp
      const isAdmin = currentUser.role === 'admin';
      
      const userMenuHTML = `
        <div class="user-menu-wrapper">
          <button class="user-menu-btn" id="user-menu-btn">
            <span class="user-name">${isAdmin ? 'Admin' : (currentUser.name || currentUser.email)}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="user-dropdown" id="user-dropdown">
            ${isAdmin ? `
              <a href="${getPrefix()}admin/index.html" class="dropdown-item">
                 Trang Quản Trị
              </a>
              <hr class="dropdown-divider">
              <button class="dropdown-item logout-btn" id="logout-btn">
                 Đăng xuất
              </button>
            ` : `
              <a href="${getPrefix()}pages/account.html" class="dropdown-item">
                 Cập nhật tài khoản
              </a>
              <a href="${getPrefix()}pages/orders.html" class="dropdown-item">
                 Đơn hàng của tôi
              </a>
              <hr class="dropdown-divider">
              <button class="dropdown-item logout-btn" id="logout-btn">
                 Đăng xuất
              </button>
            `}
          </div>
        </div>
      `;
      navLinks.insertAdjacentHTML('beforeend', userMenuHTML);
      
      // Khởi tạo dropdown
      initUserDropdown();
    }
  } else {
    // Chưa đăng nhập - hiển thị link đăng nhập
    if (existingUserMenu) {
      existingUserMenu.remove();
    }
    
    if (!existingLoginLink) {
      const loginLinkHTML = `<a href="${getPrefix()}pages/login.html">Đăng nhập</a>`;
      navLinks.insertAdjacentHTML('beforeend', loginLinkHTML);
    }
  }
}

// Lấy prefix path (../ hoặc '')
function getPrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

// Khởi tạo dropdown menu người dùng
function initUserDropdown() {
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (userMenuBtn && userDropdown) {
    // Toggle dropdown
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    
    // Đóng dropdown khi click bên ngoài
    document.addEventListener('click', (e) => {
      if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });
  }
  
  // Xử lý đăng xuất
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        // Xóa thông tin user
        localStorage.removeItem('tdungdecor_current_user');
        
        // Xóa giỏ hàng
        Cart.clear();
        
        // Phát sự kiện
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        // Chuyển về trang chủ
        window.location.href = getPrefix() + 'index.html';
      }
    });
  }
}

// Đánh dấu trang đang active trong navigation
function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    // Lấy pathname của link
    const linkPath = new URL(link.href).pathname;
    
    // Kiểm tra nếu đang ở trang chủ
    if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/QLCHNT/')) {
      if (link.getAttribute('href') === 'index.html' || link.getAttribute('href').endsWith('/index.html')) {
        link.classList.add('active');
      }
    }
    // Kiểm tra các trang khác
    else if (currentPath.includes(linkPath) || linkPath.includes(currentPath.split('/').pop())) {
      link.classList.add('active');
    }
  });
}

// Load dynamic categories and brands for homepage dropdown
function loadHomepageDropdown() {
  // Load categories
  const categoriesData = localStorage.getItem('tdungdecor_categories');
  if (categoriesData) {
    const categories = JSON.parse(categoriesData);
    const categoryWrapper = document.querySelector('.dropdown-section .dropdown-items-wrapper');
    
    if (categoryWrapper) {
      categoryWrapper.innerHTML = categories.map(cat => {
        const icon = cat.icon || '📦';
        return `<a href="pages/products.html?category=${cat.id}">${icon} ${cat.name}</a>`;
      }).join('');
    }
  }
  
  // Load brands
  const brandsData = localStorage.getItem('tdungdecor_brands');
  if (brandsData) {
    const brands = JSON.parse(brandsData);
    const brandWrapper = document.querySelector('.dropdown-section:nth-child(2) .dropdown-items-wrapper');
    
    if (brandWrapper) {
      brandWrapper.innerHTML = brands.map(brand => {
        const flag = brand.type === 'domestic' ? '🇻🇳' : '🌍';
        // Only add country if it's not already in the brand name
        const displayName = brand.name.includes('-') || brand.name.includes(brand.country || '') 
          ? brand.name 
          : `${brand.name}${brand.country ? ' - ' + brand.country : ''}`;
        return `<a href="pages/products.html?brand=${brand.id}">${flag} ${displayName}</a>`;
      }).join('');
    }
  }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  updateCartBadge();
  updateUserMenu();
  setActiveNavLink();
  loadHomepageDropdown(); // Load categories/brands động cho dropdown
});

// Lắng nghe cập nhật giỏ hàng
window.addEventListener('cartUpdated', updateCartBadge);

// Lắng nghe cập nhật đăng nhập
window.addEventListener('userLoggedIn', updateUserMenu);
window.addEventListener('userLoggedOut', updateUserMenu);

// ...existing code...
