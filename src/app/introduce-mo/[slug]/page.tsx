import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { SiteHeader } from "@/components/site-header";
import { getProfileExperienceBySlug, getProfileExperienceSlugs } from "@/data/profile";

type ExperienceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProfileExperienceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = getProfileExperienceBySlug(slug);

  if (!experience) {
    return {
      title: "经历不存在",
    };
  }

  return {
    title: `${experience.company} | INTRODUCE MO`,
    description: experience.projectNames.join(" / "),
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { slug } = await params;
  const experience = getProfileExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  return (
    <div id="home" className="min-h-screen bg-[#f7f4ee] text-black">
      <SiteHeader />

      <main className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl space-y-16">
          <section className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">Experience</p>
            <div className="space-y-3 text-left">
              <p className="text-sm font-medium tracking-[0.18em] text-black/45">{experience.rolePeriod}</p>
              <h1 className="text-3xl tracking-tight md:text-5xl">{experience.company}</h1>
            </div>
          </section>

          {experience.projectSections.map((projectSection) => (
            <section key={projectSection.title} className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">{projectSection.title}</p>
              <div className="max-w-3xl text-base leading-8 text-black/72 md:text-lg">
                <MarkdownRenderer content={`## ${projectSection.title}\n\n${projectSection.content}`} />
              </div>
            </section>
          ))}

          {experience.pdfLink ? (
            <section className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">Document</p>
              <div>
                <a
                  href={experience.pdfLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex border border-black px-5 py-3 text-xs uppercase tracking-[0.28em] transition-colors hover:bg-black hover:text-[#f3efe8]"
                >
                  查看 PDF
                </a>
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
