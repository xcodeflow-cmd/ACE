import { NextResponse } from "next/server";

import { authenticateAdmin, createAdminToken, SESSION_COOKIE } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const email = await authenticateAdmin(parsed.data.email, parsed.data.password);

  if (!email) {
    return NextResponse.json({ error: "Authentication failed." }, { status: 401 });
  }

  const token = await createAdminToken(email);
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
