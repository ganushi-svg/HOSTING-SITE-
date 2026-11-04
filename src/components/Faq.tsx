"use client";

import { useId, useState } from "react";
import { faqs } from "@/lib/site";

/**
 * FAQ as a control console (Ganushi, 4 Nov 2026): a numbered question rail and one answer stage. Every answer is in
 * the HTML (hidden ones via CSS) so search engines and screen readers get the full list; the stage swaps with a
 * transform/opacity slide. On phones the rail is a swipeable chip strip above the stage.
 */
export function Faq() {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <div className="faqc">
      <div className="faqc-rail" role="tablist" aria-label="Questions" aria-orientation="vertical">
        {faqs.map((f, i) => (
          <button
            key={f.question}
            type="button"
            role="tab"
            id={`${id}-q${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-a${i}`}
            tabIndex={i === active ? 0 : -1}
            className={i === active ? "is-active" : ""}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); setActive((a) => (a + 1) % faqs.length); }
              if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); setActive((a) => (a - 1 + faqs.length) % faqs.length); }
            }}
          >
            <b>{String(i + 1).padStart(2, "0")}</b>
            <span>{f.question}</span>
          </button>
        ))}
      </div>
      <div className="faqc-stage">
        <span className="faqc-corner tl" aria-hidden="true" /><span className="faqc-corner tr" aria-hidden="true" />
        <span className="faqc-corner bl" aria-hidden="true" /><span className="faqc-corner br" aria-hidden="true" />
        {faqs.map((f, i) => (
          <article key={f.question} id={`${id}-a${i}`} role="tabpanel" aria-labelledby={`${id}-q${i}`} className={`faqc-answer${i === active ? " is-active" : ""}`} hidden={i !== active}>
            <span className="faqc-big" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <p className="eyebrow">Question {String(i + 1).padStart(2, "0")} of {String(faqs.length).padStart(2, "0")}</p>
            <h3>{f.question}</h3>
            <p>{f.answer}</p>
          </article>
        ))}
        <div className="faqc-nav">
          <button type="button" onClick={() => setActive((a) => (a - 1 + faqs.length) % faqs.length)} aria-label="Previous question">←</button>
          <span className="faqc-dots" aria-hidden="true">{faqs.map((f, i) => <i key={f.question} className={i === active ? "is-on" : ""} />)}</span>
          <button type="button" onClick={() => setActive((a) => (a + 1) % faqs.length)} aria-label="Next question">→</button>
        </div>
      </div>
    </div>
  );
}
