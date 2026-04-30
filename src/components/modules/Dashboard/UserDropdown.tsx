"use client";

import { LogOut, Settings, Shield, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCookie, getCookie } from "@/lib/cookieUtils";
import { getSessionCookieName } from "@/lib/tokenUtils";
import { IUserInfo } from "@/services/Auth/getMe.service";
import { logoutSession } from "@/services/Auth/logoutSession.service";

const UserDropdown = ({ userInfo }: { userInfo: IUserInfo }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const cookieName = await getSessionCookieName();
      const token = await getCookie(cookieName);
      const currentSessionIdAndToken = userInfo.sessions.find(
        (session) => session.token === token,
      );

      if (currentSessionIdAndToken) {
        const result = await logoutSession(
          currentSessionIdAndToken.id,
          currentSessionIdAndToken.token,
        );

        if (result.success) {
          await deleteCookie("refreshToken");
          await deleteCookie(cookieName);
          await deleteCookie("accessToken");
          router.push("/login");
          toast.success("Logged out successfully");
          return;
        }
      }

      // Fallback: Clear local cookies anyway if session not found or API failed
      await deleteCookie("refreshToken");
      await deleteCookie(cookieName);
      await deleteCookie("accessToken");
      router.push("/login");
      toast.success("Session cleared");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, but session cleared");
      router.push("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative cursor-pointer rounded-xl border-white/5 bg-black/20 hover:bg-red-600 transition-all duration-300 group"
        >
          <span className="text-xs font-black italic text-white group-hover:scale-110 transition-transform">
            {userInfo.name.charAt(0).toUpperCase()}
          </span>
          <div className="absolute inset-0 rounded-xl bg-red-600/0 opacity-0 group-hover:opacity-20 group-hover:bg-red-600 transition-all blur-md" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl border-white/10 bg-neutral-950/90 p-2 backdrop-blur-2xl shadow-2xl"
      >
        <DropdownMenuLabel className="px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20">
              <span className="text-lg font-black italic text-red-600">
                {userInfo.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-black italic text-white leading-tight uppercase tracking-tighter">
                {userInfo.name}
              </p>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest truncate max-w-[140px]">
                {userInfo.email}
              </p>
              <div className="mt-1 inline-flex items-center gap-1">
                <Shield className="h-2 w-2 text-red-600" />
                <p className="text-[8px] font-black text-red-600 uppercase tracking-[0.2em]">
                  {userInfo.role.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/5" />

        <div className="py-1">
          <DropdownMenuItem
            onClick={() => router.push("/change-password")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 group transition-colors"
          >
            <Settings className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:rotate-45 transition-all" />
            <span className="text-[10px] font-black italic uppercase tracking-widest text-neutral-400 group-hover:text-white">
              Change Password
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/update-profile")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 group transition-colors"
          >
            <User2Icon className="h-4 w-4 text-neutral-500 group-hover:text-white transition-all" />
            <span className="text-[10px] font-black italic uppercase tracking-widest text-neutral-400 group-hover:text-white">
              Update Profile
            </span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-white/5" />

        <DropdownMenuItem
          onClick={() => {
            Swal.fire({
              title: "Logout?",
              text: "Confirming secure logout protocol.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#dc2626",
              cancelButtonColor: "#171717",
              confirmButtonText: "Logout",
              background: "#0a0a0a",
              color: "#fff",
              customClass: {
                popup: "rounded-3xl border border-white/10",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                handleLogout();
              }
            });
          }}
          className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer bg-red-600/5 hover:bg-red-600 focus:bg-red-600 group transition-all"
        >
          <LogOut className="h-4 w-4 text-red-600 group-hover:text-white transition-all" />
          <span className="text-[10px] font-black italic uppercase tracking-widest text-red-600 group-hover:text-white">
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
