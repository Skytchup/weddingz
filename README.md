# Rujuta & Alexandre — Wedding website

A multilingual (English, French, Marathi), mobile-friendly static wedding website for 28–29 January 2027 in Pune, India.

## Pages
- `index.html`: wedding landing page with photo navigation to separate pages
- `venue.html`: directions and accommodation (details pending)
- `programme.html`: two-day ceremony schedule
- `menu.html`: food information (menu pending)
- `gifts.html`: optional Japan honeymoon gifts (all payment details deliberately placeholders)

## Run locally
Open `index.html` in a browser, or use `python -m http.server 8080` from this folder.

## Cloudflare Pages
Create a separate Pages project, connect this repository, use no framework preset and no build command, and set output directory to `/` (repository root). Deploy the `main` branch. Note that a **private GitHub repository does not make a deployed Pages website private**. Share the Pages URL only when content is ready, and consider Cloudflare Access for invite-only access.

## Before publishing
Replace stock image URLs with your own licensed or personal photographs; add venue address, directions, accommodations, dishes, and verified gift instructions. Never commit personal banking documents or sensitive QR codes to a public deployment by accident. Marathi translations should be reviewed by a native speaker. Confirm event names and times with family.

## Files
Plain HTML, CSS and vanilla JavaScript. No build tools or dependencies except optional Google Fonts and externally hosted stock photos.
