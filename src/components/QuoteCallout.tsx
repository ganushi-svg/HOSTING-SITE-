import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function QuoteCallout({ title = "Tell us about your fleet.", text = "Share your machine models and quantity, and we will send you a hosting quote." }: { title?: string; text?: string }) {
  return (
    <section className="subpage-callout">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button" href="/contact">Request a quote <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </section>
  );
}
