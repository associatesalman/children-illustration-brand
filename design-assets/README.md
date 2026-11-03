# Design assets extracted from the requirement documents

Images pulled from the six source documents in `public/`. Nothing in this folder is
imported by the site, so none of it ships in the production build.

| Folder | Contents | Status |
| --- | --- | --- |
| `0-typography-reference/` | Yellow statement headline and text-style references (doc 1) | Layout reference only |
| `1-homepage-layout-references/` | Homepage section references (doc 2) and illustration-page references (doc 3) | Layout reference only — screenshots of other brands' sites, press logos, award seals and unverified figures |
| `2-illustration-candidates/` | Character art, coloring pages, interior spreads, and the two crops from the doc 1 headline | **Ownership unconfirmed — do not publish until approved** |
| `3-publishing-references/` | Editing before/after samples and publishing-page layout references (doc 4) | Editing samples may be usable on the Publishing page once confirmed; the rest are layout references |
| `4-marketing-references/` | Marketing-page layout references (doc 5) | Layout reference only — includes other companies' names and contact details |

## Before any candidate is used on the site

1. Confirm the brand owns or has licensed the artwork.
2. `doc3-character-sketch-sunny.png` carries another artist's signature — treat as reference only unless the artist confirms a license.
3. Export a web-sized WebP/AVIF into `src/assets/artwork/` and register it in
   `src/content/artwork.ts`. The matching slot on the homepage switches from the
   placeholder to the image automatically.
