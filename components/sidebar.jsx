"use client";

import { cn } from "@/lib/utils";
import { Home, PlusIcon, SettingsIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useProModal } from "@/app/hooks/use-pro-modal";
import { FloatingDock } from "@/components/ui/floating-dock";

export default function Sidebar({ isPro }) {
  const pathname = usePathname();
  const router = useRouter();
  const proModal = useProModal();

  const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
      pro: false,
    },
    {
      icon: PlusIcon,
      href: "/companion/new",
      label: "Create",
      pro: false,
    },
    {
      icon: SettingsIcon,
      href: "/settings",
      label: "Settings",
      pro: false,
    },
  ];

  const onNavigate = (url, pro) => {
    if (pro && !isPro) return proModal.onOpen();

    return router.push(url);
  };

  const dockItems = routes.map((route) => ({
    title: route.label,
    icon: <route.icon className="h-full w-full" />,
    href: route.href,
    onClick: (e) => {
      e.preventDefault();
      onNavigate(route.href, route.pro);
    }
  }));

  return (
    <div className="flex items-center justify-center w-full relative z-50">
      <FloatingDock items={dockItems} />
    </div>
  );
}
