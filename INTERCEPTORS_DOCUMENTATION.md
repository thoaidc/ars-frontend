# HTTP Interceptors Documentation

## 📋 Tổng quan (Overview)

HTTP Interceptors là middleware chạy tự động cho **mọi HTTP request và response** trong ứng dụng. Chúng nằm giữa Component/Service và Backend API, xử lý các tác vụ như authentication, error handling, và logging.

**Location:** `src/app/core/interceptors/`

---

## 🔧 Các Interceptors trong dự án

### 1. API Interceptor (`api.interceptor.ts`)

**Chức năng chính:**
- ✅ Tự động thêm **Authorization header** (Bearer token) vào mọi API request
- ✅ Thêm **Accept-Language header** dựa trên ngôn ngữ hiện tại
- ✅ Enable **credentials** cho CORS requests
- ✅ Hiển thị error messages qua Toastr

**Code snippet:**
```typescript
export const ApiInterceptorFn: HttpInterceptorFn = (request, next) => {
  const isApiRequest = request.url.startsWith(appConfig.getEndpointFor('api'));
  
  if (isApiRequest) {
    const token = localStorage.getItem(LOCAL_USER_TOKEN_KEY);
    
    modifiedReq = request.clone({
      withCredentials: true,
      setHeaders: {
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        'Accept-Language': langKey
      }
    });
  }
  
  return next(modifiedReq).pipe(
    tap({
      error: (error) => toast.error(error.message)
    })
  );
};
```

**Khi nào chạy:**
- Trước mỗi HTTP request đến API endpoint
- Sau mỗi HTTP response (để handle errors)

**Headers được thêm:**
```
Authorization: Bearer <token>
Accept-Language: vi | en
Credentials: include
```

---

### 2. Auth Expired Interceptor (`auth-expired.interceptor.ts`)

**Chức năng chính:**
- ✅ Bắt **401 Unauthorized** errors
- ✅ Tự động **refresh access token** khi hết hạn
- ✅ **Retry** request ban đầu với token mới
- ✅ **Logout** user nếu refresh token cũng hết hạn
- ✅ Lưu previous page để redirect sau khi login

**Code snippet:**
```typescript
export const AuthExpiredInterceptorFn: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !error.url?.includes(API_USERS_LOGIN)) {
        if (error.url?.includes(API_USERS_REFRESH)) {
          // Refresh token expired -> logout
          doLogout();
        }
        
        // Try refreshing token
        return authService.refreshTokenShared().pipe(
          switchMap((newToken) => {
            if (newToken) {
              // Retry request with new token
              const retryReq = request.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            }
            doLogout();
          })
        );
      }
      return throwError(() => error);
    })
  );
};
```

**Flow xử lý 401 Error:**
```
1. Request → 401 Error
2. Check if login/refresh endpoint → No
3. Call refreshToken() API
4. Success?
   Yes → Retry original request with new token
   No → Logout user & redirect to login
```

**Exceptions (không refresh):**
- Login endpoint (`API_USERS_LOGIN`)
- Refresh endpoint itself (`API_USERS_REFRESH`)

---

### 3. Fingerprint Interceptor (`fingerprint.interceptor.ts`)

**Chức năng chính:**
- ✅ Tạo và gửi **device fingerprint** với mỗi request
- ✅ Giúp backend track và verify thiết bị
- ✅ Tăng cường bảo mật (detect suspicious activities)

**Note:** Sử dụng @fingerprintjs/fingerprintjs library

---

## 🔄 Luồng hoạt động của Interceptors

```
                     HTTP Request
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│        1. Fingerprint Interceptor               │
│           Add device fingerprint                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│        2. API Interceptor                       │
│           Add Authorization & Language headers  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
            Backend API Server
                  │
                  ▼
              HTTP Response
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│        3. Auth Expired Interceptor              │
│           Handle 401, auto refresh token        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│        4. API Interceptor (Error Handler)       │
│           Show error toast messages             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
            Component/Service
```

---

## 💡 Ví dụ thực tế

### Ví dụ 1: Request thành công với token

```
User clicks "Get Products" button
   ↓
ProductService.getAllWithPaging()
   ↓
HttpClient.get('/api/v1/products')
   ↓
Fingerprint Interceptor: Add X-Device-Id header
   ↓
API Interceptor: Add headers
   - Authorization: Bearer eyJhbGc...
   - Accept-Language: vi
   - Credentials: include
   ↓
Backend API (Success - 200)
   ↓
Response returns to service
   ↓
Component displays products
```

### Ví dụ 2: Token hết hạn, auto refresh

```
User clicks "Get Orders" button
   ↓
OrderService.getOrders()
   ↓
HttpClient.get('/api/v1/orders')
   ↓
[Interceptors add headers]
   ↓
Backend API (401 Unauthorized - Token expired)
   ↓
Auth Expired Interceptor catches 401
   ↓
Call authService.refreshTokenShared()
   ↓
POST /api/p/v1/users/refresh-token
   ↓
Receive new access token
   ↓
Store new token in localStorage
   ↓
Retry original request: GET /api/v1/orders
   - Authorization: Bearer [NEW_TOKEN]
   ↓
Backend API (Success - 200)
   ↓
Response returns to service
   ↓
Component displays orders
```

