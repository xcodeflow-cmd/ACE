import { NextResponse } from "next/server";

import { readAdminSession } from "@/lib/auth";
import { createEvent, getUpcomingEvents } from "@/lib/services/events";
import { postDiscordEventWebhook } from "@/lib/services/discord";
import { eventSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json(await getUpcomingEvents());
}

export async function POST(request: Request) {
  const session = await readAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const event = await createEvent(parsed.data);
  const webhook = await postDiscordEventWebhook(parsed.data);

  return NextResponse.json({
    event,
    discord: webhook,
  });
}
