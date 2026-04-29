// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { Client, Events, GatewayIntentBits } from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !guildId) {
  console.error("Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID.");
  process.exit(1);
}

const prisma = new PrismaClient();
const activeGuildId = guildId as string;

async function syncGuild() {
  const fullGuild =
    bot.guilds.cache.get(activeGuildId) ?? (await bot.guilds.fetch(activeGuildId));

  await prisma.discordServerSnapshot.upsert({
    where: { id: "primary" },
    update: {
      guildId: fullGuild.id,
      name: fullGuild.name,
      iconUrl: fullGuild.iconURL() ?? undefined,
      memberCount: fullGuild.memberCount,
      inviteUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? undefined,
      lastSyncedAt: new Date(),
    },
    create: {
      id: "primary",
      guildId: fullGuild.id,
      name: fullGuild.name,
      iconUrl: fullGuild.iconURL() ?? undefined,
      memberCount: fullGuild.memberCount,
      inviteUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? undefined,
      lastSyncedAt: new Date(),
    },
  });
}

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

bot.once(Events.ClientReady, async () => {
  console.log(`ACE Discord bot ready as ${bot.user?.tag ?? "unknown-user"}`);
  await syncGuild();
});

bot.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
  if (newGuild.id === activeGuildId) {
    await syncGuild();
  }
});

bot.on(Events.GuildMemberAdd, async (member) => {
  if (member.guild.id === activeGuildId) {
    await syncGuild();
  }
});

bot.on(Events.GuildMemberRemove, async (member) => {
  if (member.guild.id === activeGuildId) {
    await syncGuild();
  }
});

bot.login(token).catch((error) => {
  console.error("Discord bot login failed:", error);
  process.exit(1);
});
