import { MessageCircle } from "lucide-react";
import { contact } from "@/lib/site";

/** Floating WhatsApp link (content/contact.md). Plain link, no script. */
export function WhatsAppButton() {
  if (!contact.whatsapp) return null;
  return (
    <a className="whatsapp-float" href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`Chat with us on WhatsApp, ${contact.whatsapp}`}>
      <MessageCircle size={20} aria-hidden="true" /><span>WhatsApp</span>
    </a>
  );
}
