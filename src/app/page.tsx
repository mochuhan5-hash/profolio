import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div id="home" className="min-h-screen bg-[#f7f4ee] text-black">
      <SiteHeader />

      <main>
        <section className="border-b border-black/10 px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.5fr_0.8fr] md:items-end">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-black/50">
                个人作品集 / Portfolio Selected Works
              </p>
              <h1 className="max-w-5xl text-6xl uppercase leading-[0.92] tracking-tight md:text-[8rem]">
                Narrative
                <br />
                Gallery
              </h1>
            </div>

            <div className="space-y-8 text-sm leading-7 text-black/70 md:text-base">
              <p>
                一个以流动浏览为核心的作品集首页。向下滚动时，每个项目以封面、简介和页面节奏依次展开，像阅读一本被拆开的视觉档案。
              </p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-black/55">
                <span>空间</span>
                <span>景观</span>
                <span>建筑</span>
                <span>叙事</span>
              </div>
            </div>
          </div>
        </section>

        <section id="works" className="px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </section>

        <section className="border-y border-black/10 px-6 py-20 md:px-10" id="about">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1.3fr]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">About</p>
            <div className="space-y-6">
              <h2 className="max-w-3xl text-3xl uppercase leading-tight tracking-tight md:text-5xl">
                用简洁的页面节奏，呈现空间、图像与叙事之间的关系。
              </h2>
              <p className="max-w-2xl text-base leading-8 text-black/72 md:text-lg">
                这个网站首版以作品展示为核心，参考杂志与展览网站的阅读方式：大标题、留白、图像主导、少量但准确的文字。后续可以继续替换成你的真实项目图纸、模型图和项目说明。
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-10" id="contact">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">Contact</p>
              <h2 className="text-3xl uppercase tracking-tight md:text-5xl">
                如果你想继续完善，我可以下一步帮你替换成真实作品内容。
              </h2>
            </div>

            <Link
              href="mailto:hello@example.com"
              className="inline-flex border border-black px-6 py-4 text-xs uppercase tracking-[0.28em] transition-colors hover:bg-black hover:text-[#f7f4ee]"
            >
              hello@example.com
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
