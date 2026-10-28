import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="subpage">
      <div className="container narrow-prose">
        <span className="section-kicker">404</span>
        <h1>Page not <span>found.</span></h1>
        <p>The page you asked for does not exist or has moved.</p>
        <p><Link href="/" className="text-link">Go to the home page <ArrowRight size={18} aria-hidden="true" /></Link></p>
      </div>
    </main>
  );
}
