import type { ReactNode } from "react";

/**
 * Marker for content not yet provided. `grep -rn "TODO" src content` lists every one.
 * Renders nothing on the page for the management presentation (Ganushi, 4 Nov 2026: no "Pending" or placeholder
 * text anywhere); the source and the missing item stay here in the code so they are still tracked.
 */
export function TODO(props: { source: string; inline?: boolean; children: ReactNode }) {
  void props;
  return null;
}
