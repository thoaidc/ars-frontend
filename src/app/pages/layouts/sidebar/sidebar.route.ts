import {
  ICON_DASHBOARD,
  ICON_ADMIN_MANAGEMENT,
  ICON_USER_PERMISSION,
  ICON_USER,
  ICON_CUSTOMER,
  ICON_PRODUCTS
} from '../../../shared/utils/icon';
import {
  SIDEBAR_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
  SIDEBAR_AUTHORIZATION_MANAGEMENT_TITLE,
  SIDEBAR_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
  SIDEBAR_CLASS_DROPDOWN,
  SIDEBAR_CLASS_DROPDOWN_ITEM,
  SIDEBAR_CUSTOMERS_TITLE,
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_PRODUCT_TITLE
} from '../../../constants/sidebar.constant';
import {Authorities} from '../../../constants/authorities.constants';
import {SidebarNavItem} from '../../../core/models/sidebar.model';

export const SIDEBAR_ROUTES: SidebarNavItem[] = [
  {
    path: '/dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    icon: ICON_DASHBOARD,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/authorization',
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
    path: '/customers',
    title: SIDEBAR_CUSTOMERS_TITLE,
    icon: ICON_CUSTOMER,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/products',
    title: SIDEBAR_PRODUCT_TITLE,
    icon: ICON_PRODUCTS,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  }
];
