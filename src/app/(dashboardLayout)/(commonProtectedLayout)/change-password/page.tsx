import { ChangePasswordForm } from "@/components/modules/Auth/change-password-form";

const ChangePasswordPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;