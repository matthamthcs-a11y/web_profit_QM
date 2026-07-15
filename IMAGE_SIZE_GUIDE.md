# Bảng size ảnh website Pro-Fitness

File này dùng để thống nhất kích thước ảnh khi thiết kế banner, sản phẩm, tài liệu và các ảnh upload trong khu vực admin. Nên ưu tiên ảnh `.webp` hoặc `.jpg` đã nén để website tải nhanh.

## Quy chuẩn chung

| Nội dung | Khuyến nghị |
| --- | --- |
| Định dạng ưu tiên | `.webp` cho ảnh website, `.png` cho logo cần trong suốt, `.jpg` cho ảnh chụp |
| Dung lượng ảnh thường | Dưới `300KB` nếu có thể |
| Dung lượng banner lớn | Dưới `600KB` nếu có thể |
| Tên file | Viết thường, không dấu, dùng dấu gạch ngang. Ví dụ: `gel-nang-luong-citrus.webp` |
| Vùng an toàn | Không đặt chữ/sản phẩm sát mép ảnh, chừa khoảng `8-10%` mỗi cạnh |
| Ảnh có chữ sẵn | Banner hero có thể chứa chữ trong ảnh, vì website không chèn chữ đè lên banner |

## Bảng size ảnh

| Nhóm ảnh | Trường trong admin/database | Nơi hiển thị | Tỉ lệ | Size khuyến nghị | Size tối thiểu | Dung lượng gợi ý | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Logo website | `public/logo.webp` | Top navigation | Ngang dài | `1200 x 300px` | `800 x 200px` | `< 200KB` | Nên dùng nền trong suốt hoặc nền sáng rõ. Logo đang hiển thị dạng ngang. |
| Banner trang chủ desktop | `home_banners.image_path` | Hero slide trang chủ desktop/tablet | `16:5` hoặc `1920:600` | `1920 x 600px` | `1440 x 450px` | `< 600KB` | Đây là ảnh full chiều ngang. Nếu cần chữ, thiết kế chữ trực tiếp trong ảnh. |
| Banner trang chủ mobile | `home_banners.mobile_image_path` | Hero slide trên điện thoại | `4:5` hoặc `3:4` | `1080 x 1350px` | `750 x 938px` | `< 500KB` | Nên làm bản riêng cho mobile để chữ/sản phẩm không bị cắt. Nếu trống, website dùng ảnh desktop. |
| Ảnh sản phẩm chính | `products.image_path` | Card sản phẩm, trang chi tiết sản phẩm | `1:1` | `1200 x 1200px` | `800 x 800px` | `< 400KB` | Nên là ảnh sản phẩm nền trắng/trong suốt, sản phẩm nằm giữa, không dính mép. |
| Ảnh sản phẩm dạng ngang | `products.image_path` | Nếu sau này dùng cho banner/category highlight | `4:3` | `1200 x 900px` | `800 x 600px` | `< 450KB` | Chỉ cần khi muốn ảnh sản phẩm có bối cảnh hoặc lifestyle. Hiện ưu tiên ảnh vuông. |
| Ảnh bảng thành phần/Nutrition Facts | `products.nutrition_image_path` | Trang chi tiết sản phẩm | `4:3` hoặc theo file gốc | `1200 x 900px` | `900 x 675px` | `< 500KB` | Chữ trong ảnh phải đọc được trên desktop và mobile. Tránh ảnh quá mờ hoặc chụp nghiêng. |
| Logo thương hiệu | `brands.logo_path` | Trang thương hiệu/admin, có thể dùng ở homepage sau này | `3:1` hoặc `4:1` | `900 x 300px` | `600 x 200px` | `< 200KB` | Nên dùng `.png`/`.webp` nền trong suốt. Không nên có quá nhiều khoảng trắng thừa. |
| Thumbnail tài liệu/chứng nhận | `documents.thumbnail_path` | Thẻ tài liệu/chứng nhận nếu bật hiển thị thumbnail | `4:3` | `1200 x 900px` | `800 x 600px` | `< 400KB` | Dùng ảnh bìa catalog, ảnh chứng nhận hoặc preview trang đầu. |
| File tài liệu PDF/catalog | `documents.file_path` | Trang chứng nhận/tài liệu, admin upload file | Theo file gốc | PDF tối ưu dưới `10MB` | Không áp dụng | `< 10MB` nếu có thể | Đây không phải ảnh hiển thị trực tiếp, nhưng nên tối ưu để khách tải nhanh. |
| Ảnh Open Graph/SEO | Chưa có trường admin riêng | Khi chia sẻ link website lên Facebook/Zalo | `1.91:1` | `1200 x 630px` | `1200 x 630px` | `< 500KB` | Nên chuẩn bị sau khi chốt branding. Có thể thêm vào metadata sau. |
| Favicon | Chưa có file riêng | Icon tab trình duyệt | `1:1` | `512 x 512px` | `256 x 256px` | `< 100KB` | Nên dùng biểu tượng rút gọn, không dùng logo ngang vì sẽ quá nhỏ. |

## Ưu tiên chuẩn bị ảnh theo giai đoạn

| Mức ưu tiên | Cần chuẩn bị | Lý do |
| --- | --- | --- |
| 1 | Logo website, banner desktop, banner mobile | Ảnh đầu tiên khách nhìn thấy, ảnh hưởng mạnh tới cảm nhận thiết kế. |
| 2 | Ảnh sản phẩm chính, ảnh Nutrition Facts | Phục vụ mục tiêu chính: xem sản phẩm, giá, vị, công dụng, cách dùng. |
| 3 | Thumbnail chứng nhận/tài liệu, logo thương hiệu | Tăng độ tin cậy và hoàn thiện trang giới thiệu/chứng nhận. |
| 4 | Open Graph, favicon | Tối ưu sau khi website chuẩn bị public chính thức. |

## Ghi chú cho người nhập liệu admin

| Trường ảnh | Cách nhập tốt nhất |
| --- | --- |
| Ảnh banner | Bấm `Chọn ảnh`, upload file đã thiết kế đúng size. Không cần dán link thủ công nếu file có sẵn trong máy. |
| Ảnh sản phẩm | Ưu tiên ảnh vuông `1200 x 1200px`, nền trắng hoặc trong suốt. |
| Ảnh bảng thành phần | Kiểm tra chữ trong ảnh trước khi upload, đặc biệt trên điện thoại. |
| Logo thương hiệu | Dùng logo ngang, nền trong suốt, không để khoảng trắng quá lớn quanh logo. |
| Thumbnail tài liệu | Có thể dùng ảnh bìa tài liệu hoặc ảnh chụp chứng nhận đã crop thẳng. |

