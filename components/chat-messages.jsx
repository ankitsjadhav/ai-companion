"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/chat-message";

export default function ChatMessages({ companion, isLoading, messages = [] }) {
  const scrollRef = useRef(null);

  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        key="greeting"
        isLoading={fakeLoading}
        src={companion.src}
        role="system"
        content={`Hello, I'm ${companion.name}, ${companion.description}.`}
      />

      {messages.map((message, index) => (
        <ChatMessage
          key={message.id || `chat-msg-${index}`}
          role={message.role}
          content={message.content}
          src={companion.src}
        />
      ))}
      {isLoading && <ChatMessage role="system" src={companion.src} isLoading />}

      <div ref={scrollRef} />
    </div>
  );
}
