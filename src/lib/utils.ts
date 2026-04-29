import { format } from "date-fns";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatRaceDate(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function formatCompactDate(value: string) {
  return format(new Date(value), "dd MMM");
}

export function formatSyncTime(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
