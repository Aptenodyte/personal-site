/**
 * Client-safe formatting utilities — no Node.js imports.
 * Kept separate from content.ts (which uses node:fs) so they can be
 * imported safely from client components.
 */

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
