import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export const GENERATION_LIMIT_FREE = 10;
