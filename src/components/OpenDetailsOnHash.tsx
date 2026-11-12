"use client";

import { useEffect } from "react";

/** Opens the <details> panel named in the address (#privacy, #terms) when a link points to it, then scrolls to it. */
export function OpenDetailsOnHash({ ids }: { ids: string[] }) {
  useEffect(() => {
    const openId = (id: string) => {
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement && !el.open) {
        el.open = true;
        requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
      }
    };
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (ids.includes(id)) openId(id);
    };
    // A link to the hash already in the address fires no hashchange, so also catch the click itself.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='#']");
      const id = a?.getAttribute("href")?.slice(1);
      if (id && ids.includes(id)) openId(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick);
    };
  }, [ids]);
  return null;
}
