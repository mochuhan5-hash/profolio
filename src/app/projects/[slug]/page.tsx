import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHero } from "@/components/project-hero";
import { SiteHeader } from "@/components/site-header";
import { getProjectBySlug, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
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
          <ProjectHero project={project} />

          <section className="grid gap-12 border-t border-black/10 pt-12 md:grid-cols-[0.75fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">Project Story</p>
            <div className="space-y-10">
              {project.details.map((detail) => (
                <article key={detail.title} className="grid gap-3 md:grid-cols-[180px_1fr] md:gap-8">
                  <h2 className="text-sm uppercase tracking-[0.24em] text-black/58">
                    {detail.title}
                  </h2>
                  <p className="text-base leading-8 text-black/72 md:text-lg">
                    {detail.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6 border-t border-black/10 pt-12">
            <div className="grid gap-4 md:grid-cols-[0.75fr_1.3fr]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">Gallery</p>
              <p className="max-w-2xl text-base leading-8 text-black/72 md:text-lg">
                以下内容用于模拟项目详情页的图像节奏。后续替换成你的总平、分析图、效果图或模型照片即可。
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {project.gallery.map((item) => (
                <figure key={item.title} className="space-y-4 border border-black/10 bg-[#f1ede6] p-4 md:p-5">
                  <div
                    className="detail-image"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.24)), url(${item.image})`,
                    }}
                  />
                  <figcaption className="space-y-2">
                    <h3 className="text-lg uppercase tracking-[0.06em]">{item.title}</h3>
                    <p className="text-sm leading-7 text-black/65 md:text-base">{item.description}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
