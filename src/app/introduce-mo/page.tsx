import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { SiteHeader } from "@/components/site-header";
import { loadProfile } from "@/data/profile";

export const metadata: Metadata = {
  title: "INTRODUCE MO | Mo Portfolio",
  description: "Mo 的个人简介与工作经历。",
};

export default function IntroduceMoPage() {
  const profile = loadProfile();

  return (
    <div id="home" className="min-h-screen bg-[#f7f4ee] text-black">
      <SiteHeader />

      <main className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl space-y-16">
          <PageIntro
            title={profile.name}
            description="INTRODUCE MO"
            descriptionClassName="mx-auto max-w-xl text-base uppercase tracking-[0.28em] text-black/70 md:text-sm"
            arrowHref="#education"
          />

          <section id="education" className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">Education</p>
            <div className="grid gap-4 md:grid-cols-2">
              {profile.education.map((education) => (
                <article key={`${education.school}-${education.year}`} className="rounded-2xl border border-black/10 bg-[#f3efe8] p-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl tracking-tight">{education.school}</h2>
                    <p className="text-sm uppercase tracking-[0.18em] text-black/55">{education.degree}</p>
                    <p className="text-sm leading-7 text-black/72">{education.year}</p>
                    {education.className ? <p className="text-sm leading-7 text-black/72">{education.className}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="skill" className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">Skill</p>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 xl:grid-cols-6">
              {profile.skillIcons.map((icon) => (
                <article key={icon.slug} className="flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-black/10 bg-[#f3efe8] shadow-sm md:h-24 md:w-24">
                    <Image src={icon.src} alt={icon.label} width={72} height={72} className="h-10 w-10 object-contain md:h-14 md:w-14" unoptimized />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">Experience</p>
            <div className="grid gap-6 xl:grid-cols-2">
              {profile.experiences.map((experience) => (
                <Link
                  key={experience.slug}
                  href={`/introduce-mo/${encodeURIComponent(experience.slug)}`}
                  className="rounded-[28px] border border-black/10 bg-[#f3efe8] p-8 text-black shadow-[0_18px_40px_rgba(17,17,17,0.08)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <h2 className="text-3xl tracking-tight">{experience.company}</h2>
                      <p className="text-sm font-medium tracking-[0.18em] text-black/45">{experience.rolePeriod}</p>
                    </div>

                    <div className="grid gap-3">
                      {experience.projectNames.map((projectName) => (
                        <p key={projectName} className="text-sm leading-7 text-black/72">
                          {projectName}
                        </p>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
