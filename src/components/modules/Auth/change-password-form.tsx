"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import PasswordField from "@/components/shared/forms/PasswordField";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { changePasswordSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changePasswordAction } from "../../../services/Auth/changePassword.service";

export function ChangePasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) => 
      changePasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },

    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync(value)) as {
          success: boolean;
          message: string;
        };
        if (!result.success) {
          toast.error(result.message || "Password change failed");
          return;
        }

        toast.success(result.message || "Password changed successfully");
        router.back();
      } catch {
        toast.error("Password change failed. Please try again.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-black/60 backdrop-blur-2xl border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-black uppercase font-outfit tracking-tight text-white">Change Password</CardTitle>
          <CardDescription className="text-slate-400 font-medium">
            Enter your current and new password to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="space-y-6">
              <form.Field
                name="currentPassword"
                validators={{ onChange: changePasswordSchema.shape.currentPassword }}
              >
                {(field) => (
                  <PasswordField
                    field={field}
                    label="Current Password"
                    id="currentPassword"
                    placeholder="Enter current password"
                    className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
                    labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
                  />
                )}
              </form.Field>

              <div className="space-y-2">
                <form.Field
                  name="newPassword"
                  validators={{ onChange: changePasswordSchema.shape.newPassword }}
                >
                  {(field) => (
                    <PasswordField
                      field={field}
                      label="New Password"
                      id="newPassword"
                      placeholder="Enter new password"
                      className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
                      labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
                    />
                  )}
                </form.Field>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Must be at least 8 characters long.
                </p>
              </div>

              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isSubmitting] as const}
              >
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Changing Password..."
                    disabled={!canSubmit}
                    className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                  >
                    Update Password
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}