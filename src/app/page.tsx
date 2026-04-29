import { LandingExperience } from "@/components/landing/landing-experience";
import { getDiscordSnapshot } from "@/lib/services/discord";
import { getUpcomingEvents, getNewsPreview } from "@/lib/services/events";
import { getLeaderboard } from "@/lib/services/kmr";

export default async function Home() {
  const [events, discord, leaderboard, news] = await Promise.all([
    getUpcomingEvents(),
    getDiscordSnapshot(),
    getLeaderboard(),
    getNewsPreview(),
  ]);

  return (
    <main className="min-h-screen">
      <LandingExperience
        events={events}
        discord={discord}
        leaderboard={leaderboard}
        news={news}
      />
    </main>
  );
}
