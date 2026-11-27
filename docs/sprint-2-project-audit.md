# Sprint 2.1 — Portfolio candidate assessment

## Scope

The portfolio will present verified technical work, not imply paid client engagements
or production readiness. The initial inventory was reviewed at repository level.
Selected source files were inspected; independent execution and end-to-end tests
of external projects have not yet been performed.

## Candidate order

1. Genyx visual prototype: first-party example of responsive UI, WebGL and automated CI.
2. Project management API concept: potential enterprise software case study.
3. Pet adoption API concept: potential backend architecture case study.
4. Customer management API concept: CRUD operations and unit-test examples.
5. Attendance API concept: registration and consultation workflows.
6. API-driven Angular application concept: search, filtering, pagination and favorites.
7. Tourism website concept: multipage informational web experience.
8. Genyx Labs: possible collection of browser-based interactive demonstrations.

The candidate order is a proposal, not an approved publication list. No external
repository content, screenshots, private metadata, credentials or customer data
is included in this document.

## Publication gates

- Confirm ownership, contributor permissions and rights to names, media and assets.
- Review source and history for sensitive data; resolve security findings before linking.
- Run the documented build and relevant tests in an isolated environment.
- Use synthetic data for screenshots, videos and live demos.
- Clearly label training projects, prototypes and demonstrations.
- Do not invent customer testimonials, savings, performance results or deployments.
- Do not publish private or unverified work without explicit approval.
- Verify accessibility, media size, alternative text and bilingual content.

Projects not accessible in the connected account remain outside the verified inventory.
No SaaS product is marked commercially available until it has been validated.

## Sprint 2.2 implementation

- Define a domain model for a portfolio project with stable ID, bilingual content,
  capabilities, technologies, media metadata and publication status.
- Expose only approved records through the application layer and content repository.
- Add a responsive project grid and project-detail navigation.
- Validate publication filtering, locale handling and missing-media fallbacks.
- Keep content separate from rendering so a future CMS can replace the static repository.

Start with the first-party Genyx case study. Additional candidates remain unpublished
until their individual checks are complete.
