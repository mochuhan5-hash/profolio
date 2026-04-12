import { describe, expect, it } from "vitest";
import { getProjectBySlug, getProjectSlugs, loadProjects } from "./projects";

describe("project content loading", () => {
  it("loads projects from file-based content", () => {
    const projects = loadProjects();

    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toMatchObject({
      slug: "coastal-archive",
      title: "海岸档案馆",
    });
  });

  it("returns all slugs for static params", () => {
    expect(getProjectSlugs()).toContain("coastal-archive");
  });

  it("finds a project by slug", () => {
    expect(getProjectBySlug("coastal-archive")?.title).toBe("海岸档案馆");
  });
});
