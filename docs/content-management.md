# Genyx content management

The initial CMS is Git-backed and file-based. It requires no external account,
database, admin API or additional npm dependency. Edit JSON in VS Code or on GitHub
using a feature branch and a pull request to develop.

## Content files

All content files are under `src/infrastructure/content/data/`.

- `site.json`: bilingual home page and navigation copy.
- `services.json`: service names, summaries, audiences and proposed deliverables.
- `projects.json`: case studies, technologies, media and publication status.
- `products.json`: SaaS catalog and commercial availability status.

Both es and en translations are required. Keep identifiers stable and use lowercase
letters, digits and single hyphens. Project states are draft, review and published.
Product states are draft, review and available. Only published projects and available
products are returned by the public application queries.

## Editorial workflow

1. Create a feature branch. Edit approved, public-safe text only.
2. Prepare both translations and confirm ownership and accuracy of all claims.
3. Store approved media under public/media with lowercase filenames and paths.
4. Supply image dimensions and descriptive alt text. Videos require MP4, VTT captions
   and a transcript in the selected language.
5. Run the commands below, review the site locally, and open a pull request.
6. Review the diff, rights, publication status and passing CI before merging.

```bash
npm run format
npm run test:content
npm run check
npm run test:browser
```

Validation runs when the repositories load and rejects malformed records. Unit tests
also verify committed local media references exist. Unrecognized fields are not
copied into the typed records. Local media must be inspected for licensing, privacy,
malicious content, and file size before it is committed.

## Security and limitations

GitHub is the editing interface; there is no browser-based administration panel.
This repository is public. Draft or review states are visibility filters, not access
control. Anyone can read committed JSON and files under public/media, even if the
site does not list them. Never commit confidential material, credentials, personal
data or unpublished client assets. Store sensitive editorial drafts outside this repo.

Publishing changes requires a new build and release. An authenticated external CMS
can replace the existing repository adapters in the future without rewriting the
presentation components. No runtime editing, media uploads, scheduling or live
publishing is claimed.
