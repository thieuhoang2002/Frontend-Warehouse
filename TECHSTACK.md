# 🛠️ Tech Stack — WMS Frontend

## Core Framework

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **React** | 18.3.1 | UI framework chính, component-based |
| **React DOM** | 18.2.0 | Render React vào browser DOM |
| **React Router DOM** | v6.25 | Client-side routing, SPA navigation |
| **React Scripts (CRA)** | 5.0.1 | Build toolchain (Webpack, Babel, ESLint) |

## UI & Styling

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **MUI (Material UI)** | v6 | Component library: Button, Table, Dialog, DataGrid |
| **MUI Icons** | v6 | Icon set |
| **MUI X DataGrid** | 7.18 | Bảng dữ liệu nâng cao (sort, filter, pagination) |
| **MUI X DatePickers** | 7.22 | Date picker component |
| **Emotion React/Styled** | v11 | CSS-in-JS engine cho MUI |
| **Styled Components** | v6 | CSS-in-JS alternative |
| **Framer Motion** | 6.5 | Animation library (Home page transitions) |
| **SASS** | 1.77 | CSS preprocessor |
| **Fontsource Montserrat** | v5 | Font chữ Montserrat (self-hosted) |
| **FontAwesome** | 6.7 | Icon library bổ sung |
| **React Icons** | 5.3 | Tổng hợp icon từ nhiều bộ |
| **Swiper** | 8.4 | Slider/Carousel component |
| **SweetAlert2** | 11.14 | Popup thông báo đẹp |

## 3D Visualization

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **Three.js** | 0.166 | 3D graphics engine |
| **@react-three/fiber** | 8.16 | React renderer cho Three.js |
| **@react-three/drei** | 9.108 | Helper components cho R3F (OrbitControls, Text, Grid...) |

> **Tại sao Three.js?** Để hiển thị kho hàng dạng 3D trực quan, người dùng có thể xoay, zoom, click vào từng ngăn kệ để xem/thao tác hàng hóa.

## HTTP & Real-time

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **Axios** | 1.7.5 | HTTP client, gọi REST API backend |
| **@stomp/stompjs** | 7.0 | STOMP protocol client cho WebSocket |
| **SockJS Client** | 1.6 | WebSocket fallback transport |
| **Socket.io Client** | 4.8 | WebSocket alternative (nếu dùng) |

## Charts & Reports

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **Chart.js** | 4.4 | Biểu đồ (Bar, Line, Pie) |
| **React ChartJS 2** | 5.2 | Wrapper React cho Chart.js |
| **React Zoom Pan Pinch** | 3.6 | Zoom/pan cho bản đồ kho |

## Forms & Validation

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **React Validation** | 3.0 | Form validation |
| **Validator** | 13.12 | String validation helpers |
| **React Dropzone** | 14.2 | Drag-and-drop file upload (CSV) |
| **Dayjs** | 1.11 | Date manipulation nhẹ hơn Moment |
| **Moment** | 2.30 | Date formatting (legacy, đang dùng) |

## QR Code

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **QRCode.react** | 4.1 | Tạo QR code cho từng ngăn kệ |
| **QRCode** | 1.5 | QR code generation library |

## Email

| Thư viện | Phiên bản | Mục đích |
|---------|-----------|---------|
| **EmailJS** | 4.0 | Gửi email từ frontend (form liên hệ) |
| **EmailJS-COM** | 3.2 | EmailJS legacy SDK |

## Dev Dependencies

| Thư viện | Mục đích |
|---------|---------|
| **cross-env** | Set env vars cross-platform khi build |
| **@babel/plugin-proposal-private-property-in-object** | Fix Babel warning với CRA 5 |

---

## Tại Sao Chọn Stack Này?

### React 18 + CRA
- React 18 hỗ trợ Concurrent Mode, Suspense, automatic batching
- CRA giúp setup zero-config, phù hợp đồ án không cần custom Webpack

### MUI v6
- Component system phong phú, bao gồm DataGrid mạnh mẽ
- Theme system nhất quán, responsive by default
- v6 hỗ trợ tốt React 18

### Three.js / React Three Fiber
- Điểm đặc biệt nhất của dự án: **kho hàng 3D**
- R3F cho phép viết Three.js theo cú pháp React component, dễ maintain
- @react-three/drei cung cấp OrbitControls, Text, Grid sẵn có

### STOMP + WebSocket
- Backend Spring Boot dùng STOMP/SockJS cho notification
- @stomp/stompjs là client chính thức, tương thích hoàn hảo với Spring WebSocket
