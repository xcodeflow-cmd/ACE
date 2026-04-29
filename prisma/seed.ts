import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_PASSWORD ?? "change-me";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@ace.local" },
    update: {
      name: "ACE Admin",
      passwordHash,
    },
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@ace.local",
      name: "ACE Admin",
      passwordHash,
    },
  });

  await prisma.discordServerSnapshot.upsert({
    where: { id: "primary" },
    update: {
      name: "ACE Racing Club",
      memberCount: 482,
      onlineCount: 61,
      inviteUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.gg/ace",
      description: "Competitive racing. Real community.",
    },
    create: {
      id: "primary",
      name: "ACE Racing Club",
      memberCount: 482,
      onlineCount: 61,
      inviteUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.gg/ace",
      description: "Competitive racing. Real community.",
    },
  });

  const drivers = await Promise.all(
    [
      ["steam-mara-voss", "Mara Voss", 1, 3120, 98.2, 96.4, 103245],
      ["steam-kenji-arai", "Kenji Arai", 2, 3075, 97.6, 95.2, 103998],
      ["steam-luca-bianchi", "Luca Bianchi", 3, 2988, 96.9, 94.7, 104552],
    ].map(([steamId, displayName, ranking, kmr, paceScore, consistency, bestLapMs]) =>
      prisma.driverProfile.upsert({
        where: { steamId: steamId as string },
        update: {
          displayName: displayName as string,
          ranking: ranking as number,
          kmr: kmr as number,
          paceScore: paceScore as number,
          consistency: consistency as number,
          bestLapMs: bestLapMs as number,
        },
        create: {
          steamId: steamId as string,
          displayName: displayName as string,
          ranking: ranking as number,
          kmr: kmr as number,
          paceScore: paceScore as number,
          consistency: consistency as number,
          bestLapMs: bestLapMs as number,
        },
      }),
    ),
  );

  await prisma.raceResult.createMany({
    data: [
      {
        driverId: drivers[0].id,
        trackName: "Spa-Francorchamps",
        carName: "Porsche 911 GT3 R",
        position: 1,
        incidentPoints: 1,
        lapTimeMs: 103245,
        totalTimeMs: 5442000,
        finishedAt: new Date(),
      },
      {
        driverId: drivers[1].id,
        trackName: "Monza",
        carName: "BMW M4 GT3",
        position: 2,
        incidentPoints: 3,
        lapTimeMs: 103998,
        totalTimeMs: 5470000,
        finishedAt: new Date(),
      },
      {
        driverId: drivers[2].id,
        trackName: "Silverstone",
        carName: "Ferrari 296 GT3",
        position: 3,
        incidentPoints: 0,
        lapTimeMs: 104552,
        totalTimeMs: 5496000,
        finishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
