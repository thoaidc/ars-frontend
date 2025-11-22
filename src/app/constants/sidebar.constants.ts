import {
  ICON_DASHBOARD,
  ICON_ADMIN_MANAGEMENT,
  ICON_USER_PERMISSION,
  ICON_USER,
  ICON_CUSTOMER,
  ICON_PRODUCTS,
  ICON_CONFIG,
  ICON_LOCK,
  ICON_SHIELD,
  ICON_CHART,
  ICON_COMPANY,
  ICON_SUPPORT,
  ICON_CATEGORY,
  ICON_FINANCE,
  ICON_ORDER,
  ICON_RATE_LIMIT,
  ICON_DESIGN,
  ICON_ATTRIBUTE,
  ICON_GROUP
} from '../shared/utils/icon';
import {SidebarNavItem} from '../core/models/sidebar.model';
import {Authorities} from './authorities.constants';

export const SIDEBAR_DASHBOARD_TITLE = 'sidebar.dashboard';
export const SIDEBAR_HOME_TITLE = 'sidebar.home';
export const SIDEBAR_AUTHORIZATION_MANAGEMENT_TITLE = 'sidebar.authorization.title';
export const SIDEBAR_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE = 'sidebar.authorization.account';
export const SIDEBAR_AUTHORIZATION_ROLES_MANAGEMENT_TITLE = 'sidebar.authorization.role';
export const SIDEBAR_CUSTOMERS_TITLE = 'sidebar.customer';
export const SIDEBAR_SHOP_TITLE = 'sidebar.shop';
export const SIDEBAR_CATEGORY_TITLE = 'sidebar.category';
export const SIDEBAR_PRODUCT_TITLE = 'sidebar.product';
export const SIDEBAR_GROUP_TITLE = 'sidebar.product.group';
export const SIDEBAR_ATTRIBUTE_TITLE = 'sidebar.product.attribute';
export const SIDEBAR_PRODUCT_ITEM_TITLE = 'sidebar.product.item';
export const SIDEBAR_ORDER_TITLE = 'sidebar.order';
export const SIDEBAR_SETTING_TITLE = 'sidebar.setting';
export const SIDEBAR_FINANCE_TITLE = 'sidebar.finance';
export const SIDEBAR_STATISTIC_TITLE = 'sidebar.statistic';
export const SIDEBAR_SUPPORT_TITLE = 'sidebar.support';
export const SIDEBAR_SECURITY_MANAGEMENT_TITLE = 'sidebar.security.title';
export const SIDEBAR_SECURITY_PUBLIC_API_MANAGEMENT_TITLE = 'sidebar.security.publicApi';
export const SIDEBAR_SECURITY_RATE_LIMITER_API_MANAGEMENT_TITLE = 'sidebar.security.rateLimiter';

export const SIDEBAR_CLASS_DROPDOWN = 'dropdown nav-item has-sub';
export const SIDEBAR_CLASS_DROPDOWN_ITEM = 'dropdown nav-item';

export const ADMIN_SIDEBAR_ROUTES: SidebarNavItem[] = [
  {
    path: '/admin/dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    icon: ICON_DASHBOARD,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/admin/customers',
    title: SIDEBAR_CUSTOMERS_TITLE,
    icon: ICON_CUSTOMER,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/admin/shops',
    title: SIDEBAR_SHOP_TITLE,
    icon: ICON_COMPANY,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/categories',
    title: SIDEBAR_CATEGORY_TITLE,
    icon: ICON_CATEGORY,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/admin/products',
    title: SIDEBAR_PRODUCT_TITLE,
    icon: ICON_PRODUCTS,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/shop/orders',
    title: SIDEBAR_ORDER_TITLE,
    icon: ICON_ORDER,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/finance',
    title: SIDEBAR_FINANCE_TITLE,
    icon: ICON_FINANCE,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/statistic',
    title: SIDEBAR_STATISTIC_TITLE,
    icon: ICON_CHART,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/supports',
    title: SIDEBAR_SUPPORT_TITLE,
    icon: ICON_SUPPORT,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/admin/authorization',
    title: SIDEBAR_AUTHORIZATION_MANAGEMENT_TITLE,
    icon: ICON_ADMIN_MANAGEMENT,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: [Authorities.ACCOUNT, Authorities.ROLE],
    submenu: [
      {
        path: '/accounts',
        title: SIDEBAR_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
        icon: ICON_USER,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ACCOUNT
      },
      {
        path: '/roles',
        title: SIDEBAR_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
        icon: ICON_USER_PERMISSION,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ROLE
      }
    ]
  },
  {
    path: '/admin/security',
    title: SIDEBAR_SECURITY_MANAGEMENT_TITLE,
    icon: ICON_SHIELD,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: Authorities.SYSTEM,
    submenu: [
      {
        path: '/public-api',
        title: SIDEBAR_SECURITY_PUBLIC_API_MANAGEMENT_TITLE,
        icon: ICON_LOCK,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.SYSTEM
      },
      {
        path: '/rate-limiter',
        title: SIDEBAR_SECURITY_RATE_LIMITER_API_MANAGEMENT_TITLE,
        icon: ICON_RATE_LIMIT,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.SYSTEM
      }
    ]
  },
  {
    path: '/admin/settings',
    title: SIDEBAR_SETTING_TITLE,
    icon: ICON_CONFIG,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: Authorities.SYSTEM
  }
];

export const SHOP_SIDEBAR_ROUTES: SidebarNavItem[] = [
  {
    path: '/shop/dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    icon: ICON_DASHBOARD,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/customers',
    title: SIDEBAR_CUSTOMERS_TITLE,
    icon: ICON_CUSTOMER,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/products',
    title: SIDEBAR_PRODUCT_TITLE,
    icon: ICON_PRODUCTS,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [],
    submenu: [
      {
        path: '/attributes',
        title: SIDEBAR_ATTRIBUTE_TITLE,
        icon: ICON_ATTRIBUTE,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: []
      },
      {
        path: '/groups',
        title: SIDEBAR_GROUP_TITLE,
        icon: ICON_GROUP,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: []
      },
      {
        path: '/items',
        title: SIDEBAR_PRODUCT_ITEM_TITLE,
        icon: ICON_DESIGN,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: []
      },
    ]
  },
  {
    path: '/shop/orders',
    title: SIDEBAR_ORDER_TITLE,
    icon: ICON_ORDER,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/finance',
    title: SIDEBAR_FINANCE_TITLE,
    icon: ICON_FINANCE,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/statistic',
    title: SIDEBAR_STATISTIC_TITLE,
    icon: ICON_CHART,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/supports',
    title: SIDEBAR_SUPPORT_TITLE,
    icon: ICON_SUPPORT,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  },
  {
    path: '/shop/settings',
    title: SIDEBAR_SETTING_TITLE,
    icon: ICON_CONFIG,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: []
  }
];
