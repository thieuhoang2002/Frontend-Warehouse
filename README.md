# 🖥️ Frontend — Warehouse Management System (WMS)

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![MUI](https://img.shields.io/badge/MUI-v6-007FFF?logo=mui)
![Three.js](https://img.shields.io/badge/Three.js-0.166-black?logo=threedotjs)
![React Router](https://img.shields.io/badge/React%20Router-v6-CA4245?logo=reactrouter)
![Axios](https://img.shields.io/badge/Axios-1.7.5-5A29E4)

> Giao diện người dùng cho hệ thống Quản lý Kho hàng (WMS). Kho hàng 3D trực quan, quản lý hàng hóa, booking, báo cáo PDF và thông báo real-time.

---

## 🚀 Bắt Đầu Nhanh

### Yêu cầu
- Node.js 16+
- Backend WMS đang chạy tại `http://localhost:8080`

### Cài đặt & Chạy

```bash
# 1. Clone
git clone https://github.com/thieuhoang2002/Frontend-Warehouse.git
cd Frontend-Warehouse

# 2. Cài dependencies
npm install --legacy-peer-deps

# 3. Tạo file cấu hình
cp .env.example .env
# Chỉnh sửa .env nếu backend chạy ở port khác

# 4. Chạy dev server
npm start
```

Mở trình duyệt tại: **`http://localhost:3000`**

> ⚠️ **Bắt buộc:** Backend phải đang chạy trước khi mở frontend. Nếu không, trang sẽ không load được dữ liệu.

---

## 🔑 Biến Môi Trường (`.env`)

| Biến | Mô tả | Mặc định |
|------|-------|---------|
| `REACT_APP_API_URL` | URL của backend API | `http://localhost:8080` |
| `GENERATE_SOURCEMAP` | Tắt source map warning | `false` |

---

## 📁 Cấu Trúc Thư Mục

```
src/
├── api/                    # Axios API service layer
│   ├── auth-header.js      # Tự động thêm JWT vào headers
│   ├── auth-login.js       # Đăng nhập / Đăng ký / Đếm users
│   ├── booking.js          # CRUD Booking + upload CSV
│   ├── compartment.js      # Quản lý ngăn kệ + checkout
│   ├── notification.js     # Lấy & đánh dấu thông báo
│   ├── product.js          # CRUD hàng hóa
│   └── shelf.js            # CRUD kệ hàng
│
├── Components/             # Reusable components
│   ├── Booking/            # Form tạo booking mới
│   ├── CheckoutListReport/ # Bảng danh sách chờ xác nhận xuất kho
│   ├── Dashboard/          # Dashboard thống kê + Kho 3D (Three.js)
│   ├── DeliveryReport/     # Báo cáo giao hàng
│   ├── Footer/             # Footer layout
│   ├── Home/               # Trang chủ (Intro, Feature, Contact, Map)
│   ├── ItemInfo/           # Popup thông tin hàng hóa
│   ├── Loader/             # Loading spinner
│   ├── Model3D/            # 3D model components (Three.js/R3F)
│   ├── Navbar/             # Navigation bar
│   ├── Packaging/          # Đóng gói / phân kệ
│   ├── PopupItems/         # Popup danh sách items trong ngăn
│   ├── PrivateRoute/       # Route guard yêu cầu đăng nhập
│   ├── Product/            # Bảng hàng hóa + Edit form
│   └── WarehouseView/      # Giao diện xem kho hàng
│
└── pages/                  # Route-level pages
    ├── booking/            # Trang quản lý booking
    ├── home/               # Trang chủ (landing)
    ├── login/              # Trang đăng nhập
    ├── product/            # Trang danh sách hàng hóa
    ├── report/             # Trang báo cáo (Dashboard + Reports)
    └── warehouse/          # Trang xem kho 3D
```

---

## 🗺️ Routing

| URL | Trang | Yêu cầu đăng nhập |
|-----|-------|-------------------|
| `/` | Trang chủ (Landing page) | ❌ |
| `/login` | Đăng nhập | ❌ |
| `/warehouse` | Xem kho 3D + quản lý ngăn kệ | ✅ |
| `/booking` | Quản lý Booking + upload CSV | ✅ |
| `/product` | Danh sách hàng hóa | ✅ |
| `/report` | Dashboard thống kê | ✅ |
| `/report/reports/checkout-list` | Danh sách chờ xác nhận xuất kho | ✅ |
| `/report/reports/delivery-confirmation` | Phiếu giao hàng | ✅ |

---

## 🔐 Authentication Flow

```
1. User nhập username + password → POST /api/auth/signin
2. Backend trả về { accessToken, id, username, profileName, email }
3. Frontend lưu vào sessionStorage key "user"
4. Mọi request sau đó đều kèm header: Authorization: Bearer <token>
5. Logout → xóa sessionStorage["user"]
```

> **Lưu ý:** Dùng `sessionStorage` (không phải `localStorage`) — token mất khi đóng tab.

---

## 🏗️ Build Production

```bash
npm run build
```

Output tại thư mục `build/`. Deploy lên Vercel, Netlify, hoặc bất kỳ static host nào.

### Deploy lên Vercel

```bash
npm install -g vercel
vercel --prod
```

Cấu hình environment variable `REACT_APP_API_URL` trên Vercel dashboard trỏ về backend Render.

---

## 📚 Tài Liệu Liên Quan

| File | Nội dung |
|------|----------|
| [TECHSTACK.md](TECHSTACK.md) | Danh sách thư viện và lý do chọn |
| [../Backend-Warehouse/README.md](../Backend-Warehouse/README.md) | Backend Spring Boot |
| [../Backend-Warehouse/USER_GUIDE.md](../Backend-Warehouse/USER_GUIDE.md) | Hướng dẫn sử dụng cho người dùng |
