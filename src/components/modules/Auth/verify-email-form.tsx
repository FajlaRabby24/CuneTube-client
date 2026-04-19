"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import {
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyEmailAction } from "../../../services/Auth/verifyEmail.service";

export interface IVerifyEmailForm {
  email: string;
}

export function VerifyEmailForm({ email }: IVerifyEmailForm) {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (otp: string) => verifyEmailAction({ email, otp }),
  });

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await mutateAsync(value.otp);
        if (result.success) {
          toast.success(result.message);
          router.push("/login");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("An error occurred during verification.");
      }
    },
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-slate-400 font-medium">
          We've sent a 6-digit code to <span className="text-white font-bold">{email}</span>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col items-center space-y-8"
      >
        <FieldGroup className="flex flex-col items-center">
          <form.Field name="otp">
            {(field) => (
              <div className="space-y-4 flex flex-col items-center">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-12 md:size-14 rounded-xl border-white/10 bg-white/5 text-white text-xl font-bold focus:border-red-600 transition-all data-[active=true]:border-red-600 data-[active=true]:ring-1 data-[active=true]:ring-red-600"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {field.state.meta.errors && (
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Verifying..."
                disabled={!canSubmit || form.getFieldValue("otp").length !== 6}
                className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]"
              >
                Verify Code
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <div className="text-center">
        <button className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors uppercase tracking-widest">
          Didn't receive a code? Resend
        </button>
      </div>
    </div>
  );
}
