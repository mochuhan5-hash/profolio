import type { Project } from "@/data/projects";

type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.32em] text-black/45">
          {project.category} · {project.year}
        </p>
        <h1 className="max-w-4xl text-5xl uppercase leading-none tracking-tight md:text-7xl">
          {project.title}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-black/70 md:text-2xl">
          {project.subtitle}
        </p>
      </div>

      <div
        className="hero-image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.3)), url(${project.cover.image})`,
          backgroundColor: project.cover.accent,
        }}
      >
        <span className="hero-image__label">{project.cover.label}</span>
      </div>

      <p className="max-w-3xl text-base leading-8 text-black/72 md:text-lg">
        {project.overview}
      </p>
    </section>
  );
}
