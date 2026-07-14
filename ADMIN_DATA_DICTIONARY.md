# Bảng dữ liệu khu vực Admin Pro-Fitness

File này giải thích các trường dữ liệu đang có trong khu vực quản trị website. Mục tiêu là giúp admin/người nhập liệu hiểu mỗi ô dùng để làm gì, nên nhập kiểu dữ liệu nào, và dữ liệu đó ảnh hưởng đến phần nào trên website.

## Quy ước chung

| Khái niệm | Ý nghĩa | Ví dụ |
| --- | --- | --- |
| VI / EN | Dữ liệu song ngữ. Khi website chọn tiếng Việt thì dùng trường VI, khi chọn tiếng Anh thì dùng trường EN. | `Gel năng lượng` / `Energy Gel` |
| Slug | Đường dẫn thân thiện, viết thường, không dấu, các từ nối bằng dấu gạch ngang. | `endurance-gel-citrus` |
| Path | Đường dẫn ảnh/file. Hiện admin nhập thủ công, sau này có thể thay bằng upload file. | `/logo.webp`, `product-assets/gel.png` |
| Thứ tự / Sort order | Số dùng để sắp xếp. Số nhỏ hiển thị trước. | `0`, `10`, `20` |
| Checkbox bật/tắt | Nếu được tick thì dữ liệu đang bật. Nếu bỏ tick thì dữ liệu bị ẩn hoặc không kích hoạt. | `Đang hiển thị`, `Đang xuất bản` |
| Mỗi dòng một mục | Với ô textarea, mỗi dòng sẽ được lưu thành một mục riêng. | Dòng 1: `Cam chanh`, dòng 2: `Dâu rừng` |

## Sản phẩm

