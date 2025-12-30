// Dữ liệu sản phẩm - KHÔNG dùng nữa, tất cả lưu trong localStorage
// Mảng rỗng để không có sản phẩm mẫu
const PRODUCTS = [
  {
    id: 'p1',
    title: 'Sofa Băng Bọc Vải Phong Cách Scandinavian Cho Phòng Khách',
    price: 4990000,
    img: 'images/products/p1.jpg',
    category: 'sofa',
    featured: true,
    bestseller: true,
  desc: 'Sofa vải cao cấp 3 chỗ ngồi, thiết kế hiện đại với chất liệu vải mềm mại, bền đẹp. Khung gỗ tự nhiên chắc chắn, đệm ngồi êm ái. Phù hợp cho phòng khách sang trọng.',
  brand: 'ikea'
  },
  {
    id: 'p2',
    title: 'Bàn ăn gỗ sồi 6 chỗ',
    price: 2990000,
    img: 'images/products/p2.jpg',
    category: 'table',
    featured: true,
    bestseller: false,
  desc: 'Bàn ăn gỗ sồi tự nhiên cho 6 người, thiết kế thanh lịch. Bề mặt hoàn thiện láng mịn, chống nước tốt. Kích thước phù hợp cho gia đình từ 4-6 người.',
  brand: 'poliform'
  },
  {
    id: 'p3',
    title: 'Ghế thư giãn Armchair',
    price: 1290000,
    img: 'images/products/p3.jpg',
    category: 'chair',
    featured: false,
    bestseller: true,
    desc: 'Ghế thư giãn đơn phong cách Bắc Âu, đệm êm ái. Thiết kế ergonomic hỗ trợ lưng tốt. Chất liệu vải bền, dễ vệ sinh. Hoàn hảo cho góc đọc sách.',
    brand: 'vitra',
    fullDescription: `
      <p><strong>Ghế thư giãn Armchair</strong> từ Vitra - Đức là biểu tượng của thiết kế công thái học và sự thoải mái tối đa. Được phát triển bởi các nhà thiết kế hàng đầu thế giới, sản phẩm mang đến trải nghiệm ngồi đẳng cấp.</p>
      
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🪑 <strong>Thiết kế ergonomic đột phá</strong>: Được nghiên cứu bởi chuyên gia y học Đức</li>
        <li>💺 <strong>Đệm ngồi cao cấp</strong>: Mút memory foam thế hệ mới, ôm sát cơ thể</li>
        <li>🎯 <strong>Hỗ trợ lưng tối ưu</strong>: Giảm 70% áp lực lên cột sống</li>
        <li>🧵 <strong>Vải bọc Kvadrat</strong>: Hàng đầu từ Đan Mạch, bền bỉ và sang trọng</li>
        <li>⚙️ <strong>Khung nhôm đúc</strong>: Nhẹ nhưng chắc chắn, chịu lực 150kg</li>
        <li>🎨 <strong>Nhiều màu sắc</strong>: 15+ lựa chọn màu vải cao cấp</li>
      </ul>
      
      <h3>🏆 Giải thưởng:</h3>
      <ul>
        <li>🥇 Red Dot Design Award 2020</li>
        <li>🥇 German Design Award 2021</li>
        <li>⭐ Best Comfort Chair - Wallpaper* Magazine</li>
      </ul>
      
      <h3>🏡 Phù hợp với:</h3>
      <p>Góc đọc sách, phòng làm việc, không gian thư giãn. Lý tưởng cho những ai yêu thích thiết kế Đức và quan tâm đến sức khỏe cột sống.</p>
      
      <h3>🎁 Cam kết từ Vitra:</h3>
      <ul>
        <li>✅ Chính hãng 100% từ Đức, có tem chống hàng giả</li>
        <li>✅ Bảo hành 7 năm khung ghế, 3 năm đệm</li>
        <li>✅ Đổi vải bọc miễn phí trong 2 năm đầu</li>
        <li>✅ Vệ sinh chuyên sâu miễn phí 1 lần/năm</li>
      </ul>
    `
  },
  {
    id: 'p4',
    title: 'Kệ sách 5 tầng hiện đại',
    price: 899000,
    img: 'images/products/p4.jpg',
    category: 'cabinet',
    featured: false,
    bestseller: false,
    desc: 'Kệ sách 5 tầng thiết kế tối giản, chất liệu gỗ công nghiệp cao cấp. Nhiều ngăn để sách và đồ trang trí. Phong cách Scandinavian, dễ lắp đặt.',
    brand: 'restoration',
    fullDescription: `
      <p><strong>Kệ sách 5 tầng hiện đại</strong> từ Restoration Hardware - Mỹ mang đậm phong cách industrial chic. Kết hợp hoàn hảo giữa kim loại và gỗ, tạo nên điểm nhấn ấn tượng cho không gian.</p>
      
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🏗️ <strong>Khung thép đen matte</strong>: Phong cách công nghiệp Mỹ đương đại</li>
        <li>🌳 <strong>Gỗ sồi tái chế</strong>: Thân thiện môi trường, vân gỗ độc đáo</li>
        <li>📚 <strong>5 tầng rộng rãi</strong>: Chứa được 100+ cuốn sách</li>
        <li>💪 <strong>Chịu tải cao</strong>: Mỗi tầng chịu được 30kg</li>
        <li>🔧 <strong>Lắp ráp dễ dàng</strong>: Hệ thống ốc vít ẩn tinh tế</li>
        <li>🎨 <strong>Hoàn thiện thủ công</strong>: Mỗi sản phẩm là duy nhất</li>
      </ul>
      
      <h3>📐 Thông số kỹ thuật:</h3>
      <ul>
        <li>Kích thước: 90 x 35 x 180 cm (D x R x C)</li>
        <li>Khoảng cách giữa các tầng: 35 cm</li>
        <li>Trọng lượng: ~28 kg</li>
      </ul>
      
      <h3>🏡 Phù hợp với:</h3>
      <p>Phòng khách, thư viện, văn phòng, studio. Hoàn hảo cho phong cách industrial, loft, modern farmhouse.</p>
      
      <h3>🎁 Cam kết từ Restoration Hardware:</h3>
      <ul>
        <li>✅ Sản phẩm nhập khẩu từ Mỹ</li>
        <li>✅ Bảo hành 3 năm kết cấu</li>
        <li>✅ Miễn phí lắp đặt tại nhà</li>
        <li>✅ Đổi trả trong 60 ngày</li>
      </ul>
    `
  },
  {
    id: 'p5',
    title: 'Bàn làm việc có ngăn kéo',
    price: 1090000,
    img: 'images/products/p5.jpg',
    category: 'table',
    featured: true,
    bestseller: false,
    desc: 'Bàn làm việc gỗ công nghiệp có 2 ngăn kéo tiện dụng. Bề mặt rộng rãi, chống trầy xước. Thiết kế tối giản phù hợp làm việc tại nhà hoặc văn phòng.',
    brand: 'nhaxinh',
    fullDescription: `
      <p><strong>Bàn làm việc có ngăn kéo</strong> từ Nhà Xinh - Thương hiệu nội thất hàng đầu Việt Nam. Sản phẩm kết hợp hoàn hảo giữa công năng và thẩm mỹ, phù hợp cho không gian làm việc hiện đại.</p>
      
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🌳 <strong>Gỗ công nghiệp E1</strong>: An toàn sức khỏe, chống ẩm tốt</li>
        <li>✨ <strong>Bề mặt Melamine</strong>: Chống trầy xước, dễ vệ sinh</li>
        <li>📦 <strong>2 ngăn kéo rộng</strong>: Ray trượt êm ái, chứa được nhiều đồ dùng</li>
        <li>💻 <strong>Mặt bàn rộng rãi</strong>: Đủ không gian cho laptop, màn hình và tài liệu</li>
        <li>🔌 <strong>Rãnh dây điện</strong>: Giữ dây cáp gọn gàng, ngăn nắp</li>
        <li>🎨 <strong>Thiết kế tối giản</strong>: Phù hợp mọi phong cách nội thất</li>
      </ul>
      
      <h3>📐 Thông số kỹ thuật:</h3>
      <ul>
        <li>Kích thước: 120 x 60 x 75 cm (D x R x C)</li>
        <li>Độ dày mặt bàn: 2.5 cm</li>
        <li>Kích thước ngăn kéo: 40 x 35 x 10 cm</li>
        <li>Trọng lượng: ~22 kg</li>
      </ul>
      
      <h3>🏡 Phù hợp với:</h3>
      <p>Phòng làm việc tại nhà, văn phòng nhỏ, phòng ngủ. Lý tưởng cho dân văn phòng, học sinh, sinh viên làm việc từ xa.</p>
      
      <h3>🎁 Cam kết từ Nhà Xinh:</h3>
      <ul>
        <li>✅ Sản phẩm chính hãng Nhà Xinh</li>
        <li>✅ Bảo hành 2 năm toàn bộ sản phẩm</li>
        <li>✅ Miễn phí vận chuyển và lắp đặt nội thành</li>
        <li>✅ Đổi trả trong 7 ngày nếu không hài lòng</li>
      </ul>
    `
  },
  {
    id: 'p6',
    title: 'Tủ quần áo 2 cánh',
    price: 3490000,
    img: 'images/products/p6.jpg',
    category: 'cabinet',
    featured: false,
    bestseller: true,
    desc: 'Tủ quần áo 2 cánh lớn với nhiều ngăn chứa. Gỗ MDF phủ melamine chống ẩm. Thiết kế thông minh tối ưu không gian lưu trữ cho phòng ngủ.',
    brand: 'phoxinh',
    fullDescription: `
      <p><strong>Tủ quần áo 2 cánh</strong> từ Phố Xinh - Thương hiệu nội thất uy tín tại Việt Nam. Sản phẩm được thiết kế tối ưu không gian lưu trữ với nhiều ngăn chức năng thông minh.</p>
      
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🪵 <strong>Gỗ MDF phủ Melamine</strong>: Chống ẩm, chống mối mọt hiệu quả</li>
        <li>🚪 <strong>2 cánh mở rộng</strong>: Dễ dàng lấy đồ, tiết kiệm diện tích</li>
        <li>👔 <strong>Thanh treo quần áo</strong>: Chịu tải 20kg, thanh inox không gỉ</li>
        <li>📦 <strong>5 ngăn kéo lớn</strong>: Đủ chỗ cho quần áo, phụ kiện</li>
        <li>👟 <strong>Ngăn giày riêng biệt</strong>: Thông thoáng, chống mùi</li>
        <li>💡 <strong>Đèn LED tự động</strong>: Sáng khi mở tủ (tùy chọn)</li>
      </ul>
      
      <h3>📐 Thông số kỹ thuật:</h3>
      <ul>
        <li>Kích thước: 120 x 55 x 200 cm (D x R x C)</li>
        <li>Dung tích: Khoảng 80-100 bộ quần áo</li>
        <li>Trọng lượng: ~68 kg</li>
      </ul>
      
      <h3>🏡 Phù hợp với:</h3>
      <p>Phòng ngủ master, phòng ngủ con, căn hộ chung cư, nhà phố. Giải pháp lưu trữ hoàn hảo cho gia đình 2-4 người.</p>
      
      <h3>🎁 Cam kết từ Phố Xinh:</h3>
      <ul>
        <li>✅ Sản phẩm chính hãng Phố Xinh</li>
        <li>✅ Bảo hành 18 tháng toàn bộ sản phẩm</li>
        <li>✅ Miễn phí vận chuyển và lắp đặt</li>
        <li>✅ Tặng kèm bộ hút ẩm và thơm quần áo</li>
      </ul>
    `
  },
  {
    id: 'p7',
    title: 'Giường ngủ bọc nệm gỗ tự nhiên',
    price: 4590000,
    img: 'images/products/p7.jpg',
    category: 'bed',
    featured: true,
    bestseller: true,
    desc: 'Giường ngủ 1.8m khung gỗ tự nhiên chắc chắn. Đầu giường bọc nệm êm ái. Thiết kế hiện đại, thanh lịch. Bền đẹp theo thời gian.',
    brand: 'hoaphat',
    fullDescription: `
      <p><strong>Giường ngủ bọc nệm gỗ tự nhiên</strong> từ Hòa Phát - Thương hiệu nội thất lớn nhất Việt Nam. Sản phẩm kết hợp khung gỗ chắc chắn và đầu giường bọc nệm êm ái, mang đến giấc ngủ ngon mỗi đêm.</p>
      
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🌳 <strong>Khung gỗ sồi tự nhiên</strong>: Chắc chắn, chịu lực tốt, không cong vênh</li>
        <li>🛏️ <strong>Đầu giường bọc nệm</strong>: Mút mềm dày 5cm, tựa lưng thoải mái</li>
        <li>💎 <strong>Vải bọc cao cấp</strong>: Chống bám bụi, dễ vệ sinh</li>
        <li>🔩 <strong>Lắp ráp chắc chắn</strong>: Hệ thống ốc vít và mộng gỗ kép</li>
        <li>📏 <strong>Kích thước chuẩn 1.8m</strong>: Phù hợp nệm thông dụng</li>
        <li>🎨 <strong>5 màu sắc lựa chọn</strong>: Xám, be, nâu, xanh, hồng</li>
      </ul>
      
      <h3>📐 Thông số kỹ thuật:</h3>
      <ul>
        <li>Kích thước: 200 x 180 x 110 cm (D x R x C)</li>
        <li>Chiều cao đầu giường: 110 cm</li>
        <li>Khoảng cách chân giường: 15 cm (dễ vệ sinh)</li>
        <li>Trọng lượng: ~75 kg</li>
        <li>Chịu tải: Lên đến 400 kg</li>
      </ul>
      
      <h3>🏡 Phù hợp với:</h3>
      <p>Phòng ngủ master, phòng ngủ khách, khách sạn, homestay. Lý tưởng cho các cặp vợ chồng, gia đình có trẻ nhỏ.</p>
      
      <h3>🎁 Cam kết từ Hòa Phát:</h3>
      <ul>
        <li>✅ Sản phẩm chính hãng Hòa Phát</li>
        <li>✅ Bảo hành 3 năm khung giường</li>
        <li>✅ Miễn phí vận chuyển và lắp đặt toàn quốc</li>
        <li>✅ Đổi mới 100% nếu phát hiện lỗi sản xuất</li>
      </ul>
    `
  },
  {
    id: 'p8',
    title: 'Bàn console trang trí',
    price: 790000,
    img: 'images/products/p8.jpg',
    category: 'table',
    featured: false,
    bestseller: false,
    desc: 'Bàn console nhỏ gọn dùng trang trí hành lang hoặc sau sofa. Thiết kế tối giản với 1 ngăn kéo. Chất liệu gỗ công nghiệp cao cấp.',
    brand: 'hoanganh',
    fullDescription: `
      <p><strong>Bàn console trang trí</strong> từ Hoàng Anh Gia Lai Furniture - sản phẩm hoàn hảo cho không gian hành lang, phòng khách. Thiết kế nhỏ gọn nhưng tinh tế, tạo điểm nhấn ấn tượng.</p>
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🪵 Gỗ công nghiệp MDF phủ Melamine cao cấp</li>
        <li>📦 1 ngăn kéo tiện dụng để chìa khóa, phụ kiện</li>
        <li>🎨 Thiết kế tối giản, sang trọng</li>
        <li>💪 Chịu tải tốt, bền đẹp theo thời gian</li>
      </ul>
      <h3>🎁 Cam kết:</h3>
      <ul>
        <li>✅ Bảo hành 12 tháng</li>
        <li>✅ Miễn phí vận chuyển nội thành</li>
      </ul>
    `
  },
  {
    id: 'p9',
    title: 'Sofa góc hiện đại',
    price: 3890000,
    img: 'images/products/p9.jpg',
    category: 'sofa',
    featured: false,
    bestseller: true,
    desc: 'GHẾ SOFA PHÒNG KHÁCH hiện đại bề thế, da cao cấp, màu kem nhã nhặn tinh tế phù hợp nhiều không gian, mang phong cách châu Âu sang trọng cho phòng khách.',
    brand: 'ikea',
    fullDescription: `
      <p><strong>Sofa góc hiện đại</strong> từ IKEA - thiết kế modular linh hoạt, phong cách Bắc Âu tinh tế. Hoàn hảo cho phòng khách rộng rãi.</p>
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🛋️ Thiết kế góc L tối ưu không gian</li>
        <li>💺 Đệm cao cấp, êm ái, chống xẹp lún</li>
        <li>🎨 Da tổng hợp cao cấp, dễ vệ sinh</li>
        <li>🔄 Có thể tháo rời, thay đổi cấu hình</li>
        <li>💪 Chịu tải tốt, bền bỉ theo thời gian</li>
      </ul>
      <h3>🎁 Cam kết IKEA:</h3>
      <ul>
        <li>✅ Bảo hành 10 năm khung, 2 năm đệm</li>
        <li>✅ Miễn phí lắp đặt</li>
        <li>✅ Đổi trả trong 365 ngày</li>
      </ul>
    `
  },
  {
    id: 'p10',
    title: 'Kệ tivi để sàn phòng khách bằng gỗ ',
    price: 2190000,
    img: 'images/products/p10.jpg',
    category: 'cabinet',
    featured: true,
    bestseller: false,
    desc: 'Tủ TV MDF nhập khẩu 1.8m với nhiều ngăn kéo. Thiết kế hiện đại, phù hợp TV từ 43-55 inch. Bề mặt chống trầy xước.',
    brand: 'poliform',
    fullDescription: `
      <p><strong>Kệ tivi phòng khách</strong> từ Poliform - Ý, thiết kế sang trọng với chất liệu cao cấp. Trung tâm giải trí hoàn hảo cho phòng khách hiện đại.</p>
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🌳 Gỗ sồi tự nhiên hoặc MDF phủ veneer</li>
        <li>📺 Kích thước 1.8m, phù hợp TV 43-65 inch</li>
        <li>📦 Nhiều ngăn chứa đầu đĩa, thiết bị</li>
        <li>🔌 Hệ thống quản lý dây điện thông minh</li>
        <li>✨ Bề mặt Lacquer bóng gương</li>
      </ul>
      <h3>🎁 Cam kết Poliform:</h3>
      <ul>
        <li>✅ Chính hãng từ Ý</li>
        <li>✅ Bảo hành 5 năm</li>
        <li>✅ Lắp đặt miễn phí</li>
      </ul>
    `
  },
  {
    id: 'p11',
    title: 'Ghế ăn gỗ cao su',
    price: 590000,
    img: 'images/products/p11.jpg',
    category: 'chair',
    featured: false,
    bestseller: false,
    desc: 'Ghế ăn gỗ cao su tự nhiên, thiết kế đơn giản tinh tế. Nệm vải bọc polyester chống nhăn, kháng bụi bẩn, nấm mốc. Chân ghế chắc chắn, có đệm chống trầy sàn.',
    brand: 'vitra',
    fullDescription: `
      <p><strong>Ghế ăn gỗ cao su</strong> từ Vitra - Đức, kết hợp hoàn hảo giữa gỗ tự nhiên và nệm êm ái. Thiết kế tối giản, bền đẹp.</p>
      <h3>✨ Đặc điểm nổi bật:</h3>
      <ul>
        <li>🌳 Gỗ cao su tự nhiên FSC</li>
        <li>💺 Nệm vải polyester cao cấp</li>
        <li>🎨 Thiết kế đơn giản, sang trọng</li>
        <li>🔩 Chắc chắn, chịu tải 120kg</li>
        <li>🛡️ Đệm chân chống trầy sàn</li>
      </ul>
      <h3>🎁 Cam kết Vitra:</h3>
      <ul>
        <li>✅ Bảo hành 3 năm</li>
        <li>✅ Đổi vải miễn phí trong 1 năm</li>
      </ul>
    `
  },
  {
    id: 'p12',
    title: 'Bàn sofa mặt kính',
    price: 1490000,
    img: 'images/products/p12.jpg',
    category: 'table',
    featured: true,
    bestseller: true,
    desc: 'Bàn sofa mặt kính cường lực 8mm an toàn. Khung kim loại sơn tĩnh điện chống gỉ. Kiểu dáng hiện đại, dễ lau chùi.',
    brand: 'restoration',
    fullDescription: `<p><strong>Bàn sofa mặt kính</strong> từ Restoration Hardware - phong cách hiện đại với kính cường lực an toàn. Điểm nhấn sang trọng cho phòng khách.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>🪟 Kính cường lực 8mm, chịu lực 50kg</li><li>🔧 Khung thép sơn tĩnh điện chống gỉ</li><li>🎨 Thiết kế tối giản, hiện đại</li><li>🧽 Dễ dàng vệ sinh, lau chùi</li></ul><h3>🎁 Cam kết:</h3><ul><li>✅ Bảo hành 2 năm</li><li>✅ Lắp đặt miễn phí</li></ul>`
  },
  {
    id: 'p13',
    title: 'Tủ giày 3 tầng',
    price: 890000,
    img: 'images/products/p13.jpg',
    category: 'cabinet',
    featured: false,
    bestseller: false,
    desc: 'Tủ giày 3 tầng gỗ MDF, chứa được 12-15 đôi giày. Cửa lật tiện dụng, có lỗ thoáng khí. Phù hợp đặt ở hành lang, cửa vào.',
    brand: 'nhaxinh',
    fullDescription: `<p><strong>Tủ giày 3 tầng</strong> từ Nhà Xinh - giải pháp lưu trữ giày dép gọn gàng, tiết kiệm không gian. Thiết kế thông minh với cửa lật tiện dụng.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>👟 3 tầng chứa 12-15 đôi giày</li><li>🚪 Cửa lật mở xuống tiện lợi</li><li>💨 Lỗ thoáng khí chống mùi</li><li>🪵 Gỗ MDF phủ Melamine chống ẩm</li></ul><h3>🎁 Cam kết Nhà Xinh:</h3><ul><li>✅ Bảo hành 18 tháng</li><li>✅ Lắp đặt miễn phí</li></ul>`
  },
  {
    id: 'p14',
    title: 'Kệ tivi treo tường',
    price: 1290000,
    img: 'images/products/p14.jpg',
    category: 'cabinet',
    featured: false,
    bestseller: true,
    desc: 'Kệ tivi treo tường tiết kiệm không gian, có 2 ngăn kéo và kệ mở. Chất liệu gỗ công nghiệp chống ẩm. Lắp đặt dễ dàng với ốc vít kèm theo.',
    brand: 'phoxinh',
    fullDescription: `<p><strong>Kệ tivi treo tường</strong> từ Phố Xinh - tiết kiệm không gian tối đa. Thiết kế treo tường hiện đại, phù hợp căn hộ nhỏ.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>📺 Treo tường, tiết kiệm diện tích</li><li>📦 2 ngăn kéo + kệ mở</li><li>🪵 Gỗ công nghiệp chống ẩm</li><li>🔧 Kèm ốc vít, dễ lắp đặt</li></ul><h3>🎁 Cam kết Phố Xinh:</h3><ul><li>✅ Bảo hành 18 tháng</li><li>✅ Hỗ trợ lắp đặt miễn phí</li></ul>`
  },
  {
    id: 'p15',
    title: 'Bàn trang điểm có gương',
    price: 1890000,
    img: 'images/products/p15.jpg',
    category: 'table',
    featured: true,
    bestseller: false,
    desc: 'Bàn trang điểm gỗ công nghiệp với gương lớn và đèn LED. 3 ngăn kéo chứa đồ rộng rãi. Màu trắng thanh lịch, phù hợp phòng ngủ hiện đại.',
    brand: 'hoaphat',
    fullDescription: `<p><strong>Bàn trang điểm có gương</strong> từ Hòa Phát - thiết kế sang trọng với đèn LED hiện đại. Không gian làm đẹp hoàn hảo cho phòng ngủ.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>🪞 Gương lớn rõ nét</li><li>💡 Đèn LED tích hợp, ánh sáng đều</li><li>📦 3 ngăn kéo rộng rãi</li><li>🎨 Màu trắng thanh lịch</li></ul><h3>🎁 Cam kết Hòa Phát:</h3><ul><li>✅ Bảo hành 2 năm</li><li>✅ Lắp đặt miễn phí</li></ul>`
  },
  {
    id: 'p16',
    title: 'Ghế sofa đơn thư giãn',
    price: 2290000,
    img: 'images/products/p16.jpg',
    category: 'sofa',
    featured: false,
    bestseller: true,
    desc: 'Ghế sofa đơn có tựa chân điều chỉnh được, lý tưởng cho thư giãn xem TV. Vải nhung cao cấp, đệm êm. Có khay để đồ uống ở tay vịn.',
    brand: 'hoanganh',
    fullDescription: `<p><strong>Ghế sofa đơn thư giãn</strong> từ Hoàng Anh Gia Lai - thiết kế recliner với tựa chân điều chỉnh. Thư giãn tối đa khi xem TV.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>🛋️ Tựa chân điều chỉnh 3 nấc</li><li>💺 Vải nhung cao cấp, mềm mại</li><li>☕ Khay để ly tích hợp</li><li>🔄 Xoay 360 độ (tùy chọn)</li></ul><h3>🎁 Cam kết:</h3><ul><li>✅ Bảo hành 18 tháng</li><li>✅ Lắp đặt miễn phí</li></ul>`
  },
  {
    id: 'p17',
    title: 'Kệ trưng bày đa năng',
    price: 1590000,
    img: 'images/products/p17.jpg',
    category: 'cabinet',
    featured: false,
    bestseller: false,
    desc: 'Kệ trưng bày 4 tầng thiết kế ladder style. Gỗ cao su tự nhiên màu tự nhiên. Phù hợp trưng bày sách, cây cảnh, đồ trang trí.',
    brand: 'ikea',
    fullDescription: `<p><strong>Kệ trưng bày đa năng</strong> từ IKEA - thiết kế thang dựa độc đáo. Hoàn hảo để trưng bày sách, cây cảnh, đồ trang trí.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>🌳 Gỗ cao su tự nhiên</li><li>🪜 Thiết kế ladder style tinh tế</li><li>📚 4 tầng rộng rãi</li><li>🎨 Màu gỗ tự nhiên ấm áp</li></ul><h3>🎁 Cam kết IKEA:</h3><ul><li>✅ Bảo hành 5 năm</li><li>✅ Lắp ráp dễ dàng</li></ul>`
  },
  {
    id: 'p18',
    title: 'Tủ bếp module 1.5m',
    price: 5990000,
    img: 'images/products/p18.jpg',
    category: 'cabinet',
    featured: true,
    bestseller: true,
    desc: 'Tủ bếp module 1.5m gồm tủ trên và tủ dưới. Chất liệu MFC chống ẩm, bề mặt Acrylic bóng gương. Ray giảm chấn êm ái, phụ kiện inox 304.',
    brand: 'poliform',
    fullDescription: `<p><strong>Tủ bếp module 1.5m</strong> từ Poliform - Ý, thiết kế hiện đại với chất liệu cao cấp. Giải pháp bếp hoàn hảo cho căn hộ.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>🏗️ Gồm tủ trên + tủ dưới</li><li>✨ Bề mặt Acrylic bóng gương</li><li>🔇 Ray giảm chấn êm ái</li><li>🔧 Phụ kiện inox 304 cao cấp</li><li>💧 Chống ẩm, chống nước tốt</li></ul><h3>🎁 Cam kết Poliform:</h3><ul><li>✅ Bảo hành 5 năm</li><li>✅ Lắp đặt và thiết kế miễn phí</li></ul>`
  },
  {
    id: 'p19',
    title: 'Bàn học trẻ em',
    price: 1190000,
    img: 'images/products/p19.jpg',
    category: 'table',
    featured: false,
    bestseller: false,
    desc: 'Bàn học cho trẻ em với ghế điều chỉnh chiều cao. Bề mặt chống cận, có kệ sách tích hợp. Màu sắc tươi sáng, an toàn cho bé.',
    brand: 'vitra',
    fullDescription: `<p><strong>Bàn học trẻ em</strong> từ Vitra - Đức, thiết kế ergonomic đặc biệt cho trẻ. Bề mặt chống cận, bảo vệ thị lực tối ưu.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>📚 Bề mặt chống cận, chống lóa</li><li>🪑 Ghế điều chỉnh chiều cao 5 nấc</li><li>📖 Kệ sách tích hợp tiện dụng</li><li>🎨 Màu sắc tươi sáng, an toàn</li><li>🛡️ Bo cạnh tròn, không góc cạnh</li></ul><h3>🎁 Cam kết Vitra:</h3><ul><li>✅ Bảo hành 5 năm</li><li>✅ Chứng nhận an toàn châu Âu</li></ul>`
  },
  {
    id: 'p20',
    title: 'Giường tầng gỗ thông',
    price: 6490000,
    img: 'images/products/p20.jpg',
    category: 'bed',
    featured: true,
    bestseller: true,
    desc: 'Giường tầng gỗ thông tự nhiên cho 2 bé, có thang leo an toàn. Tải trọng cao, chắc chắn. Thiết kế thông minh tiết kiệm không gian phòng ngủ.',
    brand: 'restoration',
    fullDescription: `<p><strong>Giường tầng gỗ thông</strong> từ Restoration Hardware - Mỹ, thiết kế chắc chắn và an toàn. Giải pháp hoàn hảo cho phòng ngủ 2 bé.</p><h3>✨ Đặc điểm nổi bật:</h3><ul><li>🌲 Gỗ thông tự nhiên Bắc Mỹ</li><li>🪜 Thang leo rộng, chắc chắn</li><li>🛡️ Lan can bảo vệ 4 bên</li><li>💪 Chịu tải 150kg/tầng</li><li>📏 Khoảng cách giữa 2 tầng: 140cm</li></ul><h3>🎁 Cam kết Restoration Hardware:</h3><ul><li>✅ Bảo hành 3 năm</li><li>✅ Lắp đặt chuyên nghiệp miễn phí</li><li>✅ Tặng kèm bộ ga giường</li></ul>`
  }
];

