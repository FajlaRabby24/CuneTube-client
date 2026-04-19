import { LoginForm } from "@/components/modules/Auth/login-form";
import { ModernAuthLayout } from "@/components/shared/ModernAuthLayout";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirectPath: string }>;
}) => {
  const { redirectPath } = await searchParams;

  return (
    <ModernAuthLayout
      title="Welcome Back"
      description="Sign in to your account and explore the world of cinema."
    >
      <LoginForm redirectPath={redirectPath} />
    </ModernAuthLayout>
  );
};

export default LoginPage;
