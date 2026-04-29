export type EventPreview = {
  id: string;
  slug: string;
  name: string;
  description: string;
  trackName: string;
  eventDate: string;
  capacity: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export type DiscordServerView = {
  name: string;
  iconUrl?: string | null;
  memberCount: number;
  onlineCount: number;
  inviteUrl: string;
  description: string;
  statusLabel: string;
  lastSyncedAt: string;
};

export type LeaderboardEntry = {
  id: string;
  driver: string;
  ranking: number;
  kmr: number;
  paceScore: number;
  consistency: number;
  bestLap: string;
};

export type RaceHistoryEntry = {
  id: string;
  driver: string;
  trackName: string;
  carName: string;
  position: number;
  incidentPoints: number;
  finishedAt: string;
};

export type DashboardData = {
  leaderboard: LeaderboardEntry[];
  raceHistory: RaceHistoryEntry[];
};

export type LandingData = {
  events: EventPreview[];
  discord: DiscordServerView;
  leaderboard: LeaderboardEntry[];
  news: NewsItem[];
};

export type AdminOverview = {
  eventsCount: number;
  publishedNewsCount: number;
  driversCount: number;
  discordName: string;
};
