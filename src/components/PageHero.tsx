import type { ReactNode } from "react";

/** Sub-page header: one H1 per page, with an optional highlighted ending. */
export function PageHero({ kicker, title, highlight, lede, children }: { kicker: string; title: string; highlight?: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="subpage-hero">
      <span className="section-kicker">{kicker}</span>
      <h1>
        {title}
        {highlight && <> <span>{highlight}</span></>}
      </h1>
      {lede && <p className="section-lede">{lede}</p>}
      {children}
    </section>
  );
}
