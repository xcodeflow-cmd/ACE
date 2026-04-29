import { getDb, isDatabaseConfigured } from "@/lib/db";
import { demoLeaderboard, demoRaceHistory } from "@/lib/demo-data";
import type { DashboardData, LeaderboardEntry, RaceHistoryEntry } from "@/lib/types";

function msToLap(value?: number | null) {
  if (!value) {
    return "--:--.---";
  }

  const minutes = Math.floor(value / 60000);
  const seconds = Math.floor((value % 60000) / 1000);
  const millis = value % 1000;
  return `${minutes}:${seconds.toString().padStart(2, "0")}.${millis
    .toString()
    .padStart(3, "0")}`;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!isDatabaseConfigured()) {
    return demoLeaderboard;
  }

  const drivers = await getDb().driverProfile.findMany({
    orderBy: { ranking: "asc" },
    take: 10,
  });

  return drivers.map((driver) => ({
    id: driver.id,
    driver: driver.displayName,
    ranking: driver.ranking,
    kmr: driver.kmr,
    paceScore: driver.paceScore,
    consistency: driver.consistency,
    bestLap: msToLap(driver.bestLapMs),
  }));
}

export async function getRaceHistory(): Promise<RaceHistoryEntry[]> {
  if (!isDatabaseConfigured()) {
    return demoRaceHistory;
  }

  const races = await getDb().raceResult.findMany({
    include: { driver: true },
    orderBy: { finishedAt: "desc" },
    take: 8,
  });

  return races.map((race) => ({
    id: race.id,
    driver: race.driver.displayName,
    trackName: race.trackName,
    carName: race.carName,
    position: race.position,
    incidentPoints: race.incidentPoints,
    finishedAt: race.finishedAt.toISOString(),
  }));
}

export async function getDashboardData(): Promise<DashboardData> {
  return {
    leaderboard: await getLeaderboard(),
    raceHistory: await getRaceHistory(),
  };
}

export async function syncKmrSnapshot() {
  const apiUrl = process.env.ACE_KMR_API_URL;

  if (!apiUrl) {
    return {
      leaderboard: demoLeaderboard,
      raceHistory: demoRaceHistory,
      source: "demo",
    };
  }

  const response = await fetch(apiUrl, {
    headers: process.env.ACE_KMR_API_KEY
      ? { Authorization: `Bearer ${process.env.ACE_KMR_API_KEY}` }
      : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch KMR stats.");
  }

  const payload = (await response.json()) as {
    leaderboard?: LeaderboardEntry[];
    raceHistory?: RaceHistoryEntry[];
  };

  return {
    leaderboard: payload.leaderboard ?? demoLeaderboard,
    raceHistory: payload.raceHistory ?? demoRaceHistory,
    source: "remote",
  };
}
