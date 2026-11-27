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

## Acceptance gates

- Verify CI, browser smoke tests and CodeQL on the new pull request.
- Review the new project pages visually on mobile and desktop.
- Confirm the correct language and navigation between catalog and detail pages.
- Verify that unknown and unpublished project routes return 404.
- Add actual project media and detailed publication approvals in the next iteration.
