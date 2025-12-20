# API Calls Documentation - ARS Frontend

## 📍 Location of API Calls

This is an Angular application, and API calls are organized with a clear architecture using separate layers.

---

## 1. 🗂️ API Constants

**File:** `src/app/constants/api.constants.ts`

This is where **all API endpoint paths** are defined in the application.

### Structure:
```typescript
export const API_SECURE = 'api/v1';        // API requiring authentication
export const API_PUBLIC = 'api/p/v1';      // Public API, no authentication needed
```

### Main API Endpoints:

#### 👤 User APIs
- `API_USERS_LOGIN` - User login
- `API_USERS_LOGOUT` - User logout
- `API_USERS_REFRESH` - Refresh token
- `API_USERS_STATUS` - User status
- `API_USERS_REGISTER` - User registration
- `API_USERS_CHANGE_PASSWORD` - Change password
- `API_USERS_CHANGE_EMAIL` - Change email

#### 📦 Product APIs
- `API_PRODUCT` - Product management (secure)
- `API_PRODUCT_PUBLIC` - View products (public)
- `API_PRODUCT_GROUP` - Product groups
- `API_CATEGORY` - Product categories

#### 🛒 Order APIs
- `API_ORDER` - Order management
- `API_ORDER_BY_USER` - Orders by user
- `API_ORDER_BY_SHOP` - Orders by shop

#### 🏪 Shop APIs
- `API_SHOP` - Shop management

#### 🎟️ Voucher APIs
- `API_VOUCHER` - Voucher management (secure)
- `API_VOUCHER_PUBLIC` - View vouchers (public)

#### 🔐 Role & Permission APIs
- `API_ROLES` - Role management
- `API_ROLES_PERMISSIONS_TREE` - Permission tree

#### 💳 Payment APIs
- `API_PAYMENT` - Payment processing (secure)
- `API_PAYMENT_PUBLIC` - Payment information (public)

#### 📊 Report & Statistics APIs
- `API_REPORT` - Reports
- `API_REVENUES` - Revenue data
- `API_SALES_LAST_SEVEN_DAY` - Sales for last 7 days

#### 💰 Balance APIs
- `API_BALANCE` - Balance management
- `API_BALANCE_FOR_SHOP` - Shop balance
- `API_BALANCE_FOR_ADMIN` - Admin balance

#### 🔒 Security Gateway APIs
- `RATE_LIMITER_API` - Request rate limiting
- `PUBLIC_PATTERNS_CONFIG_API` - Public patterns configuration

---

## 2. ⚙️ Application Config Service

**File:** `src/app/core/config/application-config.service.ts`

This service **manages the base URL** and provides a method to create full URLs for API endpoints.

### Main Function:

```typescript
getEndpointFor(api: string): string
```

**How it works:**
- Gets `SERVER_API_URL` from environment configuration
- Combines with API path from constants
- Ensures no missing or duplicate "/" characters

**Example:**
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

Configure **SERVER_API_URL** for each environment:

```typescript
export const environment = {
  production: false,
  SERVER_API_URL: ''  // Can be '', 'http://localhost:8080', or full URL
};
```

---

## 4. 🔧 Service Layer

**Directory:** `src/app/core/services/`

This is where **actual HTTP calls** are made to the backend API.

### 📋 List of Services:

| Service File | Description | API Endpoints Used |
|-------------|-------------|-------------------|
| `auth.service.ts` | Authentication & session management | API_USERS_LOGIN, API_USERS_LOGOUT, API_USERS_REFRESH, API_USERS_STATUS, API_USERS_REGISTER |
| `product.service.ts` | Product management | API_PRODUCT, API_PRODUCT_PUBLIC |
| `category.service.ts` | Category management | API_CATEGORY, API_CATEGORY_PUBLIC |
| `order.service.ts` | Order management | API_ORDER, API_ORDER_BY_USER, API_ORDER_BY_SHOP |
| `payment.service.ts` | Payment processing | API_PAYMENT, API_PAYMENT_PUBLIC |
| `shop.service.ts` | Shop management | API_SHOP |
| `voucher.service.ts` | Voucher management | API_VOUCHER, API_VOUCHER_PUBLIC |
| `users.service.ts` | User management | API_USERS |
| `roles.service.ts` | Role & permission management | API_ROLES, API_ROLES_PERMISSIONS_TREE |
| `cart.service.ts` | Shopping cart management | (Local storage + Order API) |
| `balance.service.ts` | Balance management | API_BALANCE, API_BALANCE_FOR_SHOP, API_BALANCE_FOR_ADMIN |
| `product-group.service.ts` | Product groups | API_PRODUCT_GROUP, API_PRODUCT_GROUP_PUBLIC |
| `gateway-security.service.ts` | Security configuration | RATE_LIMITER_API, PUBLIC_PATTERNS_CONFIG_API |
| `report.service.ts` | Reports and statistics | API_REPORT, API_REVENUES, API_SALES_LAST_SEVEN_DAY |
| `websocket.service.ts` | Real-time communication | WebSocket endpoints |
| `state-storage.service.ts` | Local state storage | (LocalStorage) |

