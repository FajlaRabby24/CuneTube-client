import { ResetPasswordForm } from "@/components/modules/Auth/reset-password-form";
import { ModernAuthLayout } from "@/components/shared/ModernAuthLayout";

const ResetPasswordPage = () => {
  return (
    <ModernAuthLayout
      title="Secure Your Account"
      description="Almost there! Enter your new password below to finalize the process."
    >
      <ResetPasswordForm />
    </ModernAuthLayout>
  );
};

export default ResetPasswordPage;
