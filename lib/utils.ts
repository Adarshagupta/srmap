import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to extract hashtags from content
export function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches : [];
}
