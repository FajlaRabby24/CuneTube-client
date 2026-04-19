"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordAction } from "@/services/Auth/forgotPassword.service";
import { toast } from "sonner";
import InputField from "@/components/shared/forms/InputField";
import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import { FieldGroup } from "@/components/ui/field";
import { z } from "zod";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function ForgotPasswordForm() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (email: string) => forgotPasswordAction(email),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await mutateAsync(value.email);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="email"
            validators={{
              onChange: forgotPasswordSchema.shape.email,
            }}
          >
            {(field) => (
              <InputField
                field={field}
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Sending Link..."
                disabled={!canSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-xl transition-all"
              >
                Send Reset Link
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <div className="text-center mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-600 transition-colors group"
        >
          <ChevronLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
