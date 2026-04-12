## ADDED Requirements
### Requirement: Shared header profile navigation
The system SHALL expose the portfolio title and profile entry from the shared header on both the homepage and inner pages.

#### Scenario: Shared header renders on portfolio pages
- **WHEN** the shared site header is displayed on the homepage or project pages
- **THEN** the portfolio title SHALL navigate to `/`
- **AND** the header SHALL include an `INTRODUCE MO` navigation entry that links to the dedicated profile page
- **AND** the section navigation SHALL target the homepage `Works` and `Contact` sections
- **AND** the currently active top-level destination SHALL be visually highlighted

#### Scenario: Shared header renders on profile pages
- **WHEN** the shared site header is displayed on `/introduce-mo` or an experience detail page
- **THEN** the `INTRODUCE MO` top-level destination SHALL be visually highlighted with a black background and white label text
- **AND** the section navigation SHALL target the profile-page `Education`, `Skill`, and `Experience` sections

### Requirement: File-based personal introduction
The system SHALL load the personal introduction content of the profile page from `public/profile/个人简介.md`.

#### Scenario: Personal introduction markdown exists
- **WHEN** `public/profile/个人简介.md` is present with sections `#name`, `#skill`, `#education1`, and `#education2`
- **THEN** the profile page SHALL use `#name` in the reused top introduction area
- **AND** it SHALL render the `#skill` content as a skill list section
- **AND** it SHALL render `#education1` and `#education2` as separate education items in the education section above the skill section
- **AND** each education item SHALL support authored `school`, `degree`, `year`, and `class` text fields

### Requirement: File-based experience folders
The system SHALL load work experience content from direct child folders under `public/profile/`.

#### Scenario: Experience folder exists
- **WHEN** a direct child folder under `public/profile/` contains `工作经历.md`
- **THEN** the system SHALL treat that folder as one authored experience entry
- **AND** it MAY use an optional preview image named `展示图.jpg`, `展示图.jpeg`, `展示图.png`, `展示图.webp`, or `展示图.svg`
- **AND** it SHALL ignore unrelated files when building the experience list

### Requirement: Markdown-driven experience content
The system SHALL read each experience entry from `工作经历.md` and map its authored sections into the profile page.

#### Scenario: Experience markdown exists
- **WHEN** `工作经历.md` contains sections `#公司`, `#岗位/日期`, and one or more authored project-name sections
- **THEN** the profile overview page SHALL render a lightweight card containing only the company, role/date, and project names
- **AND** clicking that card SHALL navigate to a dedicated experience detail page
- **AND** the dedicated experience detail page SHALL render one section per authored project name
- **AND** each project section SHALL use a `##` subheading followed by markdown-rendered body content

#### Scenario: Optional PDF link exists
- **WHEN** `工作经历.md` contains an additional `#PDF链接` section
- **THEN** the dedicated experience detail page SHALL render that value as an optional PDF action at the bottom of the page

### Requirement: Profile page layout
The system SHALL provide a dedicated profile page for the `INTRODUCE MO` navigation entry.

#### Scenario: Visitor opens the profile page
- **WHEN** the visitor navigates to the profile page
- **THEN** the page SHALL render four ordered areas: reused personal introduction, education list, skill list, and experience list
- **AND** the reused personal introduction SHALL share the same component structure and vertical placement as the homepage intro section
- **AND** the skill, education, and experience areas SHALL present their items as list/card components aligned with the site's existing gallery/card visual language
- **AND** the experience overview cards SHALL stay within the site's light base palette instead of introducing a separate dark theme block
- **AND** the page SHALL use the same shared header and overall visual language as the rest of the portfolio
