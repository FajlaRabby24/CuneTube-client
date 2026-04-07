/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDefaultDashboardRoute } from "../../../lib/authUtilts";
import { getNavItemsByRole } from "../../../lib/navItems";
import { getUserInfo } from "../../../services/Auth/getMe.service";
import { NavSection } from "../../../types/dashboard.types";
import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async () => {
  const userInfo: any = await getUserInfo();
  const navItems: NavSection[] = getNavItemsByRole(userInfo?.role);

  const dashboardHome = getDefaultDashboardRoute(userInfo?.role);
  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;
