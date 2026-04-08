import { LoginForm } from "@/components/modules/Auth/login-form";
import { AuthBackground } from "@/components/shared/AuthBackground";

const LoginPage = () => {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
