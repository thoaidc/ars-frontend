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

// Products API constants
export const API_PRODUCT = API_SECURE + '/products';
export const API_PRODUCT_PUBLIC = API_PUBLIC + '/products';
export const API_PRODUCT_GROUP = API_PRODUCT + '/groups';
export const API_PRODUCT_GROUP_PUBLIC = API_PRODUCT_PUBLIC + '/groups';
export const API_CATEGORY = API_PRODUCT + '/categories';
export const API_CATEGORY_PUBLIC = API_PRODUCT_PUBLIC + '/categories';
export const API_ATTRIBUTE = API_PRODUCT + '/attributes';
export const API_ATTRIBUTE_PUBLIC = API_PRODUCT_PUBLIC + '/attributes';

// Role API constants
export const API_ROLES = API_USERS + '/roles';
export const API_ROLES_PERMISSIONS_TREE = API_ROLES + '/authorities';

// Security gateway
export const RATE_LIMITER_API = API_SECURE + '/admin/gateway/securities/rate-limiter';
export const RATE_LIMITER_EXCLUDED_API = API_SECURE + '/admin/gateway/securities/rate-limiter/excluded';
export const PUBLIC_PATTERNS_CONFIG_API = API_SECURE + '/admin/gateway/securities/public-request-patterns';