---

## 5. 💡 How It Works - Examples

### Example 1: Login Request

```typescript
// File: src/app/core/services/auth.service.ts

getAuthenticate(loginRequest?: LoginRequest): Observable<Authentication | null> {
  // 1. Get API path from constants
  const loginAPI = this.applicationConfigService.getEndpointFor(API_USERS_LOGIN);
  
  // 2. Execute HTTP POST request
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

**Workflow:**
1. `API_USERS_LOGIN` = `'api/p/v1/users/authenticate'` (from api.constants.ts)
2. `applicationConfigService.getEndpointFor()` combines with base URL
3. Result: `'http://localhost:8080/api/p/v1/users/authenticate'`
4. Execute POST request with HttpClient

### Example 2: Get Products

```typescript
// File: src/app/core/services/product.service.ts

getAllWithPaging(request: ProductsFilter): Observable<BaseResponse<Product[]>> {
  const params = createSearchRequestParams(request);
  return this.http.get<BaseResponse<Product[]>>(this.productPublicAPI, {params: params});
}
```

**Workflow:**
1. `API_PRODUCT_PUBLIC` = `'api/p/v1/products'`
2. Combine with base URL
3. Add query parameters (pagination, filters)
4. Execute GET request

### Example 3: Create Product (with FormData)

```typescript
// File: src/app/core/services/product.service.ts

createProduct(request: CreateProductRequest): Observable<BaseResponse<any>> {
  const formData = new FormData();
  this.utilService.buildFormData(formData, request);
  return this.http.post<BaseResponse<any>>(this.productAPI, formData);
}
```

**Features:**
- Uses FormData to upload files (product images)
- POST to secure endpoint (requires authentication)

---

## 6. 🔑 Authentication Flow

### Token Management:
1. **Login** → Receive `accessToken` from server
2. **Store** → Save token to `localStorage`
3. **Interceptor** → Automatically add token to all requests (HTTP Interceptor)
4. **Refresh** → Auto-refresh when token expires
5. **Logout** → Remove token and clear data

---

## 7. 🛠️ Usage in Components

### Inject service into component:

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

## 8. 📝 Naming Conventions

### API Constants:
- `API_*` - Secure endpoint (requires authentication)
- `API_*_PUBLIC` - Public endpoint (no authentication required)

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

## 9. 🔍 How to Find API Calls Quickly

### Find by Feature:
1. **Identify the feature** you need (e.g., login, products, orders)
2. **Open constants file**: `src/app/constants/api.constants.ts`
3. **Find the constant** (e.g., `API_USERS_LOGIN`)
4. **Search in project** to find where the constant is used
5. **Open service file** to see the implementation

### Find by File:
```bash
# Find all service files
find src/app/core/services -name "*.service.ts"

# Search for API calls in code
grep -r "http.get\|http.post\|http.put\|http.delete" src/app/core/services/
```

---

## 10. 📚 Additional Resources

- **Angular HttpClient**: https://angular.io/guide/http
- **RxJS Observables**: https://rxjs.dev/guide/overview
- **TypeScript**: https://www.typescriptlang.org/

---

## 📞 Contact

If you have questions about API calls, please check:
1. Constants file for endpoint paths
2. Corresponding service file for implementation
3. Environment configuration for base URL

---

**Notes:** 
- All API calls use Angular's HttpClient
- Response format is standardized: `BaseResponse<T>`
- Authentication is handled automatically by HTTP Interceptors
- Errors are handled using RxJS operators (catchError, retry, etc.)
