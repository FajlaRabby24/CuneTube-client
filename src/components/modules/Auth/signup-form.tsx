/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GoogleLoginButton from "@/components/shared/forms/GoogleLoginButton";
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
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import FileUpload from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { registerAction } from "../../../services/auth.service";
import { IRegisterPayload } from "../../../types/auth.types";
import AppSubmitButton from "../../shared/forms/AppSubmitButton";
import { Alert, AlertDescription } from "../../ui/alert";
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      // Image: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }
      } catch (error: any) {
        console.log(`Registration failed: ${error.message}`);
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Card>
            <CardHeader className="text-center">
              <Link href="/" className="text-2xl font-bold">
                CT
              </Link>
              <CardTitle className="text-xl">Create your account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email below to create your account
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
                  <Field className="grid grid-cols-2 gap-4">
                    {/* email  */}
                    <form.Field
                      name="name"
                      // validators={{onChange: }}
                    >
                      {(field) => (
                        <InputField
                          field={field}
                          label="Full Name"
                          type="text"
                          placeholder="John Doe"
                        />
                      )}
                    </form.Field>

                    <Field>
                      <FieldLabel htmlFor="email">Image (optional)</FieldLabel>
                      <FileUpload />
                    </Field>
                  </Field>

                  {/* email  */}
                  <form.Field
                    name="email"
                    // validators={{onChange: }}
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

                  <Field>
                    <Field className="grid grid-cols-2 gap-4">
                      {/* password  */}
                      <form.Field
                        name="password"
                        // validators={{ onChange: loginZodSchema.shape.password }}
                      >
                        {(field) => (
                          <PasswordField
                            field={field}
                            label="Password"
                            id="password"
                            placeholder="Password"
                          />
                        )}
                      </form.Field>

                      {/* confirm password  */}
                      <form.Field
                        name="confirm_password"
                        // validators={{ onChange: loginZodSchema.shape.password }}
                      >
                        {(field) => (
                          <PasswordField
                            field={field}
                            label="Confirm Password"
                            id="confirm-password"
                            placeholder="confirm password"
                          />
                        )}
                      </form.Field>
                    </Field>
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>
                  {serverError && (
                    <Alert variant="destructive">
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  )}

                  <Field>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Registering..."
                          disabled={!canSubmit}
                        >
                          Register
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
                      Already have an account? <Link href="/login">Login</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/auth.svg"
              alt="Image"
              loading="eager"
              className="absolute inset-0 h-full w-full  object-cover "
              width={500}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
