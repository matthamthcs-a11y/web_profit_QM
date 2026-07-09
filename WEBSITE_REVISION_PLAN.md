# Kế hoạch chỉnh sửa website Profitness

## 1. Bối cảnh thay đổi

Khách hàng muốn đơn giản hóa website. Mục tiêu mới không còn là một website giới thiệu thương hiệu nhiều nội dung như ban đầu, mà là website giúp khách hàng:

- Tham khảo sản phẩm
- Xem giá bán
- Xem hương vị/quy cách
- Hiểu công dụng
- Biết cách sử dụng
- Liên hệ nhanh với sales qua Zalo/Hotline

Website vẫn không có giỏ hàng, thanh toán, tài khoản khách hàng hoặc quy trình đặt hàng online.

## 1.1. Quyết định đã chốt

- Không giữ lại trang `Knowledge/Blog` trong bản giao diện mới.
- Giá sản phẩm luôn hiển thị trên card sản phẩm và trang chi tiết.
- Hotline tạm thời: `02838481014`.
- Tên website/thương hiệu hiển thị: `Pro-Fitness Sports Nutrition`.
- Logo chính: dùng logo Pro-Fitness do khách cung cấp.
- Website có song ngữ Việt/Anh.
- Có nút chuyển ngôn ngữ trên giao diện.
- Giai đoạn này vẫn không làm giỏ hàng, checkout hoặc thanh toán online.

## 2. Định hướng sản phẩm mới

Website nên được xem như một catalog sản phẩm trực tuyến.

Ưu tiên:

- Nhanh hiểu
- Dễ tìm sản phẩm
- Dễ so sánh giá/vị/công dụng
- Dễ liên hệ mua hàng
- Admin dễ cập nhật sản phẩm, giá và banner

Không ưu tiên ở giai đoạn này:

- Blog/Knowledge
- Ecommerce checkout
- Tài khoản người dùng
- Coupon/đơn hàng/thanh toán
- Hệ thống review phức tạp

## 3. Cấu trúc menu đề xuất

Menu nên rút gọn:

```text
Trang chủ | Sản phẩm | Giới thiệu | Chứng nhận | Đại lý | Liên hệ | VI/EN
```

Đề xuất xử lý các trang hiện tại:

- `Home`: giữ lại nhưng đơn giản hóa mạnh.
- `Products`: chuyển thành trang quan trọng nhất.
- `Product Detail`: thiết kế lại theo hướng thông tin sản phẩm + liên hệ mua.
- `Brands`: có thể đổi thành `Chứng nhận` hoặc gộp vào trang tĩnh.
- `Knowledge`: bỏ khỏi menu và không triển khai trong giao diện mới.
- `Dealers`: giữ lại nếu khách có hệ thống đại lý.
- `About`: giữ lại ngắn gọn.
- `Contact`: giữ lại.

### Song ngữ

Nên có nút đổi ngôn ngữ ở header:

```text
VI | EN
```

Đề xuất kỹ thuật cho giai đoạn frontend:

- Dùng bộ từ điển nội bộ trong code, ví dụ `vi` và `en`.
- Lưu ngôn ngữ người dùng chọn bằng `localStorage`.
- Mặc định hiển thị tiếng Việt.
- Không cần tách route `/vi` và `/en` ở bản đầu nếu muốn triển khai nhanh.

Nếu sau này cần SEO tiếng Anh nghiêm túc, có thể nâng cấp thành route riêng:

```text
/vi/products
/en/products
```

## 4. Frontend - Trang chủ

### Mục tiêu

Trang chủ phải đưa khách đến sản phẩm nhanh nhất.

### Các section nên có

1. Banner chính
   - Ảnh/banner có thể thay đổi từ admin sau này.
   - Tiêu đề ngắn.
   - Mô tả ngắn.
   - CTA:
     - `Xem sản phẩm`
     - `Nhắn Zalo`
     - `Gọi Hotline`

   Banner nên dùng logo Pro-Fitness làm nhận diện chính, tránh dùng logo chữ nhỏ trong header như bản hiện tại.

