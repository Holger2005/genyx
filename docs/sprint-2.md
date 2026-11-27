# Sprint 2 — Portfolio and services

## Iteration 2.2

- Add a framework-independent domain project model and repository port.
- Return localized public records only; exclude draft and review records.
- Generate static bilingual catalog and case-study routes.
- Integrate a responsive project grid into the homepage.
- Publish only the first-party Genyx prototype case study.
- Add unit tests and production HTTP checks for project routes.

The abstract project-card illustration is decorative, not a screenshot. No external
project, private record, third-party media or confidential data is included. A future
CMS must enforce publication permissions server-side; filtering is not a substitute
for access controls on the CMS itself.

## Iteration 2.3

- Localized media model, responsive image gallery and optional captioned video support.
- Original SVG diagrams for the architecture and adaptive rendering flow.
- Live first-party sculpture demonstration with reduced-motion fallback.
- Chromium smoke checks for media availability and the demo section.
- Opt-in local screenshot capture with GENYX_CAPTURE=1.
- CI uploads four actual case-study and gallery viewport screenshots as a temporary artifact.

The diagrams are original technical illustrations, not screenshots. Captured browser
images are for review and are not published automatically. No video file is available
yet; the video renderer is prepared for approved MP4 and WebVTT caption files only.

## Acceptance gates

- Verify CI, browser smoke tests and CodeQL on the new pull request.
- Review the new project pages visually on mobile and desktop.
- Confirm the correct language and navigation between catalog and detail pages.
- Verify that unknown and unpublished project routes return 404.
- Review actual screenshot artifacts and obtain publication approvals before adding client media.
- Verify captioned videos when approved video files are available.
