import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const profileDirectory = path.join(process.cwd(), "public", "profile");
const profileMarkdownFileName = "个人简介.md";
const experienceMarkdownFileName = "工作经历.md";
const experiencePreviewBaseName = "展示图";
const skillIconsDirectoryName = "skill-icons";
const defaultSkillIconSlug = "default";
const supportedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);
const skillIconAliases: Record<string, string> = {
  ps: "photoshop",
  photoshop: "photoshop",
  ardiuno: "arduino",
  arduino: "arduino",
};

type ProfileSections = {
  name: string;
  skill: string;
  education1: string;
  education2: string;
};

export type ProfileEducation = {
  school: string;
  degree: string;
  year: string;
  className: string;
};

export type ProfileSkillIcon = {
  label: string;
  slug: string;
  src: string;
};

export type ProfileProjectSection = {
  title: string;
  content: string;
};

type ExperienceSections = {
  company: string;
  rolePeriod: string;
  projectSections: ProfileProjectSection[];
  pdfLink: string | null;
};

export type ProfileExperience = {
  slug: string;
  company: string;
  rolePeriod: string;
  projectNames: string[];
  projectSections: ProfileProjectSection[];
  pdfLink: string | null;
  previewImage: string | null;
};

export type Profile = {
  name: string;
  skills: string[];
  skillIcons: ProfileSkillIcon[];
  education: ProfileEducation[];
  experiences: ProfileExperience[];
};

function toPublicProfilePath(...segments: string[]) {
  return `/profile/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

function getFileExtension(fileName: string) {
  return path.extname(fileName).toLowerCase();
}

function isSupportedImage(fileName: string) {
  return supportedImageExtensions.has(getFileExtension(fileName));
}

function getBaseName(fileName: string) {
  return path.parse(fileName).name;
}

function parseMarkdownSections(markdown: string) {
  const sections = new Map<string, string[]>();
  let currentHeading: string | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const headingMatch = line.match(/^(#+)\s*(.*)$/);

    if (headingMatch && headingMatch[1].length === 1) {
      currentHeading = headingMatch[2].trim();
      sections.set(currentHeading, []);
      continue;
    }

    if (!currentHeading) {
      continue;
    }

    sections.get(currentHeading)?.push(line);
  }

  return sections;
}

function getRequiredSection(sections: Map<string, string[]>, heading: string, fileName: string) {
  const value = sections.get(heading)?.join("\n").trim() ?? "";

  if (!value) {
    throw new Error(`${fileName} 缺少必需标题：#${heading}`);
  }

  return value;
}

function splitListContent(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•]\s*/, ""));
}

function parseEducationItem(content: string): ProfileEducation {
  const fields = new Map<string, string>();

  for (const line of content.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
    const match = line.match(/^[-•]?\s*([A-Za-z]+)\s*[:：]\s*(.*)$/);

    if (!match) {
      continue;
    }

    fields.set(match[1].toLowerCase(), match[2].trim());
  }

  const school = fields.get("school") ?? "";
  const degree = fields.get("degree") ?? "";
  const year = fields.get("year") ?? "";

  if (!school || !degree || !year) {
    throw new Error(`${profileMarkdownFileName} 的 education 条目缺少 school、degree 或 year。`);
  }

  return {
    school,
    degree,
    year,
    className: fields.get("class") ?? "",
  };
}

function getProfileSections(): ProfileSections {
  const markdownPath = path.join(profileDirectory, profileMarkdownFileName);

  if (!existsSync(markdownPath)) {
    throw new Error(`Missing markdown file '${profileMarkdownFileName}'.`);
  }

  const sections = parseMarkdownSections(readFileSync(markdownPath, "utf-8"));

  return {
    name: getRequiredSection(sections, "name", profileMarkdownFileName),
    skill: getRequiredSection(sections, "skill", profileMarkdownFileName),
    education1: getRequiredSection(sections, "education1", profileMarkdownFileName),
    education2: getRequiredSection(sections, "education2", profileMarkdownFileName),
  };
}

function getExperiencePreviewImage(slug: string, fileNames: string[]) {
  const previewFile = fileNames.find(
    (fileName) => isSupportedImage(fileName) && getBaseName(fileName) === experiencePreviewBaseName,
  );

  return previewFile ? toPublicProfilePath(slug, previewFile) : null;
}

function buildSkillIconSlug(skill: string) {
  const normalized = skill
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    return defaultSkillIconSlug;
  }

  return skillIconAliases[normalized] ?? normalized;
}

function getSkillIcon(skill: string): ProfileSkillIcon {
  const slug = buildSkillIconSlug(skill);
  const iconDirectory = path.join(profileDirectory, skillIconsDirectoryName);
  const iconSlug = existsSync(path.join(iconDirectory, `${slug}.png`)) ? slug : defaultSkillIconSlug;

  return {
    label: skill,
    slug: iconSlug,
    src: toPublicProfilePath(skillIconsDirectoryName, `${iconSlug}.png`),
  };
}

function getExperienceProjectSections(sections: Map<string, string[]>) {
  return [...sections.entries()]
    .filter(([heading, lines]) => heading !== "公司" && heading !== "岗位/日期" && heading !== "PDF链接" && lines.join("\n").trim())
    .map(([heading, lines]) => ({
      title: heading,
      content: lines.join("\n").trim(),
    }));
}

function getExperienceSections(slug: string): ExperienceSections {
  const markdownPath = path.join(profileDirectory, slug, experienceMarkdownFileName);

  if (!existsSync(markdownPath)) {
    throw new Error(`Missing markdown file '${experienceMarkdownFileName}' for experience '${slug}'.`);
  }

  const sections = parseMarkdownSections(readFileSync(markdownPath, "utf-8"));
  const projectSections = getExperienceProjectSections(sections);

  if (projectSections.length === 0) {
    throw new Error(`${experienceMarkdownFileName} 缺少至少一个项目介绍标题。`);
  }

  return {
    company: getRequiredSection(sections, "公司", experienceMarkdownFileName),
    rolePeriod: getRequiredSection(sections, "岗位/日期", experienceMarkdownFileName),
    projectSections,
    pdfLink: sections.get("PDF链接")?.join("\n").trim() || null,
  };
}

function getExperienceFromDirectory(slug: string): ProfileExperience {
  const directoryPath = path.join(profileDirectory, slug);
  const fileNames = readdirSync(directoryPath);
  const experienceSections = getExperienceSections(slug);

  return {
    slug,
    company: experienceSections.company,
    rolePeriod: experienceSections.rolePeriod,
    projectNames: experienceSections.projectSections.map((section) => section.title),
    projectSections: experienceSections.projectSections,
    pdfLink: experienceSections.pdfLink,
    previewImage: getExperiencePreviewImage(slug, fileNames),
  };
}

export function loadProfile(): Profile {
  const profileSections = getProfileSections();
  const skills = splitListContent(profileSections.skill);

  return {
    name: profileSections.name,
    skills,
    skillIcons: skills.map(getSkillIcon),
    education: [parseEducationItem(profileSections.education1), parseEducationItem(profileSections.education2)],
    experiences: readdirSync(profileDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((slug) => existsSync(path.join(profileDirectory, slug, experienceMarkdownFileName)))
      .sort((left, right) => left.localeCompare(right))
      .map(getExperienceFromDirectory),
  };
}

export function getProfileExperienceSlugs() {
  return loadProfile().experiences.map((experience) => experience.slug);
}

export function getProfileExperienceBySlug(slug: string) {
  const normalizedSlug = decodeURIComponent(slug);
  return loadProfile().experiences.find((experience) => experience.slug === normalizedSlug);
}