2. Danh mục nổi bật
   - Energy Gel
   - Electrolyte
   - Protein
   - Recovery
   - Vitamin & Supplement
   - Weight Management

3. Sản phẩm bán chạy
   - Hiển thị 6-8 sản phẩm.
   - Mỗi card có:
     - Hình ảnh
     - Tên
     - Giá
     - Vị nổi bật
     - CTA `Xem chi tiết`

4. Vì sao chọn Profitness
   - Hàng chính hãng
   - Có giấy tờ/chứng nhận
   - Tư vấn nhanh
   - Nhiều dòng sản phẩm cho từng nhu cầu

5. CTA cuối trang
   - Nhắn Zalo
   - Gọi Hotline
   - Xem toàn bộ sản phẩm

## 5. Frontend - Trang danh sách sản phẩm

### Mục tiêu

Đây là trang khách sẽ dùng nhiều nhất. Cần ưu tiên tốc độ tìm và lọc sản phẩm.

### Thành phần chính

1. Ô tìm kiếm lớn
   - Tìm theo tên sản phẩm.
   - Tìm theo thương hiệu.
   - Tìm theo công dụng hoặc nhóm sản phẩm.

2. Smart Search
   - Gợi ý kết quả khi đang gõ.
   - Hỗ trợ không dấu tiếng Việt.
   - Hỗ trợ sai chính tả nhẹ.

3. Bộ lọc
   - Nhóm sản phẩm
   - Thương hiệu
   - Khoảng giá
   - Hương vị
   - Mục tiêu sử dụng, ví dụ:
     - Trước tập
     - Trong tập
     - Sau tập
     - Phục hồi
     - Bù điện giải

4. Card sản phẩm
   - Ảnh sản phẩm
   - Tên sản phẩm
   - Giá bán luôn hiển thị
   - Thương hiệu
   - Nhóm sản phẩm
   - Danh sách vị ngắn
   - CTA `Xem chi tiết`

## 6. Frontend - Trang chi tiết sản phẩm

### Mục tiêu

Trang chi tiết phải trả lời nhanh các câu hỏi:

- Sản phẩm này là gì?
- Giá bao nhiêu?
- Có vị nào?
- Công dụng gì?
- Dùng như thế nào?
- Muốn mua thì liên hệ ai?

### Layout đề xuất

1. Khu vực đầu trang
   - Gallery ảnh sản phẩm
   - Tên sản phẩm
   - Giá bán luôn hiển thị
   - Thương hiệu
   - Nhóm sản phẩm
   - Quy cách/size
   - Hương vị
   - Nút `Nhắn Zalo`
   - Nút `Gọi Hotline`

2. Nội dung chi tiết
   - Bảng thành phần
   - Công dụng
   - Cách sử dụng
   - Đối tượng phù hợp
   - Lưu ý sử dụng
   - Hình ảnh Nutrition Facts nếu có

3. Sản phẩm liên quan
   - Cùng nhóm sản phẩm
   - Hoặc do admin chọn thủ công sau này

### Mobile

Trên mobile nên có thanh liên hệ cố định ở cuối màn hình:

```text
[Nhắn Zalo] [Gọi Hotline]
```

Nút gọi hotline dùng số:

```text
02838481014
```

## 7. Frontend - Trang tĩnh

### Giới thiệu

Nội dung ngắn, tập trung vào:

- Profitness là ai
- Phân phối sản phẩm gì
- Cam kết hàng chính hãng
- Định hướng tư vấn sản phẩm

### Chứng nhận

Hiển thị:

- Chứng nhận phân phối
- Giấy tờ nhập khẩu
- Công bố ATTP
- COA nếu có
- Catalog PDF nếu có

### Đại lý

Hiển thị:

- Danh sách đại lý
- Khu vực/tỉnh thành
- Số điện thoại
- Link bản đồ nếu có
- Form đăng ký đại lý nếu khách cần

### Liên hệ

Hiển thị:

- Hotline: `02838481014`
- Zalo
- Messenger
- Facebook
- Email
- Địa chỉ
- Google Map nếu có

