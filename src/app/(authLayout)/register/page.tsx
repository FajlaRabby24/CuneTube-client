import { SignupForm } from "@/components/modules/Auth/signup-form";
import { ModernAuthLayout } from "@/components/shared/ModernAuthLayout";

const RegisterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirectPath: string }>;
}) => {
  const { redirectPath } = await searchParams;

  return (
    <ModernAuthLayout
      title="Create Account"
      description="Join thousands of movie lovers and share your thoughts."
    >
      <SignupForm redirectPath={redirectPath} />
    </ModernAuthLayout>
  );
};

export default RegisterPage;
