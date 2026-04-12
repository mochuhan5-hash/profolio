## Context
The site already uses a file-based project workflow under `public/projects/<slug>/`, but the remaining UX details are still being decided. The newest requests add a second content surface (`INTRODUCE MO`) plus route-aware header navigation and richer gallery behavior, so the change now spans content loading, routing, and client-side interaction.

## Goals / Non-Goals
- Goals:
  - Keep content editable through local files instead of introducing a CMS
  - Let the homepage sort projects by the year already embedded in project markdown metadata
  - Add a dedicated profile page with markdown-backed intro and work-experience content
  - Preserve the current visual language while tightening navigation and gallery behavior
- Non-Goals:
  - Rich text editing UI or admin tools
  - Arbitrary nested profile sections beyond the requested intro, skill, education, and experience areas
  - Reworking unrelated homepage or detail-page styling beyond the requested items

## Decisions
- Decision: Keep all authored content in the filesystem under `public/`.
  - Why: It matches the existing project workflow, keeps deployment simple, and lets the owner update content by editing markdown files and folders.
- Decision: Parse the project sort year from `#项目标签（包括tag和日期）` by extracting the latest four-digit year.
  - Why: The year is already stored there today, so no new frontmatter field is needed.
  - Tie-breaker: When two projects resolve to the same year, keep the output stable with alphabetical slug order.
- Decision: Store profile content in `public/profile/个人简介.md` plus one folder per experience under `public/profile/`.
  - Why: The owner explicitly wants one intro file and one folder per experience, not a database or separate CMS.
- Decision: Parse `个人简介.md` headings `#name`, `#skill`, `#education1`, and `#education2` into four profile content buckets.
  - Why: This keeps the authoring format simple and directly matches the requested profile layout.
- Decision: Parse each experience folder from `工作经历.md`, optional `展示图.*`, and optional `#PDF链接` inside the markdown file.
  - Why: The experience card needs authored text, one preview image, and an optional outbound PDF target without introducing extra config files.
- Decision: Use `next/link` for shared-header navigation.
  - Why: Next.js recommends `Link` as the primary route-navigation primitive in the App Router, and it allows the header to work consistently from detail pages.
- Decision: Keep zoom behavior inside the existing client gallery component.
  - Why: Wheel zoom only affects the fullscreen preview, so local client state with bounded scale and reset-on-close behavior is the smallest change.
- Decision: Render skill, education, and experience as reusable list/card sections that visually align with the existing homepage card gallery.
  - Why: The owner wants a consistent portfolio language and specifically referenced the current homepage layout plus the provided experience-card mock.

## Risks / Trade-offs
- Parsing years from free-form metadata is less explicit than adding a separate field.
  - Mitigation: Restrict the parser to a four-digit year and keep alphabetical fallback ordering when no year is found.
- Storing markdown under `public/` means those raw files are directly addressable by URL.
  - Mitigation: This matches the current project-content convention and avoids a larger content-system migration.
- Fixing the preview-image convention to `展示图.*` adds one more naming rule for profile content.
  - Mitigation: The deterministic filename keeps authoring simple and avoids ambiguous image selection inside each experience folder.

## Migration Plan
1. Extend the active proposal to include the finalized `INTRODUCE MO` content contract and page layout.
2. After approval, add the profile loader and page scaffold alongside the remaining header, sorting, and gallery changes.
3. Scaffold starter files under `public/profile/` so the owner can fill content manually.
4. Validate with automated tests, build output, and strict OpenSpec validation.

## Open Questions
- None for the current requested scope.
