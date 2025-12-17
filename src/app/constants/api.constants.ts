export const API_SECURE = 'api/v1';
export const API_PUBLIC = 'api/p/v1';

// User API constants
export const API_USERS = API_SECURE + '/users';
export const API_USERS_LOGIN = API_PUBLIC + '/users/authenticate';
export const API_USERS_LOGOUT = API_PUBLIC + '/users/logout';
export const API_USERS_REFRESH = API_PUBLIC + '/users/refresh-token';
export const API_USERS_STATUS = API_SECURE + '/users/status';
export const API_USERS_CHANGE_EMAIL = API_SECURE + '/users/email';
export const API_USERS_CHANGE_PASSWORD = API_SECURE + '/users/password';
export const API_USERS_RECOVER_PASSWORD = API_SECURE + '/users/recover';
export const API_USERS_REGISTER = API_PUBLIC + '/users/register';

// Products API constants
export const API_PRODUCT = API_SECURE + '/products';
export const API_PRODUCT_PUBLIC = API_PUBLIC + '/products';
export const API_PRODUCT_GROUP = API_PRODUCT + '/groups';
export const API_PRODUCT_GROUP_PUBLIC = API_PRODUCT_PUBLIC + '/groups';
export const API_CATEGORY = API_PRODUCT + '/categories';
export const API_CATEGORY_PUBLIC = API_PRODUCT_PUBLIC + '/categories';

// Orders API constants
export const API_ORDER = API_SECURE + '/orders';
export const API_ORDER_BY_USER = API_ORDER + '/by-user';
export const API_ORDER_BY_SHOP = API_ORDER + '/by-shop';

// Shops API constants
export const API_SHOP = API_SECURE + '/shops'

// Voucher API constants
export const API_VOUCHER = API_SECURE + '/vouchers';
export const API_VOUCHER_PUBLIC = API_PUBLIC + '/vouchers';

// Role API constants
export const API_ROLES = API_USERS + '/roles';
export const API_ROLES_PERMISSIONS_TREE = API_ROLES + '/authorities';

// Report API constants
export const API_REPORT = API_SECURE + '/reports';
export const API_REPORT_REVENUE_DASHBOARD = API_REPORT + '/revenue-last-seven-day';
export const API_REPORT_SALES_DASHBOARD = API_REPORT + '/sales-last-seven-day';

// Payment API constants
export const API_PAYMENT = API_SECURE + '/payments';
export const API_PAYMENT_PUBLIC = API_PUBLIC + '/payments';

// Balance API constants
export const API_BALANCE = API_SECURE + '/balance';

// Security gateway
export const RATE_LIMITER_API = API_SECURE + '/admin/gateway/securities/rate-limiter';
export const RATE_LIMITER_EXCLUDED_API = API_SECURE + '/admin/gateway/securities/rate-limiter/excluded';
export const PUBLIC_PATTERNS_CONFIG_API = API_SECURE + '/admin/gateway/securities/public-request-patterns';
