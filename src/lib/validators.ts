import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const eventSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(20),
  trackName: z.string().min(2),
  eventDate: z.iso.datetime(),
  capacity: z.coerce.number().int().min(8).max(120),
});

export const newsSchema = z.object({
  title: z.string().min(4),
  excerpt: z.string().min(10),
  body: z.string().min(40),
});