**User không thấy gì:** Process này diễn ra tự động, transparent!

### Ví dụ 3: Refresh token cũng hết hạn

```
User clicks button
   ↓
[HTTP Request]
   ↓
Backend API (401 Unauthorized)
   ↓
Auth Expired Interceptor tries refresh
   ↓
POST /api/p/v1/users/refresh-token
   ↓
Backend (401 - Refresh token expired)
   ↓
Auth Expired Interceptor:
   - Call authService.logout()
   - Clear localStorage
   - Save current URL to stateStorage
   - Navigate to /login
   ↓
User sees login page
```

**After login:** User tự động redirect về page ban đầu!

---

## 🔑 Token Management Flow

### Storage Location
```typescript
// Token được lưu trong localStorage
localStorage.setItem(LOCAL_USER_TOKEN_KEY, token);
localStorage.getItem(LOCAL_USER_TOKEN_KEY);
```

### Token Lifecycle
```
1. Login → Receive tokens
   - Access Token (short-lived, ~15 min)
   - Refresh Token (long-lived, ~7 days)

2. Store in localStorage
   - LOCAL_USER_TOKEN_KEY = access token
   
3. Every API request
   - Interceptor auto adds: Authorization: Bearer <token>
   
4. Token expires
   - Backend returns 401
   - Auto refresh with refresh token
   - Get new access token
   - Retry original request
   
5. Refresh token expires
   - Logout user
   - Redirect to login
```

---

## 🛡️ Security Features

### 1. Automatic Token Management
- Không cần manually thêm token vào mỗi request
- Giảm risk quên add authorization header

### 2. Seamless Token Refresh
- User không bị logout đột ngột
- Better user experience
- Reduce login friction

### 3. Device Fingerprinting
- Track suspicious activities
- Detect account sharing
- Security audit trail

### 4. Credential Handling
```typescript
withCredentials: true
```
- Cho phép gửi cookies với CORS requests
- Important cho authentication flows

---

## 📝 Cấu hình Interceptors

**File:** `src/app/app.config.ts`

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        FingerprintInterceptorFn,
        ApiInterceptorFn,
        AuthExpiredInterceptorFn
      ])
    )
  ]
};
```

**Thứ tự quan trọng:**
1. **Fingerprint** - Add device ID first
2. **API** - Add auth & language headers
3. **AuthExpired** - Handle errors last

---

## 🔍 Debugging Interceptors

### Kiểm tra headers trong request
```typescript
// Trong interceptor, log request
console.log('Request URL:', request.url);
console.log('Request Headers:', request.headers);
```

### Xem trong Browser DevTools
1. Mở Chrome DevTools
2. Tab Network
3. Click vào request
4. Xem Headers section
5. Check:
   - Authorization header
   - Accept-Language header
   - X-Device-Id header (nếu có)

### Test token refresh flow
```typescript
// Trong console
localStorage.removeItem(LOCAL_USER_TOKEN_KEY);
// Then make any API call -> Should redirect to login

// Or set expired token
localStorage.setItem(LOCAL_USER_TOKEN_KEY, 'expired_token');
// Make API call -> Should auto refresh
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Token không được thêm vào request
**Cause:** Request URL không match API endpoint pattern
**Solution:** Check `request.url.startsWith(appConfig.getEndpointFor('api'))`

### Issue 2: Infinite refresh loop
**Cause:** Refresh endpoint cũng return 401
**Solution:** Code đã handle bằng cách check `error.url?.includes(API_USERS_REFRESH)`

### Issue 3: CORS errors
**Cause:** `withCredentials: true` nhưng backend không allow
**Solution:** Backend cần set:
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: [specific origin]
```

---

## 📚 Liên quan

- **AuthService** - Xử lý refresh token logic
- **ApplicationConfigService** - Provide API endpoints
- **StateStorageService** - Lưu previous page
- **API Constants** - Define endpoint paths

---

## 🎯 Best Practices

1. ✅ **Không manually add token** - Let interceptor handle it
2. ✅ **Không catch 401** ở service level - Let interceptor handle
3. ✅ **Test với expired tokens** - Ensure refresh works
4. ✅ **Monitor refresh calls** - Avoid too many refreshes
5. ✅ **Clear tokens on logout** - Security best practice

---

## 📖 Xem thêm

- [API Documentation](./API_DOCUMENTATION.md) - Chi tiết về API calls
- [API Quick Reference](./API_QUICK_REFERENCE.md) - Sơ đồ tổng quan
- Angular HttpClient: https://angular.io/guide/http-interceptor
- RxJS Operators: https://rxjs.dev/guide/operators
