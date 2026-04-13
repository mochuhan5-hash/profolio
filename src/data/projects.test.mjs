import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getProjectBySlug, getProjectSlugs, loadProjects } from "./projects.ts";
import { loadProfile } from "./profile.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectCardSource = readFileSync(path.join(__dirname, "../components/project-card.tsx"), "utf8");
const projectGallerySource = readFileSync(path.join(__dirname, "../components/project-gallery.tsx"), "utf8");
const projectPageSource = readFileSync(path.join(__dirname, "../app/projects/[slug]/page.tsx"), "utf8");
const homePageSource = readFileSync(path.join(__dirname, "../app/page.tsx"), "utf8");
const siteHeaderSource = readFileSync(path.join(__dirname, "../components/site-header.tsx"), "utf8");
const globalsCssSource = readFileSync(path.join(__dirname, "../app/globals.css"), "utf8");
const copyEmailButtonSource = readFileSync(path.join(__dirname, "../components/copy-email-button.tsx"), "utf8");
const markdownRendererSource = readFileSync(path.join(__dirname, "../components/markdown-renderer.tsx"), "utf8");
const introduceMoPageSource = readFileSync(path.join(__dirname, "../app/introduce-mo/page.tsx"), "utf8");
const introduceMoDetailPageSource = readFileSync(path.join(__dirname, "../app/introduce-mo/[slug]/page.tsx"), "utf8");
const profileDataSource = readFileSync(path.join(__dirname, "./profile.ts"), "utf8");
const profileIntroSource = readFileSync(path.join(__dirname, "../../public/profile/个人简介.md"), "utf8");
const experienceSource = readFileSync(path.join(__dirname, "../../public/profile/experience-01/工作经历.md"), "utf8");
const skillIconsDirectory = path.join(__dirname, "../../public/profile/skill-icons");
const pageIntroComponentPath = path.join(__dirname, "../components/page-intro.tsx");

test("loads projects from public project folders", () => {
  const projects = loadProjects();

  assert.ok(projects.length > 0);
  assert.ok(projects.some((project) => project.slug === "FOCUS-EASY"));
  assert.ok(projects.some((project) => project.slug === "ON HER WAY"));
});

test("returns all slugs for static params", () => {
  assert.ok(getProjectSlugs().includes("healing seed"));
  assert.ok(getProjectSlugs().includes("ON HER WAY"));
});

test("finds projects by both raw and encoded slug values", () => {
  assert.equal(getProjectBySlug("ON HER WAY")?.title, "ON HER WAY");
  assert.equal(getProjectBySlug("ON%20HER%20WAY")?.title, "ON HER WAY");
});

test("encodes asset URLs for project folders with spaces", () => {
  const project = getProjectBySlug("ON HER WAY");

  assert.match(project?.cover.image ?? "", /^\/projects\/ON%20HER%20WAY\/%E5%B0%81%E9%9D%A2\.(jpg|jpeg|png|webp|svg)$/);
  assert.ok((project?.galleryMedia.length ?? 0) > 0);
  assert.match(project?.galleryMedia[0]?.src ?? "", /^\/projects\/ON%20HER%20WAY\/(%E8%A7%86%E9%A2%91\.mp4|1\.(jpg|jpeg|png|webp|svg))$/);
});

test("parses markdown metadata into project fields", () => {
  const project = getProjectBySlug("healing seed");

  assert.equal(project?.meta, "服务设计 / 数字互动装置 / 游戏化设计 / 2024");
  assert.equal(project?.sortYear, 2024);
  assert.match(project?.subtitle ?? "", /游戏化的森林疗养服务设计/);
  assert.match(project?.introduction ?? "", /Arduino/);
  assert.equal(project?.website, null);
  assert.equal(project?.pdf, null);
});

test("homepage projects are sorted from newest year to oldest", () => {
  const projects = loadProjects();
  const years = projects.map((project) => project.sortYear ?? -1);

  assert.deepEqual(years, [...years].sort((left, right) => right - left));
});

