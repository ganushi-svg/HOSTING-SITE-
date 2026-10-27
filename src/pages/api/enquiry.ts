import type { APIRoute } from 'astro';
import { RESEND_API_KEY, RESEND_FROM } from 'astro:env/server';
import { Resend } from 'resend';
import { contact } from '../../data/site';

// Runs on Vercel as a serverless function; every other page is static.
export const prerender = false;

const LIMITS = { name: 100, company: 150, email: 254, models: 200, message: 4000 };
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Header-bound values (subject, reply-to) must not carry line breaks.
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ');
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Send the form as JSON.' });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(data.website, 200)) return json(200, { ok: true });

  const name = oneLine(clean(data.name, LIMITS.name));
  const company = oneLine(clean(data.company, LIMITS.company));
  const email = oneLine(clean(data.email, LIMITS.email));
  const models = oneLine(clean(data.models, LIMITS.models));
  const message = clean(data.message, LIMITS.message);
  const quantityRaw = clean(String(data.quantity ?? ''), 10);
  const quantity = quantityRaw ? Number.parseInt(quantityRaw, 10) : null;

  if (!name) return json(400, { ok: false, error: 'Enter your name.' });
  if (!EMAIL_RE.test(email)) return json(400, { ok: false, error: 'Enter a valid email address.' });
  if (quantity !== null && (!Number.isInteger(quantity) || quantity < 1 || quantity > 1_000_000)) {
    return json(400, { ok: false, error: 'Number of machines must be a whole number.' });
  }

  if (!RESEND_API_KEY) {
    return json(503, { ok: false, error: 'The form is not set up yet. Please email or call us.' });
  }

  const rows: [string, string][] = [
    ['Name', name],
    ['Company', company || '—'],
    ['Email', email],
    ['Number of machines', quantity !== null ? String(quantity) : '—'],
    ['Machine models', models || '—'],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${message || '—'}`;
  const html =
    `<table>${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>` +
    `<p><strong>Message</strong></p><p style="white-space:pre-wrap">${escapeHtml(message || '—')}</p>`;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      // TODO: set RESEND_FROM to an address on a domain verified in Resend. The fallback only delivers to the Resend account owner.
      from: RESEND_FROM || 'Segments Cloud website <onboarding@resend.dev>',
      to: [contact.email],
      replyTo: email,
      subject: `Hosting enquiry: ${company || name}${quantity !== null ? ` (${quantity} machines)` : ''}`,
      text,
      html,
    });
    if (error) {
      console.error('Resend error', error.name, error.message);
      return json(502, { ok: false, error: 'We could not send your request. Please email or call us.' });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error('Enquiry send failed', err);
    return json(502, { ok: false, error: 'We could not send your request. Please email or call us.' });
  }
};
