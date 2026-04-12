import Link from "next/link";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="project-card border border-black/10 bg-[#f3efe8]">
      <div
        className="project-card__image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.28)), url(${project.cover.image})`,
          backgroundColor: project.cover.accent,
        }}
      >
        <span className="project-card__label">{project.cover.label}</span>
      </div>

      <div className="grid gap-8 px-6 py-6 md:grid-cols-[100px_1fr_auto] md:px-8 md:py-8">
        <p className="text-xs uppercase tracking-[0.28em] text-black/45">
          {String(index + 1).padStart(2, "0")}
        </p>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-black/55">{project.meta}</p>
          <h2 className="text-3xl tracking-tight md:text-5xl">
            {project.title}
          </h2>
        </div>

        <div className="flex items-start md:justify-end">
          <Link
            href={`/projects/${encodeURIComponent(project.slug)}`}
            className="inline-flex border border-black px-5 py-3 text-xs uppercase tracking-[0.28em] transition-colors hover:bg-black hover:text-[#f3efe8]"
          >
            查看项目
          </Link>
        </div>
      </div>
    </article>
  );
}
