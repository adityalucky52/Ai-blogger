import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  // Force black and white for ui-avatars links
  if (url.includes("ui-avatars.com/api")) {
    return url.replace(/background=[^&]*/, "background=000").replace(/color=[^&]*/, "color=fff");
  }
  return url;
}
