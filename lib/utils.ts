import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const tagColors = [
  "#d63b65",
  "#eb6435",
  "#f09d37",
  "#97bf5c",
  "#439388",
  "#4995eb",
  "#4352af",
  "#a760a9",
  "#394046",
  "#fffde8",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function selectRandomTagColor() {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
}

export function convertFromUTC(dateString: string) {
  const date = new Date(dateString);

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${month} ${day}, ${year} | ${time}` as string;
}
