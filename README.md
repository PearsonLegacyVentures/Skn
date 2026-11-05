# Tranquilitas — St. Kitts & Nevis

Dedicated, mobile-first Tranquilitas landing and booking-request website for **St. Kitts & Nevis**.

**Intended production domain:** https://skn.tranquilitasspa.com/

## Hosting
Cloudflare Pages, static site from the repository root. No build command. Production branch `main`. Pages Function `functions/api/booking-request.js` supports an optional email request channel.

## Requests
The visible request form launches WhatsApp at +1 (242) 816-8286 with a completed, user-reviewed enquiry. A request is NOT a confirmed booking. Price and therapist availability are confirmed personally. Requests require at least **6 hours' lead time**, and the interface validates against St. Kitts & Nevis local time (UTC-4). The server-side email endpoint enforces the same time and input validation.

Optional email channel (not enabled in the visitor form until credentials are installed and tested):
- Cloudflare secret `RESEND_API_KEY`
- `BOOKING_FROM_EMAIL` as a verified Resend sender, e.g. a sender on an authorized domain
- Never place either key into public HTML, frontend JS, or the Git repository.

## SEO
Static prerendered page folders; per-page title, meta description, canonical, Open Graph, structured data, breadcrumbs; valid sitemap and robots. Verified GBP links to the public St. Kitts & Nevis Google Maps profile. Service-area business: no invented storefront.

## Migration caution
The existing `https://www.tranquilitasspa.com/massage-in-skn` page is indexed by Google. **Do not delete, redirect or deindex it until the new site's custom domain is live, the indexing plan is approved, and URL transition is checked.** Keep the current GBP website pointing to the existing indexed page until then.

## Imagery & provenance
- Site logo, massage-treatment photography: original Tranquilitas country website assets reused with authorization.
- Destination atmosphere: independent third-party Unsplash imagery. They are **not** representations of specific Tranquilitas clients or treatments in SKN. Photographer/source URLs are documented in `ASSET_SOURCES.md`.
