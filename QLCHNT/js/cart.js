// Quản lý giỏ hàng với localStorage
const Cart = (function() {
  const STORAGE_KEY = 'tdungdecor_cart';

  function get() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart:', e);
      return [];
    }
  }

  function save(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      // Phát sự kiện tùy chỉnh khi giỏ hàng cập nhật
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  function add(productId, quantity = 1) {
    const cart = get();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }

    save(cart);
    return cart;
  }

  function remove(productId) {
    let cart = get();
    cart = cart.filter(item => item.id !== productId);
    save(cart);
    return cart;
  }

  function update(productId, quantity) {
    const cart = get();
    const item = cart.find(item => item.id === productId);

    if (item) {
      item.quantity = Math.max(0, parseInt(quantity) || 0);
      if (item.quantity === 0) {
        return remove(productId);
      }
      save(cart);
    }

    return cart;
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  function getTotal() {
    const cart = get();
    return cart.reduce((total, item) => {
      const product = findProduct(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  function getItemCount() {
    const cart = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  return {
    get,
    add,
    remove,
    update,
    clear,
    getTotal,
    getItemCount
  };
})();

// Hiển thị trang giỏ hàng
function renderCartPage() {
  const cartRoot = document.getElementById('cart-root');
  if (!cartRoot) return;

  const cart = Cart.get();

  if (cart.length === 0) {
    cartRoot.innerHTML = `
      <div class="empty-state">
        <h3>Giỏ hàng trống</h3>
        <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <a href="../index.html" class="btn btn-primary mt-3">Tiếp tục mua sắm</a>
      </div>
    `;
    return;
  }

  const cartHTML = cart.map(item => {
    const product = findProduct(item.id);
    if (!product) return '';

    const itemTotal = product.price * item.quantity;
    
    // Điều chỉnh đường dẫn ảnh cho đúng (vì cart.html nằm trong /pages/)
    const imgPath = product.img.startsWith('../') ? product.img : `../${product.img}`;

    return `
      <tr class="cart-table-row">
        <td class="cart-product">
          <img src="${imgPath}" alt="${product.title}" class="cart-item-img">
          <span class="product-name">${product.title}</span>
        </td>
        <td class="cart-price">${formatVND(product.price)}</td>
        <td class="cart-quantity">
          <input 
            type="number" 
            class="qty-input" 
            value="${item.quantity}" 
            min="1" 
            max="99"
            data-id="${item.id}"
          >
        </td>
        <td class="cart-total">${formatVND(itemTotal)}</td>
        <td class="cart-action">
          <button class="btn-delete remove-btn" data-id="${item.id}" title="Xóa">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');

  const total = Cart.getTotal();

  cartRoot.innerHTML = `
    <div class="cart-table-wrapper">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          ${cartHTML}
        </tbody>
      </table>
    </div>
    <div class="cart-summary">
      <div class="cart-total-row">
        <span class="cart-total-label">Tổng cộng:</span>
        <span class="cart-total-amount">${formatVND(total)}</span>
      </div>
      <button class="btn btn-success btn-checkout" id="checkout-btn">Thanh toán</button>
    </div>
  `;

  // Lắng nghe sự kiện
  cartRoot.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const productId = e.target.dataset.id;
      const quantity = parseInt(e.target.value) || 1;
      Cart.update(productId, quantity);
      renderCartPage();
    });
  });

  cartRoot.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.dataset.id;
      if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        Cart.remove(productId);
        renderCartPage();
      }
    });
  });

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const currentUser = JSON.parse(localStorage.getItem('tdungdecor_current_user'));
      
      if (!currentUser) {
        if (confirm('Bạn cần đăng nhập để thanh toán. Đăng nhập ngay?')) {
          window.location.href = 'login.html';
        }
        return;
      }
      
      // Tạo đơn hàng
      const order = {
        id: 'DH' + Date.now(),
        orderId: 'DH' + Date.now(),
        userId: currentUser.email,
        userName: currentUser.name,
        userEmail: currentUser.email,
        name: currentUser.name,
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        date: new Date().toISOString(),
        items: cart.map(item => {
          const product = findProduct(item.id);
          // Điều chỉnh đường dẫn ảnh
          const imgPath = product.img.startsWith('../') ? product.img : `../${product.img}`;
          return {
            id: item.id,
            productId: item.id,
            title: product.title,
            price: product.price,
            quantity: item.quantity,
            total: product.price * item.quantity,
            img: imgPath
          };
        }),
        total: Cart.getTotal(),
        status: 'Đang xử lý'
      };
      
      // Lưu đơn hàng vào localStorage
      const orders = JSON.parse(localStorage.getItem('tdungdecor_orders') || '[]');
      orders.unshift(order); // Thêm đơn mới nhất lên đầu
      localStorage.setItem('tdungdecor_orders', JSON.stringify(orders));
      
      // Tạo thông báo cho admin
      const notification = {
        id: Date.now(),
        type: 'order',
        orderId: order.id,
        customerName: currentUser.name,
        total: order.total,
        date: order.date,
        status: 'unread',
        message: `Đơn hàng mới #${order.id} từ ${currentUser.name}`
      };
      
      const notifications = JSON.parse(localStorage.getItem('tdungdecor_notifications') || '[]');
      notifications.unshift(notification);
      localStorage.setItem('tdungdecor_notifications', JSON.stringify(notifications));
      
      alert('✅ Đặt hàng thành công!\nMã đơn hàng: ' + order.id + '\n\nCảm ơn bạn đã mua hàng!');
      Cart.clear();
      
      // Chuyển đến trang đơn hàng
      window.location.href = 'orders.html';
    });
  }
}

// Khởi tạo trang giỏ hàng nếu đang ở trang giỏ hàng
if (document.getElementById('cart-root')) {
  document.addEventListener('DOMContentLoaded', renderCartPage);
}
