"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { PIP, pipAnswer, type PipReply } from "@/lib/pip-brain";
import { contact, pricing } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppButton";
import { MinerBuddy } from "./MinerBuddy";
import "./pip-miner.css";

type Mood = "idle" | "wave" | "think" | "talk" | "happy" | "listen";
type Msg = { id: number; from: "pip" | "you"; text: string; chips?: string[]; go?: PipReply["go"]; whatsapp?: string | boolean; sent?: boolean };
type Action = { type: "show"; id: string; label: string } | { type: "whatsapp"; url: string } | { type: "enquiry_sent" };
type Turn = { role: "user" | "assistant"; content: unknown };

const AUTO_OPEN_MS = 5 * 60 * 1000; // Pip introduces itself after five minutes on the page (Ganushi, 4 Nov 2026)
const SEEN = "pip-seen";
const POS = "pip-pos"; // where the visitor dragged Pip, as right/bottom offsets in px (this browser only)
const WELCOMED = "pip-welcomed"; // the welcome card shows once per visit
const TIPS = "pip-tips"; // section tips already shown this visit

/** A short tip Pip offers when the visitor reaches a section (Ganushi, 7 Nov 2026). Facts only from site.ts. */
type Tip = { id: string; kicker: string; text: string; chip?: { label: string; to?: string; ask?: boolean; wa?: boolean } };
const TIP_IDS = ["infrastructure", "pricing", "calculator", "faq", "contact"];
function tipFor(id: string): Tip | null {
  switch (id) {
    case "infrastructure": return { id, kicker: "Infrastructure", text: "Tap any layer in the two cooling drawings below to see what it does in our air and hydro systems." };
    case "pricing": return { id, kicker: "Pricing", text: `Plug and play starts at ${pricing.plugFromLabel} per kWh for 100+ machines, and you are only billed for the days your machines run.`, chip: { label: "Estimate my bill", to: "calculator" } };
    case "calculator": return { id, kicker: "Calculator", text: "Pick a machine and a quantity and I'll show the monthly hosting power bill. Hosting cost only, never mining revenue." };
    case "faq": return { id, kicker: "FAQ", text: "Can't see your question here? Ask me anything about hosting your miners.", chip: { label: `Ask ${PIP.name}`, ask: true } };
    case "contact": return contact.person ? { id, kicker: "Contact", text: `Prefer a person? ${contact.person} answers calls in office hours and WhatsApp after hours.`, chip: contact.whatsapp ? { label: `WhatsApp ${contact.person}`, wa: true } : undefined } : null;
  }
  return null;
}

/**
 * Pip, the animated hosting assistant (Ganushi, 4 Nov 2026). A launcher in the bottom-right corner, a chat panel,
 * and the character itself with four moods: idle (floats, blinks), wave (says hi), think (while composing an answer)
 * and talk. Answers come from /api/pip (Claude with the site's facts and four actions) when the key is configured;
 * otherwise, or if that call fails, from the scripted pip-brain.ts. All motion is transform and opacity.
 */
