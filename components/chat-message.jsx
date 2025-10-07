"use client";

import React from "react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import BotAvatar from "@/components/bot-avatar";
import UserAvatar from "@/components/user-avatar";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function ChatMessage({ role, content, isLoading, src }) {
  const { theme } = useTheme();

  console.log("ChatMessage props:", { role, content, isLoading, src });
  console.log("Content length:", content?.length);
  console.log("Is content truthy:", !!content);

  const onCopy = () => {
    if (!content) return;

    navigator.clipboard.writeText(content);
    toast("Message Copied to Clipboard.", { duration: 3000 });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading ? (
          <BeatLoader size={5} color={theme === "light" ? "black" : "white"} />
        ) : (
          content
        )}
      </div>
      {role === "user" && <UserAvatar />}
      {role !== "user" && (
        <Button
          className="opacity-0 group-hover:opacity-100 transition"
          onClick={onCopy}
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
