export interface SidebarNavItem {
  path: string;
  title: string;
  icon: string;
  class: string;
  isExternalLink: boolean;
  submenu?: SidebarNavItem[];
  permission: string[] | string;
  userType: string[] | string;
}
