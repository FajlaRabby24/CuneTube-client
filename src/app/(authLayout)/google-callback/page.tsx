import { redirect } from "next/navigation";
import { syncGoogleAuthAction } from "@/services/Auth/googleAuth.service";

interface GoogleCallbackProps {
  searchParams: Promise<{
    accessToken?: string;
    refreshToken?: string;
    sessionToken?: string;
    redirectPath?: string;
    error?: string;
  }>;
}

export default async function GoogleCallbackPage({
  searchParams,
}: GoogleCallbackProps) {
  const { accessToken, refreshToken, sessionToken, redirectPath, error } =
    await searchParams;

  if (error) {
    redirect(`/login?error=${error}`);
  }

  if (!accessToken || !refreshToken || !sessionToken) {
    redirect("/login?error=missing_tokens");
  }

  const result = await syncGoogleAuthAction(
    accessToken,
    refreshToken,
    sessionToken,
  );

  if (result.success) {
    redirect(redirectPath || "/");
  } else {
    redirect(`/login?error=token_sync_failed`);
  }
}
