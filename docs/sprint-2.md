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

## Iteration 2.4

- Bilingual service catalog and individual pages for all six specialties.
- Shared domain model and catalog repository contract.
- Proposed deliverables and intended audience for each service.
- SaaS catalog exposes available products only; currently none are approved.
- Empty catalog state, guarded detail routes and honest contact-status links.
- Unit tests and production HTTP checks for service and product routes.

No prices, fabricated products, payment flows or working inquiry forms are published.
The contact integration remains a Sprint 3 task. Service descriptions are proposed
commercial scope, not evidence of prior client work or guaranteed outcomes.

## Iteration 2.5

- Move existing bilingual copy, services, projects and products into editable JSON.
- Keep the domain and application repository contracts unchanged.
- Validate required translations, record identifiers, publication states and local media.
- Add content validation tests and a documented Git-based editorial workflow.
- Preserve all existing content and the empty SaaS catalog.

See [content management](content-management.md). This is a file-based editorial
workflow, not a deployed administrative panel. Public repository data is never private.

## Acceptance gates

- Verify CI, browser smoke tests and CodeQL on the new pull request.
- Review the new project pages visually on mobile and desktop.
- Confirm the correct language and navigation between catalog and detail pages.
- Verify that unknown and unpublished project routes return 404.
- Review actual screenshot artifacts and obtain publication approvals before adding client media.
- Verify captioned videos when approved video files are available.
