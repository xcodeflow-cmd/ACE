import { PrismaClient } from "@prisma/client";

declare global {
  var __acePrisma: PrismaClient | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.__acePrisma) {
    global.__acePrisma = new PrismaClient();
  }

  return global.__acePrisma;
}
