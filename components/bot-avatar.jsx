import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function BotAvatar({ src }) {
  return (
    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-white/10 shadow-sm">
      <AvatarImage src={src} className="w-full h-full object-cover block" />
    </Avatar>
  );
}