Dùng để quản lý toàn bộ sản phẩm hiển thị ở trang danh sách sản phẩm, chi tiết sản phẩm, sản phẩm bán chạy và sản phẩm nổi bật.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên VI | `name.vi` | Văn bản | Có | Tên sản phẩm tiếng Việt. Hiển thị ở card sản phẩm, trang chi tiết và tìm kiếm. | `Gel năng lượng vị cam chanh` |
| Tên EN | `name.en` | Văn bản | Có | Tên sản phẩm tiếng Anh. | `Endurance Gel Citrus` |
| Mô tả ngắn VI | `short_description.vi` | Văn bản dài | Không | Mô tả nhanh giá trị sản phẩm bằng tiếng Việt. | `Bổ sung năng lượng nhanh cho buổi tập dài.` |
| Mô tả ngắn EN | `short_description.en` | Văn bản dài | Không | Mô tả nhanh bằng tiếng Anh. | `Quick energy support for long sessions.` |
| Mục tiêu chính VI | `primary_goal.vi` | Văn bản | Không | Nhãn công dụng chính của sản phẩm. | `Năng lượng` |
| Mục tiêu chính EN | `primary_goal.en` | Văn bản | Không | Nhãn công dụng chính tiếng Anh. | `Energy` |
| Slug | `slug` | Văn bản không dấu | Có | Tạo URL chi tiết sản phẩm. | `/products/endurance-gel-citrus` |
| Giá | `price` | Số | Có | Giá bán hiển thị cho khách tham khảo. | `45000` |
| Tiền tệ | `currency` | Văn bản ngắn | Có | Đơn vị tiền tệ. | `VND` |
| Xuất xứ | `origin` | Văn bản | Không | Hiển thị nguồn gốc sản phẩm. | `USA` |
| Danh mục | `category_id` | Chọn từ danh mục | Không | Gắn sản phẩm vào nhóm để lọc và hiển thị dropdown. | `Gel năng lượng` |
| Thương hiệu | `brand_id` | Chọn từ thương hiệu | Không | Gắn sản phẩm với thương hiệu phân phối. | `ProFuel` |
| Kiểu visual | `package_type` | Lựa chọn | Không | Điều khiển kiểu hình minh họa sản phẩm khi chưa có ảnh thật. | `gel`, `tube`, `tub`, `pouch` |
| Thứ tự | `sort_order` | Số | Không | Sắp xếp sản phẩm trong danh sách. | `0` hiển thị trước `10` |
| Image path | `image_path` | Đường dẫn ảnh | Không | Ảnh chính của sản phẩm. | `/products/gel.png` |
| Nutrition image path | `nutrition_image_path` | Đường dẫn ảnh | Không | Ảnh bảng thành phần/nutrition facts. | `/products/gel-nutrition.png` |
| Accent color | `visual_accent` | Mã màu | Không | Trường kỹ thuật đã ẩn khỏi admin. Dùng màu nhấn mặc định cho placeholder khi sản phẩm chưa có ảnh thật. | Mặc định `#ce1732` |
| Background color | `visual_background` | Mã màu | Không | Trường kỹ thuật đã ẩn khỏi admin. Dùng màu nền mặc định cho placeholder khi sản phẩm chưa có ảnh thật. | Mặc định `#fff1f2` |
| Sizes | `product_sizes` | Văn bản nhiều dòng | Không | Các quy cách đóng gói. Mỗi dòng là một size. | `35g`, `Box 24` |
| Thành phần | `product_ingredients` | Văn bản nhiều dòng | Không | Thành phần sản phẩm. Mỗi dòng theo dạng `Tên\|Hàm lượng`. | `Carbohydrate\|22g` |
| Nổi bật | `is_featured` | Bật/tắt | Không | Đánh dấu sản phẩm nổi bật để dùng ở các section đặc biệt. | Tick nếu muốn ưu tiên hiển thị |
| Bán chạy | `is_best_seller` | Bật/tắt | Không | Đưa sản phẩm vào khu vực sản phẩm bán chạy. | Tick nếu là best seller |
| Đang xuất bản | `is_published` | Bật/tắt | Có | Cho phép/ẩn sản phẩm khỏi website public. | Bỏ tick để ẩn khỏi khách hàng |
| Vị VI | `product_flavors.name.vi` | Văn bản nhiều dòng | Không | Danh sách hương vị tiếng Việt. Mỗi dòng là một vị. | `Cam chanh` |
| Vị EN | `product_flavors.name.en` | Văn bản nhiều dòng | Không | Danh sách hương vị tiếng Anh. Mỗi dòng tương ứng với VI. | `Citrus` |
| Công dụng VI | `product_benefits.content.vi` | Văn bản nhiều dòng | Không | Các lợi ích/công dụng sản phẩm tiếng Việt. | `Bổ sung năng lượng nhanh` |
| Công dụng EN | `product_benefits.content.en` | Văn bản nhiều dòng | Không | Các lợi ích/công dụng tiếng Anh. | `Supports quick energy` |
| Cách dùng VI | `product_usage.content.vi` | Văn bản nhiều dòng | Không | Hướng dẫn sử dụng tiếng Việt. | `Dùng 1 gói trước hoặc trong khi tập.` |
| Cách dùng EN | `product_usage.content.en` | Văn bản nhiều dòng | Không | Hướng dẫn sử dụng tiếng Anh. | `Take 1 pack before or during training.` |
| Đối tượng phù hợp VI | `product_audiences.content.vi` | Văn bản nhiều dòng | Không | Nhóm khách hàng phù hợp. | `Runner`, `Cyclist`, `Triathlete` |
| Đối tượng phù hợp EN | `product_audiences.content.en` | Văn bản nhiều dòng | Không | Nhóm khách hàng phù hợp tiếng Anh. | `Runners`, `Cyclists` |

Ghi chú nhập liệu cho sản phẩm:

- Nếu chưa có ảnh thật, có thể để trống `Image path`, website sẽ dùng visual placeholder.
- Nếu đổi `slug`, URL cũ sẽ thay đổi. Cần tránh đổi slug sau khi đã gửi link cho khách.
- Với các field nhiều dòng song ngữ, nên nhập cùng số dòng ở VI và EN để dữ liệu khớp nhau.
- `Đang xuất bản` là trường quan trọng nhất để kiểm soát sản phẩm có xuất hiện trên website public hay không.

## Danh mục

