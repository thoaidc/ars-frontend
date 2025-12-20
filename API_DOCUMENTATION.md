# Tài Liệu API Calls - ARS Frontend

## 📍 Vị trí các đoạn gọi API

Dự án này là một ứng dụng Angular, và các API calls được tổ chức theo kiến trúc rõ ràng với các tầng riêng biệt.

---

## 1. 🗂️ API Constants (Hằng số API)

**File:** `src/app/constants/api.constants.ts`

Đây là nơi **định nghĩa tất cả các đường dẫn API endpoint** trong ứng dụng.

### Cấu trúc:
```typescript
export const API_SECURE = 'api/v1';        // API yêu cầu authentication
export const API_PUBLIC = 'api/p/v1';      // API công khai, không cần authentication
```

### Các API Endpoints chính:

#### 👤 User APIs
- `API_USERS_LOGIN` - Đăng nhập
- `API_USERS_LOGOUT` - Đăng xuất
- `API_USERS_REFRESH` - Refresh token
- `API_USERS_STATUS` - Trạng thái người dùng
- `API_USERS_REGISTER` - Đăng ký tài khoản
- `API_USERS_CHANGE_PASSWORD` - Đổi mật khẩu
- `API_USERS_CHANGE_EMAIL` - Đổi email

#### 📦 Product APIs
- `API_PRODUCT` - Quản lý sản phẩm (secure)
- `API_PRODUCT_PUBLIC` - Xem sản phẩm (public)
- `API_PRODUCT_GROUP` - Nhóm sản phẩm
- `API_CATEGORY` - Danh mục sản phẩm

#### 🛒 Order APIs
- `API_ORDER` - Quản lý đơn hàng
- `API_ORDER_BY_USER` - Đơn hàng theo user
- `API_ORDER_BY_SHOP` - Đơn hàng theo shop

#### 🏪 Shop APIs
- `API_SHOP` - Quản lý cửa hàng

#### 🎟️ Voucher APIs
- `API_VOUCHER` - Quản lý voucher (secure)
- `API_VOUCHER_PUBLIC` - Xem voucher (public)

#### 🔐 Role & Permission APIs
- `API_ROLES` - Quản lý roles
- `API_ROLES_PERMISSIONS_TREE` - Cây phân quyền

#### 💳 Payment APIs
- `API_PAYMENT` - Xử lý thanh toán (secure)
- `API_PAYMENT_PUBLIC` - Thông tin thanh toán (public)

#### 📊 Report & Statistics APIs
- `API_REPORT` - Báo cáo
- `API_REVENUES` - Doanh thu
- `API_SALES_LAST_SEVEN_DAY` - Doanh số 7 ngày

#### 💰 Balance APIs
- `API_BALANCE` - Quản lý số dư
- `API_BALANCE_FOR_SHOP` - Số dư của shop
- `API_BALANCE_FOR_ADMIN` - Số dư admin

#### 🔒 Security Gateway APIs
- `RATE_LIMITER_API` - Giới hạn tốc độ request
- `PUBLIC_PATTERNS_CONFIG_API` - Cấu hình public patterns

---

## 2. ⚙️ Application Config Service

**File:** `src/app/core/config/application-config.service.ts`

Service này **quản lý base URL** và cung cấp method để tạo full URL cho các API endpoint.

### Chức năng chính:

```typescript
getEndpointFor(api: string): string
```

**Cách hoạt động:**
- Lấy `SERVER_API_URL` từ environment configuration
- Kết hợp với API path từ constants
- Đảm bảo không có dấu "/" thừa hoặc thiếu

**Ví dụ:**
```typescript
// Input: 'api/v1/users'
// Output: 'http://localhost:8080/api/v1/users' (development)
// Output: 'https://api.production.com/api/v1/users' (production)
```

---

## 3. 🌍 Environment Configuration

**Files:** 
- `src/environments/environment.ts` (Development)
- `src/environments/environment.prod.ts` (Production)

Cấu hình **SERVER_API_URL** cho từng môi trường:

```typescript
export const environment = {
  production: false,
  SERVER_API_URL: ''  // Có thể là '', 'http://localhost:8080', hoặc full URL
};
```

---

## 4. 🔧 Service Layer (Tầng Service)

**Thư mục:** `src/app/core/services/`

Đây là nơi **thực hiện các HTTP calls thực tế** đến backend API.

### 📋 Danh sách các Services:

| Service File | Mô tả | API Endpoints sử dụng |
|-------------|-------|----------------------|
| `auth.service.ts` | Xác thực & quản lý phiên đăng nhập | API_USERS_LOGIN, API_USERS_LOGOUT, API_USERS_REFRESH, API_USERS_STATUS, API_USERS_REGISTER |
| `product.service.ts` | Quản lý sản phẩm | API_PRODUCT, API_PRODUCT_PUBLIC |
| `category.service.ts` | Quản lý danh mục | API_CATEGORY, API_CATEGORY_PUBLIC |
| `order.service.ts` | Quản lý đơn hàng | API_ORDER, API_ORDER_BY_USER, API_ORDER_BY_SHOP |
| `payment.service.ts` | Xử lý thanh toán | API_PAYMENT, API_PAYMENT_PUBLIC |
| `shop.service.ts` | Quản lý cửa hàng | API_SHOP |
| `voucher.service.ts` | Quản lý voucher | API_VOUCHER, API_VOUCHER_PUBLIC |
| `users.service.ts` | Quản lý người dùng | API_USERS |
| `roles.service.ts` | Quản lý phân quyền | API_ROLES, API_ROLES_PERMISSIONS_TREE |
| `cart.service.ts` | Quản lý giỏ hàng | (Local storage + Order API) |
| `balance.service.ts` | Quản lý số dư | API_BALANCE, API_BALANCE_FOR_SHOP, API_BALANCE_FOR_ADMIN |
| `product-group.service.ts` | Nhóm sản phẩm | API_PRODUCT_GROUP, API_PRODUCT_GROUP_PUBLIC |
| `gateway-security.service.ts` | Cấu hình bảo mật | RATE_LIMITER_API, PUBLIC_PATTERNS_CONFIG_API |
| `report.service.ts` | Báo cáo thống kê | API_REPORT, API_REVENUES, API_SALES_LAST_SEVEN_DAY |
| `websocket.service.ts` | Real-time communication | WebSocket endpoints |
| `state-storage.service.ts` | Lưu trữ state local | (LocalStorage) |

