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

// Role API constants
export const API_ROLES = API_USERS + '/roles';
export const API_ROLES_PERMISSIONS_TREE = API_SECURE + '/roles/authorities';

// Security gateway
export const RATE_LIMITER_API = API_SECURE + '/admin/gateway/securities/rate-limiter';
export const RATE_LIMITER_EXCLUDED_API = API_SECURE + '/admin/gateway/securities/rate-limiter/excluded';
export const PUBLIC_PATTERNS_CONFIG_API = API_SECURE + '/admin/gateway/securities/public-request-patterns';
