import Link from "next/link";
import { CopyEmailButton } from "@/components/copy-email-button";
import { PageIntro } from "@/components/page-intro";
import { SiteHeader } from "@/components/site-header";
import { loadProjects } from "@/data/projects";

export default function Home() {
  const projects = loadProjects();

  return (
    <div id="home" className="min-h-screen bg-[#f7f4ee] text-black">
      <SiteHeader />

      <main className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl space-y-16">
          <PageIntro
            title="欢迎来到momo的空间。"
            description="Hi, 我是momo，一个热爱AI、关注用户体验、交互创新、社会创新的产品设计师⭐"
            arrowHref="#works"
          />

          <section id="works" className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${encodeURIComponent(project.slug)}`}
                className="group block rounded-2xl border border-black/10 bg-[#f3efe8] p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(17,17,17,0.10)]"
              >
                <div
                  className="project-card__image rounded-[20px]"
                  style={{
                    backgroundImage: `url(${project.cover.image})`,
                    backgroundColor: project.cover.accent,
                  }}
                />
              </Link>
            ))}
          </section>

          <section className="px-0 py-8" id="contact">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-black/45">Contact</p>
                <h2 className="text-2xl tracking-tight md:text-4xl">如果你对我感兴趣，欢迎联系我😄 →</h2>
              </div>

              <CopyEmailButton email="1363430269@qq.com" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
