import { TODO } from "./TODO";
import { OpenDetailsOnHash } from "./OpenDetailsOnHash";
import { legalUpdated, privacyNotice, termsOfUse, type LegalSection } from "@/lib/legal";

/**
 * Privacy notice and terms of use (Ganushi, 12 Nov 2026), drafted from www.segments.ae's own legal pages and rewritten
 * for this site (src/lib/legal.ts). Two collapsible panels under Contact so the site stays one page; the footer links
 * and the form's consent link open them. Drafts until the company's legal advisor approves them.
 */
function Body({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="privacy-body">
      {sections.map((s) => (
        <div key={s.heading} className="legal-part">
          <h4>{s.heading}</h4>
          {s.body.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
        </div>
      ))}
      <p className="legal-updated">Last updated {legalUpdated}. Draft for legal review.</p>
    </div>
  );
}

export function LegalNotices() {
  return (
    <div className="legal-notices">
      <OpenDetailsOnHash ids={["privacy", "terms"]} />
      <details className="panel privacy" id="privacy">
        <summary>Privacy notice</summary>
        <TODO source="legal">Have the company&apos;s legal advisor approve this privacy notice before the public launch</TODO>
        <Body sections={privacyNotice} />
      </details>
      <details className="panel privacy" id="terms">
        <summary>Terms of use</summary>
        <TODO source="legal">Have the company&apos;s legal advisor approve these terms of use before the public launch</TODO>
        <Body sections={termsOfUse} />
      </details>
    </div>
  );
}