## 8. Backend/Admin đề xuất sau khi duyệt frontend

Backend nên triển khai sau khi khách duyệt giao diện catalog mới.

### Công nghệ đề xuất

- Supabase Auth cho đăng nhập admin
- Supabase Database cho dữ liệu
- Supabase Storage cho ảnh sản phẩm, banner và giấy tờ
- Vercel hosting frontend/admin

### Module admin cần có

1. Quản lý sản phẩm
   - Thêm sản phẩm
   - Sửa sản phẩm
   - Xóa hoặc ẩn sản phẩm
   - Cập nhật giá
   - Cập nhật hương vị
   - Cập nhật công dụng
   - Cập nhật cách sử dụng
   - Upload ảnh
   - Đánh dấu sản phẩm bán chạy

2. Quản lý danh mục
   - Thêm/sửa/xóa danh mục
   - Sắp xếp thứ tự hiển thị

3. Quản lý thương hiệu
   - Tên thương hiệu
   - Xuất xứ
   - Mô tả ngắn
   - Logo nếu có

4. Quản lý banner
   - Đổi ảnh banner trang chủ
   - Đổi tiêu đề/mô tả
   - Đổi nút CTA
   - Bật/tắt banner theo chương trình

5. Quản lý giấy tờ/chứng nhận
   - Upload file PDF/ảnh
   - Gắn với thương hiệu hoặc sản phẩm
   - Bật/tắt hiển thị

## 9. Data model đề xuất

### `categories`

- `id`
- `name`
- `slug`
- `description`
- `sort_order`
- `is_active`

### `brands`

- `id`
- `name`
- `slug`
- `origin`
- `description`
- `logo_url`
- `is_active`

### `products`

- `id`
- `name`
- `slug`
- `brand_id`
- `category_id`
- `price`
- `price_label`
- `short_description`
- `benefits`
- `usage`
- `ingredients`
- `nutrition_facts_image_url`
- `sizes`
- `flavors`
- `main_image_url`
- `gallery_urls`
- `is_featured`
- `is_best_seller`
- `is_active`
- `sort_order`

### `banners`

- `id`
- `title`
- `subtitle`
- `image_url`
- `cta_label`
- `cta_url`
- `is_active`
- `sort_order`

### `certificates`

- `id`
- `title`
- `file_url`
- `type`
- `brand_id`
- `product_id`
- `is_active`

### `dealers`

- `id`
- `name`
- `city`
- `address`
- `phone`
- `map_url`
- `is_active`

### `site_settings`

- `hotline`
- `zalo_url`
- `messenger_url`
- `facebook_url`
- `email`
- `address`

## 10. Logic nhỏ nên thêm

### Giá linh hoạt

Theo quyết định mới, giá sản phẩm luôn hiển thị.

Nên chuẩn hóa định dạng:

```text
350.000đ
1.250.000đ
```

Trong admin vẫn nên lưu giá dạng số để sau này có thể lọc/sắp xếp theo giá.

### Hương vị theo trạng thái

Mỗi hương vị nên có trạng thái:

- Còn hàng
- Tạm hết
- Ngừng bán

Ở frontend có thể hiển thị chip:

```text
Chocolate · Vanilla · Berry
```

Sau này có thể nâng cấp thành:

```text
Chocolate còn hàng
Vanilla tạm hết
```

### Link Zalo theo sản phẩm

Khi khách bấm Zalo ở trang sản phẩm, nội dung tin nhắn nên tự gợi ý:

```text
Tôi muốn tư vấn sản phẩm Endurance Gel Citrus
```

### Sản phẩm bán chạy

Không cần tính toán tự động ở giai đoạn đầu. Admin chỉ cần tick:

```text
is_best_seller = true
```

### Ẩn sản phẩm thay vì xóa

Nên có `is_active`. Khi sản phẩm hết bán, admin tắt hiển thị thay vì xóa dữ liệu.

### SEO cơ bản

Mỗi sản phẩm nên tự sinh:

- Meta title từ tên sản phẩm
- Meta description từ mô tả ngắn
- URL slug đẹp

Ví dụ:

