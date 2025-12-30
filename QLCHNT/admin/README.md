# TDUNG DECOR - ADMIN PANEL

## 🎉 ĐÃ HOÀN THÀNH

### ✅ Cấu trúc thư mục
```
admin/
├── css/
│   └── admin-style.css     (Hoàn chỉnh - 700+ lines CSS)
├── js/
│   ├── admin-main.js       (Authentication, utilities, helpers)
│   ├── admin-dashboard.js  (Dashboard statistics & charts)
│   └── admin-products.js   (CRUD operations cho sản phẩm)
├── pages/
│   └── products.html       (Trang quản lý sản phẩm)
└── index.html             (Dashboard chính)
```

### 📱 Các trang đã tạo

#### 1. **Dashboard (admin/index.html)** ✅
- Thống kê tổng quan: Tổng sản phẩm, đơn hàng, doanh thu, khách hàng
- Bảng đơn hàng gần đây với trạng thái
- Danh sách sản phẩm bán chạy
- Responsive design với sidebar thu gọn trên mobile

#### 2. **Quản Lý Sản Phẩm (admin/pages/products.html)** ✅
- Danh sách tất cả sản phẩm trong bảng
- Lọc theo danh mục và thương hiệu
- Tìm kiếm sản phẩm theo tên/ID
- **THÊM sản phẩm mới** với modal form
- **SỬA sản phẩm** - edit trong modal
- **XÓA sản phẩm** với xác nhận
- Đánh dấu sản phẩm nổi bật / bán chạy
- Xem chi tiết sản phẩm

### 🎨 Tính năng UI/UX

1. **Sidebar Navigation**
   - Dark theme với icon emoji
   - Active state rõ ràng
   - Badge hiển thị số lượng
   - Responsive - thu gọn trên mobile

2. **Header**
   - Search bar
   - Thông báo & tin nhắn (có badge)
   - User profile dropdown
   - Mobile menu toggle

3. **Dashboard Cards**
   - 4 stat cards với màu sắc riêng
   - Icon lớn, số liệu nổi bật
   - Phần trăm thay đổi (↑ positive)
   - Hover effect: nổi lên khi di chuột

4. **Data Tables**
   - Hover effect trên row
   - Action buttons: view 👁️, edit ✏️, delete 🗑️
   - Status badges với màu sắc
   - Responsive scrolling

5. **Modal Forms**
   - Smooth animation (scale + fade)
   - Form validation
   - Close khi click outside
   - Responsive height

### 🔐 Bảo mật

- Kiểm tra đăng nhập trước khi truy cập
- Redirect về login nếu chưa đăng nhập
- Nút đăng xuất với xác nhận

### 💾 Quản lý dữ liệu

- Đọc từ `PRODUCTS` array trong data.js
- Lưu thay đổi vào localStorage
- CRUD operations đầy đủ cho sản phẩm
- Cập nhật real-time sau mỗi thao tác

### 📊 Thống kê

- Tự động tính toán từ data
- Hiển thị phần trăm tăng/giảm
- Đơn hàng gần nhất (5 đơn cuối)
- Sản phẩm bán chạy (bestsellers)

## 🚀 CÁCH SỬ DỤNG

### 1. Truy cập Admin Panel
```
Đăng nhập bằng tài khoản Admin:
Username: adminchnt
Password: 123
```
- Login sẽ tự động kiểm tra role (admin/user)
- Nếu là admin → chuyển đến `admin/index.html`
- Nếu là user → chuyển đến trang chủ
- Chỉ admin mới có quyền truy cập admin panel

### 2. Quản lý sản phẩm
```
admin/pages/products.html
```
**Thêm sản phẩm:**
1. Click nút "➕ Thêm Sản Phẩm Mới"
2. Điền form (tên, danh mục, thương hiệu, giá, hình ảnh)
3. Chọn featured/bestseller nếu cần
4. Click "💾 Lưu Sản Phẩm"

**Sửa sản phẩm:**
1. Click nút ✏️ ở cột "Hành động"
2. Chỉnh sửa trong modal
3. Click "💾 Lưu Sản Phẩm"

**Xóa sản phẩm:**
1. Click nút 🗑️
2. Xác nhận trong dialog
3. Sản phẩm bị xóa khỏi danh sách

**Lọc & Tìm kiếm:**
- Dropdown: Chọn danh mục hoặc thương hiệu
- Search bar: Gõ tên hoặc ID sản phẩm

### 3. Xem thống kê
```
admin/index.html
```
- Tổng sản phẩm, đơn hàng, doanh thu, khách hàng
- Đơn hàng gần đây với trạng thái
- Top sản phẩm bán chạy

## 📝 CÒN THIẾU (Sẽ tạo tiếp)

### Trang cần tạo thêm:
- ⏳ **Quản lý Danh mục** (categories.html)
- ⏳ **Quản lý Đơn hàng** (orders.html) - Cập nhật trạng thái
- ⏳ **Quản lý Khách hàng** (customers.html)
- ⏳ **Báo cáo Thống kê** (reports.html) - Biểu đồ doanh thu

### Tính năng nâng cao:
- Export Excel
- Upload hình ảnh sản phẩm
- Rich text editor cho mô tả
- Chart.js cho biểu đồ
- Pagination cho bảng
- Bulk actions (chọn nhiều để xóa)

## 🎯 DEMO NHANH

1. **Đăng nhập Admin:**
   - Mở: `pages/login.html`
   - Username: **adminchnt**
   - Password: **123**
   - Tự động chuyển đến Admin Panel

2. **Vào Admin:**
   - Mở: `admin/index.html`
   - Xem dashboard với số liệu thống kê

3. **Thử thêm sản phẩm:**
   - Click sidebar: "Quản Lý Sản Phẩm"
   - Click "➕ Thêm Sản Phẩm Mới"
   - Điền thông tin và lưu
   - Thấy sản phẩm mới xuất hiện trong bảng

4. **Thử sửa sản phẩm:**
   - Click nút ✏️ bất kỳ sản phẩm nào
   - Chỉnh sửa giá hoặc tên
   - Lưu và thấy cập nhật ngay

## 💡 LƯU Ý

- **Tài khoản Admin**: `adminchnt` / `123` (hardcoded)
- **Tài khoản User**: Đăng ký tại `pages/register.html`
- Chỉ admin mới truy cập được admin panel
- User thường chỉ có thể mua hàng trên website chính
- Dữ liệu được lưu trong **localStorage** (demo only)
- Production: cần backend API (Node.js, PHP, etc.)
- Hình ảnh sản phẩm: đường dẫn relative từ admin/
- CSS đã responsive cho mobile

## 🎨 Màu sắc chính

- Primary: #6366f1 (Indigo)
- Success: #10b981 (Green)
- Warning: #f59e0b (Orange)
- Danger: #ef4444 (Red)
- Dark: #1e293b
- Background: #f8fafc

## 📱 Responsive Breakpoints

- Desktop: > 768px (sidebar cố định)
- Mobile: ≤ 768px (sidebar ẩn, toggle button)

---

**Trạng thái:** 50% hoàn thành
**Tiếp theo:** Tạo trang Orders, Customers, Categories, Reports