Dùng cho dropdown Sản phẩm ở thanh điều hướng, bộ lọc trang sản phẩm và section danh mục nổi bật.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên VI | `name.vi` | Văn bản | Có | Tên danh mục tiếng Việt. | `Gel năng lượng` |
| Tên EN | `name.en` | Văn bản | Có | Tên danh mục tiếng Anh. | `Energy Gel` |
| Mô tả VI | `description.vi` | Văn bản dài | Không | Mô tả ngắn cho danh mục tiếng Việt. | `Bổ sung năng lượng nhanh cho buổi tập dài.` |
| Mô tả EN | `description.en` | Văn bản dài | Không | Mô tả ngắn cho danh mục tiếng Anh. | `Fast energy support for endurance sessions.` |
| Slug | `slug` | Văn bản không dấu | Có | Dùng cho URL/filter danh mục. | `energy-gel` |
| Thứ tự | `sort_order` | Số | Không | Sắp xếp danh mục trong dropdown và section. | `0`, `10` |
| Nổi bật | `is_featured` | Bật/tắt | Không | Đưa danh mục vào section danh mục nổi bật ở trang chủ. | Tick nếu muốn hiển thị nổi bật |
| Đang hiển thị | `is_active` | Bật/tắt | Có | Cho phép danh mục xuất hiện trên website public. | Bỏ tick để ẩn |

## Thương hiệu

Dùng để nhóm sản phẩm theo thương hiệu/phân phối, hiển thị ở bộ lọc và trang thông tin chứng nhận/phân phối.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên | `name` | Văn bản | Có | Tên thương hiệu. | `ProFuel` |
| Slug | `slug` | Văn bản không dấu | Có | Dùng cho URL/filter thương hiệu. | `profuel` |
| Xuất xứ | `origin` | Văn bản | Không | Quốc gia hoặc khu vực thương hiệu. | `USA` |
| Mô tả VI | `description.vi` | Văn bản dài | Không | Mô tả thương hiệu tiếng Việt. | `Thương hiệu dinh dưỡng thể thao...` |
| Mô tả EN | `description.en` | Văn bản dài | Không | Mô tả thương hiệu tiếng Anh. | `Sports nutrition brand...` |
| Logo path | `logo_path` | Đường dẫn ảnh | Không | Ảnh logo thương hiệu. | `/brands/profuel.png` |
| Thứ tự | `sort_order` | Số | Không | Sắp xếp thương hiệu trong admin/frontend. | `0` |
| Đang hiển thị | `is_active` | Bật/tắt | Có | Cho phép thương hiệu xuất hiện trên website public. | Bỏ tick để ẩn |

## Banner trang chủ

Dùng để quản lý ảnh slide hero ở trang chủ. Theo định hướng hiện tại, banner chỉ là ảnh; chữ quảng cáo nếu có nên được thiết kế sẵn trong file ảnh.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Image path | `image_path` | Đường dẫn ảnh | Có | Ảnh banner dùng trên desktop/tablet. | `/banners/home-hero-01.jpg` |
| Mobile image path | `mobile_image_path` | Đường dẫn ảnh | Không | Ảnh riêng cho mobile nếu cần crop khác. | `/banners/home-hero-01-mobile.jpg` |
| Alt text VI | `alt.vi` | Văn bản | Không | Mô tả ảnh cho SEO/accessibility tiếng Việt. | `Vận động viên sử dụng gel năng lượng` |
| Alt text EN | `alt.en` | Văn bản | Không | Mô tả ảnh cho SEO/accessibility tiếng Anh. | `Athlete using energy gel` |
| Link URL | `link_url` | URL/path | Không | Nếu banner có thể click, đây là trang sẽ mở. | `/products` |
| Thứ tự | `sort_order` | Số | Không | Sắp xếp thứ tự slide. | `0` |
| Đang hiển thị | `is_active` | Bật/tắt | Có | Cho phép banner xuất hiện ở trang chủ. | Bỏ tick để ẩn banner |

Ghi chú banner:

- Nên dùng ảnh ngang, chất lượng tốt.
- Không nên đặt text HTML overlay trong admin vì thiết kế hiện tại ưu tiên chữ nằm sẵn trong ảnh.
- `Mobile image path` nên dùng khi ảnh desktop bị crop xấu trên điện thoại.

## Chứng nhận & tài liệu