test("homepage uses a centered personal-intro component above the gallery", () => {
  assert.ok(homePageSource.includes("<PageIntro"));
  assert.ok(homePageSource.includes('arrowHref="#works"'));
});

test("homepage and introduce-mo pages reuse the same intro component for exact top-section alignment", () => {
  assert.ok(existsSync(pageIntroComponentPath));
  assert.ok(homePageSource.includes('import { PageIntro } from "@/components/page-intro";'));
  assert.ok(introduceMoPageSource.includes('import { PageIntro } from "@/components/page-intro";'));
  assert.ok(homePageSource.includes("<PageIntro"));
  assert.ok(introduceMoPageSource.includes("<PageIntro"));
});

test("homepage is organized as intro plus a three-column cover gallery", () => {
  assert.ok(homePageSource.includes("grid-cols-3"));
  assert.ok(homePageSource.includes("projects.map((project) => ("));
  assert.ok(!homePageSource.includes('id="about"'));
  assert.ok(!homePageSource.includes("<ProjectCard"));
});

test("homepage email button uses a separate client copy component", () => {
  assert.ok(!homePageSource.includes('"use client"'));
  assert.ok(homePageSource.includes("<CopyEmailButton"));
  assert.ok(copyEmailButtonSource.includes("cursor-pointer"));
  assert.ok(!homePageSource.includes('href="mailto:hello@example.com"'));
});

test("homepage removes the old about section and about nav link", () => {
  assert.ok(!homePageSource.includes('id="about"'));
  assert.ok(!siteHeaderSource.includes('{ label: "About", href: "#about" }'));
});

test("site header keeps only top-level active pills and removes subnav black-pill highlighting", () => {
  assert.ok(siteHeaderSource.includes("usePathname"));
  assert.ok(siteHeaderSource.includes('href="/introduce-mo"'));
  assert.ok(siteHeaderSource.includes('bg-black px-4 py-2 text-white'));
  assert.ok(siteHeaderSource.includes('href: "/introduce-mo#education"'));
  assert.ok(!siteHeaderSource.includes('activeSectionLinks.map((link, index) =>'));
});

test("site header applies explicit white text styling to the active top-level label span", () => {
  assert.ok(siteHeaderSource.includes("getTopLevelLabelClassName"));
  assert.ok(siteHeaderSource.includes('getTopLevelLabelClassName(!isIntroducePage,'));
  assert.ok(siteHeaderSource.includes('getTopLevelLabelClassName(isIntroducePage,'));
  assert.ok(siteHeaderSource.includes("text-white"));
});

test("site header keeps top-level and section navigation visible on mobile", () => {
  assert.ok(siteHeaderSource.includes('flex flex-wrap items-center gap-2 md:gap-3'));
  assert.ok(siteHeaderSource.includes('nav className="flex flex-wrap items-center gap-2'));
  assert.ok(!siteHeaderSource.includes('href={isIntroducePage ? "/introduce-mo" : "/"} className="md:hidden"'));
});

test("homepage mock intro content still lives in page.tsx", () => {
  assert.ok(homePageSource.includes("欢迎来到momo的空间。") || homePageSource.includes("Hi"));
});

test("homepage project links encode slugs with spaces", () => {
  assert.ok(projectCardSource.includes("encodeURIComponent(project.slug)") || homePageSource.includes("encodeURIComponent(project.slug)"));
});

test("homepage and detail project titles are not forced to uppercase", () => {
  assert.ok(!projectCardSource.includes("text-3xl uppercase tracking-tight md:text-5xl"));
  assert.ok(!projectPageSource.includes("text-5xl uppercase leading-none tracking-tight md:text-7xl"));
});

test("detail page removes the hero component", () => {
  assert.ok(!projectPageSource.includes("<ProjectHero project={project} />"));
  assert.ok(!projectPageSource.includes('import { ProjectHero } from "@/components/project-hero";'));
});