```text
/products/endurance-gel-citrus
```

### Empty state

Khi tìm kiếm không có kết quả, không nên để trang trống. Nên hiển thị:

```text
Không tìm thấy sản phẩm phù hợp. Hãy nhắn Zalo để được tư vấn.
```

## 11. Kế hoạch chỉnh sửa code

### Giai đoạn A - Rút gọn sitemap

- Rút menu còn các trang cần thiết.
- Bỏ `Knowledge/Blog` khỏi menu và khỏi giao diện khách hàng.
- Giữ route sản phẩm, giới thiệu, chứng nhận, đại lý, liên hệ.
- Thêm nút đổi ngôn ngữ `VI/EN` ở header.
- Thay nhận diện `PF` hiện tại bằng logo Pro-Fitness.

### Giai đoạn B - Cập nhật mock data

- Thêm giá sản phẩm và luôn hiển thị.
- Thêm hương vị.
- Thêm quy cách.
- Thêm bảng thành phần.
- Thêm công dụng.
- Thêm cách sử dụng.
- Thêm trạng thái bán chạy.

### Giai đoạn C - Làm lại trang chủ

- Banner đơn giản hơn.
- Sử dụng logo Pro-Fitness trong header/banner.
- Danh mục nổi bật.
- Sản phẩm bán chạy.
- CTA liên hệ nhanh.
- Nội dung hỗ trợ song ngữ Việt/Anh.

### Giai đoạn D - Làm lại trang sản phẩm

- Search bar lớn.
- Gợi ý khi gõ.
- Filter theo danh mục/thương hiệu/giá/vị.
- Card sản phẩm có giá và vị.
- Smart search hỗ trợ nội dung tiếng Việt và tiếng Anh ở mức cơ bản.

### Giai đoạn E - Làm lại trang chi tiết sản phẩm

- Hiển thị ảnh, giá, vị, size rõ ràng.
- Bảng thành phần.
- Công dụng.
- Cách sử dụng.
- Sticky Zalo/Hotline.
- Hotline dùng số `02838481014`.
- Nội dung sản phẩm hỗ trợ song ngữ theo dictionary/mock data.

### Giai đoạn F - Trang tĩnh

- Giới thiệu
- Chứng nhận
- Đại lý
- Liên hệ

### Giai đoạn G - Kiểm tra và deploy

- Chạy `npm run lint`
- Chạy `npm run build`
- Kiểm tra localhost
- Commit code
- Push GitHub
- Vercel tự deploy

## 12. Các quyết định cần chốt trước khi sửa

Đã chốt:

1. Bỏ `Knowledge/Blog`.
2. Giá sản phẩm luôn hiển thị.
3. Hotline tạm thời: `02838481014`.
4. Tên website/thương hiệu: `Pro-Fitness Sports Nutrition`.
5. Có song ngữ Việt/Anh.
6. Có nút đổi ngôn ngữ.
7. Logo chính dùng ảnh Pro-Fitness khách cung cấp.

Còn cần chốt:

1. Link Zalo/Zalo OA chính xác là gì?
2. Có cần hiển thị chứng nhận ngay trên trang sản phẩm không?
3. Có cần phân quyền nhiều admin không, hay chỉ một tài khoản admin?
4. File logo gốc sẽ dùng định dạng nào: PNG, JPG, SVG hay WebP?

## 13. Đề xuất quyết định mặc định

Nếu chưa có thêm yêu cầu, nên chọn mặc định như sau:

- Bỏ `Knowledge/Blog` khỏi menu và giao diện.
- Có thể giữ route blog trong code tạm thời nếu muốn tránh xóa nhiều, nhưng không liên kết từ giao diện.
- Giá sản phẩm luôn hiển thị.
- Dùng hotline `02838481014`.
- Zalo dùng mock link trước, thay bằng link thật khi khách cung cấp.
- Làm song ngữ Việt/Anh bằng dictionary nội bộ trước.
- Admin giai đoạn đầu chỉ cần một vai trò quản trị.
- Backend Supabase làm sau khi khách duyệt giao diện catalog mới.
