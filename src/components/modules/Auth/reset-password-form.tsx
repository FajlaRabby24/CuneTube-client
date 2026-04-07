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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import InputField from "@/components/shared/forms/InputField";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { resetPasswordAction } from "../../../services/Auth/resetPassword.service";

interface ResetPasswordFormProps {
  className?: string;
}

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { email: string; otp: string; newPassword: string }) => 
      resetPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: emailFromUrl,
      newPassword: "",
    },

    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync({
          email: value.email,
          otp,
          newPassword: value.newPassword,
        })) as {
          success: boolean;
          message: string;
          route: string;
        };
        if (!result.success) {
          toast.error(result.message || "Password reset failed");
          return;
        }

        toast.success(result.message || "Password reset successfully");
        router.push(result.route);
      } catch {
        toast.error("Password reset failed. Please try again.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/auth.svg"
              alt="Image"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
              width={500}
              height={500}
            />
          </div>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email, OTP and new password
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  <form.Field name="email">
                    {(field) => (
                      <InputField
                        field={field}
                        label="Email"
                        type="email"
                        placeholder="example@gmail.com"
                      />
                    )}
                  </form.Field>

                  <Field>
                    <FieldLabel className="text-center justify-center">
                      Enter 6-digit OTP
                    </FieldLabel>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </Field>

                  <form.Field name="newPassword">
                    {(field) => (
                      <PasswordField
                        field={field}
                        label="New Password"
                        id="newPassword"
                        placeholder="Enter new password"
                      />
                    )}
                  </form.Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>

                  <Field>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Resetting..."
                          disabled={otp.length !== 6}
                        >
                          Reset Password
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}