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
- **Content source:** Markdown overrides in `content/pages`, loaded by
  `app/content/getSiteContent.ts`

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

Editable site copy lives in `content/pages`. Update only the text between
matching `<!-- site: ... -->` and `<!-- /site -->` markers so the structured
content loader can apply changes safely.

Key content files:

- `content/pages/00-shared.md`
- `content/pages/01-home.md`
- `content/pages/02-about.md`
- `content/pages/03-philosophy.md`
- `content/pages/04-evidence.md`
- `content/pages/05-contact.md`

## Deployment Notes

- Local edits do not publish automatically.
- Confirm personal contact details, CV currency, and certification details
  before deployment.
- Keep media assets in `public/media` and QR assets in `qr`.
