"use client";

import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IUserInfo } from "@/services/Auth/getMe.service";
import { NavSection } from "@/types/dashboard.types";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarProps {
  userInfo: IUserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardNavbarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardNavbarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);

    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    };
  }, []);

  return (
    <div className="flex h-20 items-center gap-4 w-full px-6 border-b border-white/5 bg-neutral-950/80 backdrop-blur-3xl sticky top-0 z-50">
      {/* Mobile Menu Toggle Button And Menu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-xl border-white/5 bg-black/40 hover:bg-red-600 transition-colors"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0 border-white/10 bg-neutral-950">
          <DashboardMobileSidebar
            userInfo={userInfo}
            dashboardHome={dashboardHome}
            navItems={navItems}
          />
        </SheetContent>
      </Sheet>

      {/* Brand visibility on Mobile Navbar (Optional, but helps context) */}
      <div className="md:hidden flex-1">
         <span className="text-sm font-black italic text-white uppercase tracking-tighter">CineTube</span>
      </div>

      {/* Global Search Component */}
      <div className="flex-1 flex items-center max-w-md hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-600" />
          <input 
            type="text" 
            placeholder="Search the archive..." 
            className="w-full h-10 rounded-xl border border-white/5 bg-black/20 pl-10 pr-4 text-[10px] font-black tracking-widest uppercase italic text-white placeholder:text-neutral-600 outline-none focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20 transition-all shadow-inner" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
             <span className="text-[8px] font-black text-neutral-500">⌘K</span>
          </div>
        </div>
      </div>

      {/* Spacer for Mobile layout balance */}
      {!isMobile && <div className="flex-1" />}

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <NotificationDropdown />

        <div className="h-4 w-px bg-white/5" />

        {/* User Dropdown  */}
        <UserDropdown userInfo={userInfo} />
      </div>
    </div>
  );
};

export default DashboardNavbarContent;
