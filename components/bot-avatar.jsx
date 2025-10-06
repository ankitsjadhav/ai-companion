import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function BotAvatar({ src }) {
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={src} className="w-full h-full object-cover" />
    </Avatar>
  );
}
