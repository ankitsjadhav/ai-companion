import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { ChatClient } from "@/app/(chat)/(routes)/chat/[chatId]/components/client";

async function ChatIdPage({ params }) {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const companion = await prismadb.companion.findUnique({
    where: { id: params.chatId },
    include: {
      messages: { orderBy: { createdAt: "asc" }, where: { userId } },
      _count: { select: { messages: true } },
    },
  });

  if (!companion) return redirect("/");

  return <ChatClient companion={companion} />;
}

export default ChatIdPage;
