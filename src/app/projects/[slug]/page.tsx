import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ProjectGallery } from "@/components/project-gallery";
import { SiteHeader } from "@/components/site-header";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "项目不存在",
    };
  }

  return {
    title: `${project.title} | Mo Portfolio`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-black">
      <SiteHeader />

      <main className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl space-y-16">
          <ProjectGallery media={project.galleryMedia} />

          <section className="grid gap-12 md:grid-cols-[0.75fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">Project</p>
            <div className="space-y-3 text-left">
              <h1 className="text-3xl tracking-tight md:text-5xl">{project.title}</h1>
              <p className="text-xl leading-8 text-black/68 md:text-2xl">{project.subtitle}</p>
            </div>
          </section>

          {project.website ? (
            <section className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">Website</p>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <a
                  href={project.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex border border-black px-5 py-3 text-xs uppercase tracking-[0.28em] transition-colors hover:bg-black hover:text-[#f3efe8]"
                >
                  访问项目网站
                </a>
                <a href={project.website} target="_blank" rel="noreferrer" className="text-sm text-black/60 underline-offset-4 hover:underline">
                  {project.website}
                </a>
              </div>
            </section>
          ) : null}

          <section className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">Introduction</p>
            <div className="max-w-3xl text-base leading-8 text-black/72 md:text-lg">
              <MarkdownRenderer content={project.introduction} />
            </div>
          </section>

          {project.pdf ? (
            <section className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">Document</p>
              <div>
                <a
                  href={project.pdf}
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
