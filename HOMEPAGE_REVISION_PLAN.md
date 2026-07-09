# Homepage Revision Plan - Pro-Fitness Sports Nutrition

## Mục tiêu / Goal

Trang chủ mới phải đi theo tinh thần của `hammernutrition.com`, nhưng chỉ giữ những phần cần cho website catalogue:

- tập trung vào sản phẩm
- luôn thấy giá, vị, công dụng, cách dùng
- giao diện rõ ràng, dễ quét, dễ bấm
- song ngữ Việt / Anh
- không có Knowledge, Blog, cart, checkout, account, subscription

Đây là website trưng bày sản phẩm, không phải web bán hàng online.

## Kết luận đã chốt / Decisions

- Không giữ trang `Knowledge / Blog`
- Giá sản phẩm luôn hiển thị
- Hotline tạm thời: `02838481014`
- Tên website: `Pro-Fitness Sports Nutrition`
- Logo chính: logo Pro-Fitness khách đã upload
- Có nút đổi ngôn ngữ `VI / EN`
- Logo ở footer không cần

## Cấu trúc homepage đề xuất / Homepage structure

### 1. Top navigation

- Một thanh duy nhất, không tách `Top bar` và `Header`
- Bên trái: logo Pro-Fitness
- Ở giữa: menu chính
- Bên phải: nút `VI / EN` và hotline
- Menu cần gọn, nhìn một hàng trên desktop
- `Sản phẩm / Products` phải nằm ngay sau `Trang chủ / Home`
- Khi hover vào `Sản phẩm / Products`, menu danh mục bung xuống ngay

### 2. Hero / Banner chính

Đây là phần cần làm giống ảnh mẫu nhất.

Yêu cầu:

- banner ảnh full chiều ngang
- dùng 1 ảnh lớn hoặc carousel ảnh lớn
- ảnh phải chiếm trọn khu hero, không để cảm giác như một card nhỏ
- chữ đặt trực tiếp trên ảnh, giống nhịp của ảnh tham khảo
- nội dung song ngữ Anh / Việt hiển thị song song
- không nhét quá nhiều đoạn text
- CTA chỉ cần 2 nút chính

Gợi ý nội dung hero:

- `Xem sản phẩm / View products`
- `Liên hệ / Contact`

Gợi ý bố cục chữ trên banner:

- headline lớn
- subheadline ngắn hơn bên dưới
- dòng mô tả phụ ngắn

Mục tiêu của hero:

- nhìn vào là hiểu ngay đây là website catalogue sản phẩm
- tạo cảm giác thương hiệu mạnh
- có nhịp giống homepage tham khảo nhưng gọn hơn

### 3. Featured categories / Danh mục nổi bật

- tile lớn, dễ bấm
- dẫn vào nhóm sản phẩm
- ưu tiên các nhóm người dùng hay tìm

### 4. Best sellers / Sản phẩm nổi bật

- hiển thị các sản phẩm bán chạy
- mỗi card có:
  - ảnh
  - tên
  - giá
  - vị
  - công dụng ngắn
  - CTA `Xem chi tiết`

### 5. Why choose Pro-Fitness / Vì sao chọn Pro-Fitness

- 3 đến 4 ý ngắn
- tập trung vào độ tin cậy
- ví dụ:
  - hàng chính hãng
  - giá và vị rõ ràng
  - tư vấn nhanh qua hotline / Zalo
  - có tài liệu / chứng nhận khi cần

### 6. Customer reviews / Phản hồi khách hàng

- giữ lại trong homepage
- hiển thị nhận xét ngắn, dễ đọc
- mỗi item nên có:
  - tên
  - vai trò hoặc ngữ cảnh
  - rating sao
  - quote ngắn

### 7. Fast contact CTA / Liên hệ nhanh

- một band ngắn trước footer
- 2 đến 3 nút rõ ràng:
  - `Nhắn Zalo`
  - `Gọi hotline`
  - `Xem toàn bộ sản phẩm`

### 8. Footer

- footer gọn nhưng đầy đủ hơn site marketing thông thường
- chia nhóm link:
  - Sản phẩm
  - Giới thiệu
  - Chứng nhận
  - Đại lý
  - Liên hệ
- có hotline và thông tin cơ bản
- không đưa Knowledge / Blog vào footer

## Thứ tự ưu tiên khi làm homepage / Priority order

1. Top navigation
2. Hero / Banner chính
3. Featured categories
4. Best sellers
5. Why choose Pro-Fitness
6. Customer reviews
7. Fast contact CTA
8. Footer

## Quy tắc nội dung / Content rules

- Giá sản phẩm luôn hiển thị
- Không giữ trang kiến thức / blog
- Website song ngữ Việt / Anh
- Có nút đổi ngôn ngữ trên giao diện
- Hotline tạm thời: `02838481014`
- Tên website: `Pro-Fitness Sports Nutrition`
- Logo chính: ảnh khách đã upload

## Những chi tiết nhỏ nên giữ / Small but important details

- card sản phẩm phải dễ quét nhanh
- hero phải tạo cảm giác catalogue lớn, không phải landing page quảng cáo
- phần review nên ngắn và dễ đọc
- trên mobile CTA phải chạm dễ và không bị chồng chữ
- không lạm dụng slider ở các section phụ

## Cách hiểu nhanh phần hero / Hero interpretation

Phần 2 không phải là một khối chữ riêng nằm dưới ảnh.

Nó nên là:

- một ảnh/banner full ngang
- bên trong ảnh có headline lớn
- bên trong ảnh có subheadline song ngữ
- dưới hoặc ngay trong banner có nút CTA

Nói ngắn gọn:

`ảnh lớn + chữ trên ảnh + song ngữ + 2 nút`

đó là đúng hướng bạn muốn.

## Giai đoạn triển khai / Implementation phases

### Phase 1

- chốt layout homepage
- chốt nội dung song ngữ
- chốt thứ tự section

### Phase 2

- làm lại hero/banner full ngang
- làm lại categories và best sellers
- thêm customer reviews

### Phase 3

- tối ưu footer
- tối ưu CTA cuối trang
- chạy lại lint / build
- kiểm tra mobile / desktop

## Kết luận / Conclusion

Homepage mới cần đi theo hướng:

- nhìn như một brand catalogue rõ ràng
- hero full ngang, chữ đặt trên ảnh
- song ngữ Việt / Anh
- bỏ Knowledge / Blog
- ưu tiên sản phẩm, giá, vị, công dụng, cách dùng và liên hệ nhanh
