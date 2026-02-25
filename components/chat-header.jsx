"use client";

import React from "react";

import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

import { Button } from "@/components/ui/button";
import BotAvatar from "@/components/bot-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ChatHeader({ companion }) {
  const router = useRouter();
  const { user } = useUser();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/companion/${companion.id}`);
      toast.success("Success");
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  return (
    <div className="flex w-full justify-between items-center border-b border-white/5 pb-3 sm:pb-4">
      <div className="flex gap-x-2 items-center">
        <Button onClick={() => router.push("/")} size="icon" variant="ghost" className="h-8 w-8 sm:h-10 sm:w-10">
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <div className="flex flex-row items-center mr-1 sm:mr-2 hover:scale-105 transition-transform cursor-default">
          <BotAvatar src={companion.src} />
        </div>
        <div className="flex flex-col gap-y-0.5 sm:gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="text-base sm:text-lg font-extrabold tracking-tight">{companion.name}</p>
            <div className="hidden sm:flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="w-3 h-3 mr-1" />
              {companion._count.messages}
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground/70 flex items-center tracking-wide">
            <span className="sm:hidden mr-1.5">{companion._count.messages} chats &bull;</span>
            <span className="hidden sm:inline">Created by </span>
            <span className="sm:hidden">by </span>
            {companion.username}
          </p>
        </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/companion/${companion.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
