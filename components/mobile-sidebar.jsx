"use client";

import { Menu, Home, PlusIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useProModal } from "@/app/hooks/use-pro-modal";
import { cn } from "@/lib/utils";

import {
  SheetContent,
  Sheet,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

export const MobileSideBar = ({ isPro }) => {
  const pathname = usePathname();
  const router = useRouter();
  const proModal = useProModal();

  const routes = [
    { icon: Home, href: "/", label: "Home", pro: false },
    { icon: PlusIcon, href: "/companion/new", label: "Create", pro: false },
    { icon: SettingsIcon, href: "/settings", label: "Settings", pro: false },
  ];

  const onNavigate = (url, pro) => {
    if (pro && !isPro) return proModal.onOpen();
    return router.push(url);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="text-white h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-4 bg-zinc-950/95 border-r border-white/10 pt-16 w-28 flex flex-col gap-y-6 items-center">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Access navigation options
        </SheetDescription>

        <div className="flex flex-col gap-y-6 w-full mt-8">
          {routes.map((route) => (
            <div
              onClick={() => onNavigate(route.href, route.pro)}
              key={route.href}
              className={cn(
                "group flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all duration-300 w-full",
                pathname === route.href ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              )}
            >
              <route.icon className="h-6 w-6 mb-1.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">{route.label}</span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
