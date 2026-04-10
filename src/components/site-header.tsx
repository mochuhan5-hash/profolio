const links = [
  { label: "Home", href: "#home" },
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(247,244,238,0.88)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a href="#home" className="text-xs font-medium uppercase tracking-[0.35em]">
          Mo Portfolio
        </a>

        <nav className="hidden gap-8 text-xs uppercase tracking-[0.25em] md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-opacity hover:opacity-55">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