// Hàm tìm sản phẩm theo ID
function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

// ==================== QUẢN LÝ DỮ LIỆU SẢN PHẨM ====================

// Khởi tạo dữ liệu sản phẩm vào localStorage (chỉ chạy lần đầu)
function initProductsData() {
  const existingProducts = localStorage.getItem('tdungdecor_products');
  
  // Nếu chưa có, khởi tạo mảng rỗng
  if (!existingProducts) {
    localStorage.setItem('tdungdecor_products', JSON.stringify([]));
    console.log('✅ Đã khởi tạo localStorage với mảng sản phẩm rỗng');
  }
}

// Lấy danh sách sản phẩm CHỈ từ localStorage
function getProducts() {
  const stored = localStorage.getItem('tdungdecor_products');
  return stored ? JSON.parse(stored) : [];
}

// Lưu danh sách sản phẩm vào localStorage
function saveProducts(products) {
  localStorage.setItem('tdungdecor_products', JSON.stringify(products));
  console.log('✅ Đã lưu dữ liệu sản phẩm vào localStorage');
}

// Lấy sản phẩm theo ID
function getProductById(productId) {
  const products = getProducts();
  return products.find(p => p.id === productId);
}

// Khởi tạo khi load trang
initProductsData();

// Định dạng tiền tệ Việt Nam
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}
