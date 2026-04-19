/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GoogleLoginButton from "@/components/shared/forms/GoogleLoginButton";
import InputField from "@/components/shared/forms/InputField";
import PasswordField from "@/components/shared/forms/PasswordField";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/utils/uploadFileInCloudinary";
import { validateImage } from "@/lib/utils/validateImage";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteFromCloudinary } from "../../../lib/utils/deleteFromCloudinary";
import { registerAction } from "../../../services/Auth/register.service";
import { IRegisterPayload } from "../../../types/auth.types";
import { registerZodSchema } from "../../../zod/auth.validation";
import AppSubmitButton from "../../shared/forms/AppSubmitButton";
import ImagePreview from "../../ui/file-priview";

interface RegisterFormProps {
  redirectPath?: string;
}

export function SignupForm({ redirectPath }: RegisterFormProps) {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      registerAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: null as File | null | undefined,
    },

    onSubmit: async ({ value }) => {
      let image: string | null | undefined = null;
      try {
        if (value.image) {
          const isValidImage = await validateImage(value.image);
          if (!isValidImage.success) {
            toast.error(isValidImage.message);
            return;
          }

          const uploadImage = await uploadToCloudinary(value.image);
          if (!uploadImage.success) {
            toast.error(uploadImage.message);
            return;
          }
          image = uploadImage?.data?.url;
        }
        const result = (await mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
          image,
        })) as {
          success: boolean;
          message: string;
          route: string;
        };
        
        if (!result.success) {
          toast.error(result.message || "Registration failed");
          return;
        }

        toast.success(result.message || "Registration successful");
        router.push(result.route);
      } catch (error) {
        toast.error("Registration failed. Please try again.");
        if (image) {
          await deleteFromCloudinary(image, "image");
        }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="name"
              validators={{ onChange: registerZodSchema.shape.name }}
            >
              {(field) => (
                <InputField
                  field={field}
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
                  labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
                />
              )}
            </form.Field>

            <Field className="space-y-2">
              <FieldLabel htmlFor="image" className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                Profile Picture
              </FieldLabel>
              <ImagePreview
                onFileChange={(file) => form.setFieldValue("image", file)}
                className="bg-white/5 border-white/10 text-slate-400 hover:text-white transition-colors h-12"
              />
            </Field>
          </div>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
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

          <form.Field
            name="password"
            validators={{
              onChange: registerZodSchema.shape.password,
            }}
          >
            {(field) => (
              <PasswordField
                field={field}
                label="Password"
                id="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
                labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
              />
            )}
          </form.Field>
          
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Must be at least 8 characters.
          </p>

          <Field className="pt-4">
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating Account..."
                  disabled={!canSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                >
                  Create Account
                </AppSubmitButton>
              )}
            </form.Subscribe>

            <FieldSeparator className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] my-6">
              Or join with
            </FieldSeparator>
            
            <Field>
              <GoogleLoginButton className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-14 rounded-xl transition-all" />
            </Field>

            <FieldDescription className="text-center mt-8 text-slate-400 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 font-black hover:underline underline-offset-4">
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
