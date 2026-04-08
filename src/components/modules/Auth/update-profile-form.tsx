"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import InputField from "@/components/shared/forms/InputField";
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
import { updateProfileSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileAction } from "../../../services/Auth/updateProfile.service";
import ImagePreview from "../../ui/file-priview";

interface UpdateProfileFormProps {
  initialData?: {
    name?: string;
    image?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
  };
  className?: string;
}

export function UpdateProfileForm({ initialData, className, ...props }: UpdateProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { name?: string; image?: string | null; bio?: string | null; phoneNumber?: string | null }) => 
      updateProfileAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      image: initialData?.image || null as string | null,
      bio: initialData?.bio || "",
      phoneNumber: initialData?.phoneNumber || "",
    },

    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync({
          name: value.name || undefined,
          image: value.image,
          bio: value.bio || null,
          phoneNumber: value.phoneNumber || null,
        })) as {
          success: boolean;
          message: string;
        };
        if (!result.success) {
          toast.error(result.message || "Profile update failed");
          return;
        }

        toast.success(result.message || "Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/my-profile");
      } catch {
        toast.error("Profile update failed. Please try again.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Update Profile</CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your profile information
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
                  <FieldDescription>Image (optional)</FieldDescription>
                  <ImagePreview
                    onFileChange={(file) =>
                      form.setFieldValue(
                        "image",
                        file ? URL.createObjectURL(file) : null,
                      )
                    }
                  />
                </Field>

                <form.Field name="name">
                  {(field) => (
                    <InputField
                      field={field}
                      label="Name"
                      type="text"
                      placeholder="John Doe"
                    />
                  )}
                </form.Field>

                <form.Field name="bio">
                  {(field) => (
                    <InputField
                      field={field}
                      label="Bio"
                      type="text"
                      placeholder="Tell us about yourself"
                    />
                  )}
                </form.Field>

                <form.Field name="phoneNumber">
                  {(field) => (
                    <InputField
                      field={field}
                      label="Phone Number"
                      type="tel"
                      placeholder="12345678901"
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
                        pendingLabel="Updating..."
                        disabled={!canSubmit}
                      >
                        Update Profile
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