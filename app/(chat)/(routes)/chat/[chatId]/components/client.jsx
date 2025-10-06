"use client";

import ChatHeader from "@/components/chat-header";

export const ChatClient = ({ companion }) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
    </div>
  );
};
