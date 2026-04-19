"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import PasswordField from "@/components/shared/forms/PasswordField";
import { FieldGroup } from "@/components/ui/field";
import { resetPasswordSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { resetPasswordAction } from "@/services/Auth/resetPassword.service";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (password: string) => 
      resetPasswordAction({ 
        email: email as string, 
        otp: otp as string, 
        newPassword: password 
      }),
  });

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (!email || !otp) {
        toast.error("Required reset information (email/otp) is missing from the URL.");
        return;
      }

      try {
        const result = await mutateAsync(value.password);
        if (result.success) {
          toast.success(result.message);
          router.push("/login");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to reset password");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="space-y-6">
        <form.Field
          name="password"
          validators={{ 
            onChange: resetPasswordSchema.shape.newPassword 
          }}
        >
          {(field) => (
            <PasswordField
              field={field}
              label="New Password"
              id="password"
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
              labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
            />
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) => {
              if (value !== fieldApi.form.getFieldValue("password")) {
                return "Passwords do not match";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <PasswordField
              field={field}
              label="Confirm Password"
              id="confirmPassword"
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
              labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
            />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <AppSubmitButton
              isPending={isSubmitting || isPending}
              pendingLabel="Resetting..."
              disabled={!canSubmit || !email || !otp}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]"
            >
              Reset Password
            </AppSubmitButton>
          )}
        </form.Subscribe>

        {(!email || !otp) && (
          <p className="text-center text-xs font-bold text-red-500 uppercase tracking-widest">
            Invalid reset link. Please check your email.
          </p>
        )}
      </FieldGroup>
    </form>
  );
}