Dùng để quản lý catalog, giấy chứng nhận phân phối, COA, ATTP hoặc các tài liệu khách cần xem/tải.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tiêu đề VI | `title.vi` | Văn bản | Có | Tên tài liệu tiếng Việt. | `Giấy chứng nhận phân phối` |
| Tiêu đề EN | `title.en` | Văn bản | Có | Tên tài liệu tiếng Anh. | `Distribution Certificate` |
| Mô tả VI | `description.vi` | Văn bản dài | Không | Giải thích ngắn về tài liệu. | `Tài liệu xác nhận quyền phân phối...` |
| Mô tả EN | `description.en` | Văn bản dài | Không | Giải thích ngắn tiếng Anh. | `Document confirming distribution rights...` |
| Loại | `type` | Lựa chọn | Có | Phân loại tài liệu. | `catalog`, `certificate`, `coa`, `attp` |
| File path | `file_path` | Đường dẫn file | Không | File PDF/ảnh để khách xem hoặc tải. | `/documents/certificate.pdf` |
| Thumbnail path | `thumbnail_path` | Đường dẫn ảnh | Không | Ảnh đại diện tài liệu. | `/documents/certificate-thumb.jpg` |
| Thứ tự | `sort_order` | Số | Không | Sắp xếp tài liệu. | `0` |
| Đang xuất bản | `is_published` | Bật/tắt | Có | Cho phép tài liệu xuất hiện trên website public. | Bỏ tick để ẩn |

## Đại lý

Dùng để quản lý thông tin đại lý/điểm phân phối.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên | `name` | Văn bản | Có | Tên đại lý hoặc điểm phân phối. | `Pro-Fitness Hồ Chí Minh` |
| Thành phố | `city` | Văn bản | Không | Khu vực/tỉnh thành. | `TP. Hồ Chí Minh` |
| Số điện thoại | `phone` | Văn bản | Không | Số liên hệ của đại lý. | `02838481014` |
| Địa chỉ | `address` | Văn bản | Không | Địa chỉ chi tiết. | `Quận 1, TP. Hồ Chí Minh` |
| Zalo | `zalo` | Văn bản/URL | Không | Số Zalo hoặc link Zalo. | `02838481014` |
| Map URL | `map_url` | URL | Không | Link Google Maps hoặc bản đồ. | `https://maps.google.com/...` |
| Thứ tự | `sort_order` | Số | Không | Sắp xếp đại lý. | `0` |
| Đang hiển thị | `is_active` | Bật/tắt | Có | Cho phép đại lý xuất hiện trên website public. | Bỏ tick để ẩn |

## Phản hồi khách hàng

Dùng để quản lý review/testimonial hiển thị ở trang chủ.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên | `name` | Văn bản | Có | Tên khách hàng hoặc tên hiển thị. | `Anh Minh` |
| Vai trò | `role` | Văn bản | Không | Vai trò/nhóm khách hàng. | `Runner`, `Cyclist`, `Đại lý` |
| Rating | `rating` | Số | Không | Số sao đánh giá. | Nên nhập từ `1` đến `5` |
| Thứ tự | `sort_order` | Số | Không | Sắp xếp review. | `0` |
| Nội dung VI | `quote.vi` | Văn bản dài | Có | Nội dung phản hồi tiếng Việt. | `Sản phẩm dễ dùng và hiệu quả.` |
| Nội dung EN | `quote.en` | Văn bản dài | Có | Nội dung phản hồi tiếng Anh. | `Easy to use and effective.` |
| Đang xuất bản | `is_published` | Bật/tắt | Có | Cho phép review xuất hiện trên website public. | Bỏ tick để ẩn |

## Lead liên hệ

Dữ liệu này được tạo tự động khi khách gửi form liên hệ. Admin chủ yếu xem, đổi trạng thái xử lý hoặc xóa.

| Tên dữ liệu trên admin | Tên kỹ thuật | Loại dữ liệu | Admin nhập? | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên khách | `name` | Văn bản | Không | Tên khách gửi form. | Có thể trống nếu khách không nhập |
| Số điện thoại | `phone` | Văn bản | Không | Kênh liên hệ chính để sales gọi lại. | `0901234567` |
| Email | `email` | Email | Không | Email khách nếu có. | `customer@example.com` |
| Nội dung | `message` | Văn bản dài | Không | Nhu cầu tư vấn của khách. | `Tôi muốn hỏi về gel năng lượng...` |
| Product ID | `product_id` | ID sản phẩm | Không | Nếu lead đến từ sản phẩm cụ thể, lưu ID sản phẩm đó. | Hiện admin thấy ID, sau này có thể đổi sang tên sản phẩm |
| Nguồn | `source` | Văn bản | Không | Trang/khu vực tạo lead. | `contact_page` |
| Trạng thái | `status` | Lựa chọn | Có | Theo dõi tiến độ xử lý lead. | `new`, `contacted`, `closed`, `spam` |
| Ngày tạo | `created_at` | Ngày giờ | Không | Thời điểm khách gửi form. | Tự động sinh |

