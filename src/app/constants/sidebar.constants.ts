import {
  ICON_DASHBOARD,
  ICON_ADMIN_MANAGEMENT,
  ICON_USER_PERMISSION,
  ICON_USER,
  ICON_CUSTOMER,
  ICON_PRODUCTS
} from '../shared/utils/icon';
import {SidebarNavItem} from '../core/models/sidebar.model';
import {Authorities} from './authorities.constants';

export const SIDEBAR_DASHBOARD_TITLE = 'sidebar.dashboard';
export const SIDEBAR_HOME_TITLE = 'sidebar.home';
export const SIDEBAR_AUTHORIZATION_MANAGEMENT_TITLE = 'sidebar.authorization.title';
export const SIDEBAR_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE = 'sidebar.authorization.account';
export const SIDEBAR_AUTHORIZATION_ROLES_MANAGEMENT_TITLE = 'sidebar.authorization.role';
export const SIDEBAR_CUSTOMERS_TITLE = 'sidebar.customer';
export const SIDEBAR_PRODUCT_TITLE = 'sidebar.product';

export const SIDEBAR_CLASS_DROPDOWN = 'dropdown nav-item has-sub';
export const SIDEBAR_CLASS_DROPDOWN_ITEM = 'dropdown nav-item';

export const ADMIN_SIDEBAR_ROUTES: SidebarNavItem[] = [
  {
    path: '/admin/dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    icon: ICON_DASHBOARD,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
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
    path: '/admin/customers',
    title: SIDEBAR_CUSTOMERS_TITLE,
    icon: ICON_CUSTOMER,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/admin/products',
    title: SIDEBAR_PRODUCT_TITLE,
    icon: ICON_PRODUCTS,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
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
    permission: []
  }
];
