"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteHeaderProps = {
  sectionLinks?: Array<{
    label: string;
    href: string;
  }>;
};

const portfolioSectionLinks = [
  { label: "Works", href: "/#works" },
  { label: "Contact", href: "/#contact" },
];

const introduceSectionLinks = [
  { label: "Education", href: "/introduce-mo#education" },
  { label: "Skill", href: "/introduce-mo#skill" },
  { label: "Experience", href: "/introduce-mo#experience" },
];

function getTopLevelLinkClassName(isActive: boolean) {
  return isActive
    ? "rounded-full bg-black px-4 py-2 text-white transition-colors"
    : "rounded-full px-4 py-2 text-black transition-opacity hover:opacity-55";
}

function getTopLevelLabelClassName(isActive: boolean, trackingClassName: string) {
  return isActive ? `${trackingClassName} text-white` : trackingClassName;
}

export function SiteHeader({ sectionLinks }: SiteHeaderProps) {
  const pathname = usePathname();
  const isIntroducePage = pathname.startsWith("/introduce-mo");
  const activeSectionLinks = sectionLinks ?? (isIntroducePage ? introduceSectionLinks : portfolioSectionLinks);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(247,244,238,0.88)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 md:py-5">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Link href="/" className={getTopLevelLinkClassName(!isIntroducePage)}>
            <span className={getTopLevelLabelClassName(!isIntroducePage, "text-xs font-medium uppercase tracking-[0.35em]")}>Mo Portfolio</span>
          </Link>
          <Link href="/introduce-mo" className={getTopLevelLinkClassName(isIntroducePage)}>
            <span className={getTopLevelLabelClassName(isIntroducePage, "text-xs uppercase tracking-[0.25em]")}>INTRODUCE MO</span>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.25em] md:gap-3 md:text-xs">
          {activeSectionLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 transition-opacity hover:opacity-55 md:px-4">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