Ý nghĩa trạng thái lead:

| Trạng thái | Ý nghĩa |
| --- | --- |
| `new` | Lead mới, chưa xử lý. |
| `contacted` | Đã liên hệ khách. |
| `closed` | Đã xử lý xong hoặc chốt được nhu cầu. |
| `spam` | Lead rác/không hợp lệ. |

## Cài đặt chung

Dùng để cập nhật thông tin toàn website: hotline, email, Zalo, Facebook và SEO cơ bản.

| Tên dữ liệu trên form | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Hotline | `site_settings.contact.hotline` | Văn bản/số điện thoại | Có | Số hotline hiển thị ở header, footer, nút gọi nhanh. | `02838481014` |
| Email | `site_settings.contact.email` | Email | Không | Email liên hệ hiển thị ở footer/contact. | `hello@profitness.vn` |
| Zalo URL | `site_settings.contact.zalo_url` | URL/tel link | Không | Link mở Zalo hoặc gọi nhanh. | `tel:02838481014` |
| Địa chỉ | `site_settings.contact.address` | Văn bản | Không | Địa chỉ công ty/đơn vị phân phối. | `Ho Chi Minh City, Vietnam` |
| Facebook label | `site_settings.social_links.facebook_label` | Văn bản | Không | Tên hiển thị của kênh Facebook. | `Pro-Fitness Vietnam` |
| Facebook URL | `site_settings.social_links.facebook_url` | URL | Không | Link Facebook chính thức. | `https://facebook.com/...` |
| SEO title | `site_settings.seo.title` | Văn bản | Không | Tiêu đề SEO mặc định cho website. | `Pro-Fitness Sports Nutrition` |
| SEO description | `site_settings.seo.description` | Văn bản dài | Không | Mô tả SEO mặc định. | `Website tham khảo sản phẩm dinh dưỡng thể thao...` |

## Tài khoản Admin

Dùng để kiểm soát ai được đăng nhập khu vực quản trị.

| Tên dữ liệu | Tên kỹ thuật | Loại dữ liệu | Bắt buộc | Chức năng | Ví dụ / Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Email đăng nhập | `auth.users.email` | Email | Có | Tài khoản dùng để đăng nhập `/admin/login`. | `admin@profitness.vn` |
| Mật khẩu | Supabase Auth password | Mật khẩu | Có | Mật khẩu đăng nhập admin. | Không lưu trong repo/tài liệu public |
| Quyền | `admin_profiles.role` | Lựa chọn | Có | Xác định user có được vào admin và thao tác dữ liệu không. | `admin`, `editor` |
| Tên hiển thị | `admin_profiles.display_name` | Văn bản | Không | Tên admin hiển thị/nội bộ. | `Pro-Fitness Admin` |

Ghi chú bảo mật:

- Không chia sẻ tài khoản admin cho nhiều người dùng lâu dài.
- Mỗi người quản trị nên có một tài khoản riêng.
- Mật khẩu test nên được đổi hoặc xóa sau khi kiểm thử.
- User đăng nhập Supabase Auth nhưng không có row trong `admin_profiles` sẽ không có quyền vào dashboard admin.

## Những phần nên bổ sung sau

| Hạng mục | Lý do cần bổ sung | Gợi ý triển khai |
| --- | --- | --- |
| Upload ảnh/file trực tiếp | Hiện admin phải nhập `path` thủ công, dễ sai. | Thêm uploader lên Supabase Storage cho banner, product image, documents. |
| Preview ảnh | Admin cần biết path ảnh nhập có đúng không. | Hiển thị preview ngay dưới `Image path`. |
| Related products | Trang chi tiết sản phẩm cần gợi ý sản phẩm liên quan. | Thêm UI chọn nhiều sản phẩm liên quan. |
| Validation rõ hơn | Tránh nhập sai slug, giá âm, thiếu tên. | Hiển thị lỗi ngay trên form thay vì chỉ reload. |
| Audit log | Biết ai sửa dữ liệu và sửa lúc nào. | Thêm bảng `admin_activity_logs`. |
| Phân quyền chi tiết | Editor có thể chỉ được sửa nội dung, không xóa. | Tách role `admin`, `editor`, `viewer`. |
