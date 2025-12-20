# API Call Flow - Quick Reference

## 📊 Sơ đồ luồng gọi API (API Call Flow Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                         COMPONENT                               │
│  (e.g., ProductListComponent, LoginComponent)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ inject & call method
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                │
│  (e.g., ProductService, AuthService)                            │
│  Location: src/app/core/services/*.service.ts                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ getEndpointFor()
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              APPLICATION CONFIG SERVICE                         │
│  Location: src/app/core/config/application-config.service.ts    │
│  - Combines base URL + API path                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────────┐          ┌──────────────────────────┐
│   API CONSTANTS      │          │   ENVIRONMENT CONFIG     │
│  api.constants.ts    │          │    environment.ts        │
│  - API paths         │          │    - SERVER_API_URL      │
└──────────────────────┘          └──────────────────────────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            │
                            ▼
                    Full API URL Created
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     HTTP CLIENT                                 │
│  Angular's HttpClient makes the actual HTTP request             │
│  - GET, POST, PUT, DELETE                                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP INTERCEPTORS                            │
│  - Add authentication token                                     │
│  - Handle errors                                                │
│  - Refresh token if expired                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  BACKEND API  │
                    │   (Server)    │
                    └───────────────┘
```

## 🔍 Ví dụ cụ thể: Đăng nhập (Login Example)

### Step 1: Component gọi service
```typescript
// File: src/app/pages/auth/login.component.ts
this.authService.authenticate(loginRequest, true).subscribe(
  auth => {
    // Handle success
  }
);
```

### Step 2: Service sử dụng config để tạo URL
```typescript
// File: src/app/core/services/auth.service.ts
const loginAPI = this.applicationConfigService.getEndpointFor(API_USERS_LOGIN);
// loginAPI = "http://localhost:8080/api/p/v1/users/authenticate"
```

### Step 3: Các nguồn dữ liệu

**API Constant:**
```typescript
// File: src/app/constants/api.constants.ts
export const API_PUBLIC = 'api/p/v1';
export const API_USERS_LOGIN = API_PUBLIC + '/users/authenticate';
// Result: "api/p/v1/users/authenticate"
```

**Environment Config:**
```typescript
// File: src/environments/environment.ts
export const environment = {
  production: false,
  SERVER_API_URL: 'http://localhost:8080'
};
```

### Step 4: Config Service kết hợp
```typescript
// File: src/app/core/config/application-config.service.ts
getEndpointFor(api: string): string {
  const prefix = 'http://localhost:8080';  // from environment
  const path = 'api/p/v1/users/authenticate';  // from constants
  return `${prefix}/${path}`;
  // Returns: "http://localhost:8080/api/p/v1/users/authenticate"
}
```

### Step 5: HTTP Request
```typescript
// File: src/app/core/services/auth.service.ts
return this.http.post<BaseResponse<Authentication>>(loginAPI, loginRequest);
// Makes POST request to: http://localhost:8080/api/p/v1/users/authenticate
```

## 📝 Tóm tắt các files quan trọng

| File | Mục đích | Ví dụ |
|------|----------|-------|
| `api.constants.ts` | Định nghĩa đường dẫn API | `API_USERS_LOGIN = 'api/p/v1/users/authenticate'` |
| `environment.ts` | Cấu hình base URL | `SERVER_API_URL: 'http://localhost:8080'` |
| `application-config.service.ts` | Kết hợp base URL + path | `getEndpointFor(API_USERS_LOGIN)` |
| `*.service.ts` | Thực hiện HTTP calls | `this.http.post(url, data)` |
| Components | Gọi services | `this.authService.authenticate()` |

## 🎯 Cách tìm API call nhanh nhất

### Phương pháp 1: Tìm theo chức năng
1. Biết chức năng cần tìm (VD: đăng nhập)
2. Mở `api.constants.ts` → Tìm `API_USERS_LOGIN`
3. Search constant này trong project
4. Tìm thấy trong `auth.service.ts`

### Phương pháp 2: Tìm theo service
1. Biết feature (VD: Products)
2. Mở `product.service.ts`
3. Xem các methods: `getAll()`, `getById()`, `create()`, etc.

### Phương pháp 3: Search toàn project
```bash
# Tìm tất cả HTTP calls
grep -r "this.http\." src/app/core/services/

# Tìm service cụ thể
find src/app/core/services -name "product.service.ts"
```

## 🔐 Authentication Flow

```
Login → Receive Token → Store in localStorage → Interceptor adds to headers → All API calls authenticated
```

## 📦 Danh sách đầy đủ các Services

1. **auth.service.ts** - Đăng nhập, đăng xuất, refresh token
2. **product.service.ts** - CRUD sản phẩm
3. **category.service.ts** - CRUD danh mục
4. **order.service.ts** - Quản lý đơn hàng
5. **payment.service.ts** - Thanh toán
6. **shop.service.ts** - Quản lý shop
7. **voucher.service.ts** - Quản lý voucher
8. **users.service.ts** - Quản lý user
9. **roles.service.ts** - Phân quyền
10. **cart.service.ts** - Giỏ hàng
11. **balance.service.ts** - Số dư tài khoản
12. **product-group.service.ts** - Nhóm sản phẩm
13. **gateway-security.service.ts** - Bảo mật gateway
14. **report.service.ts** - Báo cáo, thống kê
15. **websocket.service.ts** - Real-time communication
16. **state-storage.service.ts** - Lưu trữ state local

## 💡 Lưu ý quan trọng

- ✅ Tất cả API calls đều qua service layer
- ✅ Constants giúp dễ maintain và refactor
- ✅ Environment config cho multiple environments
- ✅ HTTP Interceptors tự động add authentication
- ✅ RxJS Observables để handle async operations
- ✅ BaseResponse<T> format thống nhất

## 🚀 Để biết thêm chi tiết

Xem tài liệu đầy đủ tại:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Tiếng Việt
- [API_DOCUMENTATION_EN.md](./API_DOCUMENTATION_EN.md) - English
