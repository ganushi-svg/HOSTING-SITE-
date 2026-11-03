import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="section">
      <div className="container head">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The whole site is now one page. <Link href="/">Go to the home page</Link>.</p>
      </div>
    </main>
  );
}
