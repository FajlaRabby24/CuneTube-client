/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDefaultDashboardRoute } from "../../../lib/authUtilts";
import { getNavItemsByRole } from "../../../lib/navItems";
import { getUserInfo, IUserInfo } from "../../../services/Auth/getMe.service";
import { NavSection } from "../../../types/dashboard.types";
import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async () => {
  const userInfo: IUserInfo | null = await getUserInfo();
  if (!userInfo) {
    // Handle unauthenticated case - maybe redirect or show login
    return null;
  }

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
