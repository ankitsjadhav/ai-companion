"use client";

import { useMemo, useCallback } from "react";
import { LogOut, Sparkles } from "lucide-react";
import Link from "next/link";

import { useUser, useClerk, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileSideBar } from "@/components/mobile-sidebar";
import { useProModal } from "@/app/hooks/use-pro-modal";

export default function Navbar({ isPro }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const proModal = useProModal();

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL;

  const isDemo = useMemo(() => {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    return email && demoEmail && email === demoEmail;
  }, [user, demoEmail]);

  const handleDemoSignOut = useCallback(() => {
    signOut(() => {
      window.location.replace("/landing");
    });
  }, [signOut]);

  const handleUpgrade = useCallback(() => {
    proModal.onOpen();
  }, [proModal]);

  return (
    <nav className="w-full relative z-40 flex items-center justify-between h-20 px-6 md:px-12 bg-transparent">
      <div className="flex items-center gap-x-2">
        <MobileSideBar isPro={isPro} />

        <Link
          href="/"
          prefetch
          className="hidden sm:flex items-center gap-x-3 ml-2 group"
        >
          <div className="relative flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 shadow-[0_8px_16px_rgba(79,70,229,0.2)] group-hover:shadow-[0_8px_24px_rgba(147,51,234,0.4)] transition-all duration-300 border border-white/10 overflow-hidden">
            {}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
            <span className="relative z-10 text-white font-bold text-sm tracking-wider">
              CS
            </span>
          </div>
          <h1 className="hidden sm:block text-xl font-extrabold text-white tracking-tight group-hover:text-white/90 transition-colors">
            Cortex Stream
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-x-4">
        {!isPro && (
          <Button
            size="sm"
            variant="premium"
            onClick={handleUpgrade}
            className="hidden sm:flex rounded-full px-4 shadow-md shadow-indigo-500/20"
          >
            Upgrade
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
        )}

        {isDemo ? (
          <button
            onClick={handleDemoSignOut}
            className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 focus:outline-none shadow-md shadow-purple-500/20"
            aria-label="Sign out demo user"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <UserButton
            afterSignOutUrl="/landing"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-primary/10",
              },
            }}
          />
        )}
      </div>
    </nav>
  );
}

