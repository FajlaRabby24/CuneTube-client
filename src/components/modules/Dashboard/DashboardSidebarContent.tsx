"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { IUserInfo } from "@/services/Auth/getMe.service";
import { NavSection } from "@/types/dashboard.types";
import { Shield } from "lucide-react";

interface DashboardSidebarContentProps {
  userInfo: IUserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-white/5 bg-neutral-950/80 backdrop-blur-3xl overflow-y-auto">
      {/* Logo / Brand */}
      <div className="flex h-20 items-center border-b border-white/5 px-8 pt-2">
        <Link href={`/`} className="group flex items-center gap-2">
          <div className="size-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-transform">
            <span className="text-lg font-black italic text-white tracking-tighter">CT</span>
          </div>
          <span className="text-xl font-black italic text-white tracking-tighter uppercase group-hover:text-red-500 transition-colors">
            CineTube
          </span>
        </Link>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-4 py-8">
        <nav className="space-y-10">
          {navItems?.map((section, sectionId) => (
            <div key={sectionId} className="space-y-4">
              {section.title && (
                <h4 className="px-4 text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] italic">
                  — {section.title}
                </h4>
              )}

              <div className="space-y-2">
                {section?.items?.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300",
                        isActive
                          ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                          : "text-neutral-500 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-white rounded-r-full shadow-[0_0_10px_white]" />
                      )}
                      
                      <Icon className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-neutral-500 group-hover:text-red-500"
                      )} />
                      
                      <span className={cn(
                        "text-[10px] font-black italic uppercase tracking-widest",
                        isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
                      )}>
                        {item.title}
                      </span>

                      {/* Glow effect for active Link */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-white/[0.08] pointer-events-none" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom */}
      <div className="border-t border-white/5 px-4 py-6 bg-black/20">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="h-10 w-10 min-w-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
            <span className="text-lg font-black italic text-red-600">
              {userInfo?.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-[11px] font-black italic text-white uppercase tracking-tighter truncate">
              {userInfo?.name}
            </p>
            <div className="flex items-center gap-1.5">
               <Shield className="size-2 text-red-600" />
               <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest truncate">
                 {userInfo?.role.toLocaleLowerCase().replace("_", " ")}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
