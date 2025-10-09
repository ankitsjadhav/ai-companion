"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileSideBar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useProModal } from "@/app/hooks/use-pro-modal";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export default function Navbar({ isPro }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const proModal = useProModal();

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL;
  const isDemo = user?.emailAddresses?.[0]?.emailAddress === demoEmail;

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSideBar isPro={isPro} />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            companion.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!isPro && (
          <Button size="sm" variant="premium" onClick={proModal.onOpen}>
            Upgrade
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
        )}
        <ModeToggle />

        {isDemo ? (
          <button
            onClick={() =>
              signOut(() => {
                setTimeout(() => window.location.replace("/landing"), 500);
              })
            }
            // className="px-4 py-2 rounded bg-primary/10 text-primary hover:bg-primary/20 transition border-none"
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 border-0"
            aria-label="Sign out demo user"
          >
            Sign out
          </button>
        ) : (
          <UserButton afterSignOutUrl="/landing" />
        )}
      </div>
    </div>
  );
}

// "use client";

// import { Menu, Sparkles } from "lucide-react";
// import Link from "next/link";
// import { Button } from "./ui/button";
// import { Poppins } from "next/font/google";
// import { cn } from "@/lib/utils";
// import { UserButton } from "@clerk/nextjs";
// import { ModeToggle } from "./mode-toggle";
// import { MobileSideBar } from "./mobile-sidebar";
// import { useProModal } from "@/app/hooks/use-pro-modal";

// const font = Poppins({
//   weight: "600",
//   subsets: ["latin"],
// });

// export default function Navbar({ isPro }) {
//   const proModal = useProModal();

//   return (
//     <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 bg-secondary">
//       <div className="flex items-center">
//         <MobileSideBar isPro={isPro} />
//         <Link href="/">
//           <h1
//             className={cn(
//               "hidden md:block text-xl md:text-3xl font-bold text-primary",
//               font.className
//             )}
//           >
//             companion.ai
//           </h1>
//         </Link>
//       </div>
//       <div className="flex items-center gap-x-3">
//         {!isPro && (
//           <Button size="sm" variant="premium" onClick={proModal.onOpen}>
//             Upgrade
//             <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
//           </Button>
//         )}
//         <ModeToggle />
//         <UserButton afterSignOutUrl="/" />
//       </div>
//     </div>
//   );
// }
