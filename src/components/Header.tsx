import Link from "next/link";

export default function Header({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-glyph">Ψ</span>
        <span>PsycScope</span>
      </Link>
      <nav className="nav-links">
        <Link href="/assess">Screen</Link>
        <Link href="/results">Results</Link>
        <Link href="/history">History</Link>
        <Link href="/about">About</Link>
        {userEmail ? (
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {userEmail.split("@")[0]}
          </span>
        ) : (
          <Link href="/sign-in">Sign in</Link>
        )}
        <a href="https://6x7.gr" style={{ opacity: 0.7 }}>
          6x7.gr
        </a>
      </nav>
    </header>
  );
}
