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
import { IUserInfo } from "@/services/Auth/getMe.service";
import { logoutSession } from "@/services/Auth/logoutSession.service";
import { Key, LogOut, Settings, User2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";

const UserDropdown = ({ userInfo }: { userInfo: IUserInfo }) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const token = await getCookie("better-auth.session_token");
      const currentSessionIdAndToken = userInfo.sessions.filter(
        (session) => session.token === token,
      )[0];

      if (currentSessionIdAndToken) {
        const result = await logoutSession(
          currentSessionIdAndToken.id,
          currentSessionIdAndToken.token,
        );

        if (result.success) {
          // Delete cookies AFTER successful logout
          await deleteCookie("refreshToken");
          await deleteCookie("better-auth.session_token");
          await deleteCookie("accessToken");

          // THEN redirect
          router.push("/login");
        } else {
          toast.error(result.message || "Logout failed");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="cursor-pointer rounded-full"
        >
          <span className="text-sm font-semibold">
            {userInfo.name.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userInfo.name}</p>

            <p className="text-xs text-muted-foreground">{userInfo.email}</p>

            <p className="text-xs text-primary capitalize">
              {userInfo.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={"/change-password"} className="flex">
            <Settings className="mr-2 h-4 w-4" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href={"/Update Profile"} className="flex">
            <User2Icon className="mr-2 h-4 w-4" />
            Update Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href={"/Reset Password"} className="flex">
            <Key className="mr-2 h-4 w-4" />
            Reset Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then((result) => {
              if (result.isConfirmed) {
                handleLogout();
              }
            });
          }}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
