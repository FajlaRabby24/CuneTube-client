import { NavSection } from "../types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtilts";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      // title: "Dashboard",
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: "Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admin-management",
        icon: "Shield",
      },
      {
        title: "Users",
        href: "/admin/dashboard/user-management",
        icon: "Users",
      },
      {
        title: "Payments",
        href: "/admin/dashboard/payment-management",
        icon: "CreditCard",
      },
      {
        title: "Media",
        href: "/admin/dashboard/media-management",
        icon: "Media",
      },
      {
        title: "Pricing Plans",
        href: "/admin/dashboard/pricing-management",
        icon: "DollarSign",
      },
      {
        title: "Reports",
        href: "/admin/dashboard/report-management",
        icon: "BarChart",
      },
      {
        title: "Reviews",
        href: "/admin/dashboard/review-management",
        icon: "Star",
      },
      {
        title: "Tags",
        href: "/admin/dashboard/tag-management",
        icon: "Tag",
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    items: [
      {
        title: "Payments",   // TODO:  check in desktop
        href: "/dashboard/payments",
        icon: "CreditCard",
      },
      {
        title: "Reviews", // TODO:  check in desktop
        href: "/dashboard/reviews",
        icon: "Star",
      },
      {
        title: "Comments", // TODO:  check in desktop
        href: "/dashboard/comments",
        icon: "MessageSquare",
      },
      {
        title: "Subscriptions", // TODO:  check in desktop
        href: "/dashboard/subscriptions",
        icon: "Calendar",
      },
      {
        title: "Watchlist", // TODO:  check in desktop, Home page, Movies page, Movies details page
        href: "/dashboard/watchlist",
        icon: "Heart",
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: "Bell",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return [...commonNavItems, ...adminNavItems];

    case UserRole.USER:
      return [...commonNavItems, ...userNavItems];

    default:
      return commonNavItems;
  }
};
