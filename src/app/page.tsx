import { LandingExperience } from "@/components/landing/landing-experience";
import { demoDiscord, demoEvents, demoLeaderboard, demoNews } from "@/lib/demo-data";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingExperience
        events={demoEvents}
        discord={demoDiscord}
        leaderboard={demoLeaderboard}
        news={demoNews}
      />
    </main>
  );
}
