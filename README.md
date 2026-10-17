# Rujuta & Alexandre — Wedding website

A multilingual (English, French, Marathi), mobile-friendly static wedding website for 28–29 January 2027 in Pune, India.

## Pages
- `index.html`: wedding landing page with photo navigation to separate pages
- `venue.html`: directions and accommodation (details pending)
- `programme.html`: two-day ceremony schedule
- `menu.html`: food information (menu pending)
- `gifts.html`: a Japan honeymoon gift gallery with private contribution messages and shared progress

## Run locally
The other pages are static. The Gifts page needs its API to show current totals and record contributions; it deliberately disables gift selection if shared storage is unavailable.

To test the complete Gifts page using Cloudflare's local D1 emulator:

```sh
npx wrangler d1 execute wedding-gifts-local --local --config=wrangler.local.jsonc --file=migrations/0001_gifts.sql
npx wrangler pages dev --config=wrangler.local.jsonc
```

Set a local-only random `GIFTS_RATE_SALT` in an ignored `.dev.vars` file. Node 22.13+ can run the storage tests with `node --test tests/gifts.test.mjs` without dependencies.

## Cloudflare Pages
The existing deployment is https://wedding-98k.pages.dev/. Keep its current project, Git integration and audience. Use no framework preset and no build command, and keep the output directory at the repository root. Cloudflare builds the `functions/` directory into Pages Functions; `_routes.json` limits requests to the Gifts API.

### Required shared storage setup before merging

1. Create a Cloudflare D1 database named `wedding-gifts` in the existing account.
2. Run `migrations/0001_gifts.sql` against that database in the authenticated D1 console (or use Wrangler with a configuration containing that real database's ID).
3. In the existing Pages project's **Settings → Bindings**, add the D1 binding **GIFTS_DB** pointing to that database.
4. Add **GIFTS_RATE_SALT** as a secret, using a long random value. It salts network-address hashes for simple rate limiting; raw addresses are not stored.
5. Redeploy the project. If testing a branch preview, bind it to a **separate preview database**, run the same migration there, and configure its secret too. Never connect preview tests to production guest records.

Without these bindings, the API returns 503 and the page shows a retry message. It never substitutes browser-only totals or pretends a message was saved.

### Gifts and messages

- Targets: Hotel €2,000; JR Pass €800; Flights €1,200; Restaurants €200; Onsen €100. Pokémon and the general gift have no target or maximum.
- Amounts are stored as integer euro cents. PayNow guests are asked for the approximate euro equivalent.
- Transfers happen externally using the existing bank details and PayNow QR. Contributions are **self-reported**, not bank-confirmed. Do not interpret a completed card as proof of cleared funds.
- A finite gift closes when the recorded total reaches its target. An atomic capacity check prevents simultaneous submissions from exceeding that target; repeated request IDs prevent retry duplication.
- The public GET endpoint returns only item IDs, targets and totals. Names and notes remain in D1 and are never returned to visitors.
- The couple can read private notes in their authenticated Cloudflare D1 console, for example: `SELECT gift_id, amount_cents / 100.0 AS euros, guest_name, message, datetime(created_at, 'unixepoch') AS created FROM contributions ORDER BY created_at DESC;`.
- Corrections to mistaken or abusive self-reports can be made in that same private console after checking the actual transfer. The gallery reads corrected totals on its next refresh.
- The form has size limits, origin validation, a honeypot and basic rate limiting. It does not authenticate wedding guests.
- English, French and Marathi copy is in `gifts.js`; the corresponding server targets are in `server/gift-store.js` and must stay in sync.

## Before publishing
Review the gift copy and Marathi translations with family. Gift photographs are illustrative, not booked experiences. Photo sources are listed in `PHOTO-CREDITS.md`. Confirm gift/payment details before launch.

## Files
Plain HTML, CSS and vanilla JavaScript, with Cloudflare Pages Functions and D1 for shared gift records. No frontend build tools. Fonts and photographs are externally hosted.
