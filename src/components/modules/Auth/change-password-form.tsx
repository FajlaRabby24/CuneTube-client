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
      <Card className="overflow-hidden p-0">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Change Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your current and new password to change it
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
                <Field>
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
                      />
                    )}
                  </form.Field>
                </Field>

                <Field>
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
                      />
                    )}
                  </form.Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>

                <Field>
                  <form.Subscribe
                    selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <AppSubmitButton
                        isPending={isSubmitting || isPending}
                        pendingLabel="Changing Password..."
                        disabled={!canSubmit}
                      >
                        Change Password
                      </AppSubmitButton>
                    )}
                  </form.Subscribe>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}