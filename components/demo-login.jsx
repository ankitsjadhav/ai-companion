"use client";

import { useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DemoLoginButton() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDemoClick = async () => {
    if (!isLoaded || loading) return;

    if (user) {
      router.push("/");
      return;
    }

    setLoading(true);

    try {
      // Request a secure, passwordless sign-in ticket from our backend API
      const response = await fetch("/api/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || "Unable to initialize demo account session."
        );
      }

      const { token } = await response.json();

      if (!token) {
        throw new Error("No demo authentication ticket returned.");
      }

      // Sign in using Clerk's ticket strategy (bypasses password & breach checks)
      const result = await signIn.create({
        strategy: "ticket",
        ticket: token,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        toast.success("Signed in with Demo account!");
        router.push("/");
        router.refresh();
        return;
      }

      console.error("Unexpected sign-in status:", result);
      toast.error("Demo login requires additional verification. Please sign in manually.");
    } catch (err) {
      console.error("Demo login error:", err);
      toast.error(err?.message || "Demo login failed. Please try signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onDemoClick}
      disabled={loading}
      className="w-full max-w-xs px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 focus:ring-pink-500 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
      aria-label="Try demo account"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Signing in…</span>
        </>
      ) : (
        "Try Demo"
      )}
    </button>
  );
}
