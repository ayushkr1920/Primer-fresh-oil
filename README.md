# Prime Fresh Oil Mills — full-stack website

A responsive B2B product catalog and quotation website for Prime Fresh Oil Mills. This is a product discovery and request-for-quotation experience, not an online checkout store. The public catalog includes the products named in the company resource pack, product detail pages, verified product photography, a quote form, and a protected admin workspace.

## Verified company information and assets
- The supplied resource pack confirms Yellow Mustard Oil as the bestselling oil; Groundnut Seeds; Sesame Seeds and Sesame Oil; and a business scope including edible seeds, oils, and de-oiled cakes.
- Phone: +91 90572 92529. Email: Puneet2garg@gmail.com.
- The resource folder includes a company logo, eight product photos, and two facility videos. These supplied assets are copied into `public/`; selected product images and both videos appear on the site. Seed and cake photos are labeled as those products; none is presented as a mustard oil bottle.
- There is no standalone Yellow Mustard Oil product photo. The hero uses the existing CSS illustration and must remain understood as an illustration, not official packaging.
- The supplied README says the business/factory address is unconfirmed. The site therefore keeps an explicitly marked address placeholder. No certifications, capacities, prices, packaging sizes, or technical specifications are claimed.
- The supplied pack includes two facility videos; both are embedded with user-controlled playback and metadata-only preload.

## Requirements
- Node.js 20 or newer
- PostgreSQL database (Neon, Supabase PostgreSQL, or another hosted PostgreSQL service)
- A hosting service supporting Next.js server routes (for example Vercel)

## Run locally
1. Extract the project and open a terminal in this folder.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`.
4. Set `DATABASE_URL` to your PostgreSQL connection string.
5. Set `SESSION_SECRET` to a unique random secret of at least 32 characters.
6. Set `ADMIN_PASSWORD` to a strong, unique password.
7. The supplied, owner-confirmed phone and email are prefilled in `.env.example`; verify that they remain correct before launch. Add an address only after the owner confirms it.
8. To enable AI-generated chat answers, set `OPENAI_API_KEY` on the server and optionally set `OPENAI_MODEL`. Keep this secret out of `NEXT_PUBLIC_*` variables and source control. Without it, the assistant handles common catalog, quote, and contact questions with built-in responses and routes unknown questions to the company.
9. Run `npm run dev` and open `http://localhost:3000`.

Database tables and the catalog records are created automatically when the API first connects successfully. Keep database credentials private and do not commit `.env.local`.

## Admin
- Open `/admin`.
- Sign in with the `ADMIN_PASSWORD` environment variable.
- Manage quotation requests, status, private internal notes, CSV export, and product records.
- The admin cookie is HTTP-only, signed with `SESSION_SECRET`, and expires after 8 hours.
- Create a unique, long `SESSION_SECRET` and strong admin password before production. Do not expose either in frontend code.

## Deploy for a public live URL
1. Create a PostgreSQL database with a provider such as Neon or Supabase and copy its connection string.
2. Push this folder to a private GitHub repository.
3. Import the repository into Vercel (or another Next.js host).
4. Add all variables from `.env.example` to the host environment. Use the production database URL and strong unique secrets. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS site URL so the sitemap can be generated.
5. Deploy and wait for the build to complete. The host will provide a public URL.
6. Open the live site and test a real quotation submission. Confirm it appears in `/admin` and that product edits persist.
7. Confirm product availability, packaging, specifications, the business address, and the privacy notice with the company before launch. The supplied logo and product images are already included.

A live URL cannot be created from source code alone: deployment requires a hosting account, a configured database, environment variables, and a successful production deployment.

### Netlify upload notes

This project includes `netlify.toml` for Netlify's Next.js runtime. Import the source repository or use a logged-in Netlify build/deploy workflow so Netlify runs `npm run build`; do not publish the project root or `.next/standalone` as a static folder. For source uploads, exclude `node_modules`, `.next`, and local `.env` files. Netlify reads environment variables from Site configuration, not from local `.env` files. Set `DATABASE_URL`, `SESSION_SECRET`, and `ADMIN_PASSWORD` there to enable inquiry persistence and admin access.

## Google Cloud Run deployment

The repository includes a multi-stage `Dockerfile` configured for Cloud Run. Deploying still requires an authenticated Google Cloud project and a PostgreSQL database reachable from Cloud Run.

1. Install and authenticate the Google Cloud CLI, select the target project, and enable Cloud Run, Cloud Build, and Artifact Registry APIs.
2. Create a PostgreSQL database (Cloud SQL or an external managed PostgreSQL provider) and store `DATABASE_URL`, `SESSION_SECRET`, and `ADMIN_PASSWORD` in Google Secret Manager.
3. Deploy from this directory with `gcloud run deploy prime-fresh-oil-mills --source . --region YOUR_REGION --allow-unauthenticated`. Select the project and region that own the service.
4. Configure the three secrets as Cloud Run environment variables using Secret Manager references. Set `NEXT_PUBLIC_SITE_URL` to the HTTPS URL Cloud Run assigns, and set the verified phone/email and confirmed address values.
5. Open the service URL and verify product pages, video playback, quote persistence, and `/admin` after configuring the database and secrets.

The `--allow-unauthenticated` option makes the public website reachable by anyone. Keep admin access protected by a strong `ADMIN_PASSWORD` and unique `SESSION_SECRET`. Do not deploy with placeholder secrets.

## API endpoints
- `GET /api/products` — published product catalog (returns a safe display fallback if the database is not configured).
- `POST /api/quotes` — validates and saves a quotation inquiry to PostgreSQL.
- `POST /api/chat` — answers website questions using the published catalog and verified company facts; uses OpenAI when `OPENAI_API_KEY` is configured.
- `POST /api/admin/login` — creates a signed admin session.
- `POST /api/admin/logout` — clears the admin session.
- `GET /api/admin/quotes` — protected inquiry list.
- `PATCH /api/admin/quotes` — protected status/internal-note updates.
- `GET /api/admin/products` — protected product list.
- `POST /api/admin/products` — protected product creation.
- `PATCH /api/admin/products` — protected product update.

## Important pre-launch checklist
- Replace the hero illustration if an official Yellow Mustard Oil product photo becomes available. Do not use a seed photo to represent bottled oil.
- Confirm the business/factory address before replacing its clearly labeled placeholder.
- Confirm product names, active availability, packaging, and specifications with the company before adding detail beyond the facts in the resource pack.
- Review the privacy notice against the company's real practices.
- Add production rate limiting/spam protection and a monitoring/backup plan before handling significant traffic.
- Configure email notifications only after a real recipient and provider are approved.
- Run `npm run build` and test all primary flows on desktop and mobile.

## Current limitations
- The project includes database persistence but needs your database and hosting credentials before it can be publicly deployed.
- The catalog records are seeded from the provided resource pack, without invented prices, packaging sizes, or specifications.
- The initial hero product artwork is an original CSS illustration, not an official product photograph. The resource folder does not include a mustard oil bottle image.
- Chat answers are generated from the current published catalog and a small set of verified company facts, not from model fine-tuning. Unknown details should be confirmed with the company. Configure the optional server-side OpenAI key to enable open-ended AI responses; chat messages are sent to OpenAI when that mode is enabled.
- Email notifications, external spam protection, and formal privacy review are not configured by default.
