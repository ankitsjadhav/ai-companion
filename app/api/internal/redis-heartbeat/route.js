import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Check if the request is properly authorized via the configured cron secret
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Initialize Redis connection
    const redis = Redis.fromEnv();
    
    // Perform a minimal operation to keep the Upstash instance alive
    await redis.set("system:heartbeat", Date.now().toString());

    return NextResponse.json({ 
      success: true, 
      message: "Redis heartbeat successful." 
    }, { status: 200 });

  } catch (error) {
    console.error("[CRON_KEEP_ALIVE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
