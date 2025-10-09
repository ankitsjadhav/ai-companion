"use client";

import { useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
      const identifier = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL;
      const password = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD;

      if (!identifier || !password) {
        throw new Error(
          "Demo credentials missing in env (NEXT_PUBLIC_DEMO_USER_EMAIL / _PASSWORD)."
        );
      }

      const result = await signIn.create({ identifier, password });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push("/"); // Redirect after successful login
        return;
      }

      console.error("Unexpected sign-in result:", result);
      alert(
        "Demo login requires additional verification. Please Sign in instead."
      );
    } catch (err) {
      console.error("Demo login error:", err);
      alert(err?.message ?? "Demo login failed. Please try Sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onDemoClick}
      disabled={loading}
      className="w-full max-w-xs px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 focus:ring-pink-500 disabled:opacity-60"
      aria-label="Try demo account"
    >
      {loading ? "Signing in…" : "Try Demo"}
    </button>
  );
}