test("detail page shows project title and subtitle below the gallery", () => {
  assert.ok(projectPageSource.includes("{project.title}"));
  assert.ok(projectPageSource.includes("{project.subtitle}"));
});

test("detail page shows website label and URL text together", () => {
  assert.ok(projectPageSource.includes("{project.website}"));
  assert.ok(projectPageSource.includes("访问项目网站"));
});

test("introduce-mo page scaffolds education above skill and renders skill icons as circular png badges", () => {
  assert.ok(introduceMoPageSource.includes('id="education"'));
  assert.ok(introduceMoPageSource.includes('id="skill"'));
  assert.ok(introduceMoPageSource.indexOf('id="education"') < introduceMoPageSource.indexOf('id="skill"'));
  assert.ok(introduceMoPageSource.includes('rounded-full'));
  assert.ok(introduceMoPageSource.includes('profile.skillIcons.map((icon) => ('));
  assert.ok(introduceMoPageSource.includes('src={icon.src}'));
});

test("introduce-mo skill icons fill their circular container without leaving a smaller inner box", () => {
  assert.ok(introduceMoPageSource.includes('overflow-hidden rounded-full'));
  assert.ok(introduceMoPageSource.includes('className="h-full w-full object-cover"'));
  assert.ok(!introduceMoPageSource.includes('className="h-10 w-10 object-contain md:h-14 md:w-14"'));
});

test("introduce-mo experience cards stay lightweight and only show company, role/date, and project names", () => {
  assert.ok(!introduceMoPageSource.includes("experience.previewImage ?"));
  assert.ok(!introduceMoPageSource.includes("<MarkdownRenderer content={project}"));
  assert.ok(introduceMoPageSource.includes("experience.projectNames"));
  assert.ok(introduceMoPageSource.includes("bg-[#f3efe8]"));
});

test("profile data loader parses structured education fields, named experience sections, and skill icon assets", () => {
  const profile = loadProfile();

  assert.ok(profileDataSource.includes('school: string'));
  assert.ok(profileDataSource.includes('degree: string'));
  assert.ok(profileDataSource.includes('year: string'));
  assert.ok(profileDataSource.includes('className: string'));
  assert.ok(profileDataSource.includes('projectNames: string[]'));
  assert.ok(profileDataSource.includes('skillIcons:'));
  assert.ok(profileIntroSource.includes("school:"));
  assert.ok(profileIntroSource.includes("degree:"));
  assert.ok(profileIntroSource.includes("year:"));
  assert.ok(profileIntroSource.includes("class"));
  assert.ok(experienceSource.includes("# AI改写功能") || experienceSource.includes("#AI改写功能"));
  assert.ok(experienceSource.includes("# AI阅读功能") || experienceSource.includes("#AI阅读功能"));
  assert.ok(profile.education.length > 0);
  assert.ok(profile.education[0]?.school);
  assert.ok(profile.experiences[0]?.projectNames.length > 0);
  assert.ok(profile.skillIcons.length > 0);
  assert.ok(existsSync(path.join(skillIconsDirectory, `${profile.skillIcons[0]?.slug}.png`)));
});

test("project gallery keeps zoom preview behavior while using below-media controls", () => {
  assert.ok(projectGallerySource.includes("duration-700"));
  assert.ok(projectGallerySource.includes("setIsZoomed"));
  assert.ok(projectGallerySource.includes("fixed inset-0"));
  assert.ok(projectGallerySource.includes("zoomScale"));
  assert.ok(projectGallerySource.includes("onWheel={handleWheelZoom}"));
  assert.ok(!projectGallerySource.includes(">Gallery<"));
  assert.ok(!projectGallerySource.includes("点击图片可放大查看"));
});

