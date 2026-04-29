import { EventStatus } from "@prisma/client";

import { getDb, isDatabaseConfigured } from "@/lib/db";
import { demoEvents, demoNews } from "@/lib/demo-data";
import type { EventPreview, NewsItem } from "@/lib/types";
import { slugify } from "@/lib/utils";

export async function getUpcomingEvents(): Promise<EventPreview[]> {
  if (!isDatabaseConfigured()) {
    return demoEvents;
  }

  const events = await getDb().event.findMany({
    where: { status: EventStatus.PUBLISHED },
    orderBy: { eventDate: "asc" },
    take: 4,
  });

  return events.map((event) => ({
    id: event.id,
    slug: event.slug,
    name: event.name,
    description: event.description,
    trackName: event.trackName,
    eventDate: event.eventDate.toISOString(),
    capacity: event.capacity,
    status: event.status,
  }));
}

export async function getNewsPreview(): Promise<NewsItem[]> {
  if (!isDatabaseConfigured()) {
    return demoNews;
  }

  const posts = await getDb().newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt.toISOString(),
  }));
}

export async function createEvent(input: {
  name: string;
  description: string;
  trackName: string;
  eventDate: string;
  capacity: number;
}) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured.");
  }

  return getDb().event.create({
    data: {
      name: input.name,
      slug: slugify(`${input.name}-${input.trackName}`),
      description: input.description,
      trackName: input.trackName,
      eventDate: new Date(input.eventDate),
      capacity: input.capacity,
      status: EventStatus.PUBLISHED,
    },
  });
}

export async function createNewsPost(input: {
  title: string;
  excerpt: string;
  body: string;
}) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured.");
  }

  return getDb().newsPost.create({
    data: {
      title: input.title,
      slug: slugify(input.title),
      excerpt: input.excerpt,
      body: input.body,
      published: true,
    },
  });
}
