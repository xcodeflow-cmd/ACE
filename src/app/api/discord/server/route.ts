import { NextResponse } from "next/server";

import { getDiscordSnapshot } from "@/lib/services/discord";

export async function GET() {
  return NextResponse.json(await getDiscordSnapshot());
}
