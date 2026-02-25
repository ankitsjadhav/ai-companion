"use client";

import React from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function ChatForm({
  handleInputChange,
  input,
  isLoading,
  onSubmit,
}) {
  const placeholders = [
    "Type your message...",
    "Ask me a question...",
    "What's on your mind?",
    "Share a thought...",
    "Say hello..."
  ];

  return (
    <div className="border-t border-primary/10 pt-4 pb-4 w-full">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleInputChange}
        onSubmit={onSubmit}
        className="chat-input backdrop-blur-xl h-12 md:h-14"
      />
    </div>
  );
}
