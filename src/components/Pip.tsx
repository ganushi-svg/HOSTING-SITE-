"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { PIP, pipAnswer, type PipReply } from "@/lib/pip-brain";
import { contact } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppButton";

type Mood = "idle" | "wave" | "think" | "talk";
type Msg = { id: number; from: "pip" | "you"; text: string; chips?: string[]; go?: PipReply["go"]; whatsapp?: string | boolean; sent?: boolean };
type Action = { type: "show"; id: string; label: string } | { type: "whatsapp"; url: string } | { type: "enquiry_sent" };
type Turn = { role: "user" | "assistant"; content: unknown };

const AUTO_OPEN_MS = 5 * 60 * 1000; // Pip introduces itself after five minutes on the page (Ganushi, 4 Nov 2026)
const SEEN = "pip-seen";

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
      if (show) goTo(show.id);
    } catch {
      scripted(query);
    }
  }, [addPip, goTo, scripted]);

  return (
    <>
      <button
        type="button"
        className={`pip-launcher${open ? " is-open" : ""}${nudge ? " is-nudge" : ""}`}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close Pip, the hosting assistant" : "Ask Pip, the hosting assistant"}
      >
        <PipAvatar mood={open ? mood : "idle"} />
        {!open && <span className="pip-hint" aria-hidden="true">Ask Pip</span>}
      </button>

      <section id={panelId} className={`pip-panel${open ? " is-open" : ""}`} role="dialog" aria-modal="false" aria-label={`${PIP.name}, ${PIP.role}`} aria-hidden={!open}>
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
          {typing && <div className="pip-msg from-pip is-typing" aria-label="Pip is thinking"><span /><span /><span /></div>}
        </div>

        <form className="pip-input" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about pricing, machines, repair…" aria-label="Your question for Pip" autoComplete="off" maxLength={240} disabled={typing} />
          <button type="submit" aria-label="Send" disabled={!text.trim() || typing}><Send size={18} /></button>
        </form>
        <p className="pip-foot">Pip is an automated assistant that answers from the facts on this site and never estimates mining profit. For anything else, <a href={PIP.whatsappUrl(topic)} target="_blank" rel="noopener noreferrer">WhatsApp us</a>.</p>
      </section>
    </>
  );
}

/** The character. Blue body with the gold rim and antenna of the Segments cast, drawn so every part can move. */
function PipAvatar({ mood }: { mood: Mood }) {
  return (
    <svg className={`pip pip-${mood}`} viewBox="0 0 120 124" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="pip-body" cx="38%" cy="32%" r="75%">
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
          <path className="pip-spark s1" d="M14 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          <path className="pip-spark s2" d="M104 24 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" />
          <path className="pip-spark s3" d="M106 92 l1.4 3.5 3.5 1.4 -3.5 1.4 -1.4 3.5 -1.4 -3.5 -3.5 -1.4 3.5 -1.4z" />
        </g>
        <g className="pip-thought">
          <circle cx="92" cy="40" r="3" />
          <circle cx="100" cy="30" r="4.5" />
          <circle cx="110" cy="17" r="6.5" />
        </g>
        <g className="pip-antenna">
          <line x1="60" y1="30" x2="60" y2="12" stroke="#f7be27" strokeWidth="3" strokeLinecap="round" />
          <circle className="pip-tip-glow" cx="60" cy="10" r="11" fill="url(#pip-glow)" />
          <circle className="pip-tip" cx="60" cy="10" r="4.5" fill="#fbd24e" />
        </g>
        <g className="pip-arm pip-arm-l"><ellipse cx="22" cy="80" rx="7" ry="6" fill="#f7be27" /></g>
        <g className="pip-arm pip-arm-r"><ellipse cx="98" cy="80" rx="7" ry="6" fill="#f7be27" /></g>
        <ellipse cx="47" cy="110" rx="9" ry="5" fill="#f7be27" />
        <ellipse cx="73" cy="110" rx="9" ry="5" fill="#f7be27" />
        <circle cx="60" cy="70" r="40" fill="url(#pip-body)" stroke="#f7be27" strokeWidth="4" />
        <path d="M30 58 a36 36 0 0 1 60 0" fill="none" stroke="#9cc5ff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
        {/* The Segments mark on the forehead. */}
        <g transform="translate(52 36) scale(0.75)">
          <path d="M8 0 l12 6 v10 l-12 6 -12 -6 v-10z" fill="#3b7bff" stroke="#9fd0ff" strokeWidth="1.2" />
          <path d="M8 0 v22 M-4 6 l12 6 12 -6" fill="none" stroke="#f7be27" strokeWidth="2" />
        </g>
        <g className="pip-eyes">
          <g className="pip-eye" style={{ transformOrigin: "47px 72px" }}>
            <ellipse cx="47" cy="72" rx="8" ry="9.5" fill="#fff" />
            <g className="pip-pupil"><circle cx="48.5" cy="73.5" r="4.2" fill="#0b1530" /><circle cx="50" cy="71.5" r="1.4" fill="#fff" /></g>
          </g>
          <g className="pip-eye" style={{ transformOrigin: "73px 72px" }}>
            <ellipse cx="73" cy="72" rx="8" ry="9.5" fill="#fff" />
            <g className="pip-pupil"><circle cx="74.5" cy="73.5" r="4.2" fill="#0b1530" /><circle cx="76" cy="71.5" r="1.4" fill="#fff" /></g>
          </g>
        </g>
        <path className="pip-mouth pip-mouth-smile" d="M50 90 q10 8 20 0" fill="none" stroke="#0b1530" strokeWidth="3" strokeLinecap="round" />
        <path className="pip-mouth pip-mouth-open" d="M51 89 q9 11 18 0 q-9 4 -18 0z" fill="#0b1530" />
        <path className="pip-mouth pip-mouth-hmm" d="M52 91 q8 -4 16 0" fill="none" stroke="#0b1530" strokeWidth="3" strokeLinecap="round" />
        <ellipse className="pip-cheek" cx="36" cy="84" rx="5" ry="3" fill="#ff8aa8" opacity="0.45" />
        <ellipse className="pip-cheek" cx="84" cy="84" rx="5" ry="3" fill="#ff8aa8" opacity="0.45" />
      </g>
    </svg>
  );
}
