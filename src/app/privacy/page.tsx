import type { Metadata } from "next";
import { TODO } from "@/components/TODO";
import { contact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Notice (Draft)",
  description: "How Segments Cloud handles the details you send through the hosting enquiry form. Draft pending legal review.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="subpage">
      <div className="container narrow-prose">
        <span className="section-kicker">Draft · requires legal review</span>
        <h1>Privacy <span>notice.</span></h1>
        <TODO source="legal">Replace this draft with a privacy notice approved by the company&apos;s legal advisor before the public launch</TODO>

        <h2>What the enquiry form collects</h2>
        <p>Your name, work email, company, number of machines, machine models and your message.</p>

        <h2>Why we use it</h2>
        <p>Only to reply to your hosting enquiry and prepare a quote.</p>

        <h2>Who receives it</h2>
        <p>The form sends your details by email, through the email delivery service Resend, to the {site.name} team at {contact.email}.</p>
        <TODO source="legal">Retention period, data transfers and your rights under UAE law</TODO>

        <h2>Who is responsible</h2>
        <p>{site.legalNames.join(" and ")}, {contact.office}. Questions: {contact.email}.</p>
      </div>
    </main>
  );
}