test("project gallery supports mixed video and image media with autoplay and enlarged video viewing", () => {
  assert.ok(projectGallerySource.includes("media: ProjectGalleryMedia[]"));
  assert.ok(projectGallerySource.includes('currentMedia.type === "video"'));
  assert.ok(projectGallerySource.includes("autoPlay"));
  assert.ok(projectGallerySource.includes("muted"));
  assert.ok(projectGallerySource.includes("playsInline"));
  assert.ok(projectGallerySource.includes('aria-label="放大预览"'));
});

test("project gallery places page index and paging controls below the media frame", () => {
  assert.ok(projectGallerySource.includes('className="space-y-6 border-t border-black/10 pt-12"'));
  assert.ok(projectGallerySource.includes('className="mt-5 flex flex-col items-center gap-4"'));
  assert.ok(projectGallerySource.includes('aria-label="上一项"'));
  assert.ok(projectGallerySource.includes('aria-label="下一项"'));
  assert.ok(projectGallerySource.includes("aspect-[16/10]"));
  assert.ok(!projectGallerySource.includes('aria-label="上一张"'));
  assert.ok(!projectGallerySource.includes('aria-label="下一张"'));
});

test("project gallery uses larger symbolic arrow labels instead of Prev and Next text", () => {
  assert.ok(projectGallerySource.includes('text-3xl'));
  assert.ok(projectGallerySource.includes('{"<"}'));
  assert.ok(projectGallerySource.includes('{">"}'));
  assert.ok(!projectGallerySource.includes(">Prev<"));
  assert.ok(!projectGallerySource.includes(">Next<"));
});

test("project data loader prioritizes project video before numbered images in gallery media when a video exists", () => {
  const onHerWayProject = getProjectBySlug("ON HER WAY");

  assert.ok(profileDataSource.length > 0);
  assert.equal(onHerWayProject?.galleryMedia[0]?.type, "video");
  assert.match(onHerWayProject?.galleryMedia[0]?.src ?? "", /%E8%A7%86%E9%A2%91\.mp4$/);
  assert.ok((onHerWayProject?.galleryMedia.filter((item) => item.type === "image").length ?? 0) > 0);
});

test("project detail page passes mixed gallery media instead of image-only arrays", () => {
  assert.ok(projectPageSource.includes("<ProjectGallery media={project.galleryMedia} />"));
  assert.ok(!projectPageSource.includes("<ProjectGallery images={project.galleryImages} />"));
});

test("markdown renderer supports nested # and ## headings with separate heading levels and paragraph blocks", () => {
  assert.ok(markdownRendererSource.includes('block.startsWith("## ")'));
  assert.ok(markdownRendererSource.includes('block.startsWith("# ")'));
  assert.ok(markdownRendererSource.includes("<h2>"));
  assert.ok(markdownRendererSource.includes("<h3>"));
  assert.ok(markdownRendererSource.includes('split(/\\n(?=# |## |- )/)'));
});

test("project card cover has rounded corners and floating hover shadow", () => {
  assert.ok(homePageSource.includes("rounded-2xl") || homePageSource.includes("rounded-["));
  assert.ok(homePageSource.includes("hover:-translate-y"));
  assert.ok(homePageSource.includes("hover:shadow"));
});

test("project card cover uses a fixed 842:595 aspect ratio and full image containment", () => {
  assert.ok(globalsCssSource.includes("aspect-ratio: 842 / 595"));
  assert.ok(globalsCssSource.includes("background-size: contain"));
  assert.ok(globalsCssSource.includes("background-repeat: no-repeat"));
});

test("introduce-mo detail page renders named project sections and optional pdf link", () => {
  assert.ok(introduceMoDetailPageSource.includes("getProfileExperienceBySlug"));
  assert.ok(introduceMoDetailPageSource.includes("getProfileExperienceSlugs"));
  assert.ok(introduceMoDetailPageSource.includes("experience.projectSections.map"));
  assert.ok(introduceMoDetailPageSource.includes("查看 PDF"));
});

test("profile experience scaffold includes optional preview image asset", () => {
  assert.ok(profileDataSource.includes('return previewFile ? toPublicProfilePath(slug, previewFile) : null'));
});
