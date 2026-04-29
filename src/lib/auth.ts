import bcrypt from "bcryptjs";
export { createAdminToken, readAdminSession, SESSION_COOKIE, verifyAdminToken } from "@/lib/session";

export async function authenticateAdmin(email: string, password: string) {
  if (process.env.DATABASE_URL) {
    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const admin = await db.adminUser.findUnique({ where: { email } });

    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      return admin.email;
    }
  }

  const fallbackEmail = process.env.ADMIN_EMAIL ?? "admin@ace.local";
  const fallbackPassword = process.env.ADMIN_PASSWORD ?? "change-me";

  if (email === fallbackEmail && password === fallbackPassword) {
    return email;
  }

  return null;
}
