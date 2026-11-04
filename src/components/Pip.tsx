"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { PIP, pipAnswer, type PipReply } from "@/lib/pip-brain";
import { contact } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppButton";

type Mood = "idle" | "wave" | "think" | "talk" | "happy" | "listen";
type Msg = { id: number; from: "pip" | "you"; text: string; chips?: string[]; go?: PipReply["go"]; whatsapp?: string | boolean; sent?: boolean };
type Action = { type: "show"; id: string; label: string } | { type: "whatsapp"; url: string } | { type: "enquiry_sent" };
type Turn = { role: "user" | "assistant"; content: unknown };

const AUTO_OPEN_MS = 5 * 60 * 1000; // Pip introduces itself after five minutes on the page (Ganushi, 4 Nov 2026)
const SEEN = "pip-seen";
const POS = "pip-pos"; // where the visitor dragged Pip, as right/bottom offsets in px (this browser only)

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

  // On arrival Pip waves from the corner and says hi for a few seconds (Ganushi, 4 Nov 2026).
  const [hello, setHello] = useState(false);
  useEffect(() => {
    const t1 = window.setTimeout(() => setHello(true), 1400);
    const t2 = window.setTimeout(() => setHello(false), 7000);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, []);

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
      if (res.status === 429) { setTyping(false); addPip({ text: "I've had a lot of questions in a row. Give me a few minutes, or reach Ganushi on WhatsApp.", whatsapp: true }); return; }
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
        <PipAvatar mood={open ? mood : hello ? "wave" : "idle"} />
        {!open && <span className={`pip-hint${hello ? " is-on" : ""}`} aria-hidden="true">{hello ? "Hi there! I'm Pip 👋" : "Ask Pip · drag me"}</span>}
      </button>

      <section id={panelId} style={panelStyle} className={`pip-panel${open ? " is-open" : ""}${onLeft ? " is-left" : ""}${panelBelow ? " is-below" : ""}`} role="dialog" aria-modal="false" aria-label={`${PIP.name}, ${PIP.role}`} aria-hidden={!open}>
        <header className="pip-head">
          <span className="pip-head-avatar"><PipAvatar mood={mood} /></span>
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
              {m.sent && <p className="pip-sent">✓ Enquiry sent to {contact.person}</p>}
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

/**
 * The character: a round blue body on two little legs, two arms with gold hands, the gold antenna and the Segments
 * mark. Every limb is its own group with a transform origin at its joint, so moods can wave, gesture, hop and tuck.
 */
function PipAvatar({ mood }: { mood: Mood }) {
  return (
    <svg className={`pip pip-${mood}`} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="pip-body" cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="#4f8dff" />
          <stop offset="0.55" stopColor="#1f53d6" />
          <stop offset="1" stopColor="#0b2a7a" />
        </radialGradient>
        <radialGradient id="pip-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fbd24e" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fbd24e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="pip-float">
        <g className="pip-sparkles">
          <path className="pip-spark s1" d="M10 44 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          <path className="pip-spark s2" d="M108 26 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" />
          <path className="pip-spark s3" d="M110 104 l1.4 3.5 3.5 1.4 -3.5 1.4 -1.4 3.5 -1.4 -3.5 -3.5 -1.4 3.5 -1.4z" />
        </g>
        <g className="pip-thought">
          <circle cx="96" cy="36" r="3" />
          <circle cx="104" cy="26" r="4.5" />
          <circle cx="114" cy="13" r="6.5" />
        </g>
        <g className="pip-antenna">
          <line x1="60" y1="30" x2="60" y2="14" stroke="#f7be27" strokeWidth="3" strokeLinecap="round" />
          <circle className="pip-tip-glow" cx="60" cy="12" r="11" fill="url(#pip-glow)" />
          <circle className="pip-tip" cx="60" cy="12" r="4.5" fill="#fbd24e" />
        </g>
        {/* legs and feet (tops tucked under the body) */}
        <g className="pip-leg pip-leg-l" style={{ transformOrigin: "46px 100px" }}>
          <path d="M46 98 v24" stroke="#1a3f8f" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="43" cy="128" rx="11" ry="5.5" fill="#f7be27" />
        </g>
        <g className="pip-leg pip-leg-r" style={{ transformOrigin: "74px 100px" }}>
          <path d="M74 98 v24" stroke="#1a3f8f" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="77" cy="128" rx="11" ry="5.5" fill="#f7be27" />
        </g>
        {/* body and face */}
        <circle cx="60" cy="66" r="36" fill="url(#pip-body)" stroke="#f7be27" strokeWidth="4" />
        <path d="M34 54 a32 32 0 0 1 52 0" fill="none" stroke="#9cc5ff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
        <g transform="translate(54 34) scale(0.55)">
          <path d="M8 0 l12 6 v10 l-12 6 -12 -6 v-10z" fill="#3b7bff" stroke="#9fd0ff" strokeWidth="1.2" />
          <path d="M8 0 v22 M-4 6 l12 6 12 -6" fill="none" stroke="#f7be27" strokeWidth="2" />
        </g>
        <g className="pip-eyes">
          <g className="pip-eye" style={{ transformOrigin: "47px 66px" }}>
            <ellipse cx="47" cy="66" rx="8" ry="9.5" fill="#fff" />
            <g className="pip-pupil"><circle cx="48" cy="67" r="4.2" fill="#0b1530" /><circle cx="49.5" cy="65" r="1.4" fill="#fff" /></g>
            <path className="pip-happy-eye" d="M40 67 q7 -8 14 0" fill="none" stroke="#0b1530" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="pip-eye" style={{ transformOrigin: "73px 66px" }}>
            <ellipse cx="73" cy="66" rx="8" ry="9.5" fill="#fff" />
            <g className="pip-pupil"><circle cx="74" cy="67" r="4.2" fill="#0b1530" /><circle cx="75.5" cy="65" r="1.4" fill="#fff" /></g>
            <path className="pip-happy-eye" d="M66 67 q7 -8 14 0" fill="none" stroke="#0b1530" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
        <path className="pip-mouth pip-mouth-smile" d="M50 84 q10 8 20 0" fill="none" stroke="#0b1530" strokeWidth="3" strokeLinecap="round" />
        <path className="pip-mouth pip-mouth-open" d="M51 83 q9 11 18 0 q-9 4 -18 0z" fill="#0b1530" />
        <path className="pip-mouth pip-mouth-hmm" d="M52 85 q8 -4 16 0" fill="none" stroke="#0b1530" strokeWidth="3" strokeLinecap="round" />
        <path className="pip-mouth pip-mouth-grin" d="M46 82 q14 14 28 0 q-14 5 -28 0z" fill="#0b1530" />
        <ellipse className="pip-cheek" cx="36" cy="78" rx="5" ry="3" fill="#ff8aa8" opacity="0.45" />
        <ellipse className="pip-cheek" cx="84" cy="78" rx="5" ry="3" fill="#ff8aa8" opacity="0.45" />
        {/* arms and hands, drawn over the body and pivoting at the shoulder */}
        <g className="pip-arm pip-arm-l" style={{ transformOrigin: "26px 74px" }}>
          <path d="M26 74 q-14 10 -14 26" fill="none" stroke="#1a3f8f" strokeWidth="7" strokeLinecap="round" />
          <circle cx="12" cy="104" r="7.5" fill="#f7be27" />
        </g>
        <g className="pip-arm pip-arm-r" style={{ transformOrigin: "94px 74px" }}>
          <path d="M94 74 q14 10 14 26" fill="none" stroke="#1a3f8f" strokeWidth="7" strokeLinecap="round" />
          <circle cx="108" cy="104" r="7.5" fill="#f7be27" />
          <path className="pip-fingers" d="M103 99 l-2 -5 M108 97 l0 -5 M113 99 l2 -5" stroke="#f7be27" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
