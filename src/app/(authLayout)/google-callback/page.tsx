"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { syncGoogleAuthAction } from "@/services/Auth/googleAuth.service";
import { Loader2 } from "lucide-react";

interface GoogleCallbackProps {
  searchParams: Promise<{
    accessToken?: string;
    refreshToken?: string;
    sessionToken?: string;
    redirectPath?: string;
    error?: string;
  }>;
}

export default function GoogleCallbackPage({
  searchParams: searchParamsPromise,
}: GoogleCallbackProps) {
  const router = useRouter();
  const searchParams = use(searchParamsPromise);
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const syncTokens = async () => {
      const { accessToken, refreshToken, sessionToken, redirectPath, error } =
        searchParams;

      if (error) {
        router.push(`/login?error=${error}`);
        return;
      }

      if (!accessToken || !refreshToken || !sessionToken) {
        router.push("/login?error=missing_tokens");
        return;
      }

      try {
        const result = await syncGoogleAuthAction(
          accessToken,
          refreshToken,
          sessionToken,
        );

        if (result.success) {
          router.push(redirectPath || "/");
        } else {
          setStatus("error");
          setErrorMessage(result.message || "Token sync failed");
          router.push(`/login?error=token_sync_failed`);
        }
      } catch (err) {
        console.error("Sync error:", err);
        setStatus("error");
        router.push(`/login?error=token_sync_failed`);
      }
    };

    syncTokens();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <h1 className="text-xl font-semibold tracking-tight">
          Completing Google Login...
        </h1>
        <p className="text-sm text-gray-400">
          Please wait while we sync your session.
        </p>
        {status === "error" && (
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