export function Pip() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<Mood>("idle");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [nudge, setNudge] = useState(false);
  const [topic, setTopic] = useState("");
  const [welcome, setWelcome] = useState(false); // welcome card on arrival
  const [tip, setTip] = useState<Tip | null>(null); // section tip on screen
  const openRef = useRef(false), welcomeRef = useRef(false);
  const idRef = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const moodTimer = useRef<number>(0);
  const history = useRef<Turn[]>([]); // API-shaped conversation for /api/pip
  const apiDown = useRef(false); // once the API answers 503 (no key) or fails, stay scripted for this visit
  const panelId = useId();

  const setMoodFor = useCallback((m: Mood, ms: number) => {
    setMood(m);
    window.clearTimeout(moodTimer.current);
    moodTimer.current = window.setTimeout(() => setMood("idle"), ms);
  }, []);

  const greet = useCallback(() => {
    setMsgs((cur) => (cur.length ? cur : [{ id: idRef.current++, from: "pip", text: PIP.greeting, chips: PIP.starters }]));
    setMoodFor("wave", 2600);
  }, [setMoodFor]);

  const openPanel = useCallback(() => {
    setOpen(true);
    setNudge(false);
    setWelcome(false);
    setTip(null);
    try { sessionStorage.setItem(SEEN, "1"); } catch {}
    greet();
  }, [greet]);

  // Five minutes in: Pip pops up and says hello, once per visit.
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN) === "1"; } catch {}
    if (seen) return;
    const t = window.setTimeout(() => { setNudge(true); openPanel(); }, AUTO_OPEN_MS);
    return () => window.clearTimeout(t);
  }, [openPanel]);

  // Visitors can drag Pip anywhere on the screen (Ganushi, 4 Nov 2026). The spot is kept in localStorage.
  const [pos, setPos] = useState<{ r: number; b: number } | null>(null);
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  const drag = useRef<{ dr: number; db: number; x0: number; y0: number; moved: boolean } | null>(null);
  const justDragged = useRef(false);
  useEffect(() => {
    const size = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    const t = window.setTimeout(() => {
      size();
      try { const saved = localStorage.getItem(POS); if (saved) setPos(JSON.parse(saved)); } catch {}
    }, 0);
    window.addEventListener("resize", size);
    return () => { window.clearTimeout(t); window.removeEventListener("resize", size); };
  }, []);
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = { dr: rect.right - e.clientX, db: rect.bottom - e.clientY, x0: e.clientX, y0: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current; if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
    d.moved = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const r = Math.min(Math.max(window.innerWidth - e.clientX - d.dr, 4), window.innerWidth - rect.width - 4);
    const b = Math.min(Math.max(window.innerHeight - e.clientY - d.db, 4), window.innerHeight - rect.height - 4);
    setPos({ r, b });
  };
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current; drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (d?.moved) { justDragged.current = true; try { localStorage.setItem(POS, JSON.stringify(pos)); } catch {} }
  };
  const posStyle = pos ? ({ "--pr": `${pos.r}px`, "--pb": `${pos.b}px` } as React.CSSProperties) : undefined;
  const onLeft = pos ? pos.r > vp.w / 2 : false; // dragged to the left half: bubble and hint flip to the right side
  // Desktop panel placement: above Pip when there is room, otherwise below; aligned to Pip's side; never over Pip.
  const LW = 96, LH = 124, PW = 390;
  const r = pos?.r ?? 14, bt = pos?.b ?? 78;
  const spaceAbove = vp.h - (bt + LH) - 16, spaceBelow = bt - 16;
  const panelBelow = spaceAbove < 320 && spaceBelow > spaceAbove;
  const panelStyle: React.CSSProperties | undefined = vp.w > 720 ? {
    ...(onLeft ? { left: Math.min(vp.w - r - LW, vp.w - PW - 8), right: "auto" } : { right: Math.min(r, vp.w - PW - 8), left: "auto" }),
    ...(panelBelow ? { top: vp.h - bt + 8, bottom: "auto", maxHeight: Math.max(240, spaceBelow - 8) } : { bottom: bt + LH + 8, top: "auto", maxHeight: Math.max(240, spaceAbove - 8) }),
  } : undefined;
  // The welcome card and tips speak from Pip's corner: same side as Pip, above it (or below when Pip sits high).
  const cardStyle: React.CSSProperties = {
    ...(onLeft ? { left: Math.max(12, vp.w - r - LW), right: "auto" } : { right: Math.max(12, r), left: "auto" }),
    ...(panelBelow ? { top: vp.h - bt + 6, bottom: "auto" } : { bottom: bt + LH + 4, top: "auto" }),
  };
  const cardCls = `${onLeft ? " is-left" : ""}${panelBelow ? " is-below" : ""}`;

  // On arrival (Ganushi, 7 Nov 2026): the first time in a visit Pip waves and opens a welcome card with quick help;
  // on later page loads it just waves and says hi for a few seconds.
  const [hello, setHello] = useState(false);
  useEffect(() => {
    let first = true;
    try { first = sessionStorage.getItem(WELCOMED) !== "1"; } catch {}
    const t1 = window.setTimeout(() => {
      if (first) { setWelcome(true); try { sessionStorage.setItem(WELCOMED, "1"); } catch {} } else setHello(true);
    }, 1400);
    const t2 = window.setTimeout(() => { setHello(false); setWelcome(false); }, first ? 16000 : 7000);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, []);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => { welcomeRef.current = welcome; }, [welcome]);

  // Pip follows the page: a short tip the first time the visitor reaches each section (once per visit, at most one
  // every 9 s, never while the chat or the welcome card is open), and reactions when the calculator or form is used.
  useEffect(() => {
    let shown: string[] = [];
    try { shown = JSON.parse(sessionStorage.getItem(TIPS) || "[]"); } catch {}
    let last = 0, pending = 0;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = (e.target as HTMLElement).id;
        if (!e.isIntersecting || shown.includes(id)) continue;
        window.clearTimeout(pending);
        pending = window.setTimeout(() => {
          const t = tipFor(id);
          if (!t || openRef.current || welcomeRef.current || Date.now() - last < 9000) return;
          shown = [...shown, id];
          try { sessionStorage.setItem(TIPS, JSON.stringify(shown)); } catch {}
          last = Date.now();
          setTip(t);
          setMoodFor("talk", 1600);
        }, 900);
      }
    }, { rootMargin: "-40% 0px -45% 0px" });
    TIP_IDS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { io.disconnect(); window.clearTimeout(pending); };
  }, [setMoodFor]);
  useEffect(() => {
    if (!tip) return;
    const t = window.setTimeout(() => setTip(null), 8000);
    return () => window.clearTimeout(t);
  }, [tip]);
  useEffect(() => {
    let t = 0;
    const work = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el?.closest?.("#calculator") || openRef.current) return;
      if (e.type === "click" && !el.closest("button")) return;
      setMood("think");
      window.clearTimeout(t);
      t = window.setTimeout(() => setMoodFor("happy", 1600), 650);
    };
    const cheer = () => setMoodFor("happy", 2400);
    document.addEventListener("input", work);
    document.addEventListener("change", work);
    document.addEventListener("click", work);
    window.addEventListener("pip-cheer", cheer);
    window.addEventListener("estimate-model", cheer);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("input", work);
      document.removeEventListener("change", work);
      document.removeEventListener("click", work);
      window.removeEventListener("pip-cheer", cheer);
      window.removeEventListener("estimate-model", cheer);
    };
  }, [setMoodFor]);

  // Pip's eyes follow the pointer: two CSS variables on the launcher, updated at most once a frame.
  const launcherRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let frame = 0, mx = 0, my = 0;
    const apply = () => {
      frame = 0;
      const el = launcherRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (mx - (r.left + r.width / 2)) / window.innerWidth, dy = (my - (r.top + r.height / 2)) / window.innerHeight;
      document.documentElement.style.setProperty("--pip-ex", String(Math.max(-1, Math.min(1, dx * 3))));
      document.documentElement.style.setProperty("--pip-ey", String(Math.max(-1, Math.min(1, dy * 3))));
    };
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; if (!frame) frame = requestAnimationFrame(apply); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => { window.removeEventListener("mousemove", move); if (frame) cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    window.setTimeout(() => inputRef.current?.focus(), 350);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.innerWidth < 720) setOpen(false);
  }, []);

  const addPip = useCallback((m: Omit<Msg, "id" | "from">) => {
    setMsgs((cur) => [...cur, { id: idRef.current++, from: "pip", ...m }]);
    setMoodFor("talk", 1800);
  }, [setMoodFor]);

  /** Scripted answer (fallback): same behaviour as before the API existed. */
  const scripted = useCallback((query: string) => {
    const reply = pipAnswer(query);
    const delay = 700 + Math.min(1100, reply.text.length * 4);
    window.setTimeout(() => { setTyping(false); addPip(reply); }, delay);
  }, [addPip]);

  const ask = useCallback(async (q: string) => {
    const query = q.trim();
    if (!query) return;
    setTopic(query);
    setText("");
    setMsgs((cur) => [...cur, { id: idRef.current++, from: "you", text: query }]);
    setTyping(true);
    setMood("think");
    window.clearTimeout(moodTimer.current);
    if (apiDown.current) return scripted(query);
    const turns: Turn[] = [...history.current, { role: "user", content: query }];
    try {
      const res = await fetch("/api/pip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: turns }), signal: AbortSignal.timeout(45_000) });
      if (res.status === 503 || res.status === 502 || res.status === 400) { apiDown.current = res.status === 503; return scripted(query); }
      if (res.status === 429) { setTyping(false); addPip({ text: "I've had a lot of questions in a row. Give me a few minutes, or reach " + (contact.person ?? "us") + " on WhatsApp.", whatsapp: true }); return; }
      if (!res.ok) return scripted(query);
      const data = (await res.json()) as { text: string; actions: Action[]; turns: Turn[] };
      history.current = [...turns, ...data.turns];
      setTyping(false);
      const show = data.actions.find((a): a is Extract<Action, { type: "show" }> => a.type === "show");
      const wa = data.actions.find((a): a is Extract<Action, { type: "whatsapp" }> => a.type === "whatsapp");
      const sent = data.actions.some((a) => a.type === "enquiry_sent");
      addPip({ text: data.text, go: show ? { id: show.id, label: show.label } : undefined, whatsapp: wa ? wa.url : undefined, sent });
      if (show || sent) setMoodFor("happy", 2200);
      if (show) goTo(show.id);
    } catch {
      scripted(query);
    }
  }, [addPip, goTo, scripted, setMoodFor]);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`pip-launcher${open ? " is-open" : ""}${nudge ? " is-nudge" : ""}${hello && !open ? " is-hello" : ""}${onLeft ? " is-left" : ""}`}
        onClick={() => { if (justDragged.current) { justDragged.current = false; return; } if (open) setOpen(false); else openPanel(); }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current = null; }}
        style={posStyle}
        title="Ask Pip · drag me anywhere"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close Pip, the hosting assistant" : "Ask Pip, the hosting assistant"}
      >
        <span className="pip-disc" aria-hidden="true" />
        <MinerBuddy mood={open || (!hello && !welcome) ? mood : "wave"} />
        {!open && !welcome && <span className={`pip-hint${hello ? " is-on" : ""}`} aria-hidden="true">{hello ? "Hi there! I'm Pip 👋" : "Ask Pip · drag me"}</span>}
      </button>

      {welcome && !open && (
        <div className={`pip-welcome${cardCls}`} style={cardStyle} role="status">
          <button type="button" className="pw-close" onClick={() => setWelcome(false)} aria-label="Close the welcome message">×</button>
          <p className="pw-kicker">{PIP.role}</p>
          <p className="pw-title">Welcome to Segments Cloud 👋</p>
          <p className="pw-text">I&apos;m {PIP.name}. I can walk you through our hosting rates, estimate your monthly power bill, or connect you with {contact.person ?? "our team"}.</p>
          <div className="pw-chips">
            <button type="button" className="is-primary" onClick={() => openPanel()}>Ask {PIP.name}</button>
            <button type="button" onClick={() => { setWelcome(false); goTo("pricing"); }}>See pricing</button>
            <button type="button" onClick={() => { setWelcome(false); goTo("calculator"); }}>Estimate my bill</button>
          </div>
        </div>
      )}
      {tip && !open && !welcome && (
        <div className={`pip-tip${cardCls}`} style={cardStyle} role="status">
          <button type="button" className="pw-close" onClick={() => setTip(null)} aria-label="Close the tip">×</button>
          <p className="pw-kicker">{tip.kicker}</p>
          <p>{tip.text}</p>
          {tip.chip && (
            <div className="pw-chips">
              {tip.chip.wa
                ? <a className="is-primary" href={PIP.whatsappUrl(topic)} target="_blank" rel="noopener noreferrer">{tip.chip.label}</a>
                : <button type="button" className="is-primary" onClick={() => { const c = tip.chip!; setTip(null); if (c.ask) openPanel(); else if (c.to) goTo(c.to); }}>{tip.chip.label}</button>}
            </div>
          )}
          <span className="pip-tip-bar" aria-hidden="true" />
        </div>
      )}

      <section id={panelId} style={panelStyle} className={`pip-panel${open ? " is-open" : ""}${onLeft ? " is-left" : ""}${panelBelow ? " is-below" : ""}`} role="dialog" aria-modal="false" aria-label={`${PIP.name}, ${PIP.role}`} aria-hidden={!open}>
        <header className="pip-head">
          <span className="pip-head-avatar"><MinerBuddy mood={mood} /></span>
          <div className="pip-head-text">
            <b>{PIP.name}</b>
            <small>{PIP.role} · <i className="pip-online" aria-hidden="true" /> online</small>
          </div>
          <button type="button" className="pip-close" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
        </header>

        <div className="pip-log" ref={listRef} aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`pip-msg from-${m.from}`}>
              <p>{m.text}</p>
              {m.sent && <p className="pip-sent">✓ Enquiry sent to the Segments team</p>}
              {(m.go || m.whatsapp) && (
                <div className="pip-actions">
                  {m.go && <button type="button" className="pip-go" onClick={() => goTo(m.go!.id)}>Show me: {m.go.label}</button>}
                  {m.whatsapp && contact.whatsapp && (
                    <a className="pip-wa" href={typeof m.whatsapp === "string" ? m.whatsapp : PIP.whatsappUrl(topic)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} /> WhatsApp {contact.person?.split(" ")[0]}</a>
                  )}
                </div>
              )}
              {m.chips && m.from === "pip" && (
                <div className="pip-chips">
                  {m.chips.map((c) => <button key={c} type="button" onClick={() => ask(c)}>{c}</button>)}
                </div>
              )}
            </div>
          ))}
          {typing && <div className="pip-msg from-pip is-typing" aria-label="Pip is thinking"><span /><span /><span /><em>Pip is thinking…</em></div>}
        </div>

        <form className="pip-input" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} onFocus={() => { if (!typing) setMood("listen"); }} onBlur={() => { if (!typing) setMood("idle"); }} placeholder="Ask about pricing, machines, repair…" aria-label="Your question for Pip" autoComplete="off" maxLength={240} disabled={typing} />
          <button type="submit" aria-label="Send" disabled={!text.trim() || typing}><Send size={18} /></button>
        </form>
        <p className="pip-foot">Pip is an automated assistant that answers from the facts on this site and never estimates mining profit. For anything else, <a href={PIP.whatsappUrl(topic)} target="_blank" rel="noopener noreferrer">WhatsApp us</a>.</p>
      </section>
    </>
  );
}
