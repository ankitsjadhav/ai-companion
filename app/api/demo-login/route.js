import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const demoEmail =
      process.env.DEMO_USER_EMAIL ||
      process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ||
      "test3@gmail.com";

    const client = await clerkClient();

    let demoUser = null;

    if (process.env.DEMO_USER_ID) {
      try {
        demoUser = await client.users.getUser(process.env.DEMO_USER_ID);
      } catch (err) {
        console.warn("Could not find demo user by DEMO_USER_ID, falling back to email search:", err);
      }
    }

    if (!demoUser) {
      const users = await client.users.getUserList({
        emailAddress: [demoEmail],
      });
      demoUser = users.data?.[0];
    }

    if (!demoUser) {
      console.error(`Demo user not found with email: ${demoEmail}`);
      return NextResponse.json(
        { error: "Demo user account not found. Please contact support or sign in manually." },
        { status: 404 }
      );
    }

    // Create a secure sign-in token (valid for 5 minutes)
    // This allows passwordless login without triggering compromised password checks
    const signInToken = await client.signInTokens.createSignInToken({
      userId: demoUser.id,
      expiresInSeconds: 300,
    });

    return NextResponse.json({ token: signInToken.token });
  } catch (error) {
    console.error("Demo login API error:", error);
    return NextResponse.json(
      { error: "Failed to generate demo session token." },
      { status: 500 }
    );
  }
}
