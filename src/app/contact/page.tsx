import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, User } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { TODO } from "@/components/TODO";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Hosting Quote",
  description: "Tell Segments Cloud about your mining fleet to get a hosting quote: machine models, quantity and timeline.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main" className="subpage">
      <div className="container contact-grid">
        <div>
          <span className="section-kicker">Contact</span>
          <h1>Request a <span>hosting quote.</span></h1>
          <p className="section-lede">Tell us about your fleet and we will reply with a quote.</p>
          <div className="contact-list">
            <div><MapPin size={19} aria-hidden="true" /><span><small>Office</small><address style={{ fontStyle: "normal" }}>{contact.office}</address></span></div>
            <div><Mail size={19} aria-hidden="true" /><span><small>Email</small><span className="selectable">{contact.email}</span></span></div>
            <div><Phone size={19} aria-hidden="true" /><span><small>Phone</small><span className="selectable">{contact.phone}</span></span></div>
            <div><MessageCircle size={19} aria-hidden="true" /><span><small>WhatsApp</small>{contact.whatsapp ? <span className="selectable">{contact.whatsapp}</span> : <TODO source="content/contact.md" inline>WhatsApp number</TODO>}</span></div>
            <div><User size={19} aria-hidden="true" /><span><small>Your contact</small>{contact.person ? <span>{contact.person}</span> : <TODO source="content/contact.md" inline>Name and title</TODO>}</span></div>
            <div><Clock size={19} aria-hidden="true" /><span><small>Hours</small>{contact.hours ? <span>{contact.hours}</span> : <TODO source="content/contact.md" inline>Office hours</TODO>}</span></div>
          </div>
        </div>
        <div className="form-panel">
          <div className="form-panel-top"><span>HOSTING ENQUIRY</span><span className="form-panel-indicator"><span aria-hidden="true" /> Goes straight to our team</span></div>
          <h2>Tell us about your fleet.</h2>
          <p className="form-intro">Name and email are required. Everything else helps us quote faster.</p>
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
