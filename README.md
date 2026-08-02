# Becca Lyu - Early Childhood Educator Portfolio

A static, low-maintenance portfolio site for Becca Lyu, an Early Childhood
Educator and Graduate ECT in South Australia.

## Tech Stack

- **Framework:** React 19 with vinext app routing
- **Build tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 plus component CSS files
- **Motion and visuals:** GSAP, OGL, and local media assets in `public/media`
- **Runtime target:** Cloudflare Worker-compatible output through Wrangler
- **Package manager:** pnpm
- **Content source:** Structured TypeScript data in page files under
  `app/content`, mirrored from human-editable Markdown in `content/site.md`

## Local Development

Install dependencies with pnpm:

```bash
pnpm install
```

Start the local dev server:

```bash
pnpm run dev
```

Build and preview the production output:

```bash
pnpm run build
pnpm run start
```

## Quality Checks

Run the full production render test:

```bash
pnpm test
```

Run linting:

```bash
pnpm run lint
```

## Content Editing

Editable site copy lives in `content/site.md`. This file is for human review and
copy editing; the website reads structured content from page data files in
`app/content`.

Key content files:

- `content/site.md` - human-editable Markdown copy
- `app/content/siteData.ts` - aggregate structured data imported by the app
- `app/content/*PageData.ts` - route-specific structured page data
- `app/content/sharedData.ts` - metadata, navigation, opening, and footer data
- `app/content/siteContent.ts` - TypeScript content shape

After editing `content/site.md`, update the matching page data file so the
structured object matches the approved copy before building or deploying.

## Deployment Notes

- Local edits do not publish automatically.
- Confirm personal contact details, CV currency, and certification details
  before deployment.
- Keep media assets in `public/media` and QR assets in `qr`.
