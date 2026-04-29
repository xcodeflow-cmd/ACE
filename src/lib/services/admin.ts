import { getDb, isDatabaseConfigured } from "@/lib/db";
import type { AdminOverview } from "@/lib/types";

export async function getAdminOverview(): Promise<AdminOverview> {
  if (!isDatabaseConfigured()) {
    return {
      eventsCount: 3,
      publishedNewsCount: 2,
      driversCount: 4,
      discordName: "ACE Racing Club",
    };
  }

  const [eventsCount, publishedNewsCount, driversCount, discord] = await Promise.all([
    getDb().event.count(),
    getDb().newsPost.count({ where: { published: true } }),
    getDb().driverProfile.count(),
    getDb().discordServerSnapshot.findUnique({ where: { id: "primary" } }),
  ]);

  return {
    eventsCount,
    publishedNewsCount,
    driversCount,
    discordName: discord?.name ?? "Not synced",
  };
}
