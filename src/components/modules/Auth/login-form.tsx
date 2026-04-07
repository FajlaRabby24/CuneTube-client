/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import InputField from "@/components/shared/forms/InputField";
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
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { ILoginPayload } from "@/types/auth.types";
import { loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
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
    mutationFn: (payload: ILoginPayload) => loginAction(payload),
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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/auth.svg"
              alt="Image"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover "
              width={500}
              height={500}
            />
          </div>
          <Card>
            <CardHeader className="text-center">
              <Link href="/" className="text-2xl font-bold">
                CT
              </Link>
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Login to your CuneTube account
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
                  {/* email  */}
                  <form.Field
                    name="email"
                    validators={{ onChange: loginZodSchema.shape.email }}
                  >
                    {(field) => (
                      <InputField
                        field={field}
                        label="Email"
                        type="email"
                        placeholder="example@gamil.com"
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
                        placeholder="Password"
                      />
                    )}
                  </form.Field>

                  <Field>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Logging In...."
                          disabled={!canSubmit}
                        >
                          Log In
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>

                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-2">
                      Or continue with
                    </FieldSeparator>
                    <Field>
                      <GoogleLoginButton />
                    </Field>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <Link href="/register">Register</Link>
                    </FieldDescription>
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
