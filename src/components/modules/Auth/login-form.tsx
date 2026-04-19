/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import InputField from "@/components/shared/forms/InputField";
import PasswordField from "@/components/shared/forms/PasswordField";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { ILoginPayload } from "@/types/auth.types";
import { loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "../../../services/Auth/login.service";
import GoogleLoginButton from "../../shared/forms/GoogleLoginButton";

interface LoginFormProps {
  redirectPath?: string;
}

export function LoginForm({ redirectPath }: LoginFormProps) {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) =>
      loginAction(payload, redirectPath, navigator.userAgent),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync(value)) as {
          success: boolean;
          message: string;
          route: string;
        };

        if (!result.success) {
          toast.error(result.message || "Login failed");
          return;
        }

        toast.success(result.message || "Login successful");
        router.push(result.route);
      } catch (error: any) {
        toast.error("Login failed. Please try again.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
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
        <FieldGroup>
          {/* email  */}
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <InputField
                field={field}
                label="Email Address"
                type="email"
                placeholder="example@gmail.com"
                className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
                labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
              />
            )}
          </form.Field>

          {/* password  */}
          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <PasswordField
                from="login"
                field={field}
                label="Password"
                id="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
                labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
              />
            )}
          </form.Field>

          <div className="flex justify-end">
             <Link 
              href="/forgot-password" 
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors uppercase tracking-widest"
             >
                Forgot Password?
             </Link>
          </div>

          <Field>
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Logging In..."
                  disabled={!canSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)]"
                >
                  Sign In
                </AppSubmitButton>
              )}
            </form.Subscribe>

            <FieldSeparator className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] my-6">
              Or continue with
            </FieldSeparator>
            
            <Field>
              <GoogleLoginButton className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-14 rounded-xl transition-all" />
            </Field>

            <FieldDescription className="text-center mt-8 text-slate-400 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-red-600 font-black hover:underline underline-offset-4">
                Join now
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
