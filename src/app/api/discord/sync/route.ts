import { NextResponse } from "next/server";

import { readAdminSession } from "@/lib/auth";
import { syncDiscordSnapshot } from "@/lib/services/discord";

export async function POST(request: Request) {
  const session = await readAdminSession();
  const secret = request.headers.get("x-sync-secret");

  if (!session && (!secret || secret !== process.env.DISCORD_SYNC_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await syncDiscordSnapshot());
}
