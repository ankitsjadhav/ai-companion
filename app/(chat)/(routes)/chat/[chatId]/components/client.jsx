"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ChatHeader from "@/components/chat-header";
import ChatForm from "@/components/chat-form";
import ChatMessages from "@/components/chat-messages";

export default function ChatClient({ companion }) {
  const router = useRouter();
  const [messages, setMessages] = useState(companion.messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("ChatClient received companion:", companion);
  console.log("ChatClient messages:", companion.messages);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${companion.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const systemMessage = {
        role: "system",
        content: data.text,
      };

      setMessages((current) => [...current, systemMessage]);
      setInput("");
      router.refresh();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        handleInputChange={handleInputChange}
        input={input}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
