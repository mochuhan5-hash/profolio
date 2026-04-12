import type { ReactNode } from "react";

type PageIntroProps = {
  title: ReactNode;
  description: ReactNode;
  arrowHref: string;
  badge?: ReactNode;
  descriptionClassName?: string;
};

const defaultDescriptionClassName = "mx-auto max-w-xl text-base leading-8 text-black/70 md:text-lg";

export function PageIntro({
  title,
  description,
  arrowHref,
  badge = "👼",
  descriptionClassName = defaultDescriptionClassName,
}: PageIntroProps) {
  return (
    <section className="flex min-h-[48vh] flex-col items-center justify-center space-y-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-sm">{badge}</div>

      <div className="space-y-3">
        <p className="mx-auto max-w-xl text-2xl leading-relaxed tracking-tight md:text-4xl">{title}</p>
        <p className={descriptionClassName}>{description}</p>
      </div>

      <a href={arrowHref} className="inline-flex text-4xl leading-none text-black/70 transition-opacity hover:opacity-55">
        ↓
      </a>
    </section>
  );
}