---

## 5. 💡 Ví dụ cách hoạt động

### Ví dụ 1: Login Request

```typescript
// File: src/app/core/services/auth.service.ts

getAuthenticate(loginRequest?: LoginRequest): Observable<Authentication | null> {
  // 1. Lấy API path từ constants
  const loginAPI = this.applicationConfigService.getEndpointFor(API_USERS_LOGIN);
  
  // 2. Thực hiện HTTP POST request
  return this.http.post<BaseResponse<Authentication>>(loginAPI, loginRequest).pipe(
    map(response => {
      if (response.status && response.result) {
        return response.result as Authentication;
      }
      return null;
    }),
    catchError(() => of(null))
  );
}
```

**Luồng hoạt động:**
1. `API_USERS_LOGIN` = `'api/p/v1/users/authenticate'` (từ api.constants.ts)
2. `applicationConfigService.getEndpointFor()` kết hợp với base URL
3. Kết quả: `'http://localhost:8080/api/p/v1/users/authenticate'`
4. Thực hiện POST request với HttpClient

### Ví dụ 2: Get Products

```typescript
// File: src/app/core/services/product.service.ts

getAllWithPaging(request: ProductsFilter): Observable<BaseResponse<Product[]>> {
  const params = createSearchRequestParams(request);
  return this.http.get<BaseResponse<Product[]>>(this.productPublicAPI, {params: params});
}
```

**Luồng hoạt động:**
1. `API_PRODUCT_PUBLIC` = `'api/p/v1/products'`
2. Kết hợp với base URL
3. Thêm query parameters (pagination, filters)
4. Thực hiện GET request

### Ví dụ 3: Create Product (với FormData)

```typescript
// File: src/app/core/services/product.service.ts

createProduct(request: CreateProductRequest): Observable<BaseResponse<any>> {
  const formData = new FormData();
  this.utilService.buildFormData(formData, request);
  return this.http.post<BaseResponse<any>>(this.productAPI, formData);
}
```

**Đặc điểm:**
- Sử dụng FormData để upload file (hình ảnh sản phẩm)
- POST đến secure endpoint (yêu cầu authentication)

---

## 6. 🔑 Authentication Flow

### Token Management:
1. **Login** → Nhận `accessToken` từ server
2. **Store** → Lưu token vào `localStorage`
3. **Interceptor** → Tự động thêm token vào mọi request (HTTP Interceptor)
4. **Refresh** → Khi token hết hạn, tự động refresh
5. **Logout** → Xóa token và clear data

---

## 7. 🛠️ Cách sử dụng trong Components

### Inject service vào component:

```typescript
import { ProductService } from '@core/services/product.service';

export class ProductListComponent {
  constructor(private productService: ProductService) {}
  
  loadProducts() {
    this.productService.getAllWithPaging({
      page: 0,
      size: 10
    }).subscribe(response => {
      if (response.status) {
        this.products = response.result;
      }
    });
  }
}
```

---

## 8. 📝 Quy ước đặt tên

### API Constants:
- `API_*` - Secure endpoint (cần authentication)
- `API_*_PUBLIC` - Public endpoint (không cần authentication)

### Services:
- `*.service.ts` - Service files
- Method names: `getAll()`, `getById()`, `create()`, `update()`, `delete()`

### Response Model:
```typescript
interface BaseResponse<T> {
  status: boolean;
  result?: T;
  message?: string;
}
```

---

## 9. 🔍 Cách tìm API call nhanh

### Tìm theo chức năng:
1. **Xác định chức năng** cần tìm (ví dụ: login, products, orders)
2. **Mở file constants**: `src/app/constants/api.constants.ts`
3. **Tìm constant** tương ứng (ví dụ: `API_USERS_LOGIN`)
4. **Search trong project** để tìm nơi constant được sử dụng
5. **Mở service file** tương ứng để xem implementation

### Tìm theo file:
```bash
# Tìm tất cả service files
find src/app/core/services -name "*.service.ts"

# Search API calls trong code
grep -r "http.get\|http.post\|http.put\|http.delete" src/app/core/services/
```

---

## 10. 📚 Tài liệu bổ sung

- **Angular HttpClient**: https://angular.io/guide/http
- **RxJS Observables**: https://rxjs.dev/guide/overview
- **TypeScript**: https://www.typescriptlang.org/

---

## 📞 Liên hệ

Nếu có thắc mắc về API calls, vui lòng kiểm tra:
1. File constants để biết endpoint path
2. Service file tương ứng để xem implementation
3. Environment configuration để kiểm tra base URL

---

**Lưu ý:** 
- Tất cả API calls đều sử dụng HttpClient của Angular
- Response format thống nhất: `BaseResponse<T>`
- Authentication được xử lý tự động bởi HTTP Interceptors
- Errors được handle bằng RxJS operators (catchError, retry, etc.)
