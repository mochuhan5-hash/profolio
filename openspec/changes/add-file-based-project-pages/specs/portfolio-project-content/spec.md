## ADDED Requirements
### Requirement: File-based project discovery
The system SHALL discover portfolio projects from directories under `public/projects/` instead of relying on a hard-coded in-code project array.

#### Scenario: Project directory is available
- **WHEN** the site loads portfolio project data
- **THEN** it SHALL treat each direct child directory of `public/projects/` as one project
- **AND** it SHALL use the directory name as the project slug

### Requirement: Cover image naming convention
The system SHALL derive each project card cover image from a file named `封面` in the project directory, using a supported image extension.

#### Scenario: Cover image exists
- **WHEN** a project directory contains `封面.jpg`, `封面.jpeg`, `封面.png`, `封面.webp`, or `封面.svg`
- **THEN** the home page and project page SHALL use that file as the project cover image

### Requirement: Homepage project ordering
The system SHALL order homepage project cards from newest to oldest using the year embedded in each project's markdown metadata.

#### Scenario: Project metadata includes a year
- **WHEN** `#项目标签（包括tag和日期）` contains a four-digit year for multiple projects
- **THEN** the home page SHALL sort those projects by year in descending order before rendering
- **AND** projects with the same resolved year SHALL fall back to alphabetical slug order for stability

### Requirement: Numbered project media gallery
The system SHALL render one authored project media item at a time on each project page using supported video files first and supported image files other than the cover image after them.

#### Scenario: Project video and numbered gallery images exist
- **WHEN** a project directory contains a supported video file such as `视频.mp4` and supported image files named with numeric basenames such as `1.jpg`, `2.png`, or `10.webp`, besides the `封面.*` file
- **THEN** the project page SHALL place the video before the numbered images in the gallery order
- **AND** it SHALL sort the numbered images by numeric filename order before rendering
- **AND** it SHALL exclude the `封面.*` file from that gallery
- **AND** it SHALL render one current media item at a time with previous and next controls on the left and right edges of the gallery region
- **AND** it SHALL show the current media index without an additional instructional text block beside it

#### Scenario: Only numbered gallery images exist
- **WHEN** a project directory does not contain a supported video file but does contain supported image files named with numeric basenames
- **THEN** the project page SHALL render the image-only gallery using the same single-item gallery component

### Requirement: Zoomable project media preview
The system SHALL let visitors open the current project media item in a fullscreen preview and adjust magnification with the mouse wheel.

#### Scenario: Fullscreen preview is open for an image
- **WHEN** the visitor clicks the current gallery image
- **THEN** the system SHALL open a fullscreen preview of that image
- **AND WHEN** the visitor scrolls the mouse wheel over the preview
- **THEN** the system SHALL zoom the image in or out within a bounded scale range
- **AND** it SHALL reset the zoom level when the preview closes or the current gallery image changes

#### Scenario: Fullscreen preview is open for a video
- **WHEN** the visitor clicks the current gallery video
- **THEN** the system SHALL open a fullscreen preview of that video
- **AND** the video SHALL autoplay inside both the inline gallery and the fullscreen preview
- **AND WHEN** the visitor scrolls the mouse wheel over the preview
- **THEN** the system SHALL scale the fullscreen video in or out within a bounded range

### Requirement: Markdown-driven project header and introduction
The system SHALL read project text content from a markdown file named `项目简介.md` within each project directory and map specific sections into the project page layout.

#### Scenario: Markdown summary exists
- **WHEN** a project directory contains `项目简介.md` with sections headed `#项目标签（包括tag和日期）`, `#项目名称`, `#项目副标题`, and `#简介正文`
- **THEN** the project page SHALL place the tag/date section, project name, and project subtitle into the project header area below the gallery
- **AND** it SHALL render the `#简介正文` section as markdown content below the project header

#### Scenario: Optional website address exists
- **WHEN** a project directory contains `项目简介.md` with an additional section headed `#项目地址`
- **THEN** the project page SHALL render a clickable website link between the project header and the markdown introduction body

### Requirement: PDF document link
The system SHALL expose a downloadable project PDF link from a fixed file named `project.pdf`.

#### Scenario: PDF exists
- **WHEN** a project directory contains `project.pdf`
- **THEN** the project page SHALL render a link to that PDF below the markdown introduction body

### Requirement: Supported project asset filtering
The system SHALL ignore non-project support files when building the image gallery and document links.

#### Scenario: Mixed files exist in a project directory
- **WHEN** a project directory contains image files, `项目简介.md`, and `project.pdf`
- **THEN** only supported numbered non-cover image files SHALL appear in the gallery
- **AND** `项目简介.md` SHALL only be used for markdown parsing and rendering
- **AND** `project.pdf` SHALL only be used for the PDF link
