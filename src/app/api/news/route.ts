import { NextResponse } from "next/server";

import { readAdminSession } from "@/lib/auth";
import { createNewsPost, getNewsPreview } from "@/lib/services/events";
import { newsSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json(await getNewsPreview());
}

export async function POST(request: Request) {
  const session = await readAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = newsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const post = await createNewsPost(parsed.data);
  return NextResponse.json({ post });
}
