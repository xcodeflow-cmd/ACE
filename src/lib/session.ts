import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ace_admin_session";

export type AdminSession = {
  email: string;
  role: "admin";
};

function getJwtSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "ace-dev-secret-change-me",
  );
}

export async function createAdminToken(email: string) {
  return new SignJWT({ email, role: "admin" satisfies AdminSession["role"] })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export async function readAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token ? verifyAdminToken(token) : null;
}
