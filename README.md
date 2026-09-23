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
│   ├── admin.js            # Quản lý tài khoản & thống kê hệ thống (Admin)
│   ├── api-client.js       # Axios client dùng chung với JWT interceptor
│   ├── auth-header.js      # Tự động thêm JWT vào headers
│   ├── auth-login.js       # Đăng nhập / Đăng ký / Đếm users
│   ├── booking.js          # CRUD Booking + upload CSV
│   ├── compartment.js      # Quản lý ngăn kệ + checkout
│   ├── notification.js     # Lấy & đánh dấu thông báo
│   ├── product.js          # CRUD hàng hóa
│   └── shelf.js            # CRUD kệ hàng
│
├── Components/             # Reusable components
│   ├── Booking/            # Form tạo booking mới & bảng booking
│   ├── CheckoutListReport/ # Bảng danh sách chờ xác nhận xuất kho
│   ├── Dashboard/          # Dashboard thống kê + Kho 3D (Three.js)
│   ├── DeliveryReport/     # Báo cáo giao hàng
│   ├── Footer/             # Footer layout
│   ├── Home/               # Trang chủ (Intro, Feature, Contact, Map)
│   ├── ItemInfo/           # Popup thông tin hàng hóa
│   ├── Loader/             # Loading spinner
│   ├── Model3D/            # 3D model components (Three.js/R3F)
│   ├── Navbar/             # Navigation bar (responsive, dark mode)
│   ├── Packaging/          # Đóng gói / phân kệ
│   ├── PopupItems/         # Popup danh sách items trong ngăn
│   ├── PrivateRoute/       # Route guard yêu cầu đăng nhập
│   ├── Product/            # Bảng hàng hóa + Edit form
│   └── WarehouseView/      # Giao diện xem kho hàng
│
└── pages/                  # Route-level pages
    ├── admin/              # Trang Quản Trị Viên (Quản lý User & Thống kê hệ thống)
    ├── booking/            # Trang quản lý booking
    ├── home/               # Trang chủ (landing)
    ├── login/              # Trang đăng nhập
    ├── product/            # Trang danh sách hàng hóa
    ├── report/             # Trang báo cáo (Dashboard + Reports)
    └── warehouse/          # Trang xem kho 3D
```

---

## 🗺️ Routing

| URL | Trang | Quyền truy cập |
|-----|-------|----------------|
| `/` | Trang chủ (Landing page) | Mọi người |
| `/login` | Đăng nhập | Mọi người |
| `/warehouse` | Xem kho 3D + quản lý ngăn kệ | Đã đăng nhập |
| `/booking` | Quản lý Booking + upload CSV | Đã đăng nhập |
| `/product` | Danh sách hàng hóa | Đã đăng nhập |
| `/report` | Dashboard thống kê | Đã đăng nhập |
| `/report/reports/checkout-list` | Danh sách chờ xác nhận xuất kho | Đã đăng nhập |
| `/report/reports/delivery-confirmation` | Phiếu giao hàng | Đã đăng nhập |
| `/admin` | Quản Trị Viên (Nhân viên, Thống kê HT) | Chỉ **ROLE_ADMIN** |

---

## 🔐 Authentication Flow

```
1. User nhập username + password → POST /api/auth/signin
2. Backend trả về { accessToken, id, username, profileName, email, role }
3. Frontend lưu vào sessionStorage key "user"
4. Shared Axios Interceptor (api-client.js) tự động gán Authorization: Bearer <token>
5. Navbar tự động hiển thị tab "Quản Trị Viên" nếu role === "ROLE_ADMIN"
6. Logout → xóa sessionStorage["user"] và chuyển về trang chủ
```


> **Lưu ý:** Dùng `sessionStorage` (không phải `localStorage`) — token mất khi đóng tab.

---

## 🏗️ Build Production

```bash
npm run build
```

> Build script dùng `cross-env CI=false GENERATE_SOURCEMAP=false` để tránh lỗi ESLint khi deploy trên CI/CD.

Output tại thư mục `build/`. Deploy lên Vercel, Netlify, hoặc bất kỳ static host nào.

### Deploy lên Vercel

1. Push code lên GitHub
2. Kết nối repo tại [vercel.com](https://vercel.com) → **New Project**
3. Framework Preset: **Create React App**
4. **Không cần** set `REACT_APP_API_URL` trên Vercel Dashboard — file `.env.production` trong repo đã chứa URL backend Render

```bash
# .env.production (đã commit vào repo, không chứa secret)
REACT_APP_API_URL=https://wms-backend-iu98.onrender.com
GENERATE_SOURCEMAP=false
```

> ⚠️ Nếu đổi backend URL, chỉnh `.env.production` rồi push lại — Vercel tự re-deploy.



---

## 📚 Tài Liệu Liên Quan
|------|----------|
| [TECHSTACK.md](TECHSTACK.md) | Danh sách thư viện và lý do chọn |
| [../Backend-Warehouse/README.md](../Backend-Warehouse/README.md) | Backend Spring Boot |
| [../Backend-Warehouse/USER_GUIDE.md](../Backend-Warehouse/USER_GUIDE.md) | Hướng dẫn sử dụng cho người dùng |
