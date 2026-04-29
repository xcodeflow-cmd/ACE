import type {
  DiscordServerView,
  EventPreview,
  LeaderboardEntry,
  NewsItem,
  RaceHistoryEntry,
} from "@/lib/types";

export const demoEvents: EventPreview[] = [
  {
    id: "demo-spa",
    slug: "endurance-night-spa",
    name: "Endurance Night at Spa",
    description: "90 minutes of GT3 pace management, strategy calls, and traffic pressure.",
    trackName: "Spa-Francorchamps",
    eventDate: "2026-05-08T19:30:00.000Z",
    capacity: 42,
    status: "PUBLISHED",
  },
  {
    id: "demo-monza",
    slug: "draft-war-monza",
    name: "Draft War Monza Sprint",
    description: "High-risk qualifying and a sprint race that rewards nerve under braking.",
    trackName: "Monza",
    eventDate: "2026-05-15T18:00:00.000Z",
    capacity: 36,
    status: "PUBLISHED",
  },
  {
    id: "demo-silverstone",
    slug: "silverstone-championship-round",
    name: "Championship Round at Silverstone",
    description: "Full points weekend with balance, tire discipline, and long-run consistency.",
    trackName: "Silverstone",
    eventDate: "2026-05-22T19:00:00.000Z",
    capacity: 40,
    status: "PUBLISHED",
  },
];

export const demoDiscord: DiscordServerView = {
  name: "ACE Racing Club",
  iconUrl: undefined,
  memberCount: 482,
  onlineCount: 61,
  inviteUrl: "https://discord.gg/ace",
  description: "Daily practice, race control updates, live stewarding, and event signup.",
  statusLabel: "Connected",
  lastSyncedAt: new Date("2026-04-30T00:00:00.000Z").toISOString(),
};

export const demoLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    driver: "Mara Voss",
    ranking: 1,
    kmr: 3120,
    paceScore: 98.2,
    consistency: 96.4,
    bestLap: "1:43.245",
  },
  {
    id: "2",
    driver: "Kenji Arai",
    ranking: 2,
    kmr: 3075,
    paceScore: 97.6,
    consistency: 95.2,
    bestLap: "1:43.998",
  },
  {
    id: "3",
    driver: "Luca Bianchi",
    ranking: 3,
    kmr: 2988,
    paceScore: 96.9,
    consistency: 94.7,
    bestLap: "1:44.552",
  },
  {
    id: "4",
    driver: "Sarah Holt",
    ranking: 4,
    kmr: 2944,
    paceScore: 95.8,
    consistency: 93.1,
    bestLap: "1:44.904",
  },
];

export const demoRaceHistory: RaceHistoryEntry[] = [
  {
    id: "r1",
    driver: "Mara Voss",
    trackName: "Spa-Francorchamps",
    carName: "Porsche 911 GT3 R",
    position: 1,
    incidentPoints: 1,
    finishedAt: "2026-04-25T20:45:00.000Z",
  },
  {
    id: "r2",
    driver: "Kenji Arai",
    trackName: "Monza",
    carName: "BMW M4 GT3",
    position: 2,
    incidentPoints: 3,
    finishedAt: "2026-04-18T20:10:00.000Z",
  },
  {
    id: "r3",
    driver: "Luca Bianchi",
    trackName: "Silverstone",
    carName: "Ferrari 296 GT3",
    position: 3,
    incidentPoints: 0,
    finishedAt: "2026-04-11T19:55:00.000Z",
  },
];

export const demoNews: NewsItem[] = [
  {
    id: "n1",
    slug: "championship-reboot",
    title: "Season Restart: sharper stewarding, tighter race control",
    excerpt: "ACE updates race operations to keep long-form competition clean and predictable.",
    publishedAt: "2026-04-20T09:00:00.000Z",
  },
  {
    id: "n2",
    slug: "kmr-dashboard",
    title: "KMR dashboard now tracks pace and consistency side by side",
    excerpt: "Drivers can compare outright speed with discipline over a full event cycle.",
    publishedAt: "2026-04-14T10:00:00.000Z",
  },
];
