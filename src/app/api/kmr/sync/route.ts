import { NextResponse } from "next/server";

import { readAdminSession } from "@/lib/auth";
import { syncKmrSnapshot } from "@/lib/services/kmr";

export async function POST() {
  const session = await readAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await syncKmrSnapshot());
}
