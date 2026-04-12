import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const projectsDirectory = path.join(process.cwd(), "public", "projects");
const supportedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);
const supportedVideoExtensions = new Set([".mp4", ".mov", ".webm", ".ogg"]);
const markdownFileName = "项目简介.md";
const pdfFileName = "project.pdf";
const coverBaseName = "封面";
const numberedImagePattern = /^\d+$/;

type MarkdownSections = {
  meta: string;
  title: string;
  subtitle: string;
  website: string | null;
  body: string;
};

export type ProjectGalleryMedia = {
  type: "image" | "video";
  src: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  meta: string;
  sortYear: number | null;
  website: string | null;
  summary: string;
  cover: {
    label: string;
    image: string;
    accent: string;
  };
  galleryMedia: ProjectGalleryMedia[];
  introduction: string;
  pdf: string | null;
};

function toPublicPath(slug: string, fileName: string) {
  return `/projects/${encodeURIComponent(slug)}/${encodeURIComponent(fileName)}`;
}

function getFileExtension(fileName: string) {
  return path.extname(fileName).toLowerCase();
}

function isSupportedImage(fileName: string) {
  return supportedImageExtensions.has(getFileExtension(fileName));
}

function isSupportedVideo(fileName: string) {
  return supportedVideoExtensions.has(getFileExtension(fileName));
}

function getBaseName(fileName: string) {
  return path.parse(fileName).name;
}

function getCoverImage(fileNames: string[], slug: string) {
  const coverFile = fileNames.find(
    (fileName) => isSupportedImage(fileName) && getBaseName(fileName) === coverBaseName,
  );

  if (!coverFile) {
    throw new Error(`Missing cover image '${coverBaseName}.*' for project '${slug}'.`);
  }

  return toPublicPath(slug, coverFile);
}

function getGalleryMedia(fileNames: string[], slug: string): ProjectGalleryMedia[] {
  const videoMedia = fileNames
    .filter((fileName) => isSupportedVideo(fileName))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => ({
      type: "video" as const,
      src: toPublicPath(slug, fileName),
    }));

  const imageMedia = fileNames
    .filter((fileName) => isSupportedImage(fileName) && numberedImagePattern.test(getBaseName(fileName)))
    .sort((left, right) => Number(getBaseName(left)) - Number(getBaseName(right)))
    .map((fileName) => ({
      type: "image" as const,
      src: toPublicPath(slug, fileName),
    }));

  return [...videoMedia, ...imageMedia];
}

function extractFirstParagraph(markdown: string) {
  return (
    markdown
      .split(/\r?\n\s*\r?\n/)
      .map((block) => block.replace(/\r?\n/g, " ").trim())
      .find(Boolean) ?? ""
  );
}

function extractSortYear(meta: string) {
  const matches = meta.match(/\b(19|20)\d{2}\b/g);
  return matches ? Number(matches.at(-1)) : null;
}

function parseMarkdownSections(markdown: string): MarkdownSections {
  const sections = new Map<string, string[]>();
  let currentHeading: string | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith("#")) {
      currentHeading = line.replace(/^#+\s*/, "").trim();
      sections.set(currentHeading, []);
      continue;
    }

    if (!currentHeading) {
      continue;
    }

    sections.get(currentHeading)?.push(line);
  }

  const meta = sections.get("项目标签（包括tag和日期）")?.join("\n").trim() ?? "";
  const title = sections.get("项目名称")?.join("\n").trim() ?? "";
  const subtitle = sections.get("项目副标题")?.join("\n").trim() ?? "";
  const website = sections.get("项目地址")?.join("\n").trim() || null;
  const body = sections.get("简介正文")?.join("\n").trim() ?? "";

  if (!meta || !title || !subtitle || !body) {
    throw new Error("项目简介.md 缺少必需标题：项目标签（包括tag和日期）、项目名称、项目副标题、简介正文。");
  }

  return { meta, title, subtitle, website, body };
}

function getMarkdownSections(slug: string) {
  const markdownPath = path.join(projectsDirectory, slug, markdownFileName);

  if (!existsSync(markdownPath)) {
    throw new Error(`Missing markdown file '${markdownFileName}' for project '${slug}'.`);
  }

  return parseMarkdownSections(readFileSync(markdownPath, "utf-8"));
}

function getPdfPath(slug: string) {
  const pdfPath = path.join(projectsDirectory, slug, pdfFileName);
  return existsSync(pdfPath) ? toPublicPath(slug, pdfFileName) : null;
}

function getProjectFromDirectory(slug: string): Project {
  const directoryPath = path.join(projectsDirectory, slug);
  const fileNames = readdirSync(directoryPath);
  const markdownSections = getMarkdownSections(slug);

  return {
    slug,
    title: markdownSections.title,
    subtitle: markdownSections.subtitle,
    meta: markdownSections.meta,
    sortYear: extractSortYear(markdownSections.meta),
    website: markdownSections.website,
    summary: extractFirstParagraph(markdownSections.body),
    cover: {
      label: "Project",
      image: getCoverImage(fileNames, slug),
      accent: "#d7d0c4",
    },
    galleryMedia: getGalleryMedia(fileNames, slug),
    introduction: markdownSections.body,
    pdf: getPdfPath(slug),
  };
}

export function loadProjects(): Project[] {
  return readdirSync(projectsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .map(getProjectFromDirectory)
    .sort((left, right) => {
      const leftYear = left.sortYear ?? -1;
      const rightYear = right.sortYear ?? -1;

      if (leftYear !== rightYear) {
        return rightYear - leftYear;
      }

      return left.slug.localeCompare(right.slug);
    });
}

export function getProjectSlugs() {
  return loadProjects().map((project) => project.slug);
}

export function getProjectBySlug(slug: string) {
  const normalizedSlug = decodeURIComponent(slug);
  return loadProjects().find((project) => project.slug === normalizedSlug);
}
