"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { DiscordServerView, EventPreview, LeaderboardEntry, NewsItem } from "@/lib/types";
import { formatCompactDate, formatCount, formatRaceDate, formatSyncTime } from "@/lib/utils";

type LandingExperienceProps = {
  events: EventPreview[];
  discord: DiscordServerView;
  leaderboard: LeaderboardEntry[];
  news: NewsItem[];
};

export function LandingExperience({
  events,
  discord,
  leaderboard,
  news,
}: LandingExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-title]",
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      const pinnedCard = document.querySelector("[data-pin-card]");
      const pinnedSection = document.querySelector("[data-pin-section]");

      if (pinnedCard && pinnedSection) {
        ScrollTrigger.create({
          trigger: pinnedSection,
          start: "top top",
          end: "+=900",
          pin: pinnedCard,
          scrub: 0.6,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-x-clip">
      <section className="relative flex min-h-screen items-end overflow-hidden px-6 pb-10 pt-28 sm:px-10 lg:px-16">
        <div className="hero-gradient absolute inset-0" />
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div
          data-parallax
          className="absolute inset-x-[-10%] top-[-8%] h-[50vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,101,47,0.34),transparent_55%)] blur-3xl"
        />
        <div
          data-parallax
          className="absolute bottom-[-18%] right-[-10%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_55%)] blur-3xl"
        />

        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <p data-reveal className="eyebrow">
              ACE / Assetto Corsa Experience
            </p>
            <div data-hero-title className="space-y-5">
              <h1 className="max-w-5xl font-display text-6xl font-semibold uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-7xl lg:text-[7.75rem]">
                ACE
                <span className="mt-2 block text-white/68">Assetto Corsa Experience</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Competitive racing. Real community. Long-form events, clean stewardship,
                and a visual identity built like a motorsport campaign site.
              </p>
            </div>

            <div data-reveal className="flex flex-wrap gap-4">
              <Link href="#events" className="primary-button">
                Explore events
              </Link>
              <Link href="#discord" className="secondary-button">
                Join Discord
              </Link>
            </div>
          </div>

          <div data-reveal className="glass-panel ml-auto w-full max-w-xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/45">Live Preview</p>
                <h2 className="mt-2 font-display text-2xl text-white">Race control snapshot</h2>
              </div>
              <div className="status-pill">Server ready</div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Members", formatCount(discord.memberCount)],
                ["Online now", formatCount(discord.onlineCount)],
                ["Upcoming rounds", String(events.length)],
                ["Top KMR", String(leaderboard[0]?.kmr ?? 0)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">{label}</p>
                  <p className="mt-3 font-display text-3xl text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Next green flag</span>
                <span>{formatRaceDate(events[0].eventDate)}</span>
              </div>
              <p className="mt-3 font-display text-2xl text-white">{events[0].name}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{events[0].description}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-shell">
        <div className="section-inner">
          <div data-reveal className="max-w-xl">
            <p className="eyebrow">About ACE</p>
            <h2 className="section-title">Built like a racing broadcast, run like a real league.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Race craft first",
                text: "Event design prioritizes consistency, fair race control, and sharp pacing over chaos.",
              },
              {
                title: "Community with standards",
                text: "Discord, live server health, and championship context are presented as one connected system.",
              },
              {
                title: "Visual intensity",
                text: "The landing page uses pinned sections, parallax layers, and reveal timing to feel premium.",
              },
            ].map((item) => (
              <article key={item.title} data-reveal className="glass-panel p-7">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-300/70">01</p>
                <h3 className="mt-5 font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="events"
        data-pin-section
        className="relative min-h-[210vh] px-6 py-24 sm:px-10 lg:px-16"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-pin-card className="lg:h-fit">
            <div className="glass-panel space-y-5 p-8">
              <p className="eyebrow">Events Preview</p>
              <h2 className="section-title">
                Scroll through the calendar while the headliner stays pinned.
              </h2>
              <p className="text-base leading-8 text-slate-300">
                This section is intentionally cinematic: one dominant event card, then supporting
                rounds cascading below it with depth and motion.
              </p>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                  Highlighted round
                </p>
                <p className="mt-4 font-display text-3xl text-white">{events[0].name}</p>
                <p className="mt-2 text-sm text-amber-300">{events[0].trackName}</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">{events[0].description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-10 lg:pt-32">
            {events.map((event, index) => (
              <article
                key={event.id}
                data-reveal
                className="glass-panel relative overflow-hidden p-7 sm:p-9"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-600" />
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                      Round {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-display text-3xl text-white">{event.name}</h3>
                  </div>
                  <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/55">
                    {formatCompactDate(event.eventDate)}
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <p className="text-sm leading-7 text-slate-300">{event.description}</p>
                  <div className="space-y-2 text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/40">Grid</p>
                    <p className="font-display text-4xl text-white">{event.capacity}</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-white/10 pt-5 text-sm text-white/55">
                  Track: <span className="text-white">{event.trackName}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner">
          <div data-reveal className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="eyebrow">Live server stats / KMR</p>
              <h2 className="section-title">Leaderboard design that feels technical, not generic.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-slate-300">
              For the full product, this block would hydrate from the ACE telemetry or KMR API.
              For now, it previews the visual direction: dark glass surfaces, aggressive type, and
              strong information hierarchy.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="glass-panel overflow-hidden">
              <div className="grid grid-cols-[90px_1.4fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.26em] text-white/35">
                <span>Rank</span>
                <span>Driver</span>
                <span>KMR</span>
                <span>Pace</span>
                <span>Best lap</span>
              </div>
              <div>
                {leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    data-reveal
                    className="grid grid-cols-[90px_1.4fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-white/6 px-6 py-5 last:border-b-0"
                  >
                    <span className="font-display text-2xl text-white/70">
                      {String(entry.ranking).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-medium text-white">{entry.driver}</p>
                      <p className="mt-1 text-sm text-white/40">
                        Consistency {entry.consistency.toFixed(1)}
                      </p>
                    </div>
                    <span className="font-display text-2xl text-amber-300">{entry.kmr}</span>
                    <span className="text-white/65">{entry.paceScore.toFixed(1)}</span>
                    <span className="text-white/65">{entry.bestLap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div data-reveal className="glass-panel p-7">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Performance mix</p>
                <div className="mt-6 space-y-4">
                  {leaderboard.slice(0, 4).map((entry) => (
                    <div key={entry.id}>
                      <div className="mb-2 flex items-center justify-between text-sm text-white/65">
                        <span>{entry.driver}</span>
                        <span>{entry.paceScore.toFixed(1)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/8">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
                          style={{ width: `${entry.paceScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div data-reveal className="glass-panel p-7">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Recent updates</p>
                <div className="mt-5 space-y-5">
                  {news.map((item) => (
                    <div key={item.id} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                      <p className="text-xs uppercase tracking-[0.24em] text-amber-300/70">
                        {formatCompactDate(item.publishedAt)}
                      </p>
                      <p className="mt-2 font-medium text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{item.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="discord" className="section-shell">
        <div className="section-inner">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div data-reveal className="max-w-xl">
              <p className="eyebrow">Discord integration</p>
              <h2 className="section-title">
                The site and Discord can read like one synchronized control room.
              </h2>
            </div>
            <div data-reveal className="glass-panel p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/6 font-display text-2xl text-white">
                    {discord.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display text-3xl text-white">{discord.name}</p>
                    <p className="mt-1 text-sm text-slate-300">{discord.description}</p>
                  </div>
                </div>
                <div className="status-pill">{discord.statusLabel}</div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Members", formatCount(discord.memberCount)],
                  ["Online", formatCount(discord.onlineCount)],
                  ["Last sync", formatSyncTime(discord.lastSyncedAt)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/40">{label}</p>
                    <p className="mt-3 font-display text-2xl text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                    Website → Discord
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    Admin-created events post automatically to your Discord race announcements.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-sky-400/20 bg-sky-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/70">
                    Discord → Website
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    Server identity, member counts, and community status feed back into the site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-14 pt-10 sm:px-10 lg:px-16">
        <div className="cta-panel mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Call to action</p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-[-0.04em] text-white sm:text-6xl">
              Join the grid before the next lights-out.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              If the direction feels right, I can continue next with the real admin flows, Discord
              sync, database wiring, and a dedicated stats dashboard page using the same visual system.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={discord.inviteUrl} className="primary-button">
              Join Discord
            </Link>
            <Link href="#about" className="secondary-button">
              Review sections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
