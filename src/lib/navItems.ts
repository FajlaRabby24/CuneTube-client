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
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "change-password",
          icon: "Settings",
        },
        {
          title: "Update Profile",
          href: "update-profile",
          icon: "User",
        },
        {
          title: "Reset Password",
          href: "reset-password",
          icon: "Key",
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: "Shield",
      },
      {
        title: "Users",
        href: "/admin/dashboard/users-management",
        icon: "Users",
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
        href: "/admin/dashboard/reports-management",
        icon: "BarChart",
      },
      {
        title: "Reviews",
        href: "/admin/dashboard/reviews-management",
        icon: "Star",
      },
      {
        title: "Tags",
        href: "/admin/dashboard/tags-management",
        icon: "Tag",
      },
    ],
  },
  {
    title: "Hospital Management",
    items: [
      {
        title: "Appointments",
        href: "/admin/dashboard/appointments-management",
        icon: "Calendar",
      },
      {
        title: "Schedules",
        href: "/admin/dashboard/schedules-management",
        icon: "Clock",
      },
      {
        title: "Specialties",
        href: "/admin/dashboard/specialties-management",
        icon: "Hospital",
      },
      {
        title: "Doctor Schedules",
        href: "/admin/dashboard/doctor-schedules-managament",
        icon: "CalendarClock",
      },
      {
        title: "Doctor Specialties",
        href: "/admin/dashboard/doctor-specialties-management",
        icon: "Stethoscope",
      },
      {
        title: "Payments",
        href: "/admin/dashboard/payments-management",
        icon: "CreditCard",
      },
      {
        title: "Prescriptions",
        href: "/admin/dashboard/prescriptions-management",
        icon: "FileText",
      },
      {
        title: "Reviews",
        href: "/admin/dashboard/reviews-management",
        icon: "Star",
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: "Appointments",
    items: [
      {
        title: "My Appointments",
        href: "/dashboard/my-appointments",
        icon: "Calendar",
      },
      {
        title: "Book Appointment",
        href: "/dashboard/book-appointments",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "Medical Records",
    items: [
      {
        title: "My Prescriptions",
        href: "/dashboard/my-prescriptions",
        icon: "FileText",
      },
      {
        title: "Health Records",
        href: "/dashboard/health-records",
        icon: "Activity",
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
