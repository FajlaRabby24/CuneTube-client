import { LoginForm } from "@/components/modules/Auth/login-form";
import { AuthBackground } from "@/components/shared/AuthBackground";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
          <LoginForm redirectPath={redirectPath} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
