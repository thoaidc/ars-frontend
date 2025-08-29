import {
  ICON_DASHBOARD,
  ICON_ADMIN_MANAGEMENT,
  ICON_USER_PERMISSION,
  ICON_USER,
  ICON_CUSTOMER,
  ICON_HOMEPAGE,
  ICON_COMPANY,
  ICON_HISTORY_LOG,
  ICON_ATTENTION,
  ICON_STORY,
  ICON_PARTNER,
  ICON_MOTTOS,
  ICON_CONTACT_FORM,
  ICON_PRODUCTS,
  ICON_WORK,
  ICON_CATEGORY,
  ICON_PROJECTS, ICON_HIRING, ICON_ABOUT,
} from '../../../../shared/utils/icon';
import {
  SIDEBAR_ABOUT_FORMS_TITLE,
  SIDEBAR_ABOUT_MOTTOS_TITLE,
  SIDEBAR_ABOUT_PARTNERS_TITLE,
  SIDEBAR_ABOUT_STORIES_TITLE,
  SIDEBAR_ABOUT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_MANAGEMENT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
  SIDEBAR_CLASS_DROPDOWN,
  SIDEBAR_CLASS_DROPDOWN_ITEM,
  SIDEBAR_COMPANY_TITLE, SIDEBAR_CUSTOMERS_TITLE,
  SIDEBAR_DASHBOARD_TITLE,
  SIDEBAR_HIRING_TITLE,
  SIDEBAR_HOME_TITLE,
  SIDEBAR_PRODUCT_TITLE,
  SIDEBAR_WORK_CATEGORIES_TITLE,
  SIDEBAR_WORK_PROJECTS_TITLE,
  SIDEBAR_WORK_TITLE
} from '../../../../constants/sidebar.constant';
import {Authorities} from '../../../../constants/authorities.constants';
import {SidebarNavItem} from '../../../../core/models/sidebar.model';

export const SIDEBAR_ROUTES: SidebarNavItem[] = [
  {
    path: '/admin/dashboard',
    title: SIDEBAR_DASHBOARD_TITLE,
    icon: ICON_DASHBOARD,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/admin/authorize',
    title: SIDEBAR_ADMIN_AUTHORIZATION_MANAGEMENT_TITLE,
    icon: ICON_ADMIN_MANAGEMENT,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: [Authorities.ACCOUNT, Authorities.ROLE],
    submenu: [
      {
        path: '/accounts',
        title: SIDEBAR_ADMIN_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
        icon: ICON_USER,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ACCOUNT
      },
      {
        path: '/roles',
        title: SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
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
    path: '/admin/home',
    title: SIDEBAR_HOME_TITLE,
    icon: ICON_HOMEPAGE,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/admin/company',
    title: SIDEBAR_COMPANY_TITLE,
    icon: ICON_COMPANY,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/admin/hiring',
    title: SIDEBAR_HIRING_TITLE,
    icon: ICON_HIRING,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/admin/abouts',
    title: SIDEBAR_ABOUT_TITLE,
    icon: ICON_ABOUT,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: [Authorities.ACCOUNT, Authorities.ROLE],
    submenu: [
      {
        path: '/stories',
        title: SIDEBAR_ABOUT_STORIES_TITLE,
        icon: ICON_STORY,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ACCOUNT
      },
      {
        path: '/partners',
        title: SIDEBAR_ABOUT_PARTNERS_TITLE,
        icon: ICON_PARTNER,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ROLE
      },
      {
        path: '/mottos',
        title: SIDEBAR_ABOUT_MOTTOS_TITLE,
        icon: ICON_MOTTOS,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ROLE
      },
      {
        path: '/forms',
        title: SIDEBAR_ABOUT_FORMS_TITLE,
        icon: ICON_CONTACT_FORM,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ROLE
      }
    ]
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
    path: '/admin/works',
    title: SIDEBAR_WORK_TITLE,
    icon: ICON_WORK,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: [Authorities.ACCOUNT, Authorities.ROLE],
    submenu: [
      {
        path: '/categories',
        title: SIDEBAR_WORK_CATEGORIES_TITLE,
        icon: ICON_CATEGORY,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ACCOUNT
      },
      {
        path: '/projects',
        title: SIDEBAR_WORK_PROJECTS_TITLE,
        icon: ICON_PROJECTS,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ROLE
      }
    ]
  },
];
