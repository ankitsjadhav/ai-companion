import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function absoluteUrl(path) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("NEXT_PUBLIC_APP_URL environment variable is not defined");
  }
  if (!path || typeof path !== "string") {
    throw new Error("Path must be a non-empty string");
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${process.env.NEXT_PUBLIC_APP_URL}${normalizedPath}`;
}
