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

// Cart API constants
export const API_CART = API_SECURE + '/carts';

// Chat API constants
export const API_CHAT = API_SECURE + '/notifications/chats';

// Orders API constants
export const API_ORDER = API_SECURE + '/orders';
export const API_ORDER_UPLOAD_DESIGN_FILE = API_ORDER + '/products/files/uploads';
export const API_ORDER_SALES_TODAY = API_ORDER + '/today/by-shop';
export const API_ORDER_SALES_ADMIN_TODAY = API_ORDER + '/today';
export const API_ORDER_BY_USER = API_ORDER + '/by-user';
export const API_ORDER_BY_SHOP = API_ORDER + '/by-shop';

// Reviews API constants
export const API_REVIEW = API_SECURE + '/reviews';
export const API_REVIEW_PUBLIC = API_PUBLIC + '/reviews';

// Shops API constants
export const API_SHOP = API_SECURE + '/shops';

export const API_STATISTIC_REVENUE = API_ORDER + '/reports/revenues';
export const API_STATISTIC_REVENUE_EXCEL = API_SECURE + '/reports/revenues';

// Voucher API constants
export const API_VOUCHER = API_SECURE + '/vouchers';
export const API_VOUCHER_PUBLIC = API_PUBLIC + '/vouchers';

// Role API constants
export const API_ROLES = API_USERS + '/roles';
export const API_ROLES_PERMISSIONS_TREE = API_ROLES + '/authorities';

// Payment API constants
export const API_PAYMENT = API_SECURE + '/payments';
export const API_PAYMENT_PUBLIC = API_PUBLIC + '/payments';

// Report API constants
export const API_FINANCE_STATISTIC = API_PAYMENT + '/finances/statistic/shop';
export const API_FINANCE_STATISTIC_ADMIN = API_PAYMENT + '/finances/statistic/admin';

// Revenue API constants
export const API_REVENUES = API_PAYMENT + '/revenues';
export const API_REVENUES_TODAY = API_REVENUES + '/today';
export const API_REVENUES_TODAY_ADMIN = API_REVENUES + '/admin/today';
export const API_REVENUES_LAST_SEVEN_DAY = API_REVENUES + '/last-seven-day';
export const API_REVENUES_LAST_SEVEN_DAY_ADMIN = API_REVENUES + '/admin/last-seven-day';

// Sales API constants
export const API_SALES_LAST_SEVEN_DAY = API_ORDER + '/last-seven-day/by-shop';
export const API_SALES_LAST_SEVEN_DAY_ADMIN = API_ORDER + '/last-seven-day/by-admin';

// Balance API constants
export const API_BALANCE = API_SECURE + '/balances';
export const API_BALANCE_FOR_SHOP = API_BALANCE + '/shop';
export const API_BALANCE_FOR_ADMIN = API_BALANCE + '/admin';

// Security gateway
export const RATE_LIMITER_API = API_SECURE + '/admin/gateway/securities/rate-limiter';
export const RATE_LIMITER_EXCLUDED_API = API_SECURE + '/admin/gateway/securities/rate-limiter/excluded';
export const PUBLIC_PATTERNS_CONFIG_API = API_SECURE + '/admin/gateway/securities/public-request-patterns';
