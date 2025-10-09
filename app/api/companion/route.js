import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !categoryId
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    // const isPro = await checkSubscription();

    const existingCompanions = await prismadb.companion.count({
      where: { userId: user.id },
    });

    if (existingCompanions >= 1) {
      const isPro = await checkSubscription();
      if (!isPro) {
        return new NextResponse(
          "Pro Subscription is Required to Create Additional Companions.",
          { status: 403 }
        );
      }
    }

    const displayName = user.username ?? user.firstName ?? "";

    const companion = await prismadb.companion.create({
      data: {
        categoryId,
        userId: user.id,
        username: displayName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
