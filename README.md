# Brightside Dental Studio — Cloudflare Workers code package

This ZIP contains the Cloudflare Workers project only. It is a source-code package; it does not deploy or publish your website.

## Environment variables
`.dev.vars` is included ready to use — not a `.example` template. The owner username and email were taken from the builder. The supplied password is stored only as a salted PBKDF2 hash in `ADMIN_PASSWORD_HASH`; it is never written in plaintext. A unique `CSRF_SECRET` signs CSRF tokens and short-lived owner sessions; it is not an admin API key. For Vercel, a separate `CRON_SECRET` protects the scheduled payment-reminder endpoint.
`DATABASE_URL` was filled in from the Neon connection string you entered in the builder. `sslmode`/`channel_binding` query parameters were removed automatically — the generated runtime uses Neon's secure HTTP transport and does not use them.
Treat `.dev.vars` as a secret: it is already ignored by the included `.gitignore`, so keep it out of source control.

## Database setup
Create a Neon Postgres database (if you have not already), then run `db/schema.sql` (safe to rerun; it includes idempotent migrations) and `db/seed.sql`. The seed file includes the generated site configuration, payment details, custom pages and sample practice content.

## Deploy to Cloudflare Workers
Use Node.js 22+ and run `npm install`. In the Cloudflare dashboard, set the values from `.dev.vars` under Worker Settings → Variables and Secrets. Store `DATABASE_URL`, `ADMIN_PASSWORD_HASH` and `CSRF_SECRET` as secrets; set `ADMIN_USERNAME` and `ADMIN_EMAIL` as variables or secrets. Wrangler does not upload `.dev.vars` during `npm run deploy`. For local development, `.dev.vars` is already in place, so just run `npm run dev`.

## Owner dashboard and sign-in
The owner dashboard path is generated from the current date in the site's time zone (default `Asia/Manila`). Today, when this package was generated, its path is `/tadmin10/dashboard`; it changes at local midnight. The dashboard is not linked from public pages; enter this URL directly and sign in using the administrator account configured in the builder. The public sign-in form intentionally starts blank; the raw password is never embedded in public site assets.
Path scheme: Monday = dog, Tuesday = rat, Wednesday = ant, Thursday = fish, Friday = fly, Saturday = cat, Sunday = cockroach. Take the animal's last letter, append `admin` and the current calendar day number, then append `/dashboard`. For example, Tuesday on the 8th is `/tadmin8/dashboard`. The changing path is only an obscurity measure—the username/password sign-in is the actual access control.
The Menu links view in the owner dashboard can rename, reorder, add or remove public navigation links. Links accept same-site paths or HTTPS URLs; the site starts with 0 generated custom menu pages. GCash/Maya payment details are also configured in the generated settings.

## Payment reminders and booking release
Bookings remain scheduled after 15 minutes; that is a review threshold, not an automatic cancellation deadline. If no proof is uploaded after 12 minutes, the client dashboard displays a reminder—even if the owner has independently marked the payment received. The client can still upload proof after 15 minutes while the booking remains active; a manually confirmed payment stays confirmed when its screenshot is attached. The owner can mark a payment received or manually release the booking after checking the payment account.
The Cloudflare Workers cron runs the reminder checks every minute.
An exact Node.js background worker is also included: run `npm run payments:worker` under a process manager on an always-on Node.js host for 90-second client-reminder checks and 3-minute owner-follow-up checks. The standalone worker is not run inside Vercel serverless functions or Cloudflare Workers; those use their native scheduled triggers.

## Site notes
The starter includes fixed-field blog and gallery content, client accounts and appointment scheduling. Appointment availability remains unpublished until the site owner configures it. Review the privacy and security guidance in the owner editor before adding sensitive information. This starter is not a compliant electronic health record system.

Generated practice: **Brightside Dental Studio** (Dental practice) · Site ID: `brightside-dental-studio` · Selected target: **Cloudflare Workers**
