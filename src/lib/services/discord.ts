import { getDb, isDatabaseConfigured } from "@/lib/db";
import { demoDiscord } from "@/lib/demo-data";
import type { DiscordServerView } from "@/lib/types";

function getDiscordInvite() {
  return process.env.NEXT_PUBLIC_DISCORD_INVITE ?? demoDiscord.inviteUrl;
}

export async function getDiscordSnapshot(): Promise<DiscordServerView> {
  if (!isDatabaseConfigured()) {
    return demoDiscord;
  }

  const snapshot = await getDb().discordServerSnapshot.findUnique({
    where: { id: "primary" },
  });

  if (!snapshot) {
    return demoDiscord;
  }

  return {
    name: snapshot.name,
    iconUrl: snapshot.iconUrl,
    memberCount: snapshot.memberCount,
    onlineCount: snapshot.onlineCount,
    inviteUrl: snapshot.inviteUrl ?? getDiscordInvite(),
    description:
      snapshot.description ?? "Race operations, event signups, voice comms, and stewarding.",
    statusLabel: "Connected",
    lastSyncedAt: snapshot.lastSyncedAt.toISOString(),
  };
}

export async function syncDiscordSnapshot() {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    return demoDiscord;
  }

  const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
    cache: "no-store",
  });

  if (!guildResponse.ok) {
    throw new Error("Failed to fetch Discord guild data.");
  }

  const guild = (await guildResponse.json()) as {
    id: string;
    name: string;
    icon: string | null;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    description?: string;
  };

  const widgetResponse = await fetch(
    `https://discord.com/api/guilds/${guildId}/widget.json`,
    { cache: "no-store" },
  ).catch(() => null);

  let onlineCount = demoDiscord.onlineCount;
  if (widgetResponse?.ok) {
    const widget = (await widgetResponse.json()) as { presence_count?: number };
    onlineCount = widget.presence_count ?? onlineCount;
  }

  const payload: DiscordServerView = {
    name: guild.name,
    iconUrl: guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : undefined,
    memberCount: guild.approximate_member_count ?? demoDiscord.memberCount,
    onlineCount,
    inviteUrl: getDiscordInvite(),
    description: guild.description ?? demoDiscord.description,
    statusLabel: "Connected",
    lastSyncedAt: new Date().toISOString(),
  };

  if (isDatabaseConfigured()) {
    await getDb().discordServerSnapshot.upsert({
      where: { id: "primary" },
      update: {
        guildId: guild.id,
        name: payload.name,
        iconUrl: payload.iconUrl,
        inviteUrl: payload.inviteUrl,
        memberCount: payload.memberCount,
        onlineCount: payload.onlineCount,
        description: payload.description,
        lastSyncedAt: new Date(),
      },
      create: {
        id: "primary",
        guildId: guild.id,
        name: payload.name,
        iconUrl: payload.iconUrl,
        inviteUrl: payload.inviteUrl,
        memberCount: payload.memberCount,
        onlineCount: payload.onlineCount,
        description: payload.description,
        lastSyncedAt: new Date(),
      },
    });
  }

  return payload;
}

export async function postDiscordEventWebhook(event: {
  name: string;
  description: string;
  trackName: string;
  eventDate: string;
}) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    return { delivered: false, reason: "DISCORD_WEBHOOK_URL not configured" };
  }

  const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          title: event.name,
          description: event.description,
          color: 0xe5532c,
          fields: [
            { name: "Track", value: event.trackName, inline: true },
            { name: "Date", value: event.eventDate, inline: true },
          ],
        },
      ],
    }),
  });

  return { delivered: response.ok, status: response.status };
}
