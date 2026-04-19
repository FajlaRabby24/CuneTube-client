import { ForgotPasswordForm } from "@/components/modules/Auth/forgot-password-form";
import { ModernAuthLayout } from "@/components/shared/ModernAuthLayout";

const ForgotPasswordPage = () => {
  return (
    <ModernAuthLayout
      title="Forgot Password?"
      description="No worries! Enter your email and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </ModernAuthLayout>
  );
};

export default ForgotPasswordPage;
