import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import ChatClient from "@/app/(chat)/(routes)/chat/[chatId]/components/client";

async function ChatIdPage({ params }) {
  const resolvedParams = await params;
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const companion = await prismadb.companion.findUnique({
    where: { id: resolvedParams.chatId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      _count: { select: { messages: true } },
    },
  });

  if (!companion) return redirect("/");

  console.log(
    `[SERVER PAGE] Fetched data for companion ${companion.id}:`,
    JSON.stringify(companion.messages, null, 2)
  );

  return <ChatClient companion={companion} />;
}

export default ChatIdPage;
