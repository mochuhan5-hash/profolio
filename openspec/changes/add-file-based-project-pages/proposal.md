# Change: Add file-based portfolio project and profile pages

## Why
The portfolio site now needs one consistent file-driven workflow for both project pages and a new `INTRODUCE MO` page. The owner also wants the profile page to be editable entirely from local markdown, preview images, and PDF links without introducing a CMS or hand-editing code for each experience.

## What Changes
- Keep portfolio project content sourced from `public/projects/<slug>/` using cover images, numbered gallery images, markdown summaries, and optional PDFs
- Sort the homepage project gallery from newest to oldest by the year parsed from `#项目标签（包括tag和日期）`
- Refine project detail galleries to show one authored media item at a time with lightweight side controls, fullscreen preview, and mouse-wheel zooming, while prioritizing project video when present
- Remove the extra instructional copy from the gallery header area while keeping the current image index
- Update the shared header so the title returns to `/`, the home-section links remain usable across pages, a new `INTRODUCE MO` entry links to a dedicated profile page, and the active top-level destination renders as black background with white text
- Reuse one shared intro component for the homepage and `INTRODUCE MO` page so both top sections stay vertically aligned
- Add a file-based profile content flow under `public/profile/` with:
  - `个人简介.md`
  - one folder per work experience
  - `工作经历.md` inside each experience folder
  - an optional preview image named `展示图.*`
  - an optional PDF link stored in markdown
- Parse `个人简介.md` sections `#name`, `#skill`, `#education1`, and `#education2`
- Parse each `工作经历.md` using `#公司`, `#岗位/日期`, `#项目1介绍`, `#项目2介绍`, and optional `#PDF链接`
- Render the `INTRODUCE MO` page as four ordered areas: reused personal intro, skill list, education list, and experience cards laid out like the existing homepage gallery/cards

## Impact
- Affected specs: `portfolio-project-content`, `portfolio-profile-content`
- Affected code: `src/data/projects.ts`, `src/components/project-gallery.tsx`, `src/components/site-header.tsx`, `src/app/page.tsx`, `src/app/projects/[slug]/page.tsx`, a new profile route/data loader, and profile content scaffolding under `public/profile/`
